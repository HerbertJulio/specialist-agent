---
name: dev-create-hook
description: "Use when adding server state management to a module - creates React Query hook with caching and error handling."
user-invocable: true
argument-hint: "[hook-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a custom hook following `docs/ARCHITECTURE.md` section 4.4.

Hook: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 4.4.

2. Determine the type:
   - **Query** (data reading) -> `useQuery` + service + adapter
   - **Mutation** (write/delete) -> `useMutation` + query invalidation
   - **Pure logic** (no API) -> useState + useMemo + useEffect

3. Create the hook in `hooks/use[Name].ts`:

### Query Hook Template
```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { xxxService } from '../services/xxx-service'
import { xxxAdapter } from '../adapters/xxx-adapter'

interface UseXxxOptions {
  page: number
  pageSize?: number
}

export function useXxx(options: UseXxxOptions) {
  const { page, pageSize = 20 } = options

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['xxx', { page, pageSize }],
    queryFn: async () => {
      const response = await xxxService.list({ page, pageSize })
      return xxxAdapter.toXxxList(response.data)
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  return { data, isLoading, isFetching, error, refetch }
}
```

### Mutation Hook Template
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { xxxService } from '../services/xxx-service'
import { xxxAdapter } from '../adapters/xxx-adapter'

export function useCreateXxx() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateXxxInput) => {
      const payload = xxxAdapter.toCreatePayload(input)
      const response = await xxxService.create(payload)
      return xxxAdapter.toXxx(response.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] })
    },
  })
}
```

4. Required: `use` prefix, staleTime for queries, queryKey as array, adapter in queryFn.

5. Connect the layers: service -> adapter -> React Query

6. Validate: `npx tsc --noEmit`
