import { BookOpen, ArrowRight } from "lucide-react";

export default function AuthHero({ isLogin, setIsLogin, setError, setSuccess }) {
    return (
        <section className={`
      relative w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between 
      bg-gradient-to-br from-indigo-600 to-violet-600 text-white
      transition-all duration-500 ease-in-out z-10
      ${!isLogin ? "md:translate-x-full" : "translate-x-0"}
    `}>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">StudyMate</h1>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold leading-tight">
                        {isLogin ? "Welcome Back!" : "Join the Community"}
                    </h2>
                    <p className="text-indigo-100/90 text-lg leading-relaxed">
                        {isLogin
                            ? "Your AI tutor is ready to help you master your subjects. Let's pick up where we left off."
                            : "Start your journey towards academic excellence with personalized AI assistance."}
                    </p>
                </div>
            </div>

            <div className="relative z-10 pt-12 text-center md:text-left">
                <button
                    onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
                    className="group flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-3 rounded-full transition-all w-fit mx-auto md:mx-0"
                >
                    {isLogin ? "Create an Account" : "I have an Account"}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Abstract Shapes */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-50"></div>
        </section>
    );
}
