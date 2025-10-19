import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './components/App.jsx';
import './index.css';

// Start MSW in development
if (import.meta.env.DEV) {
	const { worker } = await import('./mocks/browser');

	await worker.start(
		{ onUnhandledRequest: 'bypass' },
	);

	console.log('MSW started');
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
