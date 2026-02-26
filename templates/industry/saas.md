# SaaS Template

Quick start template for Software-as-a-Service applications.

## Recommended Agents

| Agent | Purpose |
|-------|---------|
| `@starter` | Scaffold the project |
| `@builder` | Create modules |
| `@security` | Multi-tenant auth |
| `@finance` | Subscription billing |
| `@data` | Multi-tenant database |
| `@devops` | Infrastructure setup |

## Core Modules

```text
src/
├── modules/
│   ├── auth/              # Authentication
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ForgotPassword.tsx
│   │       └── MagicLink.tsx
│   │
│   ├── tenants/           # Multi-tenancy
│   │   ├── types.ts
│   │   ├── service.ts
│   │   ├── middleware.ts
│   │   └── components/
│   │       ├── TenantSwitcher.tsx
│   │       └── TenantSettings.tsx
│   │
│   ├── billing/           # Subscription management
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── PricingTable.tsx
│   │       ├── BillingPortal.tsx
│   │       ├── UsageMetrics.tsx
│   │       └── InvoiceList.tsx
│   │
│   ├── users/             # User management
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── UserList.tsx
│   │       ├── InviteUser.tsx
│   │       └── RoleManager.tsx
│   │
│   ├── settings/          # App settings
│   │   └── components/
│   │       ├── GeneralSettings.tsx
│   │       ├── SecuritySettings.tsx
│   │       └── IntegrationSettings.tsx
│   │
│   └── dashboard/         # Main dashboard
│       └── components/
│           ├── DashboardLayout.tsx
│           ├── MetricsCards.tsx
│           └── ActivityFeed.tsx
```

## Key Features

### Multi-Tenancy
- Subdomain routing (tenant.app.com)
- Data isolation
- Tenant-specific settings
- Cross-tenant admin

### Authentication
- Email/password
- Magic links
- SSO (Google, GitHub)
- 2FA support

### Subscription Billing
- Multiple plans (Free, Pro, Enterprise)
- Usage-based pricing
- Seat-based pricing
- Trial periods

### User Management
- Role-based access (Admin, Member, Viewer)
- Team invitations
- Activity logs

## Database Schema

```sql
-- Tenants
tenants (id, name, slug, plan_id, trial_ends_at, created_at)
tenant_settings (tenant_id, key, value)

-- Users
users (id, email, password_hash, name, avatar_url)
tenant_users (tenant_id, user_id, role, invited_at, joined_at)

-- Billing
plans (id, name, price_monthly, price_yearly, features)
subscriptions (id, tenant_id, plan_id, status, current_period_end)
invoices (id, tenant_id, amount, status, paid_at)

-- Usage
usage_records (id, tenant_id, metric, value, recorded_at)
```

## Quick Start

```bash
# Create project
"Use @starter to create a SaaS app with Next.js + Supabase"

# Setup auth
"Use @security to implement multi-tenant authentication"

# Add billing
"Use @finance to integrate Stripe subscriptions"

# Build dashboard
"Use @builder to create dashboard module"
```

## Performance Targets

- Dashboard load: < 2s
- API response: < 200ms (p95)
- Webhook processing: < 5s
- Report generation: < 10s
