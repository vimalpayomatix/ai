import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat Frontend',
  description: 'Modern Next.js chat UI that proxies to an AI API',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}


