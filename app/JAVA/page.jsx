"use client";

import React from 'react';
import {
    Type,
    Split,
    Repeat,
    CaseSensitive,
    LayoutGrid,
    FunctionSquare,
    ChevronRight
} from 'lucide-react';

const ParhoMateDashboard = () => {
    const paths = [
        {
            title: "Variables & Data Types",
            description: "Master primitives, declarations, and memory allocation in Java.",
            icon: Type,
            progress: 0,
            topics: 5
        },
        {
            title: "Conditional Statements (If/Switch)",
            description: "Learn logical flow control and decision-making structures.",
            icon: Split,
            progress: 0,
            topics: 4
        },
        {
            title: "Looping Structures (For, While)",
            description: "Iterate through data and master controlled repetitive execution.",
            icon: Repeat,
            progress: 0,
            topics: 6
        },
        {
            title: "String Manipulation",
            description: "Explore the String class, immutability, and common methods.",
            icon: CaseSensitive,
            progress: 0,
            topics: 4
        },
        {
            title: "Arrays (1D & 2D)",
            description: "Work with collections of data and multi-dimensional matrices.",
            icon: LayoutGrid,
            progress: 0,
            topics: 7
        },
        {
            title: "Methods & Recursion",
            description: "Modularize code with functions and recursive logic patterns.",
            icon: FunctionSquare,
            progress: 0,
            topics: 5
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900">
            {/* Main Content Area - Now takes up the full width */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Parho<span className="text-purple-600">Mate</span> | Java PF Exam Paths
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BSSE @ UoK</p>
                            <p className="text-sm font-bold text-slate-800">Usman Mughal</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                            UM
                        </div>
                    </div>
                </header>

                {/* Grid Content */}
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-800">Select a Module</h2>
                        <p className="text-slate-600">Prepare systematically for your Programming Fundamentals exam.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paths.map((path, index) => (
                            <div
                                key={index}
                                className="group relative bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-600 cursor-pointer"
                            >
                                {/* Card Icon */}
                                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4 transition-colors group-hover:bg-purple-100">
                                    <path.icon className="text-purple-600 w-6 h-6" />
                                </div>

                                {/* Card Content */}
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                                    {path.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                    {path.description}
                                </p>

                                {/* Progress Indicator */}
                                <div className="mt-auto">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                        <span className="text-xs font-bold text-purple-600">{path.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-purple-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${path.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Topics Footer */}
                                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-500">{path.topics} Lessons</span>
                                    <div className="flex items-center gap-1 text-xs font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Start Learning <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ParhoMateDashboard;