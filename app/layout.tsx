import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Эшелон на Самарканд',
  description: 'Чат с героями романа Гузель Яхиной',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
