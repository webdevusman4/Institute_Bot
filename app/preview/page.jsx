"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// 1. Import your data directly
// Note: If this import fails, ensure the path to your json file is correct relative to this file
import chapterData from "../../data/chapter_2.json"; 

export default function BookPreview() {
  // The same cleaning function from your ChatInterface
  const fixMatrixLines = (content) => {
    if (typeof content !== 'string') return "";
    return content
        .replace(/(\w|\d|\})\s*\\\s*(\w|\d|\{)/g, "$1 \\\\\\\\ $2")
        .replaceAll("\\\\", "\\\\\\\\");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      {/* Control Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center px-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">
          Chapter Preview: {chapterData.chapter}
        </h1>
        <button 
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print / Save as PDF
        </button>
      </div>

      {/* The "Paper" Document */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        <div className="p-10 md:p-16 space-y-12">
          
          {/* Title Page Header */}
          <div className="text-center border-b pb-8 mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              {chapterData.chapter}
            </h1>
            <p className="text-slate-500">Generated from chapter_2.json</p>
          </div>

          {/* Render Topics */}
          {chapterData.topics.map((topic, index) => (
            <article key={topic.id || index} className="prose prose-slate max-w-none border-b border-gray-100 last:border-0 pb-10">
              
              {/* Topic Title */}
              <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-3">
                <span className="bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full border border-indigo-100">
                  {topic.id}
                </span>
                {topic.title}
              </h2>

              {/* The Content (With Math Rendering) */}
              <div className="text-gray-700 leading-relaxed space-y-4">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    // Style the Math blocks to look like textbook equations
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    // Ensure math blocks allow horizontal scrolling if huge
                    div: ({node, ...props}) => <div className="overflow-x-auto py-2" {...props} />
                  }}
                >
                  {fixMatrixLines(topic.content)}
                </ReactMarkdown>
              </div>

            </article>
          ))}

        </div>
      </div>
    </div>
  );
}