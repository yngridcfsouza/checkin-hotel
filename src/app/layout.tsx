import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Express.com",
  description: "Seu checkin online +rápido e +seguro",
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
