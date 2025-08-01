
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import SmokeyCursor from "@/components/ui/smokey-cursor";

export const metadata: Metadata = {
  title: 'CyberLim',
  description: 'CyberLim - Your partner in cutting-edge digital solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <SmokeyCursor />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
