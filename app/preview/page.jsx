"use client";

import { useState, useEffect } from "react";
// Import your JSON (Make sure the name matches your actual file exactly)
import matricesData from "../../data/matrix.json"; 

// The necessary Math rendering libraries
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // The CSS that makes the math look beautiful

export default function MatricesPreview() {
  const [activeSection, setActiveSection] = useState(matricesData.sections[0].id);
  const [openSubtopic, setOpenSubtopic] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpenSubtopic(null);
  }, [activeSection]);

  const currentSection = matricesData.sections.find((s) => s.id === activeSection);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-200">
      
      {/* 📱 MOBILE NAVIGATION */}
      <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
        <h1 className="text-lg font-black text-slate-900 mb-3">Matrices & Determinants</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {matricesData.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all flex-shrink-0 ${
                activeSection === section.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-100"
              }`}
            >
              Sec {section.id}
            </button>
          ))}
        </div>
      </div>

      {/* 💻 DESKTOP SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-200 p-6 hidden md:block sticky top-0 h-screen overflow-y-auto shadow-sm z-40">
        <div className="mb-10 mt-4">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-widest mb-4 inline-block shadow-sm">
            MATH-11
          </span>
          <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
            Matrices & <br />
            <span className="text-indigo-600">Determinants</span>
          </h1>
        </div>

        <nav className="space-y-3">
          {matricesData.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all duration-200 border group ${
                activeSection === section.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200/50 scale-[1.02]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-md"
              }`}
            >
              <span className={`text-[10px] uppercase tracking-widest block mb-1.5 font-black ${
                activeSection === section.id ? "text-indigo-200" : "text-slate-400 group-hover:text-indigo-400"
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
        
        <header className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-indigo-600"></span>
            <h2 className="text-indigo-600 font-black uppercase tracking-widest text-xs md:text-sm">
              Section {currentSection.id}
            </h2>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {currentSection.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl">
            {matricesData.description}
          </p>
        </header>

        {/* 🔻 ACCORDIONS */}
        <div className="space-y-4 md:space-y-6">
          {currentSection.subtopics.map((sub) => {
            const isOpen = openSubtopic === sub.id;

            return (
              <div
                key={sub.id}
                className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-indigo-300 shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-100"
                    : "border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpenSubtopic(isOpen ? null : sub.id)}
                  className={`w-full flex justify-between items-center p-5 md:p-7 text-left transition-colors group ${
                    isOpen ? "bg-indigo-50/40" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="pr-4">
                    <span className="text-[10px] md:text-xs font-black text-indigo-500 uppercase tracking-widest block mb-1.5">
                      Topic {sub.id}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                      {sub.title}
                    </h3>
                  </div>
                  <div
                    className={`shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-transform duration-300 shadow-sm border ${
                      isOpen
                        ? "bg-indigo-600 text-white border-indigo-600 rotate-180"
                        : "bg-white text-slate-400 border-slate-200 group-hover:border-indigo-300 group-hover:text-indigo-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 md:p-8 pt-0 border-t border-slate-100 bg-white">
                    
                    {/* Render Content with KaTeX */}
                    <div className="text-slate-600 leading-relaxed text-base md:text-lg mt-6 mb-8 whitespace-pre-line prose prose-indigo max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {sub.content}
                      </ReactMarkdown>
                    </div>

                    {/* Formula Box with KaTeX */}
                    {sub.formula && (
                      <div className="bg-slate-900 text-indigo-300 p-6 md:p-8 rounded-2xl text-center text-lg md:text-xl shadow-inner mb-8 border border-slate-800 relative overflow-hidden overflow-x-auto">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-400 opacity-50"></div>
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {sub.formula}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* List Items with KaTeX */}
                    {sub.list_items && (
                      <div className="bg-indigo-50/50 p-6 md:p-8 rounded-2xl border border-indigo-100">
                        <h4 className="font-black text-indigo-900 uppercase text-xs md:text-sm tracking-widest mb-6 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                          {sub.list_title}
                        </h4>
                        <ul className="space-y-4">
                          {sub.list_items.map((item, i) => (
                            <li key={i} className="flex gap-4 text-slate-700 leading-relaxed text-sm md:text-base prose prose-indigo max-w-none">
                              <span className="text-indigo-500 font-black mt-1 text-lg leading-none shrink-0">
                                ↳
                              </span>
                              <div>
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                  {item}
                                </ReactMarkdown>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => setOpenSubtopic(null)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm flex items-center gap-2 border border-indigo-200 hover:border-indigo-300"
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