"use client";

import ReactMarkdown from "react-markdown";
import { useState } from "react";

// Import your data
// ⚠️ Verify this path matches your folder structure. 
// If file is at app/preview/java/page.jsx, use "../../data/..."
import javaData from "../../../data/javaStringMethods.json";

export default function JavaCheatsheet() {
    const [activeCategory, setActiveCategory] = useState("All");

    // Get unique categories for filter tabs
    const categories = ["All", ...javaData.javaStringMethods.map(c => c.category)];

    // Filter logic
    const displayedCategories = activeCategory === "All"
        ? javaData.javaStringMethods
        : javaData.javaStringMethods.filter(c => c.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* 🟦 Header Section */}
            <header className="bg-indigo-700 text-white py-12 px-6 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                                ☕ Java String Cheatsheet
                            </h1>
                            <p className="text-indigo-100 text-lg opacity-90">
                                The ultimate guide to manipulating text in Java.
                            </p>
                        </div>
                        <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 print:hidden">
                            🖨️ Print PDF
                        </button>
                    </div>
                </div>
            </header>

            {/* 🔍 Navigation / Filter Bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm print:hidden">
                <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
                    <div className="flex space-x-6 py-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap pb-2 text-sm font-bold border-b-4 transition-colors ${activeCategory === cat
                                        ? "border-indigo-600 text-indigo-700"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 📚 Content Grid */}
            <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">

                {displayedCategories.map((section, idx) => (
                    <section key={idx} className="scroll-mt-24">

                        {/* Category Title */}
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 border-l-8 border-indigo-500 pl-4">
                            {section.category}
                        </h2>

                        {/* Methods Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {section.methods.map((method, mIdx) => (
                                <div key={mIdx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">

                                    {/* Method Header */}
                                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-mono text-lg font-bold text-indigo-700">
                                            {method.name}
                                        </h3>
                                        {method.version && (
                                            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                                {method.version}
                                            </span>
                                        )}
                                    </div>

                                    {/* ✅ NEW: Explanation Block */}
                                    {method.explanation && (
                                        <div className="px-6 pt-6 text-slate-600 leading-relaxed text-sm">
                                            {method.explanation}
                                        </div>
                                    )}

                                    {/* Examples Body */}
                                    <div className="p-6 space-y-6 flex-grow">
                                        {method.examples.map((ex, eIdx) => (
                                            <div key={eIdx}>
                                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                                                    {ex.description}
                                                </p>
                                                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto group relative shadow-inner">
                                                    <code className="font-mono text-sm text-indigo-100 block whitespace-pre">
                                                        {ex.code}
                                                    </code>

                                                    {/* Copy Button Hint */}
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-white/10 px-2 py-1 rounded">Java</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </section>
                ))}

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-20 py-10 text-center text-slate-400 text-sm">
                <p>Generated by StudyMate AI • Java String API Reference</p>
            </footer>

        </div>
    );
}