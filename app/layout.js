import { Inter } from "next/font/google"; // <--- Switching to Inter
import "./globals.css";
import BrandLogo from "./components/BrandLogo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StudyMate - AI Tutor",
  description: "Your personalized AI learning assistant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 bg-white px-6 py-4 flex items-center shadow-md shadow-slate-200/50 ring-1 ring-slate-900/5">
          <BrandLogo />
        </nav>
        {children}
      </body>
    </html>
  );
}