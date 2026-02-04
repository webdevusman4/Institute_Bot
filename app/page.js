"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Menu, Sparkles, Settings, LogOut, History, X } from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial Chat State
  const [messages, setMessages] = useState([
    { role: "ai", content: "Salam! **StudyMate** here. Aaj Physics mein kya phansa hua hai? (What's stuck?)" }
  ]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Sending Messages
  async function sendMessage() {
    if (!input.trim()) return;

    // 1. Add User Message immediately
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Call the Real API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      if (!res.ok) throw new Error("Network error");

      // 3. Get the Real Answer
      const data = await res.json();
      
      // 4. Update the UI with Gemini's Answer
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "ai", content: "Error: I cannot read the prospectus right now." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#0f1117] text-gray-100 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#161b22] border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white">StudyMate</h1>
                <p className="text-xs text-indigo-400 font-medium">AI Tutor</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <div className="text-xs font-semibold text-gray-500 px-3 mb-3 uppercase tracking-wider">Recent Chats</div>
            {["Projectile Motion", "Organic Chemistry", "Newton's Laws"].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-400 hover:bg-[#1f242e] hover:text-gray-100 transition-all group">
                <History size={16} className="text-gray-600 group-hover:text-indigo-400" />
                {item}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-800 space-y-1">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1f242e] rounded-lg transition-colors">
              <Settings size={18} /> Settings
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden rounded-lg hover:bg-gray-800">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">Gemini 2.5 Flash</span>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">Beta</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`
                max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm
                ${msg.role === "user" 
                  ? "bg-indigo-600 text-white rounded-br-none shadow-indigo-500/10" 
                  : "bg-[#1e232e] border border-gray-800 text-gray-200 rounded-bl-none"}
              `}>
                <ReactMarkdown 
                  components={{
                    strong: ({node, ...props}) => <span className="font-bold text-indigo-300" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2 space-y-1" {...props} />,
                    code: ({node, ...props}) => <code className="bg-black/30 px-1 py-0.5 rounded text-indigo-200 font-mono text-sm" {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-[#1e232e] p-4 rounded-2xl rounded-bl-none border border-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-[#0f1117] border-t border-gray-800">
          <div className="max-w-4xl mx-auto relative flex items-end gap-2">
            <div className="flex-1 bg-[#1e232e] border border-gray-700 hover:border-gray-600 focus-within:border-indigo-500/50 rounded-2xl flex items-center px-4 py-3 transition-all shadow-lg">
              <input
                className="flex-1 bg-transparent border-0 outline-none text-gray-100 placeholder-gray-500 min-h-[24px] max-h-32 resize-none"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                autoComplete="off"
              />
            </div>
            <button 
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex-shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-center text-gray-600 mt-3 select-none">
            AI can make mistakes. Always verify important info.
          </p>
        </div>

      </main>
    </div>
  );
}