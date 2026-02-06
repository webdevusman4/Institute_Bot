import { Inter } from "next/font/google"; // <--- Switching to Inter
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StudyMate - AI Tutor",
  description: "Your personalized AI learning assistant.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}