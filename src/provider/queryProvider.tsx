'use client';

import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query';
import { ReactNode } from 'react';

export const queryClient = new QueryClient();

export default function QueryClientProvider({ children }: { children: ReactNode }) {
    return (
        <Provider client={queryClient}>
            {children}
        </Provider>
    );
}