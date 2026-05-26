"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import courseData from "@/data/JavaOOPs.json";

export default function OOPsPage() {
    // State Management
    const [activeSection, setActiveSection] = useState(courseData.sections[0].id);
    const [openSubtopic, setOpenSubtopic] = useState(null);

    // Scroll to top when changing sections
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setOpenSubtopic(null); // Close accordions when switching sections
    }, [activeSection]);

    const currentSection = courseData.sections.find((s) => s.id === activeSection);

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

    // Advanced parser for \n\n paragraphs and images
    const renderContentWithImages = (text, subId) => {
        if (!text) return null;

        const imageRegex = /\[Diagram of (.*?)\]/g;
        const parts = text.split(imageRegex);

        return (
            <div className="text-slate-600 leading-relaxed text-base md:text-lg mt-6 mb-8">
                {parts.map((part, index) => {
                    // Even indexes are normal text
                    if (index % 2 === 0) {
                        return (
                            <span key={index}>
                                {/* Split by \n\n to create distinct paragraphs */}
                                {part.split('\n\n').map((paragraph, pIndex) => (
                                    <p key={pIndex} className={`whitespace-pre-line ${pIndex > 0 ? "mt-5" : ""}`}>
                                        {/* Still run the bold parser on the paragraph text! */}
                                        {renderText(paragraph)}
                                    </p>
                                ))}
                            </span>
                        );
                    }

                    // Odd indexes are the text captured inside the image brackets
                    let imageSrc = "";
                    if (subId === "1.1") {
                        imageSrc = "/images/java-compilation-diagram.jpg";
                    } else {
                        // Fallback placeholder
                        const safeText = part.length > 20 ? "Diagram" : encodeURIComponent(part);
                        imageSrc = `https://placehold.co/800x400/e11d48/ffffff?text=${safeText}`;
                    }

                    return (
                        <div key={index} className="my-10 flex flex-col items-center bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <img
                                src={imageSrc}
                                alt={part}
                                className="rounded-xl max-w-full h-auto shadow-sm"
                            />
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mt-4 mb-1 text-center">
                                Figure: {part}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const theme = {
        text: "text-violet-600",
        bg: "bg-violet-600",
        bgLight: "bg-violet-50",
        border: "border-violet-200",
        ring: "ring-violet-100",
        hover: "hover:border-violet-300",
        shadow: "shadow-violet-100/50"
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-200">

            {/* 📱 MOBILE NAVIGATION (Hidden on Desktop) */}
            <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Link href="/java" className="text-violet-600 hover:text-violet-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h1 className="text-lg font-black text-slate-900">Java OOPs</h1>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {courseData.sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all flex-shrink-0 ${activeSection === section.id
                                ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                                : "bg-slate-100 text-slate-600 hover:bg-violet-100"
                                }`}
                        >
                            Sec {section.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* 💻 DESKTOP SIDEBAR (Hidden on Mobile) */}
            <aside className="w-80 bg-white border-r border-slate-200 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto shadow-sm z-40">
                <Link href="/java" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors mb-6 group">
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Dashboard
                </Link>
                <div className="mb-4">
                    <span className="bg-violet-100 text-violet-700 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                        BSSE-351
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                        Java <br />
                        <span className="text-violet-600">OOPs</span>
                    </h1>
                </div>

                <nav className="space-y-3">
                    {courseData.sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all duration-200 border group ${activeSection === section.id
                                ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200/50 scale-[1.02]"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-white hover:shadow-md"
                                }`}
                        >
                            <span className={`text-[10px] uppercase tracking-widest block mb-1.5 font-black ${activeSection === section.id ? "text-violet-200" : "text-slate-400 group-hover:text-violet-400"
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
                        <span className="h-px w-8 bg-violet-600"></span>
                        <h2 className="text-violet-600 font-black uppercase tracking-widest text-xs md:text-sm">
                            Section {currentSection.id}
                        </h2>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {currentSection.title}
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl">
                        {courseData.description}
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
                                    ? "border-violet-300 shadow-xl shadow-violet-100/50 ring-1 ring-violet-100"
                                    : "border-slate-200 hover:border-violet-200 shadow-sm hover:shadow-md"
                                    }`}
                            >
                                {/* Accordion Toggle Button */}
                                <button
                                    onClick={() => setOpenSubtopic(isOpen ? null : sub.id)}
                                    className={`w-full flex justify-between items-center p-5 md:p-7 text-left transition-colors group ${isOpen ? "bg-violet-50/40" : "hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="pr-4">
                                        <span className="text-[10px] md:text-xs font-black text-violet-500 uppercase tracking-widest block mb-1.5">
                                            Topic {sub.id}
                                        </span>
                                        <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-violet-700 transition-colors">
                                            {sub.title}
                                        </h3>
                                    </div>
                                    <div
                                        className={`shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-transform duration-300 shadow-sm border ${isOpen
                                            ? "bg-violet-600 text-white border-violet-600 rotate-180"
                                            : "bg-white text-slate-400 border-slate-200 group-hover:border-violet-300 group-hover:text-violet-500"
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </button>

                                {/* Accordion Expanded Content */}
                                {isOpen && (
                                    <div className="p-5 md:p-8 pt-0 border-t border-slate-100 bg-white">

                                        {renderContentWithImages(sub.content, sub.id)}

                                        {/* Pro-Tip / Callout Box */}
                                        {sub.callout_title && sub.callout_text && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
                                                <h4 className="font-black text-amber-900 text-sm md:text-base uppercase tracking-wider mb-2 flex items-center gap-2">
                                                    {sub.callout_title}
                                                </h4>
                                                <p className="text-amber-800 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                                    {renderText(sub.callout_text)}
                                                </p>
                                            </div>
                                        )}

                                        {/* Java Code Block Rendering */}
                                        {sub.code_block && (
                                            <div className="bg-slate-900 rounded-2xl mb-8 overflow-hidden border border-slate-800 shadow-inner relative">
                                                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                                    <span className="text-slate-400 text-xs font-mono ml-2 tracking-widest uppercase">Java</span>
                                                </div>
                                                <pre className="p-6 overflow-x-auto text-emerald-300 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                                    <code>{sub.code_block}</code>
                                                </pre>
                                            </div>
                                        )}

                                        {/* Original Formula/Concept Box */}
                                        {sub.formula && (
                                            <div className="bg-slate-900 text-violet-300 p-6 md:p-8 rounded-2xl font-mono text-center text-base md:text-lg shadow-inner mb-8 border border-slate-800 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-orange-400 opacity-50"></div>
                                                {sub.formula}
                                            </div>
                                        )}

                                        {/* Content Lists */}
                                        {sub.list_items && (
                                            <div className="bg-violet-50/50 p-6 md:p-8 rounded-2xl border border-violet-100">
                                                <h4 className="font-black text-violet-900 uppercase text-xs md:text-sm tracking-widest mb-6 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                                                    {sub.list_title}
                                                </h4>
                                                <ul className="space-y-4">
                                                    {sub.list_items.map((item, i) => (
                                                        <li key={i} className="flex gap-4 text-slate-700 leading-relaxed text-sm md:text-base">
                                                            <span className="text-violet-500 font-black mt-1 text-lg leading-none shrink-0">
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
                                                className="bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm flex items-center gap-2 border border-violet-200 hover:border-violet-300"
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
