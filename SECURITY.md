# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Specialist Agent, please report it responsibly.

**Do NOT open a public issue.**

Instead, please email the maintainers or use [GitHub's private vulnerability reporting](https://github.com/HerbertJulio/specialist-agent/security/advisories/new).

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response timeline

- **Acknowledgment**: within 48 hours
- **Initial assessment**: within 1 week
- **Fix and disclosure**: coordinated with reporter

## Scope

Specialist Agent is a collection of markdown files and a CLI installer. The main security considerations are:

- **CLI (`npx specialist-agent init`)**: File copying operations only, no network calls, no code execution
- **Agent/skill instructions**: Markdown files that instruct Claude Code - they don't execute code directly
- **Documentation site**: Static VitePress site with no server-side processing

## Best Practices

When using Specialist Agent agents, follow standard security practices:

- Review generated code before committing
- Never commit secrets or credentials
- Use the `@security` agent for auth flows and OWASP compliance checks
- Keep dependencies up to date
