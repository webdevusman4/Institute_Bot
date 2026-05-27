import { Inter } from "next/font/google"; // <--- Switching to Inter
import "./globals.css";
import BrandLogo from "./components/BrandLogo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ParhoMate - AI Tutor",
  description: "Your personalized AI learning assistant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 bg-white px-6 py-4 flex items-center justify-between shadow-md shadow-slate-200/50 ring-1 ring-slate-900/5">
          <BrandLogo />
          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">BSSE Engine</span>
            <span className="text-slate-900 font-bold">Usman Mughal</span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}