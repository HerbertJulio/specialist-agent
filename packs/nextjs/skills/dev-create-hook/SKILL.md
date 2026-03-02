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
   - **Pure logic** (no API) -> useState + useEffect + cleanup

3. Create the hook in `hooks/use[Name].ts`:

### Query Hook
```typescript
'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { xxxService } from '../services/xxx-service'
import { xxxAdapter } from '../adapters/xxx-adapter'

interface UseXxxListOptions {
  page: number
  pageSize?: number
  search?: string
}

export function useXxxList(options: UseXxxListOptions) {
  const { page, pageSize = 20, search = '' } = options

  const query = useQuery({
    queryKey: ['xxx', 'list', { page, pageSize, search }],
    queryFn: async () => {
      const response = await xxxService.list({ page, pageSize, search })
      return xxxAdapter.toXxxList(response.data)
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  return {
    items: query.data?.items ?? [],
    totalPages: query.data?.totalPages ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isEmpty: !query.isLoading && (query.data?.items.length ?? 0) === 0,
    error: query.error,
    refetch: query.refetch,
  }
}
```

### Mutation Hook
```typescript
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { xxxService } from '../services/xxx-service'
import { xxxAdapter } from '../adapters/xxx-adapter'

export function useDeleteXxx() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => xxxService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] })
    },
  })
}
```

4. Rules:
   - Required `use` prefix
   - `'use client'` directive (hooks are client-only)
   - Explicit `staleTime` for queries
   - Connect layers: service -> adapter -> React Query
   - Return typed values

5. Validate: `npx tsc --noEmit`
