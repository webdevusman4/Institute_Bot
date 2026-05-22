"use client";

import { useState, useEffect } from "react";
// Assumes you saved the Master Blueprint as JavaBase.json
import javaData from "../../../data/JavaBase.json";

export default function JavaPreview() {
    // 🛡️ Safety check: Supports both raw Array JSON and Object-wrapped JSON
    const domains = Array.isArray(javaData) ? javaData : javaData.domains || javaData;

    // 🗄️ State Management (3-Level Hierarchy)
    const [activeDomainId, setActiveDomainId] = useState(domains[0]?.domain_id);
    const [activeModuleId, setActiveModuleId] = useState(domains[0]?.modules[0]?.id);
    const [openSubtopic, setOpenSubtopic] = useState(null);

    // Scroll to top when changing modules
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setOpenSubtopic(null); // Close accordions when switching modules
    }, [activeModuleId]);

    // Active Data Pointers
    const currentDomain = domains.find((d) => d.domain_id === activeDomainId);
    const currentModule = currentDomain?.modules.find((m) => m.id === activeModuleId);

    // 🎨 Custom parser for **bold** text
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

    // 🖼️ Advanced parser for \n\n paragraphs and [Diagram of X] tags
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
                                        {renderText(paragraph)}
                                    </p>
                                ))}
                            </span>
                        );
                    }

                    // Odd indexes are the text captured inside the image brackets
                    let imageSrc = "";
                    if (subId === "1.1") {
                        imageSrc = "../../../images/java-compilation-diagram.jpg";
                    } else if (subId === "2.1") {
                        imageSrc = "../../";
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

    if (!currentModule) return <div className="p-10 text-center text-rose-500">Failed to load Java Course Data.</div>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-200">

            {/* 📱 MOBILE NAVIGATION (Hidden on Desktop) */}
            <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
                <h1 className="text-lg font-black text-slate-900 mb-2">Java Fundamentals</h1>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pb-2 scrollbar-hide">
                    {domains.map((domain) => (
                        <div key={domain.domain_id} className="flex gap-2 overflow-x-auto pb-2">
                            <div className="text-[10px] font-bold uppercase text-slate-400 shrink-0 self-center w-12">
                                D-{domain.domain_id}
                            </div>
                            {domain.modules.map((module) => {
                                const isActive = activeDomainId === domain.domain_id && activeModuleId === module.id;
                                return (
                                    <button
                                        key={module.id}
                                        onClick={() => {
                                            setActiveDomainId(domain.domain_id);
                                            setActiveModuleId(module.id);
                                        }}
                                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 border ${
                                            isActive
                                                ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:border-rose-200"
                                        }`}
                                    >
                                        Mod {module.id}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* 💻 DESKTOP SIDEBAR (Hidden on Mobile) */}
            <aside className="w-80 bg-white border-r border-slate-200 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto shadow-sm z-40 custom-scrollbar">
                <div className="mb-10 mt-4">
                    <span className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                        BSSE-351
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                        Java <br />
                        <span className="text-rose-600">Fundamentals</span>
                    </h1>
                </div>

                <nav className="space-y-8">
                    {domains.map((domain) => (
                        <div key={domain.domain_id} className="relative">
                            {/* Domain Header */}
                            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-3 px-2 flex items-center gap-2">
                                <span className="w-4 h-px bg-slate-300"></span>
                                {domain.title}
                            </h3>

                            {/* Domain Modules */}
                            <div className="space-y-2">
                                {domain.modules.map((module) => {
                                    const isActive = activeDomainId === domain.domain_id && activeModuleId === module.id;
                                    return (
                                        <button
                                            key={module.id}
                                            onClick={() => {
                                                setActiveDomainId(domain.domain_id);
                                                setActiveModuleId(module.id);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all duration-200 border group ${
                                                isActive
                                                    ? "bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200/50 scale-[1.02]"
                                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-300 hover:bg-white hover:shadow-md"
                                            }`}
                                        >
                                            <span className={`text-[10px] uppercase tracking-widest block mb-1 font-black ${
                                                isActive ? "text-rose-200" : "text-slate-400 group-hover:text-rose-400"
                                            }`}>
                                                Module {module.id}
                                            </span>
                                            <span className="leading-snug block text-sm">{module.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* 📄 MAIN CONTENT AREA */}
            <main className="flex-1 p-5 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">

                {/* Module Header */}
                <header className="mb-10 md:mb-14">
                    <div className="inline-flex items-center gap-3 mb-3">
                        <span className="h-px w-8 bg-rose-600"></span>
                        <h2 className="text-rose-600 font-black uppercase tracking-widest text-xs md:text-sm">
                            {currentDomain.title} / Module {currentModule.id}
                        </h2>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {currentModule.title}
                    </h1>
                </header>

                {/* 🔻 ACCORDIONS FOR SUBTOPICS */}
                <div className="space-y-4 md:space-y-6">
                    {currentModule.subtopics.map((sub) => {
                        const isOpen = openSubtopic === sub.id;

                        return (
                            <div
                                key={sub.id}
                                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? "border-rose-300 shadow-xl shadow-rose-100/50 ring-1 ring-rose-100"
                                        : "border-slate-200 hover:border-rose-200 shadow-sm hover:shadow-md"
                                }`}
                            >
                                {/* Accordion Toggle Button */}
                                <button
                                    onClick={() => setOpenSubtopic(isOpen ? null : sub.id)}
                                    className={`w-full flex justify-between items-center p-5 md:p-7 text-left transition-colors group ${
                                        isOpen ? "bg-rose-50/40" : "hover:bg-slate-50"
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
                                        className={`shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-transform duration-300 shadow-sm border ${
                                            isOpen
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

                                        {/* Main Content Paragraphs & Images */}
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