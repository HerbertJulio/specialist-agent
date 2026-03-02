# Revisão de Código

Cenários reais para revisar e melhorar código.

## Revisão de PR {#pr-review}

**Objetivo:** Revisar mudanças antes de fazer o merge.

**Comando:**
```
Review the changes in src/modules/auth/
```

**O que acontece:**
1. Analisa todos os arquivos alterados
2. Verifica conformidade com a spec
3. Verifica qualidade de código
4. Verifica padrões de arquitetura
5. Emite um veredicto

**Resultado:**
```
Review: src/modules/auth/

Spec Compliance: PASS
  ✓ Login functionality works
  ✓ Token refresh implemented
  ✓ Logout clears state

Code Quality: PASS
  ✓ No TypeScript errors
  ✓ Tests pass
  ✓ No console.logs

Architecture: WARN
  ⚠ auth-service.ts:15 - Try/catch should be at boundary, not in service
  ⚠ useAuth.ts:42 - Missing error handling for refresh failure

Verdict: APPROVED WITH NOTES
  Fix the 2 warnings before deploying to production.
```

---

## Verificação de Arquitetura {#architecture}

**Objetivo:** Verificar se o código segue os padrões de arquitetura.

**Comando:**
```
Check architecture of the orders module
```

**O que acontece:**
1. Lê o ARCHITECTURE.md
2. Verifica a estrutura de pastas
3. Verifica a separação de camadas
4. Valida as importações

**Resultado:**
```
Architecture Check: orders module

Structure: PASS
  ✓ types/ contains only type definitions
  ✓ services/ contains only HTTP calls
  ✓ adapters/ contains only transformations

Layer Separation: PASS
  ✓ Components don't import services directly
  ✓ Services don't contain business logic
  ✓ No circular dependencies

Violations: 1 found
  ✗ OrderList.tsx imports ordersService directly
    Should use useOrders hook instead

Overall: 95% compliant
```

---

## Refatorar Código {#refactor}

**Objetivo:** Limpar código bagunçado ou duplicado.

**Comando:**
```
Refactor src/utils/helpers.ts - it has too many responsibilities
```

**O que acontece:**
1. Analisa o arquivo
2. Identifica code smells
3. Sugere um plano de refatoração
4. Aplica as mudanças

**Resultado:**
```
Analysis: helpers.ts (450 lines)

Issues Found:
  - 15 unrelated functions in one file
  - 3 functions duplicated with slight variations
  - 2 functions over 50 lines

Refactoring Plan:
  1. Extract date functions → utils/date.ts
  2. Extract format functions → utils/format.ts
  3. Extract validation → utils/validation.ts
  4. Merge duplicates
  5. Split long functions

After:
  utils/
  ├── date.ts (45 lines)
  ├── format.ts (60 lines)
  ├── validation.ts (80 lines)
  └── index.ts (re-exports)
```

---

## Revisão de Segurança {#security-review}

**Objetivo:** Verificar problemas de segurança.

**Comando:**
```
Review the checkout flow for security issues
```

**O que acontece:**
1. Verifica o OWASP top 10
2. Revisa autenticação e autorização
3. Verifica o tratamento de dados
4. Revisa a segurança da API

**Resultado:**
```
Security Review: Checkout Flow

CRITICAL (fix immediately):
  ✗ checkout-service.ts:25 - Credit card number logged
  ✗ payment-form.tsx:18 - Card data in component state

HIGH:
  ✗ No rate limiting on payment attempts
  ✗ Missing CSRF token on form submission

MEDIUM:
  ⚠ PCI compliance: Card data should never touch your servers
    Use Stripe.js or similar to tokenize client-side

Recommendations:
  1. Remove all card logging
  2. Use payment provider's hosted fields
  3. Add rate limiting (3 attempts per minute)
  4. Add CSRF protection
```

---

## Revisão de Performance {#performance-review}

**Objetivo:** Encontrar gargalos de performance.

**Comando:**
```
Review the dashboard for performance issues
```

**O que acontece:**
1. Analisa renders de componentes
2. Verifica o data fetching
3. Revisa o impacto no bundle
4. Identifica otimizações

**Resultado:**
```
Performance Review: Dashboard

Render Issues:
  ⚠ MetricsCard re-renders 12x on data load
    Fix: Wrap with memo, stabilize props

  ⚠ ChartWidget creates new function on every render
    Fix: Use useCallback for event handlers

Data Fetching:
  ⚠ 8 separate API calls on mount
    Fix: Combine into single dashboard endpoint or use parallel queries

  ⚠ No staleTime set - refetches on every focus
    Fix: Add staleTime: 5 * 60 * 1000 (5 min)

Bundle:
  ⚠ chart.js adds 180KB
    Fix: Dynamic import, load only when needed

Estimated Impact:
  - Initial load: 2.4s → 1.1s (-54%)
  - Time to interactive: 3.8s → 2.2s (-42%)
```

---

## Dicas Rápidas

### Delimite o Escopo da Revisão

```
# Revisar tudo (lento, custoso)
Review the entire codebase

# Revisar área específica (rápido, focado)
Review src/modules/payments/

# Revisar apenas mudanças recentes
Review the files I changed today
```

### Faça Perguntas Específicas

```
# Genérico (menos útil)
Review this code

# Específico (mais útil)
Review this code for:
- SQL injection vulnerabilities
- Missing error handling
- N+1 query problems
```

### Dê Seguimento

Após a revisão:
```
Fix the security issues found in the review
```

---

## Cenários Relacionados

- [Construindo Features](/pt-BR/scenarios/build-feature) - Construir código para revisar
- [Depurar Problemas](/pt-BR/scenarios/debug-issue) - Quando a revisão encontra bugs
- [Segurança](/pt-BR/scenarios/security) - Auditoria de segurança aprofundada
