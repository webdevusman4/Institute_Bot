"use client";

import Link from "next/link";

export default function MathDashboard() {

    const chapters = [
        {
            title: "Functional English",
            description: "Communication process, verbal/non-verbal types, and ESP.",
            icon: "✍️",
            link: "/preview/english",
            headerColor: "bg-rose-600",
            status: "Ready"
        },
        {
            title: "Matrices & Determinants",
            description: "Order, Determinants, Cramer's Rule, and Inverses.",
            icon: "📐",
            link: "/preview", // Update with your actual route if different
            headerColor: "bg-indigo-600",
            status: "Ready"
        },
        {
            title: "Discrete Structures",
            description: "Logic, Propositions, Sets, and Truth Tables.",
            icon: "🧠",
            link: "/preview/discrete",
            headerColor: "bg-emerald-600",
            status: "Ready"
        },
        {
            title: "Number Systems",
            description: "Binary, Hex, Decimal conversions and logic.",
            icon: "💻",
            link: "/preview/numbers",
            headerColor: "bg-blue-600",
            status: "Ready"
        },
        {
            title: "Trigonometry",
            description: "Identities, Formulas, and Triangles.",
            icon: "tri",
            link: "/preview/trigonometry",
            headerColor: "bg-slate-500",
            status: "Coming Soon"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* ✨ Glassmorphism Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white p-2 rounded-lg text-xl leading-none">∑</span>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                            Math<span className="text-indigo-600">Mastery</span>
                        </h1>
                    </div>
                    <div className="text-sm font-medium text-slate-500 hidden md:flex items-center gap-3">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">Student</span>
                        <span className="text-slate-900 font-bold">Usman Mughal</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16 px-6 shadow-inner">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Master Mathematics, <br /> One Chapter at a Time.
                    </h2>
                    <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                        Comprehensive notes, examples, and detailed solutions for BSSE students.
                    </p>
                </div>
            </div>

            {/* Dashboard Grid */}
            <main className="max-w-6xl mx-auto px-6 -mt-10 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chapters.map((chapter, idx) => {

                        const isReady = chapter.status === "Ready";

                        return (
                            <Link
                                key={idx}
                                href={isReady ? chapter.link : "#"}
                                className={`group relative flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 
                  ${isReady ? 'hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200' : 'opacity-75 grayscale cursor-not-allowed'}`}
                            >

                                {/* ✨ Colored Header Section */}
                                <div className={`h-24 ${chapter.headerColor} relative flex items-center px-6`}>
                                    {/* Icon */}
                                    <div className="text-4xl text-white/90 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                                        {chapter.icon === "tri" ? (
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        ) : (
                                            chapter.icon
                                        )}
                                    </div>

                                    {/* ✨ Badges moved inside the header */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm 
                      ${isReady ? "bg-white/20 text-white backdrop-blur-sm" : "bg-white/50 text-slate-800"}`}>
                                            {chapter.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {chapter.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                                        {chapter.description}
                                    </p>

                                    {/* ✨ Upgraded Explicit Button */}
                                    <div className="mt-6">
                                        <div className={`w-full text-center py-2.5 rounded-xl font-bold text-sm transition-all duration-300 
                      ${isReady
                                                ? 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white'
                                                : 'bg-slate-100 text-slate-400'}`}>
                                            {isReady ? "Start Learning" : "Under Construction"}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>

        </div>
    );
}