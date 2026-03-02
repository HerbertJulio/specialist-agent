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
grep -rn "try {" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK: None"

echo "=== 2. Services with transformation ==="
grep -rn "\.map(\|\.filter(\|new Date\|\.reduce(" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK: None"

echo "=== 3. Hooks in Server Components (pages without 'use client') ==="
for f in $(find app/ -name "page.tsx" -o -name "layout.tsx" 2>/dev/null); do
  if ! grep -q "'use client'" "$f" 2>/dev/null; then
    grep -l "useState\|useEffect\|useRef\|useQuery\|useStore" "$f" 2>/dev/null
  fi
done || echo "OK: None"

echo "=== 4. Missing 'use client' in components with hooks ==="
grep -rn "useState\|useEffect\|useRef\|useCallback\|useMemo\|useQuery\|useMutation" src/modules/*/components/ --include="*.tsx" -l 2>/dev/null | while read f; do
  grep -L "'use client'" "$f" 2>/dev/null
done || echo "OK: None"

echo "=== 5. Missing 'use server' in actions ==="
grep -rL "'use server'" src/modules/*/actions/ --include="*.ts" 2>/dev/null || echo "OK: All have directive"

echo "=== 6. error.tsx without 'use client' ==="
find app/ -name "error.tsx" 2>/dev/null | while read f; do
  grep -L "'use client'" "$f" 2>/dev/null
done || echo "OK: All have directive"

echo "=== 7. Missing loading.tsx for pages ==="
for dir in $(find app/ -name "page.tsx" -exec dirname {} \; 2>/dev/null); do
  [ ! -f "$dir/loading.tsx" ] && echo "Missing: $dir/loading.tsx"
done || echo "OK: All present"

echo "=== 8. Missing error.tsx for pages ==="
for dir in $(find app/ -name "page.tsx" -exec dirname {} \; 2>/dev/null); do
  [ ! -f "$dir/error.tsx" ] && echo "Missing: $dir/error.tsx"
done || echo "OK: All present"

echo "=== 9. Server state in Zustand ==="
grep -rn "async\|fetch\|axios\|api\.\|\.get(\|\.post(" src/modules/*/stores/ --include="*.ts" 2>/dev/null || echo "OK: None"

echo "=== 10. any types ==="
grep -rn ": any\| any;\|as any\|<any>" src/modules/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l

echo "=== 11. Cross-module imports ==="
for module in src/modules/*/; do
  name=$(basename "$module")
  grep -rn "from.*modules/" "$module" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "modules/${name}" || true
done

echo "=== 12. dangerouslySetInnerHTML ==="
grep -rn "dangerouslySetInnerHTML" src/ app/ --include="*.tsx" 2>/dev/null || echo "OK: None"

echo "=== 13. Debug artifacts ==="
grep -rn "console\.\|debugger" src/modules/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l

echo "=== 14. Queries without staleTime ==="
grep -rn "useQuery" src/ --include="*.ts" --include="*.tsx" -l 2>/dev/null | while read f; do
  grep -L "staleTime" "$f" 2>/dev/null
done

echo "=== 15. Components > 200 lines ==="
find src/modules -name "*.tsx" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 200 ] && echo "$1: $lines lines"' _ {} \;

echo "=== 16. Pages Router remnants ==="
ls pages/ 2>/dev/null && echo "WARN: pages/ directory still exists"
grep -rn "getServerSideProps\|getStaticProps\|getStaticPaths" src/ app/ --include="*.ts" --include="*.tsx" 2>/dev/null || echo "OK: None"
grep -rn "from.*next/router" src/ app/ --include="*.ts" --include="*.tsx" 2>/dev/null || echo "OK: None"

echo "=== 17. <img> instead of next/image ==="
grep -rn "<img " src/ app/ --include="*.tsx" 2>/dev/null || echo "OK: None"

echo "=== 18. Missing metadata in pages ==="
for f in $(find app/ -name "page.tsx" 2>/dev/null); do
  grep -L "metadata\|generateMetadata" "$f" 2>/dev/null
done || echo "OK: All have metadata"
```

Produce a summary table:

| Check | Status | Occurrences |
|-------|--------|-------------|
| Services without try/catch | OK/FAIL | X |
| ... | ... | ... |

Overall score: X/18 checks passing.
