import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Express.com | Site Oficial | Check-in Online",
  description: "Seu Check-in Online +rápido e +seguro",
  icons: {
    icon: [{
      url: '/favicon.png',
      type: 'image/png'
    }],
    shortcut: [{
      url: '/favicon.png',
      type: 'image/png'
    }],
    apple: [{
      url: '/favicon.png',
      type: 'image/png'
    }],
    other: [{
      url: '/favicon.png',
      type: 'image/png'
    }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="antialiased bg-gray-50">
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
