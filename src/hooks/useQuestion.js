import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchQuestionQueryFn = async ({ queryKey }) => {
	const question = queryKey[1];

	if (question === '') {
		// TODO handle avoid adding '' to answers list.

		// Return a resolved promise with empty answer
		return Promise.resolve('');
	}

	const url = new URL('/api/question', window.location.origin);

	// assumes question is already encoded with encodeURIComponent
	const query = '?question=' + question;

	url.search = query;

	const response = await fetch(
		url,
		{ method: 'GET' },
	);

	if (!response.ok) {
		throw new Error('Failed to fetch answer.');
	}

	// TODO handle other unhappy responses.

	// Return a promise.
	return response.json();
};

export const useQuestion = () => {
	const [ answers, setAnswers ] = useState([]);

	const [ question, setQuestion ] = useState('');
	const askQuestion = useCallback(
		(newQuestion) => setQuestion(newQuestion),
		[],
	);

	const queryKey = [ 'question', encodeURIComponent(question) ];
	const {
		data,
		isLoading,
		error,
		refetch,
		isFetching,
	} = useQuery({
		queryKey,
		queryFn: fetchQuestionQueryFn,
		refetchOnWindowFocus: false, // Disable automatic refetch on window focus
	});

	// Update answers when new data is fetched.
	if (data && !answers.includes(data.answer)) {
		setAnswers((prevAnswers) => [ ...prevAnswers, data.answer ]);
	}

	return {
		answers,
		askQuestion,
		isLoading,
		error,
		refetch,
		isFetching,
	};
};
