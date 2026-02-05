"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import ReactMarkdown from "react-markdown";
import { 
  Send, Menu, Sparkles, Settings, LogOut, 
  History, X, Moon, Sun, BookOpen, Trash2, Plus, MessageSquare 
} from "lucide-react";

export default function Dashboard() { 
  const router = useRouter();
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  
  // --- 🔒 AUTHENTICATION ---
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      router.push("/"); 
    } else {
      setUserName(user.name);
      setUserEmail(user.email);
    }
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- 📚 MULTI-CHAT DATABASE LOGIC ---
  const [sessions, setSessions] = useState([]); 
  
  // activeSessionId = NULL means we are in "New Chat" (Draft) mode
  const [activeSessionId, setActiveSessionId] = useState(null);

  // 1. Load Sessions on Startup
  useEffect(() => {
    if (userEmail) {
      const savedSessions = JSON.parse(localStorage.getItem(`studymate_sessions_${userEmail}`));
      if (savedSessions && savedSessions.length > 0) {
        setSessions(savedSessions);
        // Optional: Open the last chat automatically? 
        // setActiveSessionId(savedSessions[0].id); 
        // OR start with a new chat:
        setActiveSessionId(null);
      } else {
        setActiveSessionId(null);
      }
    }
  }, [userEmail]);

  // 2. Save Sessions whenever they change
  useEffect(() => {
    if (userEmail && sessions.length > 0) {
      localStorage.setItem(`studymate_sessions_${userEmail}`, JSON.stringify(sessions));
    } else if (userEmail && sessions.length === 0) {
      // If user deleted all chats, clear storage
      localStorage.removeItem(`studymate_sessions_${userEmail}`);
    }
  }, [sessions, userEmail]);

  // --- ACTIONS ---

  // Create a New Chat (DRAFT MODE)
  // This NO LONGER creates a folder immediately. It just clears the screen.
  const createNewChat = () => {
    setActiveSessionId(null); // Null means "Fresh Screen"
    setSidebarOpen(false);
  };

  // Switch Chat
  const switchChat = (id) => {
    setActiveSessionId(id);
    setSidebarOpen(false);
  };

  // Delete All History
  const clearAllHistory = () => {
    if (confirm("Are you sure? This will delete ALL your chats.")) {
      setSessions([]);
      localStorage.removeItem(`studymate_sessions_${userEmail}`);
      createNewChat(); 
    }
  };

  // Helper: Get Messages to Display
  const getDisplayMessages = () => {
    if (activeSessionId === null) {
        // DRAFT MODE: Show only the welcome message
        return [{ role: "ai", content: `Salam **${userName}**! I'm ready. Ask me anything about your studies.` }];
    }
    // ACTIVE MODE: Find the session and show its messages
    const session = sessions.find(s => s.id === activeSessionId);
    return session ? session.messages : [];
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const currentInput = input; // Store for title generation
    setInput("");
    setIsLoading(true);

    let targetSessionId = activeSessionId;
    let newSessionsList = [...sessions];

    // --- CASE 1: IS THIS A NEW CHAT? ---
    if (activeSessionId === null) {
        // 1. Create the Session Object NOW (only after sending)
        targetSessionId = Date.now();
        const welcomeMsg = { role: "ai", content: `Salam **${userName}**! I'm ready. Ask me anything about your studies.` };
        
        // 2. Name the folder automatically based on the first question
        const autoTitle = currentInput.length > 25 ? currentInput.substring(0, 25) + "..." : currentInput;

        const newSession = {
            id: targetSessionId,
            title: autoTitle, // <--- NAMED AUTOMATICALLY
            messages: [welcomeMsg, userMsg]
        };

        // 3. Update State
        newSessionsList = [newSession, ...sessions];
        setSessions(newSessionsList);
        setActiveSessionId(targetSessionId);
    } 
    // --- CASE 2: EXISTING CHAT ---
    else {
        // Update existing session
        newSessionsList = sessions.map(session => 
            session.id === activeSessionId 
            ? { ...session, messages: [...session.messages, userMsg] }
            : session
        );
        setSessions(newSessionsList);
    }

    try {
      // Get the message history for context
      const currentHistory = newSessionsList.find(s => s.id === targetSessionId).messages;

      // Call API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentHistory }),
      });
      
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      const aiMsg = { role: "ai", content: data.reply };

      // Update UI with AI Response
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === targetSessionId 
            ? { ...session, messages: [...session.messages, aiMsg] } 
            : session
        )
      );

    } catch (e) {
      console.error(e);
      // Add Error Message to chat
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === targetSessionId 
            ? { ...session, messages: [...session.messages, { role: "ai", content: "Error: Connection failed. Please try again." }] } 
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Scroll to bottom when messages change
  const currentMessages = getDisplayMessages();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  if (!userName) return null; 

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen font-sans overflow-hidden transition-colors duration-300 
        bg-[#f5f6fa] text-gray-800 
        dark:bg-[#0f1117] dark:text-gray-100">
        
        {/* --- SIDEBAR --- */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out border-r shadow-2xl flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          
          bg-[#1a237e] border-blue-900 text-white
          dark:bg-[#161b22] dark:border-gray-800 dark:text-gray-100
        `}>
          <div className="p-5 flex-shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                  <BookOpen size={22} className="text-[#ffd700]" />
                </div>
                <div>
                  <h1 className="font-bold text-xl tracking-tight text-white">StudyMate</h1>
                  <p className="text-xs text-[#ffd700] font-medium tracking-wide">AI TUTOR</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* NEW CHAT BUTTON */}
            <button 
              onClick={createNewChat}
              className="w-full flex items-center gap-2 justify-center bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-medium transition-all shadow-sm active:scale-95 mb-4"
            >
              <Plus size={18} /> New Chat
            </button>

            <div className="text-xs font-bold text-white/50 px-2 uppercase tracking-wider mb-2">History</div>
          </div>

          {/* CHAT HISTORY LIST (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
            {sessions.map((session) => (
              <button 
                key={session.id}
                onClick={() => switchChat(session.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left transition-all border border-transparent
                  ${activeSessionId === session.id 
                    ? "bg-white/20 text-white font-medium border-white/10 shadow-sm" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <MessageSquare size={16} className={activeSessionId === session.id ? "text-[#ffd700]" : "opacity-70"} />
                <span className="truncate">{session.title}</span>
              </button>
            ))}
            {sessions.length === 0 && (
                <div className="text-white/40 text-sm text-center py-4 italic">No history yet</div>
            )}
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="p-4 mt-auto border-t border-white/10 space-y-1 bg-[#151b60] dark:bg-[#0d1117]">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Settings size={18} /> Settings
            </button>
            
            {/* CLEAR HISTORY */}
            <button 
              onClick={clearAllHistory}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 size={18} /> Clear History
            </button>

            {/* LOGOUT */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>

        {/* --- MAIN CHAT AREA --- */}
        <main className="flex-1 flex flex-col h-full relative transition-colors duration-300">
          
          <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur-md
            bg-white/80 border-b border-gray-200 shadow-sm
            dark:bg-[#0f1117]/80 dark:border-gray-800 dark:shadow-none
          ">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden rounded-lg">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-[#1a237e] dark:text-gray-300">Gemini 2.5 Flash</span>
                <span className="text-[10px] font-bold bg-[#1a237e]/10 text-[#1a237e] px-2 py-0.5 rounded-full border border-[#1a237e]/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">LIVE</span>
              </div>
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-200
              bg-gray-100 text-gray-600 hover:bg-gray-200
              dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
            {currentMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`
                  max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm relative
                  ${msg.role === "user" 
                    ? "bg-[#1a237e] text-white rounded-br-none shadow-blue-900/20 dark:bg-indigo-600 dark:shadow-indigo-500/10" 
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-gray-200/50 dark:bg-[#1e232e] dark:border-gray-800 dark:text-gray-200 dark:shadow-none"}
                `}>
                  <ReactMarkdown 
                    components={{
                      strong: ({node, ...props}) => <span className={`font-bold ${msg.role === 'user' ? 'text-[#ffd700]' : 'text-[#1a237e] dark:text-indigo-400'}`} {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2 space-y-1" {...props} />,
                      code: ({node, ...props}) => <code className={`px-1 py-0.5 rounded font-mono text-sm ${msg.role === 'user' ? 'bg-white/20' : 'bg-gray-100 dark:bg-black/30'}`} {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="p-4 rounded-2xl rounded-bl-none border flex items-center gap-2
                  bg-white border-gray-100 dark:bg-[#1e232e] dark:border-gray-800">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t transition-colors
            bg-white border-gray-100 
            dark:bg-[#0f1117] dark:border-gray-800">
            
            <div className="max-w-4xl mx-auto relative flex items-end gap-2">
              <div className="flex-1 rounded-2xl flex items-center px-4 py-3 transition-all shadow-sm border
                bg-gray-50 border-gray-200 focus-within:border-[#1a237e] focus-within:ring-1 focus-within:ring-[#1a237e]/20
                dark:bg-[#1e232e] dark:border-gray-700 dark:focus-within:border-indigo-500
              ">
                <input
                  className="flex-1 bg-transparent border-0 outline-none min-h-[24px] max-h-32 resize-none
                    text-gray-800 placeholder-gray-400
                    dark:text-gray-100 dark:placeholder-gray-500"
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
                className="p-4 rounded-2xl transition-all shadow-lg active:scale-95 flex-shrink-0
                  bg-[#1a237e] text-white hover:bg-[#151b60] shadow-blue-900/20
                  disabled:opacity-50 disabled:hover:bg-[#1a237e]
                  dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:shadow-indigo-500/25"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-center mt-3 select-none
              text-gray-400 dark:text-gray-600">
              AI can make mistakes. Always verify important info.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}