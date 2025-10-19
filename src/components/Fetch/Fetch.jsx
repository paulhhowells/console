import { useQuery } from '@tanstack/react-query';

const fetchCounter = async () => {
	const response = await fetch('/api/counter');

	if (!response.ok) {
		throw new Error('Failed to fetch counter');
	}

	return response.json();
};

export default function Fetch () {
	const {
		data,
		isLoading,
		error,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: [ 'counter' ],
		queryFn: fetchCounter,
		refetchOnWindowFocus: false, // Disable automatic refetch on window focus
	});

	if (isLoading) {
		return <div>Loading counter...</div>;
	}

	if (error) {
		return (
			<div>
				<p>Error: {error.message}</p>
				<button onClick={() => refetch()}>Retry</button>
			</div>
		);
	}

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
			<h3>Counter from MSW</h3>
			<p><strong>Count:</strong> {data?.count}</p>
			<p><strong>Message:</strong> {data?.message}</p>
			<button
				onClick={() => refetch()}
				disabled={isFetching}
			>
				{isFetching ? 'Fetching...' : 'Fetch New Number'}
			</button>
		</div>
	);
}
