# Bongo Component - Event Data and Actor Example

## Overview

The Bongo component demonstrates key XState patterns:
1. **Using `raise()` to emit internal events with data**
2. **Conditional raised events** (data determines which event to raise)
3. **Invoking actors to process data asynchronously**
4. **Using `emit()` for external event emission**
5. **Using `enqueueActions()` to batch multiple actions**

## Flow Diagram

```
                           ┌─────────────────────────────┐
                           │  process.data branch        │
                           │  (default data flow)        │
                           ▼                             │
┌──────┐    START   ┌─────────┐    input.submit     ┌────────┐
│ idle │ ─────────> │ waiting │ ──────────────────> │process │
└──────┘            └─────────┘   raise() chooses   └────┬───┘
   ▲                     │        event type based       │ invoke
   │                     │        on data content        │ actor
   │                     │                               │
   │                     │ process.command branch        │ onDone
   │                     │ (when data="cmd"/"command")   │
   │                     └──────────────┬────────────────┘
   │                                    ▼
   │                            ┌──────────────┐
   │                            │   command    │
   │                            │(emit/enqueue)│
   │                            └──────┬───────┘
   │                                   │
   │                   ┌───────────────┤
   │                   ▼               │
   │            ┌──────────────┐       │
   └────RESET─-─│    done      │───────┘
                └──────────────┘
```

## Key Code Sections

### 1. Conditional raise() - Event Type Based on Data

```javascript
// Action that raises DIFFERENT events based on data content
proceedToProcess: raise(({ event }) => {
  const data = event.data.trim();

  // Conditional routing: data determines which event to raise
  if (data === 'command' || data === 'cmd') {
    return { type: 'process.command', data };
  }

  // Default path for regular data
  return { type: 'process.data', data };
}),
```

### 2. Waiting State - Handles Raised Events

```javascript
waiting: {
  entry: ['logWaiting'],
  on: {
    'input.submit': {
      // Trigger action that raises an internal event
      actions: ['proceedToProcess'],
    },
    'process.data': {
      // Raised event triggers transition to process
      target: 'process',
    },
    'process.command': {
      // Alternative raised event for command data
      target: 'command',
    },
  },
}
```

### 3. Actor Processing with Input from Raised Event

```javascript
// Actor definition using fromPromise
const processDataActor = fromPromise(async ({ input }) => {
  console.log('🥁 Bongo Actor: Processing data:', input.data);

  // Simulate async work
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    originalData: input.data,
    processedData: input.data.toUpperCase(),
    timestamp: new Date().toISOString(),
  };
});

// Process state invokes the actor
process: {
  entry: ['logProcessing', 'incrementCounter'],
  invoke: {
    src: 'processDataActor',
    input: ({ event }) => {
      // Receive data from the raised event
      return { data: event.data };
    },
    onDone: {
      target: 'done',
      actions: ['storeProcessedResult', 'recordEndTime', 'logDone'],
    },
    onError: {
      target: 'done',
      actions: ['recordEndTime'],
    },
  },
}
```

## User Interaction Flow

1. **Idle State**: User clicks "Start Bongo"
   - Transition to `waiting` state
   - Record start time

2. **Waiting State**:
   - User enters text in input field (e.g., "hello" or "command")
   - Clicks "Submit Input"
   - Sends: `{ type: 'input.submit', data: 'user text' }`

3. **Action Execution - Conditional raise()**:
   - `proceedToProcess` action is triggered
   - Trims the data: `const data = event.data.trim()`
   - **If** data is "command" or "cmd":
     - Raises: `{ type: 'process.command', data }`
     - Transitions to `command` state
   - **Else** (default):
     - Raises: `{ type: 'process.data', data }`
     - Transitions to `process` state

4. **Process State** (for regular data):
   - Actor is invoked with the data from raised event
   - Shows loading spinner
   - Processes data asynchronously (uppercase transformation)
   - Increments process counter

5. **Command State** (for "command"/"cmd" data):
   - Entry actions execute `enqueueActions()`
   - Emits external notification via `emit()`
   - Waits for manual completion

6. **Done State**:
   - Displays original and processed data
   - Shows timestamps
   - User can start again or reset

## Context Structure

```javascript
context: {
  processCount: 0,           // Number of times process state was entered
  startTime: null,           // ISO timestamp when START event triggered
  endTime: null,             // ISO timestamp when done state reached
  processedResult: null,     // Result output from actor's onDone
  lastCommand: null,         // Track last command (for future use)
}
```

## Component Features

### Input Field
- Text input for entering data
- Real-time state updates
- Default value: "test data"

### Processing Indicator
- Shows spinner animation
- Displays "Processing data with actor..."
- Visible during actor execution

### Results Display
- Shows submitted data
- Shows processed result (uppercase)
- Displays timestamps

## Event Data Flow

### Regular Data Path (data != "command")

```javascript
// User input
input.submit { data: "hello world" }
        ↓
// proceedToProcess action evaluates data
data.trim() = "hello world" (not command)
        ↓
// Raised event
process.data { data: "hello world" }
        ↓
// Transition and invoke actor
process state { invoke: { input: { data: "hello world" } } }
        ↓
// Actor processes
result = {
  originalData: "hello world",
  processedData: "HELLO WORLD",
  timestamp: "2025-10-21T..."
}
        ↓
// Stored in context via onDone
context.processedResult = result
```

### Command Path (data = "command" or "cmd")

```javascript
// User input
input.submit { data: "command" }
        ↓
// proceedToProcess action evaluates data
data.trim() = "command" (matches condition)
        ↓
// Raised event (different type)
process.command { data: "command" }
        ↓
// Transition to command state
command state { entry: ['processCommand'] }
        ↓
// processCommand executes enqueueActions and emit
emitted event = { type: 'notification', data: 'command' }
        ↓
// Component listener can subscribe to external events
bongoRef.on('notification', (params) => { ... })
```

## Learning Points

### Conditional raise() - Routing Based on Data

```javascript
// Raise different events based on data content
proceedToProcess: raise(({ event }) => {
  const data = event.data.trim();

  // Conditional logic determines event type
  if (data === 'command' || data === 'cmd') {
    return { type: 'process.command', data };
  }
  return { type: 'process.data', data };
}),
```

### Actor Input from Raised Event

```javascript
invoke: {
  src: 'myActor',
  input: ({ event }) => {
    // Access data from the raised event
    return { data: event.data };
  },
}
```

### Actor Results in Context

```javascript
onDone: {
  target: 'nextState',
  actions: assign({
    processedResult: ({ event }) => event.output
  }),
}
```

### emit() for External Event Emission

```javascript
emitNotification: emit(({ event }) => {
  console.log('🦓 Bongo: emitNotification', event.data);

  // This object is emitted as an external event
  return {
    type: 'notification',
    data: event.data,
  };
}),

// Component can subscribe:
// bongoRef.on('notification', (params) => { ... })
```

### enqueueActions() for Action Batching

```javascript
processCommand: enqueueActions(({ enqueue }) => {
  console.log('🦫 Bongo: enqueueActions');

  // Enqueue multiple actions to run in sequence
  enqueue('emitNotification');
  // Could enqueue more actions here
}),
```

## Console Output

Watch the browser console to see:
```
🥁 Bongo: Entered waiting state, will auto-proceed...
🥁 Bongo Actor: Processing data: hello world
🥁 Bongo: Processing...
🥁 Bongo Actor: Processing complete: {originalData: "hello world", ...}
🥁 Bongo: Done!
```

## Try It Out

1. Start the dev server: `npm run dev`
2. Open the Bongo component
3. Enter different text values
4. Watch the state transitions
5. Check the browser console for logs
6. See the processed results

## Advanced Patterns

### Multiple Actor Types Demonstrated

1. **`fromPromise`**: For async operations (processDataActor)
   - Returns a promise that resolves with data
   - Use for API calls, file operations, etc.

2. **`fromCallback`**: For synchronous callback-based work (commandCallbackActor)
   - Accepts `sendBack` to emit events back to machine
   - Use for manual event triggering, polling, etc.

3. **`fromTransition`**: For complex actor logic (commandTransitionActor)
   - Returns updated state based on events
   - Use for sub-state machines, complex workflows

### Extend This Example To:

- **Validate input** before raising event
  ```javascript
  proceedToProcess: raise(({ event }) => {
    if (!event.data || event.data.trim() === '') {
      return { type: 'validation.error', error: 'Empty input' };
    }
    return { type: 'process.data', data: event.data };
  })
  ```

- **Handle actor errors** gracefully
  ```javascript
  invoke: {
    src: 'myActor',
    onError: {
      target: 'error',
      actions: assign({ error: ({ event }) => event.error })
    },
  }
  ```

- **Chain multiple actors** in sequence
  ```javascript
  process1: {
    invoke: { src: 'actor1', onDone: { target: 'process2' } },
  },
  process2: {
    invoke: { src: 'actor2', onDone: { target: 'done' } },
  }
  ```

- **Emit events conditionally** based on context
  ```javascript
  processCommand: enqueueActions(({ enqueue, context }) => {
    if (context.shouldNotify) {
      enqueue('emitNotification');
    }
    enqueue('anotherAction');
  })
  ```
