import { http, HttpResponse } from 'msw';

// Counter to track incremented numbers
let counter = 0;

export const handlers = [
	// Handle GET requests to any endpoint and return incremented number
	// http.get('*', ({ request }) => {
	// 	counter += 1;

	// 	console.log(`MSW: GET ${request.url} - returning: ${counter}`);

	// 	return HttpResponse.json({
	// 		number: counter,
	// 		timestamp: new Date().toISOString(),
	// 		url: request.url,
	// 	});
	// }),

	http.get('/api/question', ({ request }) => {
		const url = new URL(request.url);
		const question = url.searchParams.get('question');
		const answer = 'SQL:' + encodeURIComponent(question);

		console.log(`MSW: Received GET request to ${request.url}: ${question}`);

		return HttpResponse.json({
			answer,
		});
	}),

	// You can also add specific endpoints if needed
	http.get('/api/counter', () => {
		counter += 1;

		return HttpResponse.json({
			count: counter,
			message: `This is request number ${counter}`,
		});
	}),

	// Reset counter endpoint
	http.post('/api/reset', () => {
		counter = 0;

		return HttpResponse.json({
			message: 'Counter reset to 0',
			count: counter,
		});
	}),
];
