---
name: review-check-architecture
description: "Use when checking if code follows ARCHITECTURE.md patterns - runs automated conformance checks."
user-invocable: true
argument-hint: "[module]"
allowed-tools: Read, Bash, Glob, Grep
---

Validate the entire project (or a specific module) against `docs/ARCHITECTURE.md`.

Scope: $ARGUMENTS (if empty, validate all src/)

## Automated Checks

Run all checks and report a summary:

```bash
echo "=== 1. Services with try/catch ==="
grep -rn "try {" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK: None"

echo "=== 2. Services with transformation ==="
grep -rn "\.map(\|\.filter(\|new Date\|\.reduce(" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK: None"

echo "=== 3. Unnecessary client:load ==="
grep -rn "client:load" src/ --include="*.astro" 2>/dev/null || echo "OK: None"

echo "=== 4. client:only usage (skips SSR) ==="
grep -rn "client:only" src/ --include="*.astro" 2>/dev/null || echo "OK: None"

echo "=== 5. set:html usage (XSS risk) ==="
grep -rn "set:html" src/ --include="*.astro" 2>/dev/null || echo "OK: None"

echo "=== 6. innerHTML in islands ==="
grep -rn "innerHTML\|dangerouslySetInnerHTML" src/islands/ --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null || echo "OK: None"

echo "=== 7. any types ==="
grep -rn ": any\| any;\|as any\|<any>" src/modules/ --include="*.ts" --include="*.astro" 2>/dev/null | wc -l

echo "=== 8. Cross-module imports ==="
for module in src/modules/*/; do
  name=$(basename "$module")
  grep -rn "from.*modules/" "$module" --include="*.ts" --include="*.astro" 2>/dev/null | grep -v "modules/${name}" || true
done

echo "=== 9. Debug artifacts ==="
grep -rn "console\.\|debugger" src/modules/ --include="*.ts" --include="*.astro" 2>/dev/null | wc -l

echo "=== 10. Missing Content Collection schemas ==="
ls src/content/config.ts 2>/dev/null || echo "WARNING: No content config found"

echo "=== 11. Raw img tags (should use Image component) ==="
grep -rn "<img " src/ --include="*.astro" 2>/dev/null | grep -v "astro:assets" || echo "OK: None"

echo "=== 12. Islands without client directive ==="
grep -rn "import.*from.*islands/" src/ --include="*.astro" 2>/dev/null | while read f; do
  file=$(echo "$f" | cut -d: -f1)
  component=$(echo "$f" | grep -oP "import\s+\K\w+")
  grep -L "client:" "$file" 2>/dev/null && echo "WARNING: $file imports island without client: directive"
done

echo "=== 13. Environment variables in client code ==="
grep -rn "import.meta.env" src/islands/ --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null || echo "OK: None"
```

Produce a summary table:

| Check | Status | Occurrences |
|-------|--------|-------------|
| Services without try/catch | OK/FAIL | X |
| ... | ... | ... |

Overall score: X/13 checks passing.
