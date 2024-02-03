import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import routes from './routes.tsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ToastProvider from './providers/ToastProvider.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key');
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}
			storageKey="discord-theme"
		>
			<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
				<QueryClientProvider client={queryClient}>
					<ToastProvider />
					<ReactQueryDevtools />
					<RouterProvider router={routes} />
				</QueryClientProvider>
			</ClerkProvider>
		</ThemeProvider>
	</React.StrictMode>
);
