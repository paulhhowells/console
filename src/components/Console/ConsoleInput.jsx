import { useState } from 'react';
import { ConsoleSubmitButton } from '../buttons/ConsoleSubmitButton';

export default function ConsoleInput ({ askQuestion }) {
	const [ question, setQuestion ] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();

		askQuestion(question);
		setQuestion(''); // Clear the input field after submission.
	};
	const handleChange = (event) => setQuestion(event.target.value);

	return (
		<div className="console__input">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={question}
					onChange={handleChange}
				/>
				<ConsoleSubmitButton />
				{/* <button
					type="submit"
					aria-label="Send"
				>
					<PaperAirplaneIcon size={24} />
				</button> */}
			</form>
		</div>
	);
}
