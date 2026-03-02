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
grep -rn "try {" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 2. Services with transformation ==="
grep -rn "\.map(\|\.filter(\|new Date\|\.reduce(" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 3. Class components ==="
grep -rn "class.*extends.*Component" src/modules/ --include="*.tsx" 2>/dev/null || echo "OK None"

echo "=== 4. PropTypes usage ==="
grep -rn "PropTypes\." src/modules/ --include="*.tsx" --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 5. Redux usage ==="
grep -rn "useSelector\|useDispatch\|createSlice\|createStore\|connect(" src/modules/ --include="*.ts" --include="*.tsx" 2>/dev/null || echo "OK None"

echo "=== 6. Server state in Zustand ==="
grep -rn "async.*fetch\|axios\|api\.\|\.get(\|\.post(" src/modules/*/stores/ --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 7. Full Zustand destructure (should use selectors) ==="
grep -rn "} = use.*Store()" src/ --include="*.tsx" 2>/dev/null || echo "OK None"

echo "=== 8. any types ==="
grep -rn ": any\| any;\|as any\|<any>" src/modules/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l

echo "=== 9. Cross-module imports ==="
for module in src/modules/*/; do
  name=$(basename "$module")
  grep -rn "from.*modules/" "$module" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "modules/${name}" || true
done

echo "=== 10. dangerouslySetInnerHTML ==="
grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx" 2>/dev/null || echo "OK None"

echo "=== 11. Debug artifacts ==="
grep -rn "console\.\|debugger" src/modules/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l

echo "=== 12. Queries without staleTime ==="
grep -rn "useQuery" src/ --include="*.ts" -l 2>/dev/null | while read f; do
  grep -L "staleTime" "$f" 2>/dev/null
done

echo "=== 13. Components > 200 lines ==="
find src/modules -name "*.tsx" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 200 ] && echo "$1: $lines lines"' _ {} \;

echo "=== 14. Inline style objects in JSX ==="
grep -rn "style={{" src/modules/ --include="*.tsx" 2>/dev/null || echo "OK None"
```

Produce a summary table:

| Check | Status | Occurrences |
|-------|--------|-------------|
| Services without try/catch | OK/FAIL | X |
| ... | ... | ... |

Overall score: X/14 checks passing.
