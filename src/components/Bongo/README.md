# Bongo Component

A demonstration component showcasing XState's `raise()` function for emitting internal events within state machine actions.

## Purpose

The Bongo component demonstrates a key XState pattern: **using `raise()` to trigger automatic state transitions from within actions**. This is particularly useful when you want a state to automatically proceed to another state without requiring external input.

## Key Concept: Using `raise()`

The `raise()` function allows actions to emit events internally, enabling automatic state transitions. This is different from external events sent via `send()`.

### Example from bongoMachine.js:

```javascript
actions: {
  // This action raises an internal PROCEED event
  proceedToProcess: raise({ type: 'PROCEED' }),
}

states: {
  waiting: {
    // When entering 'waiting', the proceedToProcess action runs
    entry: ['logWaiting', 'proceedToProcess'],
    on: {
      // The raised PROCEED event triggers this transition
      PROCEED: {
        target: 'process',
      },
    },
  },
}
```

## State Flow

```
┌──────┐   START    ┌─────────┐   raise(PROCEED)   ┌─────────┐
│ idle │ ────────> │ waiting │ ──────────────────> │ process │
└──────┘            └─────────┘                     └────┬────┘
   ▲                                                     │
   │                                                     │ COMPLETE
   │                 ┌──────┐                            │
   └──── RESET ────  │ done │ <──────────────────────────┘
                     └──────┘
```

## States

1. **idle**: Initial state, waiting for user to start
2. **waiting**: Intermediate state that automatically proceeds via `raise()`
3. **process**: Processing state (waits for user to complete)
4. **done**: Final state, can reset or start again

## Usage

### Basic Usage

```jsx
import Bongo from './components/Bongo';

function App() {
  return (
    <div>
      <Bongo />
    </div>
  );
}
```

### Adding to Existing App

You can add Bongo to the App component to see it in action:

```jsx
// In src/components/App.jsx
import Bongo from './Bongo';

export default function App() {
  return (
    <>
      <Bongo />
      {/* Other components */}
    </>
  );
}
```

## Why Use `raise()`?

### Benefits:

1. **Automatic Transitions**: States can transition automatically without external triggers
2. **Cleaner Logic**: Keep transition logic within the state machine
3. **Self-Contained States**: States can manage their own progression
4. **Asynchronous Patterns**: Useful for delayed or conditional automatic transitions

### Common Use Cases:

- **Auto-progression**: Move to next state after validation
- **Retry Logic**: Automatically retry after errors
- **Cleanup Operations**: Trigger cleanup then proceed
- **Multi-step Initialization**: Chain initialization steps
- **Timeouts**: Combined with delays for timeout behavior

## Files

- `src/machines/bongoMachine.js` - State machine definition
- `src/components/Bongo/Bongo.jsx` - React component
- `src/components/Bongo/Bongo.css` - Component styles
- `src/components/Bongo/index.jsx` - Barrel export

## Interactive Demo

When you run the component:

1. Click **"Start Bongo"** - Transitions to `waiting` state
2. The `waiting` state immediately raises a `PROCEED` event
3. The machine automatically transitions to `process` state
4. Click **"Complete"** - Transitions to `done` state
5. Click **"Start Again"** or **"Reset"** to restart

## Learning Points

- **Internal Events**: `raise()` creates events that don't come from outside
- **Entry Actions**: Actions in `entry` run when entering a state
- **Action Ordering**: Actions in arrays run in sequence
- **Context Updates**: Track process count and timestamps
- **Console Logging**: See state transitions in browser console

## Extending the Example

You can extend this pattern to:

```javascript
// Raise with data
proceedWithData: raise({ type: 'PROCEED', data: { value: 42 } }),

// Conditional raise
conditionalProceed: ({ context }) => {
  if (context.shouldProceed) {
    return raise({ type: 'PROCEED' });
  }
},

// Multiple raises
multipleSteps: [
  raise({ type: 'STEP_1' }),
  raise({ type: 'STEP_2' }),
],
```

## Comparison: `raise()` vs `send()`

| Feature | `raise()` | `send()` |
|---------|-----------|----------|
| Usage | Inside actions | External to machine |
| Timing | Synchronous | Via event queue |
| Context | Internal events | External events |
| Use Case | Auto-transitions | User interactions |

## Resources

- [XState Documentation - Actions](https://stately.ai/docs/actions)
- [XState raise() API](https://stately.ai/docs/actions#raise-action)
- [State Machine Patterns](https://stately.ai/docs/patterns)

## Try It Out

Start the development server and interact with the Bongo component to see `raise()` in action!

```bash
npm run dev
```

Watch the browser console to see the logged messages as the state machine transitions.
