import { GearIcon } from '@primer/octicons-react';
import { useQuestion } from '../../hooks/useQuestion';

// import Fetch from '../Fetch';
import ConsoleLog from './ConsoleLog';
import ConsoleInput from './ConsoleInput';

import './Console.css';

export default function Console () {
	const { answers, askQuestion } = useQuestion();
	return (
		<div className="console">
			<button
				type="button"
				aria-label="Settings"
			>
				<GearIcon size={24} />
			</button>

			{/* <Fetch /> */}

			<ConsoleLog answers={answers} />
			<ConsoleInput askQuestion={askQuestion} />
		</div>
	);
}
