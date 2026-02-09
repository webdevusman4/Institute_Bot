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
    return <div className="p-10 text-center">Loading data...</div>;
  }

  // Helper to fix LaTeX backslashes for rendering
  const fixMatrixLines = (content) => {
    if (typeof content !== 'string') return "";
    return content.replace(/\\\\(?![a-zA-Z])/g, "\\\\\\\\");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 print:bg-white print:py-0 font-sans">
      
      {/* 🖨️ Control Bar */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center px-6 print:hidden">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded uppercase tracking-wider">Textbook Mode</span>
          {/* Safety Check for Chapter Title */}
          {chapterData.chapter || "Chapter Preview"}
        </h1>
        <button onClick={() => window.print()} className="bg-slate-800 hover:bg-black text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print / Save PDF
        </button>
      </div>

      {/* 📄 The Document */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        <div className="p-12 md:p-16 space-y-12">
          
          {/* Chapter Title */}
          <div className="text-center border-b-2 border-slate-900 pb-8 mb-10">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              {chapterData.chapter}
            </h1>
            <p className="text-lg text-slate-500">Comprehensive Study Guide</p>
          </div>

          {/* 📚 SECTIONS LOOP - THE FIX IS HERE */}
          {/* We check if sections exist before mapping */}
          {chapterData.sections?.map((section) => (
            <section key={section.id} className="mb-16 border-b border-gray-200 last:border-0 pb-12 break-after-auto">
              
              {/* --- SECTION HEADER --- */}
              <div className="mb-8">
                <div className="text-3xl font-bold text-indigo-800 mb-4 flex items-center gap-3">
                  <span className="bg-indigo-100 text-indigo-700 text-lg px-3 py-1 rounded-md border border-indigo-200">
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
                  <div className="text-gray-600 italic ml-2 md:ml-14 text-lg border-l-4 border-gray-300 pl-4">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {fixMatrixLines(section.intro)}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* --- SUBTOPICS CONTENT --- */}
              <div className="space-y-12 pl-2 md:pl-14">
                {section.subtopics?.map((sub) => (
                  <div key={sub.id} className="group">
                    
                    {/* Subtopic Title */}
                    <div className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3 group-hover:border-indigo-600 transition-colors flex items-center gap-2">
                      <span className="text-indigo-600 mr-1">{sub.id}</span>
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
                            div: ({node, ...props}) => <div className="overflow-x-auto my-4 py-4 flex justify-center bg-slate-50 rounded-lg border border-slate-100" {...props} />
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
                          <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm">
                            <h4 className="font-bold text-yellow-800 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                              💡 Note: {note.title}
                            </h4>
                            <div className="text-gray-800 text-sm leading-relaxed">
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
                <div className="mt-14 bg-slate-50 p-8 rounded-xl border border-slate-200 print:break-inside-avoid">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">
                    <span className="text-2xl">✏️</span> Practice Problems
                  </h3>
                  <div className="space-y-8">
                    {section.exercises.map((ex, i) => (
                      <div key={i}>
                        <h4 className="font-bold text-indigo-600 mb-4">{ex.title}</h4>
                        <div className="space-y-4">
                          {ex.problems.map((prob, j) => (
                            <div key={j} className="text-slate-700 bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm md:text-base">
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
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </section>
          ))}

        </div>
      </div>
    </div>
  );
}