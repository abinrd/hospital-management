'use client';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hospital Management System</title>
        <meta name="description" content="Hospital Management System for patients and healthcare providers" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}