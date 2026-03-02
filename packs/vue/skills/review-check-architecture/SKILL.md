---
name: review-check-architecture
description: "Use when checking if code follows ARCHITECTURE.md patterns - runs automated conformance checks."
user-invocable: true
argument-hint: "[module]"
allowed-tools: Read, Bash, Glob, Grep
---

Validate the entire project (or a specific module) against `docs/ARCHITECTURE.md`.

Scope: $ARGUMENTS (if empty, validate all src/modules/)

## Automated Checks

Run all checks and report a summary:

```bash
echo "=== 1. Services with try/catch ==="
grep -rn "try {" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "✅ None"

echo "=== 2. Services with transformation ==="
grep -rn "\.map(\|\.filter(\|new Date\|\.reduce(" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "✅ None"

echo "=== 3. Components without script setup ==="
grep -rL "script setup" src/modules/*/components/*.vue src/modules/*/views/*.vue 2>/dev/null || echo "✅ All ok"

echo "=== 4. Components without TypeScript ==="
grep -rL 'lang="ts"' src/modules/*/components/*.vue src/modules/*/views/*.vue 2>/dev/null || echo "✅ All ok"

echo "=== 5. Options API ==="
grep -rn "defineComponent\|export default {" src/modules/ --include="*.vue" 2>/dev/null || echo "✅ None"

echo "=== 6. Mixins ==="
grep -rn "mixins:" src/ --include="*.vue" 2>/dev/null || echo "✅ None"

echo "=== 7. Server state in Pinia ==="
grep -rn "async.*fetch\|axios\|api\.\|\.get(\|\.post(" src/modules/*/stores/ --include="*.ts" 2>/dev/null || echo "✅ None"

echo "=== 8. Missing storeToRefs ==="
grep -rn "const {.*} = use.*Store()" src/ --include="*.vue" 2>/dev/null | grep -v "storeToRefs" || echo "✅ All ok"

echo "=== 9. any types ==="
grep -rn ": any\| any;\|as any\|<any>" src/modules/ --include="*.ts" --include="*.vue" 2>/dev/null | wc -l

echo "=== 10. Cross-module imports ==="
for module in src/modules/*/; do
  name=$(basename "$module")
  grep -rn "from.*modules/" "$module" --include="*.ts" --include="*.vue" 2>/dev/null | grep -v "modules/${name}" || true
done

echo "=== 11. v-html ==="
grep -rn "v-html" src/ --include="*.vue" 2>/dev/null || echo "✅ None"

echo "=== 12. Debug artifacts ==="
grep -rn "console\.\|debugger" src/modules/ --include="*.ts" --include="*.vue" 2>/dev/null | wc -l

echo "=== 13. Queries without staleTime ==="
grep -rn "useQuery" src/ --include="*.ts" -l 2>/dev/null | while read f; do
  grep -L "staleTime" "$f" 2>/dev/null
done

echo "=== 14. Components > 200 lines ==="
find src/modules -name "*.vue" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 200 ] && echo "$1: $lines lines"' _ {} \;
```

Produce a summary table:

| Check | Status | Occurrences |
|-------|--------|-------------|
| Services without try/catch | ✅/❌ | X |
| ... | ... | ... |

Overall score: X/14 checks passing.
