import React from 'react';
import { X, GlassWater, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface UsageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderClick: () => void;
}

export const UsageGuideModal: React.FC<UsageGuideModalProps> = ({
  isOpen,
  onClose,
  onOrderClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#5a1427] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <GlassWater className="w-5 h-5 text-amber-300" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              বিটরুট পাউডার সেবন বিধি
            </h3>
          </div>
          <p className="text-xs text-rose-200">
            সর্বোচ্চ স্বাস্থ্য উপকারিতা পেতে যেভাবে পান করবেন
          </p>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700">
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
              <div className="w-7 h-7 rounded-full bg-[#5a1427] text-white flex items-center justify-center text-xs font-bold shrink-0">
                ১
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">উপাদান মিশ্রণ:</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  এক গ্লাস (২০০ মিলি) কুসুম গরম পানি, হালকা দুধ অথবা যেকোনো ফলের জুস নিন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
              <div className="w-7 h-7 rounded-full bg-[#5a1427] text-white flex items-center justify-center text-xs font-bold shrink-0">
                ২
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">পরিমাণ:</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  ১ চা চামচ (প্রায় ৫ গ্রাম) হীরামন স্প্রে ড্রাইড বিটরুট পাউডার পানিতে ভালো করে গুলিয়ে নিন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
              <div className="w-7 h-7 rounded-full bg-[#5a1427] text-white flex items-center justify-center text-xs font-bold shrink-0">
                ৩
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">সেবনের সেরা সময়:</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  প্রতিদিন সকালে নাস্তার ৩০ মিনিট আগে খালি পেটে অথবা সন্ধ্যায় ব্যায়ামের পূর্বে সেবন করা সবচেয়ে বেশি ফলপ্রসূ।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-950 text-xs">বিশেষ টিপস:</h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  স্বাদ আরও মনমুগ্ধকর করতে এর সাথে আধা চা চামচ খাঁটি মধু অথবা কয়েক ফোঁটা লেবুর রস মিশিয়ে নিতে পারেন।
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOrderClick();
              }}
              type="button"
              className="w-full py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md"
            >
              এখনই অর্ডার করুন
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
