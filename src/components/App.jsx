import { useState } from 'react';

import { Console } from './Console';
import Settings from './Settings';
import { SettingsCogButton } from './buttons/SettingsCogButton';

export default function App () {
	const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);

	const openSettings = () => setIsSettingsOpen(true);
	const closeSettings = () => setIsSettingsOpen(false);

	return (
		<>
			<SettingsCogButton onClick={openSettings} />
			<Console />
			<Settings isOpen={isSettingsOpen} onClose={closeSettings} />
		</>
	);
}
