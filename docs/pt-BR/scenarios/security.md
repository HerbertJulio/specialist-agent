# Segurança

Cenários reais para autenticação, autorização e auditorias de segurança.

## Autenticação JWT {#jwt}

**Objetivo:** Adicionar autenticação JWT com refresh tokens.

**Comando:**
```
Implement JWT authentication with access and refresh tokens
```

**O que acontece:**
1. Cria o serviço de autenticação
2. Implementa a geração de tokens
3. Adiciona o fluxo de refresh token
4. Cria o middleware
5. Adiciona armazenamento seguro

**Resultado:**
```typescript
// Auth flow
1. Login → Returns access token (15min) + refresh token (7 days)
2. API calls → Include access token in Authorization header
3. Token expires → Use refresh token to get new access token
4. Refresh expires → User must login again

// Token structure
{
  accessToken: "eyJhbG...",   // Short-lived, contains user data
  refreshToken: "eyJhbG...",  // Long-lived, stored securely
  expiresIn: 900              // 15 minutes in seconds
}

// Middleware
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Refresh endpoint
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body

  // Verify refresh token
  // Check if token is in database (not revoked)
  // Generate new access token
  // Optionally rotate refresh token

  res.json({ accessToken, expiresIn: 900 })
})
```

---

## Controle de Acesso por Papel {#rbac}

**Objetivo:** Adicionar permissões baseadas em papéis (RBAC).

**Comando:**
```
Add RBAC with admin, manager, and user roles
```

**Resultado:**
```typescript
// Role definitions
const roles = {
  admin: ['read', 'write', 'delete', 'manage_users', 'view_reports'],
  manager: ['read', 'write', 'delete', 'view_reports'],
  user: ['read', 'write']
}

// Check permission middleware
export function requirePermission(permission: string) {
  return (req, res, next) => {
    const userRole = req.user.role
    const userPermissions = roles[userRole] || []

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `Required permission: ${permission}`
      })
    }

    next()
  }
}

// Usage
app.delete('/products/:id',
  authMiddleware,
  requirePermission('delete'),
  deleteProduct
)

app.get('/admin/users',
  authMiddleware,
  requirePermission('manage_users'),
  listUsers
)
```

---

## Auditoria OWASP {#owasp}

**Objetivo:** Verificar vulnerabilidades do OWASP Top 10.

**Comando:**
```
Audit the application for OWASP Top 10 vulnerabilities
```

**Resultado:**
```
OWASP Top 10 Audit

1. Injection
   ✓ Using parameterized queries
   ✗ Found: Raw SQL in reports/custom-query.ts:45
   Fix: Use query builder or ORM

2. Broken Authentication
   ✓ Password hashing with bcrypt
   ✗ No account lockout after failed attempts
   Fix: Add lockout after 5 failed attempts

3. Sensitive Data Exposure
   ✓ HTTPS enforced
   ✗ Passwords logged in auth-service.ts:23
   Fix: Remove all password logging

4. XML External Entities (XXE)
   ✓ No XML processing found

5. Broken Access Control
   ✗ Direct object reference in /api/orders/:id
   Fix: Verify order belongs to authenticated user

6. Security Misconfiguration
   ✓ Security headers present
   ✗ Debug mode enabled in production
   Fix: Set DEBUG=false in production

7. Cross-Site Scripting (XSS)
   ✓ React escapes output by default
   ✗ dangerouslySetInnerHTML in Comment.tsx
   Fix: Sanitize HTML content

8. Insecure Deserialization
   ✓ No unsafe deserialization found

9. Using Components with Known Vulnerabilities
   ✗ 3 high-severity npm vulnerabilities
   Fix: Run npm audit fix

10. Insufficient Logging
    ✗ No audit logs for sensitive actions
    Fix: Log all auth events and admin actions

Summary: 4 critical, 2 high, 2 medium
Priority: Fix critical issues before deploy
```

---

## Conformidade com GDPR {#gdpr}

**Objetivo:** Tornar a aplicação conforme com o GDPR.

**Comando:**
```
Review and implement GDPR compliance requirements
```

**Resultado:**
```
GDPR Compliance Checklist

Data Inventory
  ✓ Document what personal data is collected
  ✓ Document why and how long it's stored
  ✗ No data retention policy documented

Consent
  ✗ No cookie consent banner
  ✗ Marketing emails without explicit opt-in
  Fix: Add cookie consent + email opt-in

User Rights
  ✗ No way to download user data (data portability)
  ✗ No way to delete account (right to erasure)
  Fix: Add /account/export and /account/delete

Privacy Policy
  ✓ Privacy policy exists
  ✗ Doesn't list all third parties (Stripe, Analytics)
  Fix: Update privacy policy

Data Protection
  ✓ Data encrypted at rest
  ✓ HTTPS for all connections
  ✗ Personal data in logs
  Fix: Mask PII in logs

Implementation:
  1. Cookie consent banner (1 day)
  2. Email opt-in checkbox (1 hour)
  3. Data export endpoint (2 days)
  4. Account deletion (2 days)
  5. Update privacy policy (1 day)
```

---

## Segurança de API {#api-security}

**Objetivo:** Proteger os endpoints da API.

**Comando:**
```
Add security measures to our REST API
```

**Resultado:**
```typescript
// Security measures implemented

// 1. Rate limiting
app.use(rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 100,               // 100 requests per minute
  message: { error: 'Too many requests' }
}))

// 2. CORS
app.use(cors({
  origin: ['https://myapp.com'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}))

// 3. Security headers
app.use(helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}))

// 4. Input validation
app.post('/products', validateBody(createProductSchema), createProduct)

// 5. SQL injection prevention
// Use parameterized queries or ORM
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]  // Not string concatenation!
)

// 6. CSRF protection
app.use(csrf({ cookie: true }))

// 7. Request size limit
app.use(express.json({ limit: '10kb' }))
```

---

## Dicas Rápidas

### Comece pela Autenticação

```
1. Implemente a autenticação primeiro
2. Depois adicione às rotas protegidas
3. Depois adicione o controle de acesso por papel
4. Depois faça a auditoria de vulnerabilidades
```

### Nunca Confie na Entrada do Usuário

```
- Valide toda entrada (body, params, query)
- Sanitize antes de exibir
- Use queries parametrizadas
- Limite o tamanho de uploads de arquivos
```

---

## Cenários Relacionados

- [Design de API](/pt-BR/scenarios/api-design) - Projete APIs seguras
- [Depurar Problemas](/pt-BR/scenarios/debug-issue) - Depure problemas de autenticação
- [Infraestrutura](/pt-BR/scenarios/infrastructure) - Deploy seguro
