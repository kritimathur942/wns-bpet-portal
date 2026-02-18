"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // We keep the field for UI realism
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 'credentials' matches the ID we set in [...nextauth]
    const result = await signIn("credentials", {
      email: email.toLowerCase(),
      password: password,
      redirect: false, // We handle redirect manually to show errors
    });

    if (result?.error) {
      setError("Unauthorized. Please use your WNS BPET credentials.");
      setLoading(false);
    } else {
      // Success! Send Kriti to the dashboard
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-10">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="bg-[#003366] h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <Building2 className="text-white h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">WNS Global</h1>
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">BPET Operations Portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Corporate Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="kriti.bpet@wns.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-[10px] font-medium leading-relaxed">
              Authorized Personnel Only.<br />
              System access is monitored for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}