"use client";

import Link from "next/link";

export default function JavaDashboard() {

    const modules = [
        {
            title: "Foundations & Memory",
            description: "JVM Architecture, Primitive Types, and the Stack/Heap Divide.",
            icon: "☕",
            link: "/JAVA/foundations",
            headerColor: "bg-orange-500",
            status: "Ready"
        },
        {
            title: "Operators & Logic",
            description: "Arithmetic truncation, relational routing, and bitwise hardware logic.",
            icon: "⚙️",
            link: "/JAVA/operators",
            headerColor: "bg-blue-600",
            status: "Ready"
        },
        {
            title: "Conditionals",
            description: "Branching logic, guard clauses, and Java 21+ pattern matching.",
            icon: "🔀",
            link: "/JAVA/conditionals",
            headerColor: "bg-emerald-600",
            status: "Ready"
        },
        {
            title: "Loops & Iteration",
            description: "While, For, For-Each, and advanced loop compiler mechanics.",
            icon: "🔁",
            link: "/JAVA/loops",
            headerColor: "bg-purple-600",
            status: "Ready"
        },
        {
            title: "Methods & Stack",
            description: "Call stack physics, pass-by-value, and method overloading.",
            icon: "📦",
            link: "/JAVA/methods",
            headerColor: "bg-indigo-600",
            status: "Ready"
        },
        {
            title: "Arrays & Memory",
            description: "Contiguous RAM, multi-dimensional matrices, and sorting.",
            icon: "📚",
            link: "/JAVA/arrays",
            headerColor: "bg-rose-600",
            status: "Ready"
        },
        {
            title: "Strings",
            description: "The String Pool, Immutability, and RegEx parsing.",
            icon: "🔤",
            link: "/JAVA/strings",
            headerColor: "bg-teal-600",
            status: "Ready"
        },
        {
            title: "String Methods",
            description: "Advanced string manipulation and common utility methods.",
            icon: "🛠️",
            link: "/JAVA/string-methods",
            headerColor: "bg-cyan-600",
            status: "Ready"
        },
        {
            title: "Trace Tables",
            description: "Variable state tracking, debugging logic, and algorithmic execution.",
            icon: "📋",
            link: "/JAVA/trace-table",
            headerColor: "bg-amber-600",
            status: "Ready"
        },
        {
            title: "File I/O",
            description: "Reading and writing files, streams, and data persistence.",
            icon: "📁",
            link: "/JAVA/io",
            headerColor: "bg-lime-600",
            status: "Ready"
        },
        {
            title: "Collections",
            description: "Lists, Sets, Maps, and the Java Collections Framework.",
            icon: "🗃️",
            link: "/JAVA/collections",
            headerColor: "bg-fuchsia-600",
            status: "Ready"
        },
        {
            title: "Algorithms",
            description: "Sorting, searching, and algorithmic complexity.",
            icon: "🧠",
            link: "/JAVA/algorithms",
            headerColor: "bg-red-600",
            status: "Ready"
        },
        {
            title: "Data Formats",
            description: "JSON, XML, and data serialization.",
            icon: "📄",
            link: "/JAVA/data-formats",
            headerColor: "bg-pink-600",
            status: "Ready"
        },
        {
            title: "Exceptions",
            description: "Try-catch blocks, custom exceptions, and error handling.",
            icon: "⚠️",
            link: "/JAVA/exceptions",
            headerColor: "bg-yellow-600",
            status: "Ready"
        },
        {
            title: "OOPs",
            description: "Inheritance, Polymorphism, Encapsulation, and Abstraction.",
            icon: "🏗️",
            link: "/JAVA/oops",
            headerColor: "bg-violet-600",
            status: "Ready"
        },
        {
            title: "Recursion",
            description: "Base cases, call stack unwinding, and recursive logic.",
            icon: "🔄",
            link: "/JAVA/recursion",
            headerColor: "bg-sky-600",
            status: "Ready"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* ✨ Glassmorphism Sticky Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white p-2 rounded-lg text-xl leading-none">☕</span>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                            Java<span className="text-indigo-600">Mastery</span>
                        </h1>
                    </div>
                    <div className="text-sm font-medium text-slate-500 hidden md:flex items-center gap-3">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">BSSE Engine</span>
                        <span className="text-slate-900 font-bold">Usman Mughal</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16 px-6 shadow-inner">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Master Java Architecture, <br /> One Module at a Time.
                    </h2>
                    <p className="text-indigo-200 text-lg mb-8 max-w-2xl mx-auto">
                        Hardware-level insights, memory management, and enterprise coding patterns.
                    </p>
                </div>
            </div>

            {/* Dashboard Grid */}
            <main className="max-w-6xl mx-auto px-6 -mt-10 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module, idx) => (
                        <Link
                            key={idx}
                            href={module.link}
                            className="group relative flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200"
                        >
                            {/* Header */}
                            <div className={`h-24 ${module.headerColor} relative flex items-center px-6`}>
                                <div className="text-4xl text-white/90 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                                    {module.icon}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                                    {module.description}
                                </p>

                                <div className="mt-6">
                                    <div className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        Initialize Module
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}