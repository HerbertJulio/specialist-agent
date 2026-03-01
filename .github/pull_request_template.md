## Summary

<!-- Brief description of your changes (1-3 bullet points) -->

-

## Type

<!-- Check the one that applies -->

- [ ] New agent
- [ ] New skill
- [ ] New framework pack
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Documentation
- [ ] CI/tooling
- [ ] Refactoring (no behavior change)
- [ ] Other

## Checklist

### Required

- [ ] My commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] `node tests/validate-agents.mjs` passes without errors
- [ ] `node tests/test-skills.mjs` passes without failures
- [ ] `npm run docs:build` passes without errors

### If applicable

- [ ] New agents have both full and lite versions
- [ ] New agents include Verification Protocol and Anti-Rationalization sections
- [ ] New skills include Anti-Rationalization table
- [ ] CLI tested locally (`node cli/index.mjs list`)
- [ ] Documentation updated
- [ ] Auto-dispatch hook updated for new agents

## Breaking Changes

<!-- If this PR introduces breaking changes, describe them here. Otherwise delete this section. -->

None.

## Related Issues

<!-- Link related issues: Fixes #123, Closes #456 -->
