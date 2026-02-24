import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeChat Style Engine",
  description: "Compile Markdown into WeChat-compatible inline HTML",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
