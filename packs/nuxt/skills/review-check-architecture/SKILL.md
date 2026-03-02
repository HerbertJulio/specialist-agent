---
name: review-check-architecture
description: "Use when checking if code follows ARCHITECTURE.md patterns - runs automated conformance checks."
user-invocable: true
argument-hint: "[module]"
allowed-tools: Read, Bash, Glob, Grep
---

Validate the entire project (or a specific module) against `docs/ARCHITECTURE.md`.

Scope: $ARGUMENTS (if empty, validate all modules/)

## Automated Checks

Run all checks and report a summary:

```bash
echo "=== 1. Services with try/catch ==="
grep -rn "try {" modules/*/services/ --include="*.ts" 2>/dev/null || echo "None found"

echo "=== 2. Services with transformation ==="
grep -rn "\.map(\|\.filter(\|new Date\|\.reduce(" modules/*/services/ --include="*.ts" 2>/dev/null || echo "None found"

echo "=== 3. Components without script setup ==="
grep -rL "script setup" modules/*/components/*.vue pages/*.vue 2>/dev/null || echo "All ok"

echo "=== 4. Components without TypeScript ==="
grep -rL 'lang="ts"' modules/*/components/*.vue pages/*.vue 2>/dev/null || echo "All ok"

echo "=== 5. Options API ==="
grep -rn "defineComponent\|export default {" modules/ pages/ --include="*.vue" 2>/dev/null || echo "None found"

echo "=== 6. Explicit Vue imports (should use auto-imports) ==="
grep -rn "from 'vue'" composables/ components/ pages/ --include="*.vue" --include="*.ts" 2>/dev/null || echo "None found"

echo "=== 7. Server state in Pinia ==="
grep -rn "\$fetch\|useFetch\|useAsyncData" modules/*/stores/ --include="*.ts" 2>/dev/null || echo "None found"

echo "=== 8. any types ==="
grep -rn ": any\| any;\|as any\|<any>" modules/ --include="*.ts" --include="*.vue" 2>/dev/null | wc -l

echo "=== 9. Cross-module imports ==="
for module in modules/*/; do
  name=$(basename "$module")
  grep -rn "from.*modules/" "$module" --include="*.ts" --include="*.vue" 2>/dev/null | grep -v "modules/${name}" || true
done

echo "=== 10. v-html ==="
grep -rn "v-html" --include="*.vue" 2>/dev/null || echo "None found"

echo "=== 11. Debug artifacts ==="
grep -rn "console\.\|debugger" modules/ --include="*.ts" --include="*.vue" 2>/dev/null | wc -l

echo "=== 12. Server routes without Zod validation ==="
grep -rL "readValidatedBody\|getValidatedQuery\|getValidatedRouterParams" server/api/**/*.ts 2>/dev/null || echo "All ok"

echo "=== 13. Components > 200 lines ==="
find modules pages components -name "*.vue" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 200 ] && echo "$1: $lines lines"' _ {} \; 2>/dev/null

echo "=== 14. Nuxt 2 patterns ==="
grep -rn "asyncData\|nuxtServerInit\|\$axios\|this\.\$store\|this\.\$route\|this\.\$router" --include="*.vue" --include="*.ts" 2>/dev/null || echo "None found"
```

Produce a summary table:

| Check | Status | Occurrences |
|-------|--------|-------------|
| Services without try/catch | OK/FAIL | X |
| ... | ... | ... |

Overall score: X/14 checks passing.
