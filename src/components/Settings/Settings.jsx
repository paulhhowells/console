import { useState, useEffect, useRef } from 'react';
import { XIcon } from '@primer/octicons-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

import './settings.css';

export default function Settings ({ isOpen, onClose }) {
	const [ settings, setSettings ] = useLocalStorage('console-settings', {
		theme: 'light',
		fontSize: 'medium',
		autoScroll: true,
		maxLogItems: 100,
	});

	const [ formData, setFormData ] = useState(settings);
	const closeButtonRef = useRef(null);

	// Focus management: move focus to close button when dialog opens
	useEffect(() => {
		if (isOpen && closeButtonRef.current) {
			closeButtonRef.current.focus();
		}
	}, [ isOpen ]);

	// Keyboard event handler for ESC key
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				// handleCancel();
				setFormData(settings); // Reset to saved settings
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [ isOpen, settings, onClose ]);

	if (!isOpen) return null;

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setSettings(formData);
		onClose();
	};

	const handleCancel = () => {
		setFormData(settings); // Reset to saved settings
		onClose();
	};

	return (
		<div className="settings__overlay" onClick={handleCancel}>
			<div
				className="settings__panel"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="settings__title"
				aria-describedby="settings__description"
			>
				<div className="settings__header">
					<h2 id="settings__title">Settings</h2>
					<button
						ref={closeButtonRef}
						type="button"
						className="close-button"
						onClick={ handleCancel }
						aria-label="Close settings"
					>
						<XIcon size={24} aria-hidden="true" />
					</button>
				</div>

				<p id="settings__description" className="sr-only">
					Configure console settings including theme, font size, and logging preferences.
				</p>

				<form onSubmit={handleSubmit} className="settings__form">
					<div className="settings__form-group">
						<label htmlFor="theme">Theme</label>
						<select
							id="theme"
							name="theme"
							value={formData.theme}
							onChange={handleChange}
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="auto">Auto</option>
						</select>
					</div>

					<div className="settings__form-group">
						<label htmlFor="fontSize">Font Size</label>
						<select
							id="fontSize"
							name="fontSize"
							value={formData.fontSize}
							onChange={handleChange}
						>
							<option value="small">Small</option>
							<option value="medium">Medium</option>
							<option value="large">Large</option>
						</select>
					</div>

					<div className="settings__	form-group">
						<label htmlFor="maxLogItems">Max Log Items</label>
						<input
							type="number"
							id="maxLogItems"
							name="maxLogItems"
							min="10"
							max="1000"
							value={formData.maxLogItems}
							onChange={handleChange}
						/>
					</div>

					<div className="settings__form-group checkbox-group">
						<label htmlFor="autoScroll">
							<input
								type="checkbox"
								id="autoScroll"
								name="autoScroll"
								checked={formData.autoScroll}
								onChange={handleChange}
							/>
							Auto-scroll to latest log
						</label>
					</div>

					<div className="settings__form-actions">
						<button type="button" onClick={handleCancel} className="button-secondary">
							Cancel
						</button>
						<button type="submit" className="button-primary">
							Save Settings
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
