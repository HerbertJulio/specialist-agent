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
grep -rn "try {" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "None"

echo "=== 2. Services with transformation ==="
grep -rn "\.map(\|\.filter(\|new Date\|\.reduce(" src/modules/*/services/ --include="*.ts" 2>/dev/null || echo "None"

echo "=== 3. NgModule usage ==="
grep -rn "NgModule\|declarations:" src/modules/ --include="*.ts" 2>/dev/null || echo "All standalone"

echo "=== 4. Constructor DI ==="
grep -rn "constructor(" src/modules/ --include="*.ts" 2>/dev/null | grep -v "\.spec\.ts" || echo "All using inject()"

echo "=== 5. Legacy @Input/@Output decorators ==="
grep -rn "@Input()\|@Output()" src/modules/ --include="*.ts" 2>/dev/null || echo "All using input()/output()"

echo "=== 6. BehaviorSubject in stores ==="
grep -rn "BehaviorSubject\|ReplaySubject" src/modules/*/stores/ --include="*.ts" 2>/dev/null || echo "All signal-based"

echo "=== 7. Missing OnPush ==="
grep -rn "@Component" src/modules/ --include="*.ts" -l 2>/dev/null | while read f; do
  grep -L "OnPush" "$f" 2>/dev/null
done

echo "=== 8. any types ==="
grep -rn ": any\| any;\|as any\|<any>" src/modules/ --include="*.ts" 2>/dev/null | wc -l

echo "=== 9. Cross-module imports ==="
for module in src/modules/*/; do
  name=$(basename "$module")
  grep -rn "from.*modules/" "$module" --include="*.ts" 2>/dev/null | grep -v "modules/${name}" || true
done

echo "=== 10. innerHTML ==="
grep -rn "innerHTML\|\[innerHTML\]" src/ --include="*.ts" 2>/dev/null || echo "None"

echo "=== 11. Debug artifacts ==="
grep -rn "console\.\|debugger" src/modules/ --include="*.ts" 2>/dev/null | wc -l

echo "=== 12. Components > 200 lines ==="
find src/modules -name "*.component.ts" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 200 ] && echo "$1: $lines lines"' _ {} \;
```

Produce a summary table:

| Check | Status | Occurrences |
|-------|--------|-------------|
| Services without try/catch | PASS/FAIL | X |
| ... | ... | ... |

Overall score: X/12 checks passing.
