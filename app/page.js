"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthHero from "./components/AuthHero";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Input states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    goal: ""
  });

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      router.push("/dashboard");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate network delay (1 second)
    setTimeout(() => {
      // Get existing users from Local Storage
      const users = JSON.parse(localStorage.getItem("studymate_users")) || [];

      if (isLogin) {
        // --- LOCAL LOGIN LOGIC ---
        const user = users.find(u => u.email === formData.email && u.password === formData.password);

        if (user) {
          // Save session
          localStorage.setItem("currentUser", JSON.stringify(user));
          router.push("/dashboard");
        } else {
          setError("Invalid email or password.");
          setLoading(false);
        }

      } else {
        // --- LOCAL SIGNUP LOGIC ---
        if (users.find(u => u.email === formData.email)) {
          setError("User already exists.");
          setLoading(false);
          return;
        }

        const newUser = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          goal: formData.goal
        };

        // Save new user to Local Storage
        users.push(newUser);
        localStorage.setItem("studymate_users", JSON.stringify(users));

        setSuccess("Account created successfully! Redirecting...");
        setLoading(false);

        // Wait 2 seconds then switch to login view
        setTimeout(() => {
          setIsLogin(true);
          setSuccess("");
          setFormData(prev => ({ ...prev, password: "" })); // Clear password
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-900 text-slate-100 transition-colors duration-500">

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      <main className="w-full max-w-sm md:max-w-4xl h-auto md:h-[600px] glass-panel rounded-3xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden border border-white/10">

        {/* LEFT PANEL (Briefing) */}
        <AuthHero
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setError={setError}
          setSuccess={setSuccess}
        />

        {/* RIGHT PANEL (Form) */}
        <section className={`
          w-full md:w-1/2 p-8 md:p-12 bg-slate-900/80 backdrop-blur-sm flex flex-col justify-center
          transition-all duration-500 ease-in-out
          ${!isLogin ? "md:-translate-x-full" : "translate-x-0"}
        `}>
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLogin ? "Enter your credentials to access your account." : "Fill in your details to get started."}
              </p>
            </div>

            {isLogin ? (
              <LoginForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={success}
              />
            ) : (
              <SignupForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={success}
              />
            )}
          </div>
        </section>

      </main>
    </div>
  );
}   