# AI Coding Agent Instructions for Console Project

## Project Overview

**Console** is a React + Vite demo application showcasing **XState v5** for state machine management. It features two main interactive components: a question-answering console and a Bongo component demonstrating advanced XState patterns like `raise()` and `emit()`for internal event emission.

**Tech Stack:**
- React 19 + Vite (SWC compiler for Fast Refresh)
- XState v5 for state machines with `xstate` and `@xstate/react`
- React Query for data fetching
- MSW (Mock Service Worker) for API mocking
- Vitest + React Testing Library for tests
- ESLint (strict stylistic rules) + Husky pre-commit hooks

When I mention XState in my request, read the XState 5 technical docs at [XState 5](https://stately.ai/docs/xstate)

## Critical Architecture Patterns

### 1. XState State Machines (Core Pattern)

State machines live in `src/machines/` and are the **primary source of truth** for UI logic flow:

- **`consoleMachine.js`**: Models Q&A lifecycle (idle → asking → answered/error states)
  - Context holds: `currentQuestion`, `questionCount`, `lastAnswer`, `errorMessage`
  - Used via `useMachine()` hook in components
  - State-based rendering: `state.matches('idle')` determines UI branches

- **`bongoMachine.js`**: Advanced patterns demonstrating `raise()`, actors, and `enqueueActions`
  - Shows how actions can emit internal events without external triggers
  - Demonstrates 3 types of actors: `fromPromise`, `fromCallback`, `fromTransition`
  - Key insight: `raise()` enables automatic state transitions from actions

**Pattern to follow:**
```javascript
// ✅ Use state.matches() for rendering, not state.value
if (state.matches('asking')) { /* show spinner */ }

// ✅ Send events with type and optional payload
send({ type: 'ASK_QUESTION', question: 'What is...?' });

// ✅ Actions with assign() for context updates
actions: {
  setAnswer: assign({
    lastAnswer: ({ event }) => event.answer
  })
}
```

### 2. React Query Integration

`useQuestion` hook (`src/hooks/useQuestion.js`) wraps React Query with state machine events:
- Uses `queryKey: ['question', encodeURIComponent(question)]` pattern
- MSW mocks API at `/api/question`
- **Don't mix React Query state with machine state**—use the hook to trigger machine events

### 3. Testing Approach (Vitest + MSW)

Tests in `**/*.test.jsx` follow this pattern:

```javascript
// 1. Create QueryClient with retry: false for tests
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

// 2. Override MSW handlers in beforeEach()
server.use(
  http.get('/api/question', () => HttpResponse.json({ answer: '...' }))
);

// 3. Use userEvent, not fireEvent (better UX simulation)
await user.click(screen.getByText('Submit'));
await waitFor(() => expect(...).toBeInTheDocument());
```

MSW server is started in `vitest.setup.js` with `onUnhandledRequest: 'error'` to catch unmocked requests.

## Code Conventions & Style

### Strict ESLint Config

The project enforces opinionated formatting via `eslint.config.js`:

- **Indentation:** Tabs only (error)
- **Quotes:** Single quotes with template literals allowed
- **Spacing:**
  - Array brackets `[ ]` always spaced
  - Object braces `{ }` always spaced
  - Space before function paren: `function (x)` ✅, `function(x)` ❌
- **Trailing:** No trailing spaces, always newline at EOF
- **Variables:** Declared at top of scope (`vars-on-top: error`)
- **Unused vars:** Error, except uppercase/underscore patterns (constants)

Run `npm run lint:fix` to auto-format. Pre-commit hook enforces it.

### Component Structure

- **Functional components only** (no class components)
- **Hooks for state**: `useState`, `useCallback`, `useMachine`
- **Custom hooks in `src/hooks/`** for reusable logic (not in components)
- **CSS co-located**: `ComponentName.jsx` + `componentName.css` in same folder
- **Barrel exports**: Each component folder has `index.jsx` re-exporting the main file

```jsx
// ✅ src/components/Bongo/index.jsx
export { default } from './Bongo.jsx';

// ✅ Import by folder
import Bongo from './Bongo';
```

### Naming Conventions

- **Machines:** `camelCase` (e.g., `consoleMachine.js`)
- **Components:** `PascalCase` (e.g., `Bongo.jsx`)
- **Hooks:** `useXxx` (e.g., `useQuestion`)
- **Files:** Match component name + lowercase extensions (e.g., `ConsoleInput.jsx` → `consoleInput.css`)
- **Actions in machines:** Descriptive verbs (e.g., `setQuestion`, `incrementQuestionCount`, `recordStartTime`)

## Build & Development Workflows

### Essential Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR (http://localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run test` | Run Vitest suite |
| `npm run test:ui` | Interactive Vitest UI |
| `npm run lint` | Check ESLint violations |
| `npm run lint:fix` | Auto-fix formatting (run before commits) |

### MSW Configuration

- **Worker:** `public/mockServiceWorker.js` (generated by MSW CLI)
- **Handlers:** `src/mocks/handlers.js` (request-response pairs)
- **Server:** `src/mocks/server.js` (Node environment, used in tests)
- **Browser:** Configured via `vitest.setup.js`

New endpoints must be added to `handlers.js` **before** writing tests.

## Component Architecture Map

```
App (state: showSettings)
├─ Console (uses: consoleMachine, useQuestion)
│  ├─ ConsoleInput (submits question)
│  └─ ConsoleLog (displays answers)
├─ Settings (modal)
├─ SettingsCogButton
└─ Bongo (educational: uses bongoMachine with raise/actors)
```

**Data Flow:**
1. User enters question in `ConsoleInput`
2. `useQuestion` hook calls `askQuestion()` → triggers `useQuery`
3. MSW intercepts fetch, returns mock data
4. Hook updates answers array
5. `ConsoleLog` re-renders with new answer

## External Dependencies & Integrations

- **React Query Devtools**: Inspect queries in UI (mounted in app)
- **Primer Octicons**: Icon components from GitHub
- **Happy DOM**: Test environment (lightweight alternative to jsdom)
- **Husky**: Git hooks; runs ESLint on staged files via `lint-staged`

## Common Pitfalls to Avoid

1. **❌ Don't hardcode query keys** → Use the pattern: `['domain', ...params]`
2. **❌ Don't mix machine context updates with React state** → Always use machine actions
3. **❌ Don't forget `encode/decodeURIComponent`** for question query params
4. **❌ Don't disable ESLint rules without team discussion**
5. **❌ Don't use `state.value` for rendering** → Use `state.matches('stateName')` (more robust)
6. **❌ Don't forget to reset MSW handlers in test `beforeEach()`** → Prevents test pollution

## Key Files to Reference

- `src/state/README.md` - State machine philosophy & benefits
- `src/machines/bongoMachine.js` - XState patterns: `raise()`, actors, `enqueueActions`
- `src/components/Bongo/README.md` - Educational guide to `raise()` pattern
- `src/hooks/useQuestion.js` - React Query + hook pattern
- `.eslintrc.js` - Formatting rules reference

## When to Create New Files

- **State machine:** `src/machines/{featureName}Machine.js` (if complex logic)
- **Hook:** `src/hooks/use{FeatureName}.js` (if reused 2+ components)
- **Component:** `src/components/{ComponentName}/` with `index.jsx` barrel export
- **Test:** Co-locate with source file as `*.test.jsx`

---

**Last Updated:** October 2025 | Generated for XState v5 + React 19 stack
