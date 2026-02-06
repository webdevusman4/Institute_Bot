"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Send, Menu, LogOut, Moon, Sun, BookOpen, Trash2, Plus, MessageSquare, Sparkles
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Authentication Check
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("currentUser"));
    if (!u) router.push("/");
    else setUser(u);
  }, []);

  // Load Sessions
  useEffect(() => {
    if (user?.email) {
      const saved = JSON.parse(localStorage.getItem(`studymate_sessions_${user.email}`));
      if (saved?.length > 0) {
        setSessions(saved);
        setActiveSessionId(null);
      }
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
    if (confirm("Delete all history?")) {
      setSessions([]);
      setActiveSessionId(null);
    }
  };

  const getDisplayMessages = () => {
    if (activeSessionId === null) {
      return [{ role: "ai", content: `Hello **${user?.name}**! I'm ready to help you achieve your goal: *${user?.goal || "Learning"}*.` }];
    }
    return sessions.find(s => s.id === activeSessionId)?.messages || [];
  };

  async function sendMessage() {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", content: input };
    const currentInput = input;
    setInput(""); 
    setIsLoading(true);

    let targetId = activeSessionId;
    let newList = [...sessions];

    // Handle New Session Creation
    if (activeSessionId === null) {
      targetId = Date.now();
      const welcome = { role: "ai", content: `Hello **${user.name}**! Let's get started.` };
      const newSession = {
        id: targetId,
        title: currentInput.substring(0, 20) + "...",
        messages: [welcome, userMsg]
      };
      newList = [newSession, ...sessions];
      setSessions(newList);
      setActiveSessionId(targetId);
    } else {
      // Update Existing Session
      newList = sessions.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMsg] } : s);
      setSessions(newList);
    }

    try {
      // Retrieve history for context
      const history = newList.find(s => s.id === targetId).messages;

      // ✅ Real API Call
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      const aiMsg = { role: "ai", content: data.reply };

      setSessions(prev => prev.map(s => s.id === targetId ? { ...s, messages: [...s.messages, aiMsg] } : s));
    } catch (e) {
      console.error(e);
      setSessions(prev => prev.map(s => s.id === targetId ? { ...s, messages: [...s.messages, { role: "ai", content: "Error connecting to AI. Please try again." }] } : s));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [getDisplayMessages()]);
  
  if (!user) return null;

  return (
    /* ✅ Dynamic Theme Class Toggle */
    <div className={`${isDarkMode ? "midnight-bloom" : ""} h-screen w-full flex flex-col overflow-hidden`}>
      
      <div className="flex h-full font-sans bg-background text-text transition-colors duration-300">

        {/* --- SIDEBAR --- */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-surface border-r border-border
        `}>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <BookOpen size={24} />
              <span className="font-bold text-xl tracking-tight text-text">StudyMate</span>
            </div>

            <button onClick={createNewChat} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-500/20">
              <Plus size={18} /> New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
            <div className="text-xs font-bold text-text-muted px-2 uppercase tracking-wider mb-2 mt-2">History</div>
            {sessions.map(s => (
              <button key={s.id} onClick={() => switchChat(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left transition-all
                ${activeSessionId === s.id 
                  ? "bg-primary/20 text-primary font-medium" 
                  : "text-text-muted hover:bg-surface hover:text-text"}`}>
                <MessageSquare size={16} /> <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-border space-y-1">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-text-muted hover:bg-surface hover:text-text rounded-lg">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button onClick={clearAllHistory} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
              <Trash2 size={18} /> Clear History
            </button>
            <button onClick={() => { localStorage.removeItem("currentUser"); router.push("/"); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-text-muted hover:bg-surface hover:text-text rounded-lg">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>

        {/* --- MAIN CHAT --- */}
        <main className="flex-1 flex flex-col h-full relative bg-background">

          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-border">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-text-muted"><Menu size={24} /></button>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">Gemini 1.5 Flash</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {getDisplayMessages().map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm
                  ${msg.role === "user"
                    ? "bg-primary text-white rounded-br-none shadow-indigo-500/20"
                    : "bg-surface border border-border text-text rounded-bl-none"}
                `}>
                  <ReactMarkdown components={{
                    strong: ({ node, ...props }) => <span className="font-bold text-primary" {...props} />
                  }}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface p-4 rounded-2xl rounded-bl-none border border-border flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface border-t border-border">
            <div className="max-w-4xl mx-auto relative flex items-end gap-2">
              <input
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/50 outline-none text-text placeholder-text-muted"
                placeholder="Ask anything..."
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} disabled={isLoading || !input.trim()}
                className="p-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none transition-all">
                <Send size={20} />
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}