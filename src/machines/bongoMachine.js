import {
	emit,
	enqueueActions,
	setup,
	assign,
	log,
	raise,
	fromCallback,
	fromPromise,
	fromTransition,
} from 'xstate';

// Bongo: https://en.wikipedia.org/wiki/Bongo_(antelope)

/**
 * Bongo State Machine
 *
 * Demonstrates using raise() in actions to emit internal events
 * that trigger state transitions.
 *
 * Flow:
 * 1. Start in 'idle' state
 * 2. User clicks 'Start' → transition to 'waiting'
 * 3. In 'waiting', user sends 'input.submit' event with data
 * 4. The 'input.submit' event triggers an action that uses raise() to emit 'PROCEED' event with data
 * 5. The 'PROCEED' event automatically transitions to 'process'
 * 6. Process state invokes an actor that processes the submitted data
 * 7. Process completes and transitions to 'done'
 *
 * States:
 * - idle: Initial state, ready to start
 * - waiting: Waiting for user input submission
 * - process: Processing state (invokes actor to process data)
 * - done: Completed state
 *
 * Events:
 * - START: User initiates the flow
 * - input.submit: User submits input with data (triggers raise action)
 * - PROCEED: Internal event raised by action with data (not called externally)
 * - COMPLETE: Processing finished
 * - RESET: Return to idle
 */

// Actor that processes the submitted data
const processDataActor = fromPromise(async ({ input }) => {
	console.log('🥁 Bongo Actor: Processing data:', input.data);

	// Simulate async processing
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const result = {
		originalData: input.data,
		processedData: input.data.toUpperCase(),
		timestamp: new Date().toISOString(),
	};

	console.log('🥁 Bongo Actor: Processing complete:', result);

	return result;
});

export const bongoMachine = setup({
	actors: {
		processDataActor,

		commandCallbackActor: fromCallback(({ sendBack, input }) => {
			console.log('🥁 Bongo Actor: Command callback invoked', input);

			// Do synchronous work
			const result = {
				originalData: input.data,
				processedData: input.data.toUpperCase(),
			};

			// Send completion event back to parent
			sendBack({ type: 'COMMAND_COMPLETE', result });
		}),

		commandTransitionActor: fromTransition(
			(state, event, z) => {
				console.log('🥁 Bongo Actor: Command transition invoked');
				console.log(state, event, z);

				return state;
			},
			{},
		),
	},
	actions: {
		// Action that raises an internal PROCEED event with data
		// This demonstrates how raise() can trigger transitions from within actions
		proceedToProcess: raise(
			({ event }) => {
				const data = event.data.trim();

				if (data === 'command' || data === 'cmd') {
					console.log(`let’s try command`);

					return ({
						type: 'process.command',
						data,
					});
				}

				return ({
					type: 'process.data',
					data,
				});
			},
		),

		// an action that emits an event externally
		emitNotification: emit(({ event }) => {
			console.log('🦓 Bongo: emitNotification',
				event.data,
			);

			// This object will be emitted as the event
			return {
				type: 'notification',
				data: event.data,
			};
		}),

		processCommand: enqueueActions(
			({ enqueue }) => {
				console.log('🦫 Bongo: enqueueActions');

				// enqueue('emitNotification');

				enqueue(
					emit(({ event }) => {
						console.log('🦓 Bongo enqueue emit:',
							event.data,
						);

						// This object will be emitted as the event
						return {
							type: 'notification',
							data: event.data,
						};
					}),
				);
			},
		),

		processCommand3: ({ event }) => {
			console.log('🥁 Bongo: processCommand with event:', event);

			// try to return an action.
			return [ { type: 'emitNotification' } ];

			/*
			// Logic to decide which actions to run
			if (event.data === 'cmd' || event.data === 'command') {
				// Return an array of actions to be executed
				return [
					{ type: 'emitNotification', data: 'Executing a special command!' },
					// () => emit({
					// 	type: 'notification',
					// 	data: 'Executing a special command!',
					// }),
					// () => assign({
					// 	lastCommand: event.data,
					// }),
				];
			}

			// Return a different array of actions for other commands
			return [
				{ type: 'emitNotification', data: `Received command: ${event.data}` },
				// () => emit({
				// 	type: 'notification',
				// 	data: `Received command: ${event.data}`,
				// }),
				// () => assign({
				// 	lastCommand: event.data,
				// }),
			];

			*/
		},

		processCommand2: emit(({ event }) => {
			console.log('🥁 Bongo: processCommand', event.data);

			// This object will be emitted as the event
			return {
				type: 'notification',
				data: event.data,
			};
		}),

		// processCommand: (_, params) => {
		// 	console.log('🥁 Bongo: processCommand:', params);

		// 	return [
		// 		// return an action
		// 		{ type: 'emitNotification' },

		// 		// emit({ type: 'notification', params }),
		// 	];

		// 	// return { type: 'complete' };
		// },

		storeProcessedResult: assign({
			processedResult: ({ event }) => event.output,
		}),

		incrementCounter: assign({
			processCount: ({ context }) => context.processCount + 1,
		}),

		logWaiting: () => {
			console.log('🥁 Bongo: Entered waiting state, will auto-proceed...');
		},

		logProcessing: () => {
			console.log('🥁 Bongo: Processing...');
		},

		logDone: () => {
			console.log('🥁 Bongo: Done!');
		},

		resetContext: assign({
			processCount: 0,
			startTime: null,
			endTime: null,
			processedResult: null,
		}),

		recordStartTime: assign({
			startTime: () => new Date().toISOString(),
		}),

		recordEndTime: assign({
			endTime: () => new Date().toISOString(),
		}),
	},
}).createMachine({
	id: 'bongo',
	initial: 'idle',
	context: {
		processCount: 0,
		startTime: null,
		endTime: null,
		processedResult: null,
		lastCommand: null,
	},
	states: {
		idle: {
			on: {
				START: {
					target: 'waiting',
					actions: [ 'recordStartTime' ],
				},
			},
		},
		waiting: {
			entry: [ 'logWaiting' ],
			on: {
				'input.submit': {
					actions: [ 'proceedToProcess' ],
				},
				'process.data': {
					target: 'process',
				},

				'process.command': {
					target: 'command',
					actions: [],
				},
			},
		},
		/*
		how to make a choice of actions returned from an action?
		why does returning an array of action types not work?

		use an actor instead of an action?

		need to use emit for external watchers.

		*/
		command: {
			description: 'command',
			entry: [
				log('🥁 Bongo: Entered command state'),
				// {
				// 	type: 'processCommand',
				// 	params: ({ event }) => {
				// 		console.log('🥁 Bongo: entry processCommand action params:', event);
				// 		// Pass any necessary parameters here

				// 		return { data: event.data };
				// 	},
				// },
				// 'emitNotification',
				'processCommand',
			],
			// invoke: {
			// 	src: 'commandTransitionActor',
			// 	input: ({ event }) => ({ data: event.data }),
			// },
			// after: {
			// 	2000: 'done', // transition after 2 seconds
			// },

			//----------------------//

			// invoke: {
			// 	src: 'commandCallbackActor',
			// 	input: ({ event }) => ({ data: event.data }),
			// },
			on: {
				// COMMAND_COMPLETE: {
				// 	target: 'done',
				// 	actions: assign({ processedResult: ({ event }) => event.result }),
				// },

				complete: {
					target: 'done',
					actions: assign({ processedResult: ({ event }) => event.result }),
				},
			},
		},
		process: {
			entry: [ 'logProcessing', 'incrementCounter' ],
			invoke: {
				src: 'processDataActor',
				input: ({ event }) => {
					console.log('🥁 Bongo: Invoking processDataActor with:', event);

					return ({ data: event.data });
				},
				onDone: {
					target: 'done',
					actions: [
						'storeProcessedResult',
						'recordEndTime',
						'logDone',
					],
				},
				onError: {
					target: 'done',
					actions: [ 'recordEndTime' ],
				},
			},
		},
		done: {
			on: {
				RESET: {
					target: 'idle',
					actions: 'resetContext',
				},
				START: {
					target: 'waiting',
					actions: [ 'recordStartTime' ],
				},
			},
		},
	},
});
