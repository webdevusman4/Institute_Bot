"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// ⚠️ Import the Discrete Structures JSON file
import courseData from "../../../data/discrete.json"; 

export default function DiscreteBookPreview() {

  // Helper to fix LaTeX backslashes for React rendering
  const fixMath = (content) => {
    if (typeof content !== 'string') return "";
    return content.replace(/\\\\(?![a-zA-Z])/g, "\\\\\\\\");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 print:bg-white print:py-0 font-sans text-slate-900">
      
      {/* 🖨️ Header / Control Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center px-6 print:hidden">
        <h1 className="text-xl font-bold text-slate-700 flex items-center gap-2">
          <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-black">
            Discrete Math
          </span>
          {courseData.subject}
        </h1>
        <button 
          onClick={() => window.print()} 
          className="bg-slate-800 hover:bg-black text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print Notes
        </button>
      </div>

      {/* 📖 The "Paper" Document */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        <div className="p-10 md:p-16 space-y-16">
          
          {/* Title Page */}
          <div className="text-center border-b-2 border-slate-900 pb-10">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {courseData.subject}
            </h1>
            <p className="text-xl text-slate-500 font-medium">
              Comprehensive Study Notes • {courseData.modules.length} Modules
            </p>
          </div>

          {/* 🔄 MODULES LOOP */}
          {courseData.modules.map((module, mIdx) => (
            <section key={mIdx} className="break-after-page">
              
              {/* Module Header */}
              <div className="mb-8 border-l-8 border-emerald-500 pl-6 py-1">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  {module.topic}
                </h2>
                <p className="text-emerald-700 font-mono text-sm uppercase tracking-widest">
                  Date: {module.date || "N/A"}
                </p>
              </div>

              {/* 1. DEFINITIONS GRID */}
              {module.definitions && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📖</span> Core Definitions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {module.definitions.map((def, dIdx) => (
                      <div key={dIdx} className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-emerald-800 text-lg mb-2 flex justify-between">
                          {def.term}
                          {def.symbol && <span className="font-mono text-slate-500 text-sm bg-white px-2 py-0.5 rounded border">{def.symbol}</span>}
                        </h4>
                        <div className="text-slate-600 text-sm leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {fixMath(def.definition)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. RULES & VARIATIONS (Logic Rules or Key Rules) */}
              {(module.rules_and_variations || module.key_rules) && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> Rules & Properties
                  </h3>
                  <div className="space-y-4">
                    {(module.rules_and_variations || module.key_rules).map((rule, rIdx) => (
                      <div key={rIdx} className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="min-w-[150px]">
                          <span className="font-bold text-amber-900 block">{rule.name || rule.rule}</span>
                          {rule.form && (
                            <span className="font-mono text-amber-700 text-sm block mt-1">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {fixMath(rule.form)}
                              </ReactMarkdown>
                            </span>
                          )}
                        </div>
                        <div className="text-amber-800 text-sm flex-1">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {fixMath(rule.description)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. EXAMPLES SECTION */}
              {module.examples && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🧮</span> Examples & Problems
                  </h3>
                  <div className="space-y-6">
                    {module.examples.map((ex, eIdx) => (
                      <div key={eIdx} className="bg-slate-800 text-slate-200 rounded-xl p-6 shadow-lg overflow-hidden relative">
                        {/* Example Title/Header */}
                        <div className="border-b border-slate-700 pb-3 mb-4">
                          <h4 className="font-bold text-emerald-400 text-lg">
                            {ex.title || ex.problem || `Example ${eIdx + 1}`}
                          </h4>
                        </div>

                        {/* Flexible Content Renderer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                          {Object.entries(ex).map(([key, value]) => {
                            if (['title', 'problem'].includes(key)) return null; // Skip title, already rendered
                            
                            // Special rendering for 'translations' array in Logic
                            if (Array.isArray(value)) {
                              return (
                                <div key={key} className="col-span-full bg-slate-900/50 p-4 rounded-lg mt-2">
                                  <span className="text-slate-500 uppercase text-xs font-bold tracking-wider block mb-2">{key}</span>
                                  <ul className="space-y-2">
                                    {value.map((t, ti) => (
                                      <li key={ti} className="flex justify-between border-b border-slate-700/50 pb-1 last:border-0">
                                        <span>{t.english}</span>
                                        <span className="font-mono text-emerald-300">
                                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                            {fixMath(t.symbolic)}
                                          </ReactMarkdown>
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            }

                            return (
                              <div key={key} className="flex flex-col">
                                <span className="text-slate-500 uppercase text-xs font-bold tracking-wider mb-1">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="font-mono text-slate-100">
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkMath]} 
                                    rehypePlugins={[rehypeKatex]}
                                    components={{ p: 'span' }}
                                  >
                                    {fixMath(String(value))}
                                  </ReactMarkdown>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </section>
          ))}

          {/* Footer */}
          <div className="hidden print:block text-center text-slate-400 text-xs mt-20 pt-10 border-t">
            Generated by StudyMate AI • Discrete Structures • {new Date().getFullYear()}
          </div>

        </div>
      </div>
    </div>
  );
}