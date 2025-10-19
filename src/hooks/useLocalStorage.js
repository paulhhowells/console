import { useState, useEffect } from 'react';

/**
 * Custom hook to persist state in localStorage
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if nothing is in localStorage
 * @returns {[*, Function]} - Returns the stored value and a setter function
 */
export function useLocalStorage (key, initialValue) {
	// Get from localStorage or use initial value
	const [ storedValue, setStoredValue ] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);

			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error);

			return initialValue;
		}
	});

	// Update localStorage when the state changes
	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(storedValue));
		} catch (error) {
			console.error(`Error setting localStorage key "${key}":`, error);
		}
	}, [ key, storedValue ]);

	return [ storedValue, setStoredValue ];
}
