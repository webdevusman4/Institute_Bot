"use client";

import { BookOpen, Plus, MessageSquare, Settings, Trash2, LogOut, X } from "lucide-react";

export default function Sidebar({
    open,
    setOpen,
    sessions,
    activeSessionId,
    onNewChat,
    onSwitchChat,
    onClearHistory,
    onLogout
}) {
    return (
        <>
            {/* Mobile Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-card border-r border-border text-foreground
      `}>
                <div className="p-6 flex-shrink-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                <BookOpen size={22} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl tracking-tight">StudyMate</h1>
                                <p className="text-xs text-muted-foreground font-medium tracking-wide">AI TUTOR</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* NEW CHAT BUTTON */}
                    <button
                        onClick={onNewChat}
                        className="w-full flex items-center gap-2 justify-center bg-primary text-primary-foreground py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 active:scale-95 mb-6"
                    >
                        <Plus size={18} /> New Chat
                    </button>

                    <div className="text-xs font-bold text-muted-foreground px-2 uppercase tracking-wider mb-3">History</div>
                </div>

                {/* CHAT HISTORY LIST */}
                <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
                    {sessions.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => onSwitchChat(session.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left transition-all group
                ${activeSessionId === session.id
                                    ? "bg-secondary text-secondary-foreground font-medium"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                }`}
                        >
                            <MessageSquare size={16} className={activeSessionId === session.id ? "text-primary" : "opacity-50 group-hover:opacity-100"} />
                            <span className="truncate">{session.title}</span>
                        </button>
                    ))}
                    {sessions.length === 0 && (
                        <div className="text-muted-foreground/50 text-sm text-center py-8 italic">No history yet</div>
                    )}
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="p-4 mt-auto border-t border-border space-y-1 bg-secondary/30">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                        <Settings size={18} /> Settings
                    </button>

                    <button
                        onClick={onClearHistory}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} /> Clear History
                    </button>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
