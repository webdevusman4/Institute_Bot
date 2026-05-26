"use client";

import { useState, useEffect } from "react";
import javaData from "../../../data/JavaStringMethods.json";

export default function JavaStringMethodsPreview() {
    const categories = javaData.javaStringMethods;
    const [activeCategory, setActiveCategory] = useState(categories[0].category);
    const [openMethod, setOpenMethod] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setOpenMethod(null);
    }, [activeCategory]);

    const currentCategoryData = categories.find((c) => c.category === activeCategory);

    const theme = {
        text: "text-cyan-600",
        bg: "bg-cyan-600",
        bgLight: "bg-cyan-50",
        border: "border-cyan-200",
        ring: "ring-cyan-100",
        hover: "hover:border-cyan-300",
        shadow: "shadow-cyan-100/50"
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-200">
            {/* MOBILE NAVIGATION */}
            <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
                <h1 className="text-lg font-black text-slate-900 mb-3">String Methods</h1>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(cat.category)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all flex-shrink-0 ${activeCategory === cat.category
                                ? "bg-cyan-600 text-white shadow-md shadow-cyan-200"
                                : "bg-slate-100 text-slate-600 hover:bg-cyan-100"
                                }`}
                        >
                            {cat.category}
                        </button>
                    ))}
                </div>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside className="w-80 bg-white border-r border-slate-200 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto shadow-sm z-40">
                <div className="mb-10 mt-4">
                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
                        Java API
                    </span>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                        String <br />
                        <span className="text-cyan-600">Methods</span>
                    </h1>
                </div>

                <nav className="space-y-3">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(cat.category)}
                            className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all duration-200 border group ${activeCategory === cat.category
                                ? "bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-200/50 scale-[1.02]"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-cyan-300 hover:bg-white hover:shadow-md"
                                }`}
                        >
                            <span className="leading-snug block text-sm">{cat.category}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-5 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
                <header className="mb-10 md:mb-14">
                    <div className="inline-flex items-center gap-3 mb-3">
                        <span className="h-px w-8 bg-cyan-600"></span>
                        <h2 className="text-cyan-600 font-black uppercase tracking-widest text-xs md:text-sm">
                            API Category
                        </h2>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {currentCategoryData.category}
                    </h1>
                </header>

                <div className="space-y-4 md:space-y-6">
                    {currentCategoryData.methods.map((method, idx) => {
                        const isOpen = openMethod === method.name;

                        return (
                            <div
                                key={idx}
                                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                                    ? "border-cyan-300 shadow-xl shadow-cyan-100/50 ring-1 ring-cyan-100"
                                    : "border-slate-200 hover:border-cyan-200 shadow-sm hover:shadow-md"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenMethod(isOpen ? null : method.name)}
                                    className={`w-full flex justify-between items-center p-5 md:p-7 text-left transition-colors group ${isOpen ? "bg-cyan-50/40" : "hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="pr-4">
                                        <h3 className="text-lg md:text-xl font-mono font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">
                                            {method.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {method.version && (
                                            <span className="hidden md:inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded">
                                                {method.version}
                                            </span>
                                        )}
                                        <div
                                            className={`shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-transform duration-300 shadow-sm border ${isOpen
                                                ? "bg-cyan-600 text-white border-cyan-600 rotate-180"
                                                : "bg-white text-slate-400 border-slate-200 group-hover:border-cyan-300 group-hover:text-cyan-500"
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="p-5 md:p-8 pt-0 border-t border-slate-100 bg-white">
                                        <p className="text-slate-600 leading-relaxed text-base md:text-lg mt-6 mb-8">
                                            {method.explanation}
                                        </p>

                                        {method.examples && method.examples.map((ex, i) => (
                                            <div key={i} className="mb-8">
                                                <h4 className="font-black text-slate-700 uppercase text-xs tracking-widest mb-3">
                                                    Example: {ex.description}
                                                </h4>
                                                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner relative">
                                                    <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                                        <span className="text-slate-400 text-xs font-mono ml-2 tracking-widest uppercase">Java</span>
                                                    </div>
                                                    <pre className="p-6 overflow-x-auto text-emerald-300 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                                        <code>{ex.code}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                                            <button
                                                onClick={() => setOpenMethod(null)}
                                                className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm flex items-center gap-2 border border-cyan-200 hover:border-cyan-300"
                                            >
                                                Close Method
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
