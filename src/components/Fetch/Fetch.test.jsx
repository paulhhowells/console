import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../../mocks/server.js';
import { http, HttpResponse } from 'msw';
import Fetch from './Fetch.jsx';

// Helper function to render components with React Query
function renderWithQueryClient (component) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false, // Disable retries for tests
			},
		},
	});

	return render(
		<QueryClientProvider client={queryClient}>
			{component}
		</QueryClientProvider>,
	);
}

describe('Fetch Component', () => {
	// Reset counter for each test by overriding the handler
	beforeEach(() => {
		let testCounter = 0;

		server.use(
			http.get('/api/counter', () => {
				testCounter += 1;

				return HttpResponse.json({
					count: testCounter,
					message: `This is request number ${testCounter}`,
				});
			}),
		);
	});

	it('should fetch and display counter data from MSW', async () => {
		renderWithQueryClient(<Fetch />);

		// Initially should show loading
		expect(screen.getByText('Loading counter...')).toBeInTheDocument();

		// Wait for the MSW response to load
		await waitFor(() => {
			expect(screen.getByText('Count:')).toBeInTheDocument();
		});

		// Should display the counter data from MSW - using more flexible text matching
		await waitFor(() => {
			expect(screen.getByText('1')).toBeInTheDocument();
		});
		expect(screen.getByText('This is request number 1')).toBeInTheDocument();
	});

	it('should increment counter when fetch button is clicked', async () => {
		const user = userEvent.setup();

		renderWithQueryClient(<Fetch />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByText('1')).toBeInTheDocument();
		});

		// Click the fetch button to get next number
		const fetchButton = screen.getByText('Fetch New Number');

		await user.click(fetchButton);

		// Wait for the new data
		await waitFor(() => {
			expect(screen.getByText('2')).toBeInTheDocument();
		});

		expect(screen.getByText('This is request number 2')).toBeInTheDocument();
	});

	it('should show fetch button with correct states', async () => {
		renderWithQueryClient(<Fetch />);

		// Wait for initial load
		await waitFor(() => {
			expect(screen.getByText('Fetch New Number')).toBeInTheDocument();
		});

		// Button should be enabled
		const fetchButton = screen.getByText('Fetch New Number');

		expect(fetchButton).not.toBeDisabled();
	});
});
