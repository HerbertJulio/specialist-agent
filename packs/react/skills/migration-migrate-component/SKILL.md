---
name: migration-migrate-component
description: "Use when a component needs migration to the target architecture or framework version."
user-invocable: true
argument-hint: "[component-file]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Migrate a React component from class to functional with TypeScript following `docs/ARCHITECTURE.md` section 5.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.

2. Analyze the component:
   - Count lines
   - List: props (PropTypes or TS), state, lifecycle methods, handlers, HOCs, Redux connections
   - Map who imports this component

3. Convert to functional component with TypeScript:
   - `class X extends Component` -> `function X(props: XProps)`
   - `this.state` / `this.setState` -> `useState()`
   - `this.props` -> destructured props parameter
   - `PropTypes` -> TypeScript interface
   - `componentDidMount` -> `useEffect(() => {}, [])`
   - `componentDidUpdate` -> `useEffect(() => {}, [deps])`
   - `componentWillUnmount` -> `useEffect` cleanup function
   - `shouldComponentUpdate` -> `React.memo()`
   - `this.handleX.bind(this)` -> `useCallback`
   - HOCs (`connect`, `withRouter`) -> custom hooks (`useStore`, `useNavigate`)
   - Redux `connect(mapState, mapDispatch)` -> Zustand selectors

4. Apply composition pattern if there is prop drilling.

5. Decompose if > 200 lines.

6. Validate:
```bash
npx tsc --noEmit
npx vite build
npx vitest run --passWithNoTests
```
