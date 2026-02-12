"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// ⚠️ Ensure this path matches your file name exactly
import courseData from "../../data/Num_Sys.json";

export default function NumberSystemsPreview() {

    // Student Profile Data
    const studentInfo = {
        name: "Usman Mughal",
        seatNo: "70",
        department: "DCS - UBIT",
        program: "BSSE (Bachelor of Science in Software Engineering)",
        university: "University of Karachi"
    };

    // Safety check
    if (!courseData) return <div className="p-10 text-center">Loading Data...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-10 print:bg-white print:py-0 font-sans text-slate-900">

            {/* 🖨️ Header / Control Bar */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center px-6 print:hidden">
                <h1 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded uppercase tracking-wider font-black">
                        DLD Lab
                    </span>
                    Number Systems
                </h1>
                <button onClick={() => window.print()} className="bg-slate-800 hover:bg-black text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print Lab File
                </button>
            </div>

            {/* 📄 The Document */}
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
                <div className="p-10 md:p-16 space-y-12">

                    {/* 🎓 STUDENT IDENTITY HEADER */}
                    <div className="border-b-4 border-slate-900 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                                {courseData.title}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium">
                                {courseData.description}
                            </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg w-full md:w-auto min-w-[300px] print:border-slate-900">
                            <div className="space-y-1 text-sm text-slate-700">
                                <div className="flex justify-between border-b border-slate-200 pb-1 mb-1">
                                    <span className="font-bold uppercase text-slate-400 text-xs">Name</span>
                                    <span className="font-bold">{studentInfo.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-1 mb-1">
                                    <span className="font-bold uppercase text-slate-400 text-xs">Seat No</span>
                                    <span className="font-mono bg-slate-200 px-1 rounded print:bg-slate-300">{studentInfo.seatNo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold uppercase text-slate-400 text-xs">Dept</span>
                                    <span>{studentInfo.department}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 0. SYSTEMS OVERVIEW */}
                    {courseData.introduction && courseData.introduction.systems && (
                        <section className="break-inside-avoid">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-8 border-indigo-500 pl-4 bg-indigo-50 py-2 rounded-r">
                                <span className="text-3xl">🧮</span> Systems Overview
                            </h2>
                            <p className="mb-4 text-slate-600 italic">{courseData.introduction.definition}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {courseData.introduction.systems.map((sys, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm text-center">
                                        <h3 className="font-bold text-lg text-slate-800">{sys.name}</h3>
                                        <div className="text-xs font-bold bg-indigo-100 text-indigo-700 inline-block px-2 py-1 rounded my-2">
                                            Base {sys.base}
                                        </div>
                                        <p className="text-sm text-slate-500 font-mono break-words">{sys.digits}</p>
                                        <p className="text-xs text-slate-400 mt-2 italic">{sys.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 1. MASTER REFERENCE TABLE */}
                    <section className="break-inside-avoid">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-8 border-blue-500 pl-4 bg-blue-50 py-2 rounded-r">
                            <span className="text-3xl">📊</span> Master Reference Table (0-15)
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 border-r">Decimal (10)</th>
                                        <th className="px-6 py-3 border-r bg-blue-50 text-blue-800">Binary (2)</th>
                                        <th className="px-6 py-3 border-r">Octal (8)</th>
                                        <th className="px-6 py-3">Hex (16)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.master_reference_table?.map((row, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 print:border-slate-300">
                                            <td className="px-6 py-2 font-bold text-slate-900 border-r">{row.decimal}</td>
                                            <td className="px-6 py-2 font-mono text-blue-600 font-bold border-r bg-blue-50/30 print:bg-transparent">{row.binary}</td>
                                            <td className="px-6 py-2 font-mono border-r">{row.octal}</td>
                                            <td className="px-6 py-2 font-mono text-purple-600 font-bold">{row.hex}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 2. CONVERSION RULES GRID */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2 border-l-8 border-purple-500 pl-4 bg-purple-50 py-2 rounded-r">
                            <span className="text-3xl">🔄</span> Conversion Rules
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {courseData.conversions && Object.entries(courseData.conversions).map(([key, section]) => {
                                const title = key.replace("from_", "").toUpperCase();
                                return (
                                    <div key={key} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full print:border-slate-300 print:break-inside-avoid">
                                        {/* Card Header */}
                                        <div className="bg-slate-800 text-white p-4">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                FROM <span className="text-purple-300">{title}</span>
                                            </h3>
                                            <div className="text-xs text-slate-400 mt-1 italic">
                                                <ReactMarkdown components={{ p: 'span' }}>
                                                    {section.general_rule}
                                                </ReactMarkdown>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 space-y-8 flex-grow">
                                            {section.targets?.map((target, tIdx) => (
                                                <div key={tIdx} className="border-l-4 border-slate-200 pl-4 hover:border-purple-400 transition-colors">
                                                    {/* Method Header */}
                                                    <h4 className="font-bold text-slate-700 text-sm uppercase mb-1 flex justify-between items-center">
                                                        <span>To {target.to}</span>
                                                    </h4>
                                                    <div className="text-slate-600 text-sm leading-relaxed mb-3">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkMath]}
                                                            rehypePlugins={[rehypeKatex]}
                                                            components={{ p: 'span' }}
                                                        >
                                                            {target.method}
                                                        </ReactMarkdown>
                                                    </div>
                                                    {/* ✅ NEW: Verification Tip */}
                                                    {target.verification && (
                                                        <div className="mt-2 mb-3 text-xs text-amber-800 bg-amber-50 border-l-4 border-amber-400 p-2 rounded-r print:border-amber-600 print:text-amber-900">
                                                            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-600 block mb-1 print:text-amber-800">
                                                                ⚡ Quick Check:
                                                            </span>
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkMath]}
                                                                rehypePlugins={[rehypeKatex]}
                                                                components={{ p: 'span' }}
                                                            >
                                                                {target.verification}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                    {/* 📝 Detailed Example Block */}
                                                    {target.example && (
                                                        <div className="bg-slate-50 border border-slate-200 rounded p-3 text-sm">
                                                            <div className="font-bold text-purple-700 border-b border-slate-200 pb-1 mb-2">
                                                                <span className="mr-2">📝 Ex:</span>
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkMath]}
                                                                    rehypePlugins={[rehypeKatex]}
                                                                    components={{ p: 'span' }}
                                                                >
                                                                    {target.example.problem}
                                                                </ReactMarkdown>
                                                            </div>
                                                            <div className="space-y-1 mb-3 pl-2 border-l-2 border-slate-300 text-slate-600 font-mono text-xs">
                                                                {target.example.steps?.map((step, sIdx) => (
                                                                    <div key={sIdx}>
                                                                        <ReactMarkdown
                                                                            remarkPlugins={[remarkMath]}
                                                                            rehypePlugins={[rehypeKatex]}
                                                                            components={{ p: 'span' }}
                                                                        >
                                                                            {step}
                                                                        </ReactMarkdown>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkMath]}
                                                                    rehypePlugins={[rehypeKatex]}
                                                                    components={{ p: 'span' }}
                                                                >
                                                                    {target.example.result}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>



                    {/* Footer */}
                    <div className="hidden print:block text-center text-slate-400 text-xs mt-10 pt-10 border-t">
                        {studentInfo.name} ({studentInfo.seatNo}) • {studentInfo.program} • {studentInfo.department}
                    </div>

                </div>
            </div>
        </div>
    );
}