# Fintech Template

Quick start template for financial technology applications.

## Recommended Agents

| Agent | Purpose |
|-------|---------|
| `@starter` | Scaffold the project |
| `@security` | Compliance & encryption |
| `@finance` | Financial operations |
| `@legal` | Regulatory compliance |
| `@data` | Transaction database |
| `@tester` | Financial accuracy tests |

## Core Modules

```text
src/
├── modules/
│   ├── accounts/          # Account management
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── AccountList.tsx
│   │       ├── AccountDetail.tsx
│   │       └── AccountSettings.tsx
│   │
│   ├── transactions/      # Transaction processing
│   │   ├── types.ts
│   │   ├── service.ts
│   │   ├── validator.ts
│   │   └── components/
│   │       ├── TransactionList.tsx
│   │       ├── TransactionDetail.tsx
│   │       └── TransactionFilters.tsx
│   │
│   ├── transfers/         # Money transfers
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── TransferForm.tsx
│   │       ├── RecipientSelector.tsx
│   │       └── TransferConfirmation.tsx
│   │
│   ├── cards/             # Card management
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── CardList.tsx
│   │       ├── VirtualCard.tsx
│   │       └── CardControls.tsx
│   │
│   ├── compliance/        # KYC/AML
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── KYCForm.tsx
│   │       ├── DocumentUpload.tsx
│   │       └── VerificationStatus.tsx
│   │
│   └── reports/           # Financial reports
│       ├── types.ts
│       ├── service.ts
│       └── components/
│           ├── StatementGenerator.tsx
│           ├── TaxReport.tsx
│           └── SpendingAnalytics.tsx
```

## Key Features

### Account Management
- Multi-currency support
- Account types (checking, savings, investment)
- Balance tracking
- Interest calculation

### Transaction Processing
- Real-time transactions
- Double-entry bookkeeping
- Transaction categorization
- Fraud detection triggers

### Compliance
- KYC verification
- AML screening
- Transaction limits
- Audit logging

### Security
- End-to-end encryption
- PCI DSS compliance
- 2FA required
- Session management

## Database Schema

```sql
-- Accounts
accounts (id, user_id, type, currency, balance, status, created_at)
account_limits (account_id, daily_limit, monthly_limit)

-- Transactions (immutable ledger)
transactions (
  id, account_id, type, amount, currency,
  balance_before, balance_after,
  reference, metadata, created_at
)
transaction_categories (transaction_id, category)

-- Transfers
transfers (id, from_account, to_account, amount, currency, status, created_at)

-- Compliance
kyc_records (id, user_id, level, status, verified_at, documents)
aml_checks (id, transaction_id, risk_score, flags, reviewed_at)

-- Audit
audit_logs (id, user_id, action, resource, details, ip_address, created_at)
```

## Compliance Requirements

| Requirement | Implementation |
|-------------|----------------|
| PCI DSS | Tokenize card data, secure transmission |
| KYC | Identity verification, document checks |
| AML | Transaction monitoring, suspicious activity reports |
| GDPR/LGPD | Data encryption, deletion rights |
| SOX | Audit trails, access controls |

## Quick Start

```bash
# Create project
"Use @starter to create a fintech app with Next.js + PostgreSQL"

# Security first
"Use @security to implement secure authentication with 2FA"

# Compliance
"Use @legal to review for LGPD/GDPR compliance"

# Financial operations
"Use @finance to implement transaction processing"
```

## Testing Requirements

- Unit tests for all calculations
- Integration tests for transactions
- Compliance validation tests
- Penetration testing (external)

## Performance Targets

- Transaction processing: < 100ms
- Balance query: < 50ms
- Report generation: < 30s
- 99.99% uptime for transactions
