import React, { useState } from 'react';
import {
  Lock,
  X,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { StoreSettings } from '../data/settings';
import { signInAdminWithEmail, isAuthorizedAdmin, auth } from '../lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  settings: StoreSettings;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('robiuletc@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('অনুগ্রহ করে অ্যাডমিন জিমেইল এবং পাসওয়ার্ড দুটিই লিখুন।');
      setIsLoading(false);
      return;
    }

    try {
      // 1. First attempt: Direct Firebase Client Authentication (signInWithEmailAndPassword)
      try {
        const user = await signInAdminWithEmail(cleanEmail, cleanPassword);
        if (user && (isAuthorizedAdmin(user.email) || cleanEmail === 'robiuletc@gmail.com')) {
          setIsLoading(false);
          onSuccess();
          return;
        }
      } catch (clientAuthError: any) {
        console.warn('Firebase client sign-in error, falling back to Firebase backend verification:', clientAuthError.code || clientAuthError.message);
      }

      // 2. Second attempt: Verify with Firebase Admin SDK endpoint
      const response = await fetch('/api/admin/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // If server provided customToken, sign in client-side auth state
        if (data.customToken) {
          try {
            await signInWithCustomToken(auth, data.customToken);
          } catch {
            // ignore client token exchange if not critical
          }
        }
        setIsLoading(false);
        onSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg(data.error || 'ভুল জিমেইল অথবা পাসওয়ার্ড! সঠিক অ্যাডমিন তথ্য দিয়ে চেষ্টা করুন।');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Firebase অথেনটিকেশন যাচাইয়ে ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#440d1c] via-[#5a1427] to-[#2d0913] p-6 text-center relative border-b border-rose-950/60">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-3 shadow-lg shadow-black/40">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Firebase অ্যাডমিন সাইন ইন</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </h3>
          <p className="text-xs text-rose-200/80 mt-1 max-w-xs mx-auto">
            শুধুমাত্র অনুমোদিত জিমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন করুন
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>অ্যাডমিন জিমেইল (Admin Gmail)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="robiuletc@gmail.com"
                required
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>অ্যাডমিন পাসওয়ার্ড (Password)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার গোপন পাসওয়ার্ড লিখুন"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>সাইন ইন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
          Firebase Authentication দ্বারা সুরক্ষিত • পিন বা গুগল লগইন প্রযোজ্য নয়
        </div>
      </div>
    </div>
  );
};
