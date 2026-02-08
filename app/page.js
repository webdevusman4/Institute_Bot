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
  const [isMounting, setIsMounting] = useState(true); // <--- Added anti-flash state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    goal: ""
  });

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      router.replace("/dashboard"); // replace is better for auth redirects
    } else {
      setIsMounting(false); // Only show the login UI if no user is found
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("studymate_users")) || [];

      if (isLogin) {
        const user = users.find(u => u.email === formData.email && u.password === formData.password);

        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          router.push("/dashboard");
        } else {
          setError("Invalid email or password.");
          setLoading(false);
        }

      } else {
        if (users.find(u => u.email === formData.email)) {
          setError("User already exists.");
          setLoading(false);
          return;
        }

        const newUser = { ...formData };
        users.push(newUser);
        localStorage.setItem("studymate_users", JSON.stringify(users));

        setSuccess("Account created successfully! Redirecting...");
        setLoading(false);

        setTimeout(() => {
          setIsLogin(true);
          setSuccess("");
          setFormData(prev => ({ ...prev, password: "" }));
        }, 2000);
      }
    }, 1000);
  };

  // While checking localStorage, show a clean background or loader
  if (isMounting) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background text-text transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      <main className="w-full max-w-sm md:max-w-4xl h-auto md:h-[600px] glass-panel rounded-3xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden border border-white/10">
        <AuthHero
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setError={setError}
          setSuccess={setSuccess}
        />

        <section className={`
          w-full md:w-1/2 p-8 md:p-12 bg-surface/80 backdrop-blur-sm flex flex-col justify-center
          transition-all duration-500 ease-in-out
          ${!isLogin ? "md:-translate-x-full" : "translate-x-0"}
        `}>
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-text mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-text-muted text-sm">
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