import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WeatherSnap',
  description: 'Fast and simple weather updates with a modern and minimal design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
