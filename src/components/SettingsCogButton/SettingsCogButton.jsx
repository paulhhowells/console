import { GearIcon } from '@primer/octicons-react';

import './settingsCogButton.css';

export function SettingsCogButton ({ onClick }) {
	return (
		<button
			type="button"
			aria-label="Settings"
			onClick={onClick}
			className="settings-cog__button"
		>
			<GearIcon size={24} />
		</button>
	);
}
