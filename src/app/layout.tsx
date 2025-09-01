import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Check-in Express",
  description: "Simplifique sua chegada com Check-in Express!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
