# Infraestrutura

Cenários reais para deploy, containers e CI/CD.

## Configuração com Docker {#docker}

**Objetivo:** Containerizar a aplicação.

**Comando:**
```
Create Docker setup for development and production
```

**Resultado:**
```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system app && adduser --system --ingroup app app
USER app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine

volumes:
  postgres_data:
```

---

## Deploy no Kubernetes {#k8s}

**Objetivo:** Fazer deploy no Kubernetes com auto-scaling.

**Comando:**
```
Create Kubernetes manifests with deployment, service, and HPA
```

**Resultado:**
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: myapp:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: database-url
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  selector:
    app: app
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
---
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## Pipeline de CI/CD {#cicd}

**Objetivo:** Automatizar testes e deploy.

**Comando:**
```
Create CI/CD pipeline with GitHub Actions
```

**Resultado:**
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy-staging:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4

      - name: Build and push Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker push myapp:${{ github.sha }}

      - name: Deploy to staging
        run: |
          kubectl set image deployment/app \
            app=myapp:${{ github.sha }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          kubectl set image deployment/app \
            app=myapp:${{ github.sha }}
```

---

## Infraestrutura em Nuvem {#cloud}

**Objetivo:** Configurar infraestrutura na AWS com Terraform.

**Comando:**
```
Create Terraform config for AWS with VPC, ECS, and RDS
```

**Resultado:**
```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# VPC
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "app-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
}

# RDS
resource "aws_db_instance" "main" {
  identifier        = "app-db"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.medium"
  allocated_storage = 20

  db_name  = "app"
  username = "admin"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  skip_final_snapshot = true
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "app-cluster"
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "app"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 3
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.app.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "app"
    container_port   = 3000
  }
}
```

---

## Monitoramento {#monitoring}

**Objetivo:** Configurar logging e monitoramento.

**Comando:**
```
Add structured logging and Prometheus metrics
```

**Resultado:**
```typescript
// Structured logging
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label })
  }
})

// Log with context
logger.info({ userId, action: 'login' }, 'User logged in')
logger.error({ err, orderId }, 'Payment failed')

// Prometheus metrics
import { collectDefaultMetrics, Counter, Histogram } from 'prom-client'

collectDefaultMetrics()

const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status']
})

const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'path'],
  buckets: [0.1, 0.5, 1, 2, 5]
})

// Middleware
app.use((req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000

    httpRequests.inc({
      method: req.method,
      path: req.route?.path || 'unknown',
      status: res.statusCode
    })

    httpDuration.observe({
      method: req.method,
      path: req.route?.path || 'unknown'
    }, duration)
  })

  next()
})

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.send(await register.metrics())
})
```

---

## Dicas Rápidas

### Boas Praticas para Containers

```dockerfile
# Use versoes especificas
FROM node:20.10-alpine

# Usuario nao-root
RUN adduser -D app
USER app

# Builds multi-estagio
FROM base AS builder
FROM base AS runner
```

### Gerenciamento de Secrets

```yaml
# Nunca no codigo, use variaveis de ambiente
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-secrets
        key: password
```

---

## Cenarios Relacionados

- [Seguranca](/pt-BR/scenarios/security) - Infraestrutura segura
- [Design de API](/pt-BR/scenarios/api-design) - Projete APIs escalaveis
- [Performance](/pt-BR/scenarios/performance) - Otimize para escala
