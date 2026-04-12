"use client";

export default function BrandLogo() {
    return (
        <div className="flex items-center gap-3 cursor-pointer group select-none">
            {/* The Icon Wrapper */}
            <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-2 bg-indigo-500 blur-md opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-300"></div>
                <svg className="relative w-full h-full" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 256 120 L 400 192 L 256 264 L 112 192 Z" fill="#0ea5e9" />
                    <path d="M 112 264 L 256 336 L 400 264" fill="none" stroke="#4f46e5" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M 112 336 L 256 408 L 400 336" fill="none" stroke="#7c3aed" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {/* The Glowing Text */}
            <div className="relative font-black text-2xl tracking-tight hidden sm:block">
                <span className="absolute inset-0 blur-[6px] bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 bg-clip-text text-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                    StudyMate
                </span>
                <span className="relative bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 bg-clip-text text-transparent drop-shadow-sm">
                    StudyMate
                </span>
                <span className="absolute -top-1 -right-6 text-[9px] uppercase tracking-widest font-bold text-indigo-400 group-hover:text-sky-500 transition-colors">
                    App
                </span>
            </div>
        </div>
    );
}