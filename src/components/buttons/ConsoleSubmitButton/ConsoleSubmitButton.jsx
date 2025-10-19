import { PaperAirplaneIcon } from '@primer/octicons-react';

import './consoleSubmitButton.css';

export function ConsoleSubmitButton () {
	return (
		<button
			type="submit"
			aria-label="Send"
			className="console__submit-button"
		>
			<PaperAirplaneIcon size={24} />
		</button>
	);
}
