import { useState } from 'react';
import { useQuestion } from '../../hooks/useQuestion';

// import Fetch from '../Fetch';
import ConsoleLog from './ConsoleLog';
import ConsoleInput from './ConsoleInput';
import Settings from '../Settings';
import { SettingsCogButton } from '../buttons/SettingsCogButton';

import './Console.css';

export default function Console () {
	const { answers, askQuestion } = useQuestion();
	const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);

	const openSettings = () => setIsSettingsOpen(true);
	const closeSettings = () => setIsSettingsOpen(false);

	return (
		<div className="console">
			<SettingsCogButton onClick={openSettings} />

			{/* <Fetch /> */}

			<ConsoleLog answers={answers} />
			<ConsoleInput askQuestion={askQuestion} />

			<Settings isOpen={isSettingsOpen} onClose={closeSettings} />
		</div>
	);
}
