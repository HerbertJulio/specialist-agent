# E-Commerce Template

Quick start template for e-commerce applications.

## Recommended Agents

| Agent | Purpose |
|-------|---------|
| `@starter` | Scaffold the project |
| `@builder` | Create modules |
| `@finance` | Payment integration |
| `@security` | Auth & checkout security |
| `@data` | Product catalog & orders DB |
| `@perf` | Optimize for conversion |

## Core Modules

```text
src/
├── modules/
│   ├── products/        # Product catalog
│   │   ├── types.ts
│   │   ├── service.ts
│   │   ├── adapter.ts
│   │   └── components/
│   │       ├── ProductCard.tsx
│   │       ├── ProductGrid.tsx
│   │       └── ProductDetail.tsx
│   │
│   ├── cart/            # Shopping cart
│   │   ├── types.ts
│   │   ├── store.ts     # Cart state (Zustand/Pinia)
│   │   └── components/
│   │       ├── CartDrawer.tsx
│   │       ├── CartItem.tsx
│   │       └── CartSummary.tsx
│   │
│   ├── checkout/        # Checkout flow
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── CheckoutForm.tsx
│   │       ├── AddressForm.tsx
│   │       ├── PaymentForm.tsx
│   │       └── OrderConfirmation.tsx
│   │
│   ├── orders/          # Order management
│   │   ├── types.ts
│   │   ├── service.ts
│   │   └── components/
│   │       ├── OrderList.tsx
│   │       └── OrderDetail.tsx
│   │
│   └── auth/            # User authentication
│       ├── types.ts
│       ├── service.ts
│       └── components/
│           ├── LoginForm.tsx
│           └── RegisterForm.tsx
```

## Key Features

### Product Catalog
- Category navigation
- Search with filters
- Product variants (size, color)
- Inventory tracking
- Image galleries

### Shopping Cart
- Persistent cart (localStorage + server sync)
- Quantity updates
- Promo code support
- Shipping calculator

### Checkout
- Guest checkout option
- Address validation
- Multiple payment methods
- Order confirmation email

### User Account
- Order history
- Saved addresses
- Wishlist
- Profile management

## Database Schema

```sql
-- Products
products (id, name, slug, description, price, compare_price, images, category_id)
product_variants (id, product_id, sku, price, inventory, attributes)
categories (id, name, slug, parent_id)

-- Orders
orders (id, user_id, status, subtotal, tax, shipping, total, shipping_address)
order_items (id, order_id, product_id, variant_id, quantity, price)

-- Users
users (id, email, password_hash, name, created_at)
addresses (id, user_id, type, street, city, state, zip, country)
```

## Quick Start

```bash
# Create project
"Use @starter to create an e-commerce app with Next.js + PostgreSQL"

# Build product catalog
"Use @builder to create products module with CRUD"

# Add payment
"Use @finance to integrate Stripe checkout"

# Security review
"Use @security to review checkout flow"
```

## Performance Targets

- Product page: < 1.5s LCP
- Add to cart: < 200ms response
- Checkout: < 3s total flow
- Search: < 500ms results
