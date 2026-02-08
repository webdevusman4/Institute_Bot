"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  Send, Menu, LogOut, Moon, Sun, BookOpen, Trash2, Plus, MessageSquare, Sparkles
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMounting, setIsMounting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Authentication Check
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    if (!u) {
      router.replace("/");
    } else {
      setUser(u);
      setIsMounting(false);
    }
  }, [router]);

  // Load Sessions
  useEffect(() => {
    if (user?.email) {
      const saved = JSON.parse(localStorage.getItem(`studymate_sessions_${user.email}`));
      if (saved?.length > 0) setSessions(saved);
    }
  }, [user]);

  // Save Sessions
  useEffect(() => {
    if (user?.email && sessions.length >= 0) {
      localStorage.setItem(`studymate_sessions_${user.email}`, JSON.stringify(sessions));
    }
  }, [sessions, user]);

  const createNewChat = () => { setActiveSessionId(null); setSidebarOpen(false); };
  const switchChat = (id) => { setActiveSessionId(id); setSidebarOpen(false); };

  const clearAllHistory = () => {
    setShowDeleteModal(true);
  };

  const confirmClearHistory = () => {
    setSessions([]);
    setActiveSessionId(null);
    setShowDeleteModal(false);
  };

  const getDisplayMessages = () => {
    if (activeSessionId === null) {
      return [{ role: "ai", content: `Hello **${user?.name}**! I'm ready to help you with **Matrices & Determinants** today.` }];
    }
    return sessions.find(s => s.id === activeSessionId)?.messages || [];
  };

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    const currentInput = input;
    setInput(""); 
    setIsLoading(true);

    let targetId = activeSessionId;
    let currentSessions = [...sessions];

    if (activeSessionId === null) {
      targetId = Date.now();
      const newSession = { id: targetId, title: currentInput.substring(0, 25), messages: [userMsg] };
      currentSessions = [newSession, ...sessions];
      setSessions(currentSessions);
      setActiveSessionId(targetId);
    } else {
      currentSessions = sessions.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMsg] } : s);
      setSessions(currentSessions);
    }

    try {
      const history = currentSessions.find(s => s.id === targetId).messages;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      setSessions(prev => prev.map(s => s.id === targetId ? { ...s, messages: [...s.messages, { role: "ai", content: data.reply }] } : s));
    } catch (e) {
      setSessions(prev => prev.map(s => s.id === targetId ? { ...s, messages: [...s.messages, { role: "ai", content: "⚠️ Connection error." }] } : s));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [sessions, activeSessionId, isLoading]);
  
  if (isMounting) return <div className="h-screen w-full bg-background" />;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background text-text transition-colors duration-500">
      
      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col bg-surface border-r border-white/5 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 text-primary">
            <BookOpen size={24} />
            <span className="font-bold text-xl tracking-tight text-text">StudyMate</span>
          </div>
          <button onClick={createNewChat} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/25 active:scale-95">
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-bold text-text-muted px-2 uppercase tracking-[0.2em] mb-4 opacity-50">History</div>
          {sessions.map(s => (
            <button key={s.id} onClick={() => switchChat(s.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${activeSessionId === s.id ? "bg-primary/20 text-text border-l-4 border-primary" : "text-text-muted hover:bg-white/5 hover:text-text"}`}>
              <MessageSquare size={16} /> <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/5 space-y-1 bg-background/50">
          <button onClick={clearAllHistory} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash2 size={18} /> Clear History
          </button>
          <button onClick={() => { localStorage.removeItem("currentUser"); router.replace("/"); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-text-muted hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-500" />
        <div className="absolute bottom-[20%] left-[-5%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none transition-colors duration-500" />

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-surface/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-10 shadow-sm transition-colors duration-500">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-muted"><Menu size={24} /></button>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/15 rounded-full border border-primary/30">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Gemini 1.5 Pro</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-primary/30 transition-all duration-500">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 relative z-10 custom-scrollbar">
          {getDisplayMessages().map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-3xl shadow-lg border ${msg.role === "user" ? "bg-primary border-primary text-white rounded-br-none shadow-primary/20" : "bg-surface/80 border-white/10 text-text rounded-bl-none backdrop-blur-md"}`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed opacity-95">{children}</p>,
                      div: ({ children }) => <div className="overflow-x-auto my-3 scrollbar-hide py-2">{children}</div>
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-surface/60 p-5 rounded-3xl rounded-bl-none border border-white/5 flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 bg-gradient-to-t from-background via-background to-transparent relative z-10">
          <div className="max-w-4xl mx-auto flex items-end gap-3 glass-panel p-2.5 rounded-2xl border-white/20 shadow-2xl shadow-black/40">
            <input
              className="flex-1 bg-transparent px-4 py-3 outline-none text-text placeholder-text-muted text-sm"
              placeholder={`Ask ${user?.name || "me"} anything...`}
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={isLoading || !input.trim()} className="p-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-md shadow-primary/30 active:scale-90 disabled:opacity-40">
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-center text-text-muted mt-6 opacity-30 font-medium uppercase tracking-[0.2em]">StudyMate AI • Powered by Google</p>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-sm glass-panel bg-surface/90 p-8 rounded-3xl border-white/10 shadow-2xl scale-up-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-red-500/20">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-text text-center mb-2">Clear History?</h3>
            <p className="text-text-muted text-center text-sm mb-8 leading-relaxed">
              This will permanently delete all your sessions. You won't be able to recover them later.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmClearHistory}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-red-500/20"
              >
                Delete Everything
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-text rounded-2xl font-bold text-sm transition-all border border-white/5"
              >
                Keep History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}