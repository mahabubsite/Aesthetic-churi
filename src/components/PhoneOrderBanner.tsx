import React from 'react';
import { PhoneCall, MessageCircle } from 'lucide-react';

interface PhoneOrderBannerProps {
  onCallClick: () => void;
  whatsappNumber?: string;
}

export const PhoneOrderBanner: React.FC<PhoneOrderBannerProps> = ({ onCallClick, whatsappNumber }) => {
  const cleanWa = (whatsappNumber || '8801516566277').replace(/[^\d]/g, '');
  const formattedWa = cleanWa.startsWith('880') ? cleanWa : cleanWa.startsWith('0') ? `88${cleanWa}` : `880${cleanWa}`;
  return (
    <section className="py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Banner with Glowing Border */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#501323] via-[#631429] to-[#501323] p-7 md:p-9 text-center shadow-xl border-2 border-amber-500/80 shadow-amber-900/15 overflow-hidden">
          
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-normal">
              ফোনে চুড়ি অর্ডার করুন অথবা সাইজ জানতে কল করুন
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={onCallClick}
                type="button"
                className="inline-flex items-center justify-center gap-2 px-8 py-2.5 sm:py-3 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 text-base sm:text-lg font-bold rounded-full shadow-md transition-all duration-200 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5 text-[#551627]" />
                <span>ফোন করুন</span>
              </button>

              <a
                href={`https://wa.me/${formattedWa}?text=I%20want%20to%20order%20Aesthetic%20Customized%20Churi`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm sm:text-base font-bold rounded-full shadow-md transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span>হোয়াটসঅ্যাপে সাইজ ও ছবি পাঠান</span>
              </a>
            </div>

            <p className="text-xs text-rose-200/90 font-medium">
              সকাল ৯টা থেকে রাত ১০টা পর্যন্ত আমাদের নারী কাস্টমার সাপোর্ট টিম সহায়তার জন্য প্রস্তুত
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
