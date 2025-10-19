import { GearIcon } from '@primer/octicons-react';
import { useQuestion } from '../../hooks/useQuestion';

// import Fetch from '../Fetch';
import ConsoleLog from './ConsoleLog';
import ConsoleInput from './ConsoleInput';
import { SettingsCogButton } from '../SettingsCogButton/SettingsCogButton';

import './Console.css';

export default function Console () {
	const { answers, askQuestion } = useQuestion();
	return (
		<div className="console">
			<SettingsCogButton onClick={openSettings} />

			{/* <Fetch /> */}

			<ConsoleLog answers={answers} />
			<ConsoleInput askQuestion={askQuestion} />
		</div>
	);
}
