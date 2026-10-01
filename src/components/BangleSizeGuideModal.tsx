import React from 'react';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

interface BangleSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreClick: () => void;
}

export const BangleSizeGuideModal: React.FC<BangleSizeGuideModalProps> = ({
  isOpen,
  onClose,
  onExploreClick,
}) => {
  if (!isOpen) return null;

  const sizes = [
    { size: '২-২ (2.2)', diameter: '২.১২৫ ইঞ্চি / ৫৪ মিমি', wrist: 'খুব ছোট / শিশুদের হাত' },
    { size: '২-৪ (2.4)', diameter: '২.২৫ ইঞ্চি / ৫৭ মিমি', wrist: 'ছোট / স্লিম হাত' },
    { size: '২-৬ (2.6)', diameter: '২.৩৭৫ ইঞ্চি / ৬০ মিমি', wrist: 'স্ট্যান্ডার্ড / মাঝারি হাত (সর্বাধিক প্রচলিত)' },
    { size: '২-৮ (2.8)', diameter: '২.৫ ইঞ্চি / ৬৩.৫ মিমি', wrist: 'বড় হাত' },
    { size: '২-১০ (2.10)', diameter: '২.৬২৫ ইঞ্চি / ৬৬.৭ মিমি', wrist: 'অতিরিক্ত বড় হাত' },
  ];

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
            <Ruler className="w-5 h-5 text-amber-300" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              চুড়ির সাইজ মাপার সঠিক নিয়ম
            </h3>
          </div>
          <p className="text-xs text-rose-200">
            ঘরে বসেই স্কেল বা ফিতা দিয়ে আপনার হাতের পারফেক্ট চুড়ির সাইজ জেনে নিন
          </p>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700">
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
              <div className="w-6 h-6 rounded-full bg-[#5a1427] text-white flex items-center justify-center text-xs font-bold shrink-0">
                ১
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">পুরাতন চুড়ি মেপে:</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  আপনার পূর্বে পরা যেকোনো আরামদায়ক চুড়ির ভিতরের ব্যাস (Inner Diameter) স্কেল দিয়ে ইঞ্চি বা মিলিমিটারে মাপুন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
              <div className="w-6 h-6 rounded-full bg-[#5a1427] text-white flex items-center justify-center text-xs font-bold shrink-0">
                ২
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">হাতের কব্জি মেপে:</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  হাত মুষ্টিবদ্ধ করে আঙুলের গোড়ায় ফিতা পেঁচিয়ে পরিধি বের করুন।
                </p>
              </div>
            </div>
          </div>

          {/* Size Chart Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 grid grid-cols-3">
              <span>চুড়ির সাইজ</span>
              <span>ভিতরের ব্যাস</span>
              <span>কার জন্য প্রযোজ্য</span>
            </div>
            <div className="divide-y divide-slate-100">
              {sizes.map((s, idx) => (
                <div key={idx} className="grid grid-cols-3 p-2.5 hover:bg-rose-50/40">
                  <span className="font-bold text-[#5a1427]">{s.size}</span>
                  <span className="text-slate-600">{s.diameter}</span>
                  <span className="text-slate-700 font-medium">{s.wrist}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onExploreClick();
              }}
              type="button"
              className="w-full py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md"
            >
              কালেকশন দেখে অর্ডার করুন
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
