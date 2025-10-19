import { useQuestion } from '../../hooks/useQuestion';

// import Fetch from '../Fetch';
import ConsoleLog from './ConsoleLog';
import ConsoleInput from './ConsoleInput';

import './Console.css';

export default function Console () {
	const { answers, askQuestion } = useQuestion();

	return (
		<div className="console">
			{/* <Fetch /> */}

			<ConsoleLog answers={answers} />
			<ConsoleInput askQuestion={askQuestion} />
		</div>
	);
}
