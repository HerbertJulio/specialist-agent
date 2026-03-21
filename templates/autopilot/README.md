# Autopilot - DevContainer Setup

Run Autopilot safely inside a container with full autonomy.

## Why DevContainer?

Running `claude --dangerously-skip-permissions` gives Claude
unrestricted access to your system. A DevContainer isolates
execution so Claude cannot affect your host machine.

## Quick Start

### 1. Copy DevContainer Config

```bash
mkdir -p .devcontainer
cp templates/autopilot/devcontainer.json .devcontainer/devcontainer.json
```

### 2. Set API Key

Ensure `ANTHROPIC_API_KEY` is set in your host environment:

```bash
# Linux/macOS
export ANTHROPIC_API_KEY="your-key-here"

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY = "your-key-here"
```

The DevContainer automatically forwards this env var.

### 3. Open in Container

In VS Code:
1. Install the **Dev Containers** extension (ms-vscode-remote)
2. Open the project folder
3. Click the bottom-left corner → **Reopen in Container**
4. Wait for container build to complete

### 4. Create a PRD

Inside the container terminal:

```bash
claude
# Then: /prd "Your feature description"
# Exit claude after PRD is generated
```

### 5. Run Autopilot

```bash
./scripts/autopilot.sh docs/PRD-your-feature.md \
  --max-iterations=10 \
  --model=claude-opus-4-6 \
  --dangerously-skip-permissions
```

Leave it running. Come back later to check results.

## Options Reference

| Option | Default | Description |
|--------|---------|-------------|
| `--max-iterations=N` | 10 | Safety limit |
| `--model=MODEL` | claude-sonnet-4-6 | Claude model |
| `--completion-signal=STR` | AUTOPILOT_COMPLETE | Stop signal |
| `--progress-file=PATH` | .claude/autopilot/progress.md | State file |
| `--dangerously-skip-permissions` | off | Auto-approve |

## Checking Progress

From another terminal (or after the loop finishes):

```bash
cat .claude/autopilot/progress.md
git log --oneline
```

## Resuming After Interruption

Just run the same command again. The script reads
`progress.md` and continues from where it stopped.

## Rollback

If something went wrong:

```bash
# List restore points
git tag -l "restore-point/ralf-*"

# Rollback to the start
git reset --hard restore-point/ralf-[timestamp]
```

## Security Notes

- The container is isolated from your host filesystem
- `--dangerously-skip-permissions` only affects the container
- Claude cannot access host files, network, or processes
- Always review generated code before merging to main
- Use a feature branch for Autopilot work

## Troubleshooting

**Claude CLI not found:**
The container runs `npm install` on creation.
If Claude is missing, run `npm install -g @anthropic-ai/claude-code`.

**API key not forwarded:**
Check that `ANTHROPIC_API_KEY` is set on your host
before opening the container.

**Permission denied on script:**
Run `chmod +x scripts/autopilot.sh`.

**Container build fails:**
Ensure Docker Desktop is running and has enough resources
(at least 4GB RAM allocated).
