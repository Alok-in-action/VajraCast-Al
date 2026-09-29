import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VajraCast AI | Thunderstorm Nowcasting",
  description: "0-120 minute thunderstorm and lightning nowcasting dashboard for India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.className} antialiased bg-slate-950 text-slate-50 min-h-screen`}
      >
        <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-cyan-500/20">V</div>
                <span className="font-semibold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                  VajraCast AI
                </span>
              </a>
              {/* Nav links */}
              <div className="flex items-center gap-1 sm:gap-5 text-xs sm:text-sm font-medium text-slate-400">
                <a href="/" className="hover:text-cyan-400 transition-colors px-1.5 py-1">Home</a>
                <a href="/dashboard" className="hover:text-cyan-400 transition-colors px-1.5 py-1">Dashboard</a>
                <a href="/methodology" className="hover:text-cyan-400 transition-colors px-1.5 py-1 hidden sm:block">Methodology</a>
                <a href="/about" className="hover:text-cyan-400 transition-colors px-1.5 py-1 hidden sm:block">About</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
