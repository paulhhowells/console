import { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { bongoMachine } from '../../machines/bongoMachine';
import './Bongo.css';

/**
 * Bongo Component
 *
 * Demonstrates XState's raise() function in actions.
 * When in the 'waiting' state, user submits input which triggers
 * an action that raises a PROCEED event to transition to 'process' state.
 * The process state invokes an actor that processes the submitted data.
 */
export default function Bongo () {
	const [ state, send, bongoRef ] = useMachine(bongoMachine);
	const [ inputData, setInputData ] = useState('command');

	useEffect(() => {
		const subscription = bongoRef.on(
			'notification',
			(params) => {
				console.log('🥁 Bongo Component: Received notification from action', params);
			});

		return () => subscription.unsubscribe();
	}, [ bongoRef ]);

	const handleStart = () => {
		send({ type: 'START' });
	};

	const handleSubmit = () => {
		send({ type: 'input.submit', data: inputData });
	};

	const handleReset = () => {
		send({ type: 'RESET' });
	};

	const getStateColor = () => {
		switch (state.value) {
			case 'idle':
				return '#6b7280'; // gray
			case 'waiting':
				return '#f59e0b'; // amber
			case 'process':
				return '#3b82f6'; // blue
			case 'done':
				return '#10b981'; // green
			default:
				return '#6b7280';
		}
	};

	return (
		<div className="bongo">
			<div className="bongo__header">
				<h2>🥁 Bongo State Machine</h2>
				<p className="bongo__description">
					Demonstrates using <code>raise()</code> to emit internal events
				</p>
			</div>

			<div className="bongo__state-display">
				<div
					className="bongo__state-badge"
					style={{ backgroundColor: getStateColor() }}
				>
					{state.value}
				</div>
			</div>

			<div className="bongo__info">
				<div className="bongo__info-item">
					<span className="bongo__label">Process Count:</span>
					<span className="bongo__value">{state.context.processCount}</span>
				</div>

				{state.context.submittedData && (
					<div className="bongo__info-item">
						<span className="bongo__label">Submitted Data:</span>
						<span className="bongo__value">{state.context.submittedData}</span>
					</div>
				)}

				{state.context.processedResult && (
					<div className="bongo__info-item">
						<span className="bongo__label">Processed Result:</span>
						<span className="bongo__value">
							{state.context.processedResult.processedData}
						</span>
					</div>
				)}

				{state.context.startTime && (
					<div className="bongo__info-item">
						<span className="bongo__label">Started:</span>
						<span className="bongo__value">
							{new Date(state.context.startTime).toLocaleTimeString()}
						</span>
					</div>
				)}

				{state.context.endTime && (
					<div className="bongo__info-item">
						<span className="bongo__label">Completed:</span>
						<span className="bongo__value">
							{new Date(state.context.endTime).toLocaleTimeString()}
						</span>
					</div>
				)}
			</div>

			<div className="bongo__controls">
				{state.matches('idle') && (
					<button
						onClick={handleStart}
						className="bongo__button bongo__button--primary"
					>
						Start Bongo
					</button>
				)}

				{state.matches('waiting') && (
					<div className="bongo__input-group">
						<input
							type="text"
							value={inputData}
							onChange={(e) => setInputData(e.target.value)}
							placeholder="Enter data to process"
							className="bongo__input"
						/>
						<button
							onClick={handleSubmit}
							className="bongo__button bongo__button--primary"
						>
							Submit Input
						</button>
					</div>
				)}

				{state.matches('process') && (
					<div className="bongo__processing">
						<span className="bongo__spinner">⏳</span>
						<span>Processing data with actor...</span>
					</div>
				)}

				{state.matches('done') && (
					<>
						<button
							onClick={handleStart}
							className="bongo__button bongo__button--primary"
						>
							Start Again
						</button>
						<button
							onClick={handleReset}
							className="bongo__button bongo__button--secondary"
						>
							Reset
						</button>
					</>
				)}
			</div>

			<div className="bongo__explanation">
				<h3>How it works:</h3>
				<ol>
					<li>Click "Start Bongo" → transitions to <strong>waiting</strong> state</li>
					<li>
						Enter some data and click "Submit Input" → sends <code>input.submit</code> event with data
					</li>
					<li>
						The <code>input.submit</code> event triggers the <code>proceedToProcess</code> action
						which calls <code>raise()</code> to emit a <code>PROCEED</code> event with the data
					</li>
					<li>
						The <code>PROCEED</code> event immediately transitions to <strong>process</strong> state
					</li>
					<li>
						The <strong>process</strong> state invokes an actor that processes the data asynchronously
					</li>
					<li>When the actor completes → transitions to <strong>done</strong> state</li>
					<li>Click "Reset" to start over</li>
				</ol>

				<div className="bongo__code-note">
					<strong>Key concepts:</strong>
					<ul>
						<li>
							The <code>raise()</code> function allows actions to emit events internally with data
						</li>
						<li>
							Event data is passed through the raised event to subsequent states
						</li>
						<li>
							Actors (invoked services) can process data asynchronously in states
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
