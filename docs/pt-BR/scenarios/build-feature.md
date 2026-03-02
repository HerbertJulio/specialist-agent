# Construindo Features

Cenários reais para construir novas funcionalidades.

## Módulo CRUD {#crud-module}

**Objetivo:** Criar um módulo completo de produtos com listagem, criação, edição e exclusão.

**Comando:**
```
Create a products module with CRUD for /api/products
```

**O que acontece:**
1. Cria a estrutura de pastas
2. Gera os tipos TypeScript
3. Cria o serviço de API
4. Constrói o adapter de dados
5. Cria os componentes de listagem e formulário
6. Adiciona testes

**Resultado:**
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

## Endpoint de API {#api-endpoint}

**Objetivo:** Adicionar um novo endpoint para buscar pedidos de um usuário.

**Comando:**
```
Create a service for GET /api/users/:id/orders with pagination
```

**O que acontece:**
1. Cria os tipos correspondentes à resposta da API
2. Cria o serviço com a chamada HTTP
3. Cria o adapter para transformação de dados
4. Cria o hook/composable para uso simplificado

**Resultado:**
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

## Formulário com Validação {#form-validation}

**Objetivo:** Criar um formulário de cadastro com validação de e-mail e senha.

**Comando:**
```
Create a registration form with email, password, and confirm password fields
```

**O que acontece:**
1. Cria o schema de validação com Zod
2. Cria o componente de formulário com os campos
3. Adiciona exibição de erros por campo
4. Conecta à mutation de cadastro
5. Trata os estados de carregamento e sucesso

**Resultado:**
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

**O formulário trata:**
- Validação em tempo real
- Mensagens de erro por campo
- Estado de carregamento no envio
- Redirecionamento após sucesso

---

## Paginação e Filtros {#pagination}

**Objetivo:** Adicionar paginação e filtro por status à listagem de pedidos.

**Comando:**
```
Add pagination and status filter to the orders list
```

**O que acontece:**
1. Atualiza o hook de query para aceitar parâmetros de página e filtro
2. Cria o componente de filtro
3. Cria o componente de paginação
4. Conecta tudo na view

**Resultado:**
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

## Dicas Rápidas

### Seja Específico

**Bom:**
```
Create a products module with CRUD for GET/POST/PATCH/DELETE /api/v2/products
```

**Melhor:**
```
Create a products module:
- List with pagination (20 per page)
- Create form with name, price, description, category
- Edit form (same fields)
- Delete with confirmation
- Filter by category
- Sort by name or price
```

### Construção Incremental

Comece pequeno e adicione funcionalidades:

```
1. "Create products types and service for /api/products"
2. "Add the products list component"
3. "Add create product form"
4. "Add edit functionality"
5. "Add delete with confirmation"
```

### Teste Conforme Avança

```
"Create tests for the products adapter"
"Create tests for the products list component"
```

---

## Cenários Relacionados

- [Revisão de Código](/pt-BR/scenarios/code-review) - Revisar o código que você construiu
- [Depurar Problemas](/pt-BR/scenarios/debug-issue) - Quando algo não funciona
- [Design de API](/pt-BR/scenarios/api-design) - Projetar o backend primeiro
