import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flowblock Clone",
  description: "Animated Bento Grid of Code Boxes built with Next.js + Tailwind + Framer Motion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}
      >
        <header className="p-6 border-b border-gray-800">
          
        </header>

        {/* ✅ Main Content */}
        <main className="flex-1">{children}</main>

        {/* ✅ Footer (optional) */}
        <footer className="p-4 text-center text-gray-500 border-t border-gray-800 text-sm">
        </footer>
      </body>
    </html>
  );
}
