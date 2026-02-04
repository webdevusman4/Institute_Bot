"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, User, Mail, Lock, Sparkles, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // <--- NEW: Success Message State

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      router.push("/dashboard");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Clear previous success messages
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("studymate_users")) || [];

      if (isLogin) {
        // --- LOGIN LOGIC ---
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          router.push("/dashboard");
        } else {
          setError("Invalid email or password.");
          setLoading(false);
        }
      } else {
        // --- SIGNUP LOGIC ---
        if (users.find(u => u.email === email)) {
          setError("User already exists.");
          setLoading(false);
          return;
        }

        // 1. Save the new user
        const newUser = { name, email, password, goal };
        users.push(newUser);
        localStorage.setItem("studymate_users", JSON.stringify(users));
        
        // 2. SHOW SUCCESS MESSAGE
        setLoading(false);
        setSuccess("Account created successfully! Redirecting to login...");

        // 3. WAIT 3 SECONDS, THEN SWITCH TO LOGIN
        setTimeout(() => {
           setIsLogin(true);      // Switch to Login Form
           setSuccess("");        // Clear the message
           setPassword("");       // Clear password for security
           // We keep the 'email' filled in so they don't have to type it again!
        }, 3000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa] p-4 font-sans text-gray-800">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#000051] to-[#1a237e] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <BookOpen size={24} className="text-[#ffd700]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">StudyMate</h1>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed italic opacity-90">
              "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
            </p>
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#ffd700] rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="z-10 mt-12">
            <div className="flex items-center gap-2 text-sm font-medium text-[#ffd700] bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
              <Sparkles size={14} /> <span>AI-Powered Learning</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1a237e] mb-2">{isLogin ? "Welcome Back" : "Join StudyMate"}</h2>
            <p className="text-gray-500">{isLogin ? "Please enter your details to sign in." : "Start your productivity journey today."}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#1a237e]" size={20} />
                  <input type="text" placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]/20 transition-all" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="relative group">
                  <Sparkles className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#1a237e]" size={20} />
                  <input type="text" placeholder="Current Goal" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]/20 transition-all" value={goal} onChange={(e) => setGoal(e.target.value)} />
                </div>
              </>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#1a237e]" size={20} />
              <input type="email" placeholder="Email Address" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]/20 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#1a237e]" size={20} />
              <input type="password" placeholder="Password" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e]/20 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* ERROR MESSAGE (Red) */}
            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}
            
            {/* SUCCESS MESSAGE (Green) */}
            {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg border border-green-100 justify-center animate-pulse">
                    <CheckCircle size={16} /> {success}
                </div>
            )}

            <button type="submit" disabled={loading || success} className="w-full bg-[#1a237e] text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg shadow-blue-900/20 hover:bg-[#151b60] hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} className="ml-2 text-[#1a237e] font-bold hover:underline transition-all">{isLogin ? "Sign up" : "Sign in"}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}