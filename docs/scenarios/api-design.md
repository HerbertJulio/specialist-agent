# API Design

::: info Agents: `@api` `@data` · Time: 5 min per scenario
:::

Real scenarios for designing and documenting APIs.

## REST API {#rest}

**Goal:** Design a REST API for orders.

**Command:**
```
Design REST API for orders with list, create, update, cancel
```

**What happens:**
1. Defines resource structure
2. Creates endpoint specifications
3. Generates OpenAPI schema
4. Documents request/response formats

**Result:**
```yaml
# openapi.yaml
paths:
  /api/orders:
    get:
      summary: List orders
      parameters:
        - name: page
          in: query
          type: integer
        - name: status
          in: query
          type: string
          enum: [pending, confirmed, shipped, delivered]
      responses:
        200:
          description: Order list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderList'

    post:
      summary: Create order
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
      responses:
        201:
          description: Order created

  /api/orders/{id}:
    patch:
      summary: Update order
    delete:
      summary: Cancel order
```

---

## GraphQL Schema {#graphql}

**Goal:** Design GraphQL schema for products.

**Command:**
```
Design GraphQL schema for products with queries and mutations
```

**Result:**
```graphql
type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  category: Category!
  images: [String!]!
  createdAt: DateTime!
}

type Category {
  id: ID!
  name: String!
  products: [Product!]!
}

type Query {
  products(
    page: Int = 1
    limit: Int = 20
    category: ID
    search: String
  ): ProductConnection!

  product(id: ID!): Product
}

type Mutation {
  createProduct(input: CreateProductInput!): Product!
  updateProduct(id: ID!, input: UpdateProductInput!): Product!
  deleteProduct(id: ID!): Boolean!
}

input CreateProductInput {
  name: String!
  description: String
  price: Float!
  categoryId: ID!
  images: [String!]
}
```

---

## Database Modeling {#database}

**Goal:** Design database schema for e-commerce.

**Command:**
```
Design database schema for e-commerce with products, orders, users
```

**Result:**
```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  category_id UUID REFERENCES categories(id),
  inventory INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_cents INTEGER NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL
);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_category ON products(category_id);
```

---

## API Versioning {#versioning}

**Goal:** Add versioning to existing API.

**Command:**
```
Add versioning to our API with v1 and v2 support
```

**Result:**
```
API Versioning Strategy

Option 1: URL Path (Recommended)
  /api/v1/products
  /api/v2/products

Option 2: Header
  Accept: application/vnd.api+json; version=2

Implementation:
  1. Keep v1 endpoints unchanged
  2. Create v2 routes in separate folder
  3. v2 can import shared logic from v1
  4. Document breaking changes

Folder Structure:
  api/
  ├── v1/
  │   ├── products/
  │   └── orders/
  └── v2/
      ├── products/  # New response format
      └── orders/    # Uses v1 logic

Migration Path:
  - Deprecation notice in v1 responses
  - 6 month migration period
  - Monitor v1 usage before removal
```

---

## Error Handling {#errors}

**Goal:** Standardize API error responses.

**Command:**
```
Design standard error response format for our API
```

**Result:**
```typescript
// Standard error response
interface APIError {
  error: {
    code: string       // Machine-readable: "VALIDATION_ERROR"
    message: string    // Human-readable: "Invalid input"
    details?: Array<{  // Field-level errors
      field: string
      message: string
    }>
    requestId: string  // For debugging
  }
}

// Examples

// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "price", "message": "Must be positive" }
    ],
    "requestId": "req_abc123"
  }
}

// 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "requestId": "req_def456"
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found",
    "requestId": "req_ghi789"
  }
}

// 500 Internal Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_jkl012"
  }
}
```

---

## Quick Tips

### Be Specific About Resources

```
# Vague
Design an API

# Clear
Design REST API for:
- Users (register, login, profile)
- Products (CRUD, search, categories)
- Orders (create, list, cancel)
- Payments (charge, refund)
```

### Include Constraints

```
Design API with:
- Pagination (cursor-based)
- Rate limiting (100 req/min)
- Filtering by status, date range
- Sorting by created_at, price
```

---

## Related Scenarios

- [Build Features](/scenarios/build-feature) - Implement the API
- [Security](/scenarios/security) - Secure the API
- [Database](/scenarios/api-design#database) - Design the data layer
