# Como Construir Formularios com Validacao

::: info Nota sobre Framework
Os exemplos abaixo utilizam os padroes do **pack Vue 3**. Cada framework pack (React, Next.js, SvelteKit) fornece padroes equivalentes adaptados ao seu ecossistema. Veja [Framework Packs](/pt-BR/guide/introduction#como-os-packs-funcionam) para detalhes.
:::

Este tutorial mostra como construir um **formulario de criacao/edicao** com validacao Zod, useMutation e tratamento adequado de erros.

## Cenario

Voce precisa de um formulario para criar novos produtos. Ele deve:
- Validar os campos antes do envio
- Exibir erros por campo
- Gerenciar estados de carregamento e sucesso
- Usar o adapter para converter os dados para a API

## Arquitetura

```mermaid
sequenceDiagram
    participant User
    participant Form as ProductForm.vue
    participant Zod as Zod Schema
    participant Composable as useCreateProduct
    participant Adapter as productsAdapter
    participant Service as productsService
    participant API as REST API

    User->>Form: Preenche o formulario e clica em Salvar
    Form->>Zod: validate(formData)
    alt Validacao falha
        Zod-->>Form: errors { name: "Obrigatorio", price: "Deve ser positivo" }
        Form-->>User: Exibe erros nos campos
    else Validacao passa
        Zod-->>Form: dados validos
        Form->>Composable: createProduct(validData)
        Composable->>Adapter: toCreatePayload(validData)
        Adapter-->>Composable: payload da API (snake_case)
        Composable->>Service: productsService.create(payload)
        Service->>API: POST /v2/products
        API-->>Composable: 201 Created
        Composable-->>Form: isSuccess = true
        Form-->>User: "Produto criado!" + redirecionamento
    end
```

## Passo 1 - Definir o Schema de Validacao

```typescript
// src/modules/products/types/products.schemas.ts

import { z } from 'zod'

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(100, 'O nome deve ter no maximo 100 caracteres'),
  description: z
    .string()
    .min(10, 'A descricao deve ter pelo menos 10 caracteres')
    .max(500, 'Descricao muito longa'),
  category: z
    .string()
    .min(1, 'Por favor, selecione uma categoria'),
  price: z
    .number({ invalid_type_error: 'O preco deve ser um numero' })
    .positive('O preco deve ser positivo')
    .max(99999, 'Preco muito alto'),
  imageUrl: z
    .string()
    .url('Deve ser uma URL valida')
    .optional()
    .or(z.literal('')),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
```

::: tip Zod + Contracts
O schema Zod valida a **entrada do formulario**. O contrato em `products.contracts.ts` define o **modelo de dados da aplicacao**. Eles podem se sobrepor, mas servem a propositos diferentes.
:::

## Passo 2 - Construir um Composable de Validacao de Formulario

```typescript
// src/shared/composables/useFormValidation.ts

import { ref, type Ref } from 'vue'
import type { ZodSchema, ZodError } from 'zod'

export function useFormValidation<T>(schema: ZodSchema<T>) {
  const errors: Ref<Record<string, string>> = ref({})
  const isValid = ref(false)

  function validate(data: unknown): data is T {
    try {
      schema.parse(data)
      errors.value = {}
      isValid.value = true
      return true
    } catch (err) {
      const zodError = err as ZodError
      errors.value = Object.fromEntries(
        zodError.errors.map(e => [e.path.join('.'), e.message])
      )
      isValid.value = false
      return false
    }
  }

  function clearErrors() {
    errors.value = {}
  }

  function getError(field: string): string | undefined {
    return errors.value[field]
  }

  return { errors, isValid, validate, clearErrors, getError }
}
```

## Passo 3 - Construir o Composable de Mutation

```typescript
// src/modules/products/composables/useCreateProduct.ts

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { productsService } from '../services/products-service'
import { productsAdapter } from '../adapters/products-adapter'
import type { CreateProductInput } from '../types/products.contracts'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  const { mutate, isPending, error, isSuccess, reset } = useMutation({
    mutationFn: (input: CreateProductInput) => {
      const payload = productsAdapter.toCreatePayload(input)
      return productsService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    createProduct: mutate,
    isPending,
    error,
    isSuccess,
    reset,
  }
}
```

## Passo 4 - Construir o Componente de Formulario

```vue
<!-- src/modules/products/components/ProductForm.vue -->
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFormValidation } from '@/shared/composables/useFormValidation'
import { useCreateProduct } from '../composables/useCreateProduct'
import { createProductSchema, type CreateProductFormData } from '../types/products.schemas'

const router = useRouter()
const { createProduct, isPending, isSuccess, error: apiError } = useCreateProduct()
const { validate, getError, clearErrors } = useFormValidation(createProductSchema)

const form = reactive<CreateProductFormData>({
  name: '',
  description: '',
  category: '',
  price: 0,
  imageUrl: '',
})

const categories = [
  { value: 'electronics', label: 'Eletronicos' },
  { value: 'clothing', label: 'Roupas' },
  { value: 'books', label: 'Livros' },
  { value: 'home', label: 'Casa & Jardim' },
]

function handleSubmit() {
  clearErrors()

  if (!validate(form)) return

  createProduct({
    name: form.name,
    description: form.description,
    category: form.category,
    price: form.price,
    imageUrl: form.imageUrl || undefined,
  })
}

// Redireciona em caso de sucesso
watch(isSuccess, (success) => {
  if (success) {
    router.push({ name: 'products' })
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <h2>Criar Produto</h2>

    <!-- Banner de erro da API -->
    <div v-if="apiError" class="error-banner">
      Falha ao criar o produto. Por favor, tente novamente.
    </div>

    <!-- Nome -->
    <div class="field">
      <label for="name">Nome do Produto *</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        placeholder="ex: Fones de Ouvido Sem Fio"
        :class="{ invalid: getError('name') }"
      />
      <span v-if="getError('name')" class="field-error">
        {{ getError('name') }}
      </span>
    </div>

    <!-- Descricao -->
    <div class="field">
      <label for="description">Descricao *</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="4"
        placeholder="Descreva o produto..."
        :class="{ invalid: getError('description') }"
      />
      <span v-if="getError('description')" class="field-error">
        {{ getError('description') }}
      </span>
    </div>

    <!-- Categoria -->
    <div class="field">
      <label for="category">Categoria *</label>
      <select
        id="category"
        v-model="form.category"
        :class="{ invalid: getError('category') }"
      >
        <option value="">Selecione uma categoria</option>
        <option
          v-for="cat in categories"
          :key="cat.value"
          :value="cat.value"
        >
          {{ cat.label }}
        </option>
      </select>
      <span v-if="getError('category')" class="field-error">
        {{ getError('category') }}
      </span>
    </div>

    <!-- Preco -->
    <div class="field">
      <label for="price">Preco (BRL) *</label>
      <input
        id="price"
        v-model.number="form.price"
        type="number"
        step="0.01"
        min="0"
        :class="{ invalid: getError('price') }"
      />
      <span v-if="getError('price')" class="field-error">
        {{ getError('price') }}
      </span>
    </div>

    <!-- URL da Imagem -->
    <div class="field">
      <label for="imageUrl">URL da Imagem (opcional)</label>
      <input
        id="imageUrl"
        v-model="form.imageUrl"
        type="url"
        placeholder="https://..."
        :class="{ invalid: getError('imageUrl') }"
      />
      <span v-if="getError('imageUrl')" class="field-error">
        {{ getError('imageUrl') }}
      </span>
    </div>

    <!-- Enviar -->
    <button type="submit" :disabled="isPending">
      {{ isPending ? 'Criando...' : 'Criar Produto' }}
    </button>
  </form>
</template>
```

## Fluxo de Dados do Formulario

```mermaid
graph LR
    Input["Entrada do Usuario<br/><i>objeto reativo form</i>"] --> Zod["Zod Schema<br/><i>validate</i>"]
    Zod -->|"invalido"| Errors["Erros dos Campos<br/><i>getError('name')</i>"]
    Zod -->|"valido"| Mutation["useMutation<br/><i>createProduct(input)</i>"]
    Mutation --> Adapter["Adapter<br/><i>toCreatePayload</i>"]
    Adapter --> Service["Service<br/><i>POST /v2/products</i>"]
    Service -->|"201"| Invalidate["Invalidar Queries<br/><i>refetch da lista</i>"]
    Service -->|"erro"| APIError["Banner de Erro da API"]

    style Input fill:#35495e,color:#fff
    style Zod fill:#42b883,color:#fff
    style Mutation fill:#42b883,color:#fff
    style Adapter fill:#35495e,color:#fff
```

## Modo de Edicao

Para reutilizar o mesmo formulario para edicao, adicione uma prop e pre-preencha:

```vue
<script setup lang="ts">
import type { Product } from '../types/products.contracts'

const props = defineProps<{
  product?: Product // undefined = criacao, definido = edicao
}>()

const form = reactive<CreateProductFormData>({
  name: props.product?.name ?? '',
  description: props.product?.description ?? '',
  category: props.product?.category ?? '',
  price: props.product?.price ?? 0,
  imageUrl: props.product?.imageUrl ?? '',
})

// Usa mutation diferente para edicao
const { createProduct, isPending } = props.product
  ? useUpdateProduct(props.product.id)
  : useCreateProduct()
</script>
```

## Pontos-Chave

- **Zod** valida na fronteira do formulario - antes dos dados entrarem no sistema
- **Adapter** converte na fronteira da API - antes dos dados sairem do sistema
- **useMutation** gerencia carregamento, erro e invalidacao de cache
- **Componentes** exibem estado (carregamento, erros, sucesso) - sem logica de negocio

## Proximos Passos

- [Paginacao + Filtros](/pt-BR/tutorials/pagination-filters) - Construa padroes avancados de listagem
- [Tutorial de Modulo CRUD](/pt-BR/tutorials/crud-module) - Veja o modulo completo com este formulario integrado
