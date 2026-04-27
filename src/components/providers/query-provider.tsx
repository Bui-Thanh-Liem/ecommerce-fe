"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export function ReactQueryProvider({children}: {children: React.ReactNode}) {
   // Tạo Query Client
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1, // Retry 1 lần nếu fail
          refetchOnWindowFocus: false, // Không refetch khi focus lại window
          staleTime: 5 * 60 * 1000, // Data được coi là fresh trong 5 phút
        },
        mutations: {
          retry: 0, // Không retry mutations
        },
      },
    });


    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}