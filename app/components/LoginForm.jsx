import { Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";

export default function LoginForm({ formData, setFormData, handleSubmit, loading, error, success }) {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                    type="email"
                    placeholder="Email Address"
                    required
                    aria-label="Email Address"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all text-sm text-white placeholder:text-slate-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    aria-label="Password"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all text-sm text-white placeholder:text-slate-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
            </div>

            {/* FEEDBACK MESSAGES */}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center animate-pulse" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 p-3 rounded-lg border border-green-500/20 justify-center" role="status">
                    <CheckCircle size={16} /> {success}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                aria-label="Sign In"
            >
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <>Sign In {!success && <ArrowRight size={18} />}</>}
            </button>
        </form>
    );
}
