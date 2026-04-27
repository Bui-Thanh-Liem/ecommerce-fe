import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

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
  
  
  
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>

        <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
          <Toaster position="bottom-right"/>
        </ThemeProvider>
      </body>
    </html>
  )
}
