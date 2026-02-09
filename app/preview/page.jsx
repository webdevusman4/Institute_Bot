"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Ensure this path matches where you saved the array you provided
import notesData from "../../data/chapter_complete.json"; 

export default function NotesPreview() {

  const fixMatrixLines = (content) => {
    if (typeof content !== 'string') return "";
    return content.replace(/\\\\(?![a-zA-Z])/g, "\\\\\\\\");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 print:bg-white print:py-0 font-sans">
      
      {/* 🖨️ Control Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center px-6 print:hidden">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-black">Notes Mode</span>
          Matrices & Determinants
        </h1>
        <button onClick={() => window.print()} className="bg-slate-800 hover:bg-black text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print Notes
        </button>
      </div>

      {/* 📄 The Document */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        <div className="p-10 md:p-16 space-y-10">
          
          <div className="text-center border-b-2 border-slate-900 pb-8 mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Chapter 2: Key Notes & Topics
            </h1>
            <p className="text-lg text-slate-500 font-medium">Standard Definitions & Mathematical Properties</p>
          </div>

          {/* 📚 MAIN LIST LOOP */}
          {notesData.map((item) => {
            const isNote = item.id.toLowerCase().includes("note");
            
            return (
              <div 
                key={item.id} 
                className={`p-6 rounded-xl border-l-8 transition-all ${
                  isNote 
                    ? "bg-amber-50 border-amber-400 shadow-sm" 
                    : "bg-indigo-50 border-indigo-500 shadow-md"
                }`}
              >
                {/* ID & Title Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-black uppercase tracking-widest ${
                    isNote ? "bg-amber-200 text-amber-800" : "bg-indigo-200 text-indigo-800"
                  }`}>
                    {isNote ? "Note" : "Topic"} {item.id}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800">
                    <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                        components={{ p: 'span' }}
                    >
                        {item.title}
                    </ReactMarkdown>
                  </h2>
                </div>

                {/* Content Body */}
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      // Customizing math block display
                      div: ({node, ...props}) => (
                        <div className="overflow-x-auto my-4 py-4 flex justify-center bg-white/50 rounded-lg border border-slate-200/50" {...props} />
                      )
                    }}
                  >
                    {fixMatrixLines(item.content)}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}

          {/* Footer for print */}
          <div className="hidden print:block text-center text-slate-400 text-xs mt-20">
            StudyMate AI Tutor - Grade 11 Mathematics Curriculum
          </div>

        </div>
      </div>
    </div>
  );
}