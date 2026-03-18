import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shree Ram Readymade Showroom",
  description: "Trendy aur affordable readymade kapdon ka trusted showroom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
