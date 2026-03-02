---
name: review-check-architecture
description: "Use when checking if code follows ARCHITECTURE.md patterns - runs automated conformance checks."
user-invocable: true
argument-hint: "[module]"
allowed-tools: Read, Bash, Glob, Grep
---

Validate the entire project (or a specific module) against `docs/ARCHITECTURE.md`.

Scope: $ARGUMENTS (if empty, validate all src/lib/modules/)

## Automated Checks

Run all checks and report a summary:

```bash
echo "=== 1. Services with try/catch ==="
grep -rn "try {" src/lib/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 2. Services with transformation ==="
grep -rn "\.map(\|\.filter(\|new Date\|\.reduce(" src/lib/modules/*/services/ --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 3. Svelte 4: export let (should use $props) ==="
grep -rn "export let " src/lib/modules/ --include="*.svelte" 2>/dev/null || echo "OK None"

echo "=== 4. Svelte 4: $: reactive (should use $derived/$effect) ==="
grep -rn "^\s*\$:" src/lib/modules/ --include="*.svelte" 2>/dev/null || echo "OK None"

echo "=== 5. Svelte 4: createEventDispatcher ==="
grep -rn "createEventDispatcher" src/lib/modules/ --include="*.svelte" --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 6. Svelte 4: <slot> (should use {@render} + snippets) ==="
grep -rn "<slot" src/lib/modules/ --include="*.svelte" 2>/dev/null || echo "OK None"

echo "=== 7. SvelteKit 1: $app/stores ==="
grep -rn "\$app/stores" src/ --include="*.svelte" --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 8. SvelteKit 1: throw redirect/error ==="
grep -rn "throw redirect\|throw error" src/ --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 9. Server state in client stores ==="
grep -rn "async.*fetch\|await fetch\|\.json()" src/lib/modules/*/stores/ --include="*.ts" 2>/dev/null || echo "OK None"

echo "=== 10. any types ==="
grep -rn ": any\| any;\|as any\|<any>" src/lib/modules/ --include="*.ts" --include="*.svelte" 2>/dev/null | wc -l

echo "=== 11. Cross-module imports ==="
for module in src/lib/modules/*/; do
  name=$(basename "$module")
  grep -rn "from.*modules/" "$module" --include="*.ts" --include="*.svelte" 2>/dev/null | grep -v "modules/${name}" || true
done

echo "=== 12. {@html} usage ==="
grep -rn "{@html" src/ --include="*.svelte" 2>/dev/null || echo "OK None"

echo "=== 13. Debug artifacts ==="
grep -rn "console\.\|debugger" src/lib/modules/ --include="*.ts" --include="*.svelte" 2>/dev/null | wc -l

echo "=== 14. Components > 200 lines ==="
find src/lib/modules -name "*.svelte" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 200 ] && echo "$1: $lines lines"' _ {} \;

echo "=== 15. Missing $state rune (reactive let without rune) ==="
grep -rn "^\s*let .* = \(null\|false\|true\|0\|''\)" src/lib/modules/ --include="*.svelte" 2>/dev/null | grep -v "\$state\|\$derived\|\$props\|import\|const" || echo "OK None"

echo "=== 16. Load functions without error handling ==="
for f in $(find src/routes -name "+page.ts" -o -name "+page.server.ts" 2>/dev/null); do
  grep -L "error(\|fail(\|try" "$f" 2>/dev/null
done
```

Produce a summary table:

| Check | Status | Occurrences |
|-------|--------|-------------|
| Services without try/catch | OK/FAIL | X |
| ... | ... | ... |

Overall score: X/16 checks passing.
