# Build Features

::: info Agents: `@builder` `@api` · Time: 3-5 min per scenario
:::

Real scenarios for building new features.

## CRUD Module {#crud-module}

**Goal:** Create a complete products module with list, create, edit, delete.

**Command:**
```
Create a products module with CRUD for /api/products
```

**What happens:**
1. Creates folder structure
2. Generates TypeScript types
3. Creates API service
4. Builds data adapter
5. Creates list and form components
6. Adds tests

**Result:**
```
src/modules/products/
├── types/
│   ├── products.types.ts      # API response types
│   └── products.contracts.ts  # App interfaces
├── services/
│   └── products-service.ts    # HTTP calls
├── adapters/
│   └── products-adapter.ts    # Data transformation
├── components/
│   ├── ProductList.tsx        # List view
│   ├── ProductForm.tsx        # Create/Edit form
│   └── ProductCard.tsx        # Item display
├── hooks/
│   ├── useProducts.ts         # List query
│   └── useProductMutations.ts # Create/Update/Delete
└── __tests__/
    └── products-adapter.test.ts
```

---

## API Endpoint {#api-endpoint}

**Goal:** Add a new endpoint to fetch user orders.

**Command:**
```
Create a service for GET /api/users/:id/orders with pagination
```

**What happens:**
1. Creates types matching the API response
2. Creates service with the HTTP call
3. Creates adapter for data transformation
4. Creates hook/composable for easy use

**Result:**
```typescript
// services/user-orders-service.ts
export const userOrdersService = {
  list(userId: string, params: { page: number; limit: number }) {
    return api.get(`/api/users/${userId}/orders`, { params })
  }
}

// hooks/useUserOrders.ts
export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'orders'],
    queryFn: () => userOrdersService.list(userId, { page: 1, limit: 20 })
  })
}
```

---

## Form with Validation {#form-validation}

**Goal:** Create a registration form with email and password validation.

**Command:**
```
Create a registration form with email, password, and confirm password fields
```

**What happens:**
1. Creates Zod validation schema
2. Creates form component with fields
3. Adds field-level error display
4. Connects to registration mutation
5. Handles loading and success states

**Result:**
```typescript
// schemas/registration.schema.ts
export const registrationSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
})
```

**Form handles:**
- Real-time validation
- Field error messages
- Submit loading state
- Success redirect

---

## Pagination and Filters {#pagination}

**Goal:** Add pagination and status filter to orders list.

**Command:**
```
Add pagination and status filter to the orders list
```

**What happens:**
1. Updates query hook to accept page and filter params
2. Creates filter component
3. Creates pagination component
4. Connects everything in the view

**Result:**
```typescript
// Using the list
const { orders, totalPages, isLoading } = useOrders({
  page: currentPage,
  status: selectedStatus,
  limit: 20
})

// Filter changes reset to page 1
function onStatusChange(status: string) {
  setStatus(status)
  setPage(1)
}
```

---

## Quick Tips

### Be Specific

**Good:**
```
Create a products module with CRUD for GET/POST/PATCH/DELETE /api/v2/products
```

**Better:**
```
Create a products module:
- List with pagination (20 per page)
- Create form with name, price, description, category
- Edit form (same fields)
- Delete with confirmation
- Filter by category
- Sort by name or price
```

### Incremental Building

Start small, add features:

```
1. "Create products types and service for /api/products"
2. "Add the products list component"
3. "Add create product form"
4. "Add edit functionality"
5. "Add delete with confirmation"
```

### Test as You Go

```
"Create tests for the products adapter"
"Create tests for the products list component"
```

---

## Related Scenarios

- [Code Review](/scenarios/code-review) - Review the code you built
- [Debug Issues](/scenarios/debug-issue) - When something doesn't work
- [API Design](/scenarios/api-design) - Design the backend first
