"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// ⚠️ Ensure this points to your latest merged file
import chapterData from "../../data/chapter_complete.json"; 

export default function BookPreview() {

  // Safety Check: If data is missing or empty, prevent crash
  if (!chapterData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-500">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading Textbook Data...</p>
          <p className="text-sm">Please check app/data/chapter_complete.json</p>
        </div>
      </div>
    );
  }

  // Helper to fix LaTeX backslashes for rendering
  const fixMatrixLines = (content) => {
    if (typeof content !== 'string') return "";
    return content.replace(/\\\\(?![a-zA-Z])/g, "\\\\\\\\");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 print:bg-white print:py-0 font-sans text-slate-900">
      
      {/* 🖨️ Control Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center px-6 print:hidden">
        <h1 className="text-xl font-bold text-slate-700 flex items-center gap-2">
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-black">
            Textbook Mode
          </span>
          {chapterData.chapter || "Chapter Preview"}
        </h1>
        <button onClick={() => window.print()} className="bg-slate-800 hover:bg-black text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print / Save PDF
        </button>
      </div>

      {/* 📄 The Document */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        <div className="p-12 md:p-16 space-y-16">
          
          {/* Chapter Title */}
          <div className="text-center border-b-2 border-slate-900 pb-10">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {chapterData.chapter}
            </h1>
            <p className="text-xl text-slate-500 font-medium">Comprehensive Study Guide</p>
          </div>

          {/* 📚 SECTIONS LOOP */}
          {chapterData.sections?.map((section) => (
            <section key={section.id} className="break-after-auto border-b border-gray-200 last:border-0 pb-16 mb-16">
              
              {/* --- SECTION HEADER --- */}
              <div className="mb-10">
                <div className="text-3xl font-bold text-indigo-900 mb-4 flex items-center gap-3">
                  <span className="bg-indigo-100 text-indigo-700 text-lg px-3 py-1 rounded-md border border-indigo-200 font-mono">
                    {section.id}
                  </span>
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                    components={{ p: 'span' }} 
                  >
                    {section.title}
                  </ReactMarkdown>
                </div>
                
                {section.intro && (
                  <div className="text-slate-600 text-lg border-l-4 border-indigo-300 pl-6 py-2 bg-indigo-50/50 rounded-r-lg">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {fixMatrixLines(section.intro)}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* --- SUBTOPICS CONTENT --- */}
              <div className="space-y-12 pl-2 md:pl-10">
                {section.subtopics?.map((sub) => (
                  <div key={sub.id} className="group">
                    
                    {/* Subtopic Title */}
                    <div className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="text-indigo-500 mr-1 font-mono text-sm">{sub.id}</span>
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                        components={{ p: 'span' }}
                      >
                        {sub.title}
                      </ReactMarkdown>
                    </div>

                    {/* Main Content */}
                    {sub.content && (
                        <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed mb-6">
                        <ReactMarkdown 
                            remarkPlugins={[remarkMath]} 
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              // Logic to ensure Matrix blocks scroll on small screens
                              div: ({node, ...props}) => <div className="overflow-x-auto my-4 py-4 flex justify-center bg-slate-50 rounded-lg border border-slate-100 shadow-inner" {...props} />
                            }}
                        >
                            {fixMatrixLines(sub.content)}
                        </ReactMarkdown>
                        </div>
                    )}

                    {/* 💡 NOTES BLOCK */}
                    {sub.notes && sub.notes.length > 0 && (
                      <div className="grid gap-4 mt-6">
                        {sub.notes.map((note, idx) => (
                          <div key={idx} className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg shadow-sm">
                            <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                              💡 Note: {note.title}
                            </h4>
                            <div className="text-slate-800 text-sm leading-relaxed">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {fixMatrixLines(note.content)}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ✏️ EXERCISES BLOCK */}
              {section.exercises && section.exercises.length > 0 && (
                <div className="mt-16 bg-slate-100 p-8 rounded-2xl border border-slate-200 print:break-inside-avoid">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b-2 border-slate-200 pb-4">
                    <span className="text-2xl">✏️</span> Practice Problems
                  </h3>
                  <div className="space-y-6">
                    {section.exercises.map((ex, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-indigo-700 mb-3 text-lg border-b border-slate-100 pb-2">
                          {ex.title}
                        </h4>
                        <div className="space-y-4">
                          {ex.problems.map((prob, j) => {
                            // Check if this is a solution line to style it differently
                            const isSolution = prob.trim().startsWith("**Solution");
                            
                            return (
                              <div 
                                key={j} 
                                className={`text-slate-700 text-sm md:text-base leading-relaxed overflow-x-auto ${
                                  isSolution ? "bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r" : ""
                                }`}
                              >
                                <ReactMarkdown 
                                  remarkPlugins={[remarkMath]} 
                                  rehypePlugins={[rehypeKatex]}
                                  components={{
                                    p: ({node, ...props}) => <div className="inline" {...props} />
                                  }}
                                >
                                  {fixMatrixLines(prob)}
                                </ReactMarkdown>
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
             StudyMate AI Tutor • Matrices & Determinants • Grade 12 Curriculum
          </div>

        </div>
      </div>
    </div>
  );
}