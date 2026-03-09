"use client";

import { useState, useEffect } from "react";
import englishData from "../../../data/english.json";

export default function EnglishPreview() {
    // State Management
    const [activeSection, setActiveSection] = useState(englishData.sections[0].id);
    const [openSubtopic, setOpenSubtopic] = useState(null);

    // Scroll to top when changing sections
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setOpenSubtopic(null); // Close accordions when switching sections
    }, [activeSection]);

    const currentSection = englishData.sections.find((s) => s.id === activeSection);

    // Custom parser for **bold** text (Zero external dependencies needed)
    const renderText = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return (
                    <strong key={i} className="font-extrabold text-slate-900">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-200">

            {/* 📱 MOBILE NAVIGATION (Hidden on Desktop) */}
            <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
                <h1 className="text-lg font-black text-slate-900 mb-3">Functional English</h1>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {englishData.sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all flex-shrink-0 ${activeSection === section.id
                                    ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                                    : "bg-slate-100 text-slate-600 hover:bg-rose-100"
                                }`}
                        >
                            Sec {section.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* 💻 DESKTOP SIDEBAR (Hidden on Mobile) */}
            <aside className="w-80 bg-white border-r border-slate-200 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto shadow-sm z-40">
                <div className="mb-10 mt-4">
                    <span className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                        CS-359
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                        Functional <br />
                        <span className="text-rose-600">English</span>
                    </h1>
                </div>

                <nav className="space-y-3">
                    {englishData.sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all duration-200 border group ${activeSection === section.id
                                    ? "bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200/50 scale-[1.02]"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-300 hover:bg-white hover:shadow-md"
                                }`}
                        >
                            <span className={`text-[10px] uppercase tracking-widest block mb-1.5 font-black ${activeSection === section.id ? "text-rose-200" : "text-slate-400 group-hover:text-rose-400"
                                }`}>
                                Section {section.id}
                            </span>
                            <span className="leading-snug block">{section.title}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* 📄 MAIN CONTENT AREA */}
            <main className="flex-1 p-5 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">

                {/* Section Header */}
                <header className="mb-10 md:mb-14">
                    <div className="inline-flex items-center gap-3 mb-3">
                        <span className="h-px w-8 bg-rose-600"></span>
                        <h2 className="text-rose-600 font-black uppercase tracking-widest text-xs md:text-sm">
                            Section {currentSection.id}
                        </h2>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {currentSection.title}
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl">
                        {englishData.description}
                    </p>
                </header>

                {/* 🔻 ACCORDIONS */}
                <div className="space-y-4 md:space-y-6">
                    {currentSection.subtopics.map((sub) => {
                        const isOpen = openSubtopic === sub.id;

                        return (
                            <div
                                key={sub.id}
                                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                                        ? "border-rose-300 shadow-xl shadow-rose-100/50 ring-1 ring-rose-100"
                                        : "border-slate-200 hover:border-rose-200 shadow-sm hover:shadow-md"
                                    }`}
                            >
                                {/* Accordion Toggle Button */}
                                <button
                                    onClick={() => setOpenSubtopic(isOpen ? null : sub.id)}
                                    className={`w-full flex justify-between items-center p-5 md:p-7 text-left transition-colors group ${isOpen ? "bg-rose-50/40" : "hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="pr-4">
                                        <span className="text-[10px] md:text-xs font-black text-rose-500 uppercase tracking-widest block mb-1.5">
                                            Topic {sub.id}
                                        </span>
                                        <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                                            {sub.title}
                                        </h3>
                                    </div>
                                    <div
                                        className={`shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-transform duration-300 shadow-sm border ${isOpen
                                                ? "bg-rose-600 text-white border-rose-600 rotate-180"
                                                : "bg-white text-slate-400 border-slate-200 group-hover:border-rose-300 group-hover:text-rose-500"
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </button>

                                {/* Accordion Expanded Content */}
                                {isOpen && (
                                    <div className="p-5 md:p-8 pt-0 border-t border-slate-100 bg-white">
                                        <p className="text-slate-600 leading-relaxed text-base md:text-lg mt-6 mb-8">
                                            {renderText(sub.content)}
                                        </p>

                                        {/* Formula/Concept Box */}
                                        {sub.formula && (
                                            <div className="bg-slate-900 text-rose-300 p-6 md:p-8 rounded-2xl font-mono text-center text-base md:text-lg shadow-inner mb-8 border border-slate-800 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-400 opacity-50"></div>
                                                {sub.formula}
                                            </div>
                                        )}

                                        {/* Content Lists */}
                                        {sub.list_items && (
                                            <div className="bg-rose-50/50 p-6 md:p-8 rounded-2xl border border-rose-100">
                                                <h4 className="font-black text-rose-900 uppercase text-xs md:text-sm tracking-widest mb-6 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                                                    {sub.list_title}
                                                </h4>
                                                <ul className="space-y-4">
                                                    {sub.list_items.map((item, i) => (
                                                        <li key={i} className="flex gap-4 text-slate-700 leading-relaxed text-sm md:text-base">
                                                            <span className="text-rose-500 font-black mt-1 text-lg leading-none shrink-0">
                                                                ↳
                                                            </span>
                                                            <span>{renderText(item)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Close Action */}
                                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                                            <button
                                                onClick={() => setOpenSubtopic(null)}
                                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm flex items-center gap-2 border border-rose-200 hover:border-rose-300"
                                            >
                                                Complete & Close
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}