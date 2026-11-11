import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hush | Silence, Re-Engineered",
  description:
    "Explore the internal acoustic architecture of Hush wireless noise-cancelling headphones through an interactive scrollytelling showcase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="bg-black font-sans text-white antialiased selection:bg-[#9FB3C8]/25 selection:text-white">
        {children}
      </body>
    </html>
  );
}
