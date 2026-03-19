import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shree Ram Readymade Showroom",
  description: "Trendy aur affordable readymade kapdon ka trusted showroom",
  icons: {
    icon: "/logo-shree-ram-round.png",
    shortcut: "/logo-shree-ram-round.png",
    apple: "/logo-shree-ram-round.png",
  },
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
