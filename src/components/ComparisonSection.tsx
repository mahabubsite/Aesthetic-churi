import React from 'react';
import { BanglesHeroPodium } from './BanglesHeroPodium';
import { XCircle, CheckCircle } from 'lucide-react';

interface ComparisonSectionProps {
  comparisonSquareImage?: string;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ comparisonSquareImage }) => {
  return (
    <section id="comparison" className="pt-8 pb-12 sm:pt-12 sm:pb-16 comparison-bg text-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose-900/20 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header with reduced compact spacing */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#facc15] tracking-tight mb-2">
            আমরা VS অন্যরা
          </h2>
          <p className="text-sm sm:text-base text-slate-100 font-normal">
            চলুন জেনে নেওয়া যাক সাধারণ বাজারের চুড়ি আর আমাদের প্রিমিয়াম চুড়ির মধ্যকার মূল পার্থক্য
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          
          {/* Left Card: "আমাদের চুড়ি" */}
          <div className="lg:col-span-4 h-full flex flex-col justify-center">
            <div className="rounded-2xl border-2 border-[#d49b38] bg-[#430f1e]/85 backdrop-blur-sm p-5 sm:p-6 shadow-xl shadow-black/20 hover:border-amber-400 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-[#facc15] text-center pb-3 mb-4 border-b border-amber-500/30">
                আমাদের চুড়ি
              </h3>

              <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-slate-100">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#facc15] mt-1.5 shrink-0 shadow-xs" />
                  <span>খাঁটি ব্রাস মেটাল ও আসল কাচের রেশমি টেক্সচার</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#facc15] mt-1.5 shrink-0 shadow-xs" />
                  <span>দীর্ঘস্থায়ী ১ গ্রাম গোল্ড প্লেটিং, সহজে রঙ নষ্ট হয় না</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#facc15] mt-1.5 shrink-0 shadow-xs" />
                  <span>নিখুঁত মসৃণ ফিনিশিং, কোনো ধারালো কিনারা নেই</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#facc15] mt-1.5 shrink-0 shadow-xs" />
                  <span>প্রিমিয়াম ভেলভেট গিফট বক্সে সুরক্ষিত প্যাকেজিং</span>
                </li>
              </ul>

              <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-center gap-1.5 text-xs text-amber-300 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>১০০% প্রিমিয়াম কোয়ালিটি গ্যারান্টিড</span>
              </div>
            </div>
          </div>

          {/* Center Column: Royal Bangles in Square Shape Frame (Matching User Request) */}
          <div className="lg:col-span-4 flex justify-center items-center py-2 lg:py-0 order-first lg:order-none">
            <div className="relative aspect-square w-full max-w-[250px] sm:max-w-[290px] lg:max-w-[320px] rounded-2xl bg-gradient-to-b from-[#350713]/85 via-[#22040b]/90 to-[#120206] p-3 border-2 border-amber-400/40 shadow-xl shadow-black/50 flex items-center justify-center overflow-hidden group">
              {/* Corner Ornamental Gold Accents */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-300/80 rounded-tl" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-300/80 rounded-tr" />
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-300/80 rounded-bl" />
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-300/80 rounded-br" />

              {/* 3D Square Stepped Podium Bangles or Uploaded Comparison Image */}
              {comparisonSquareImage ? (
                <img
                  src={comparisonSquareImage}
                  alt="Bangles Quality Compare"
                  className="w-full h-full object-cover rounded-xl scale-100 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <BanglesHeroPodium className="w-full h-full scale-100 group-hover:scale-105 transition-transform duration-300" />
              )}
            </div>
          </div>

          {/* Right Card: "বাজারের অন্যান্য চুড়ি" */}
          <div className="lg:col-span-4 h-full flex flex-col justify-center">
            <div className="rounded-2xl border-2 border-[#d49b38] bg-[#430f1e]/85 backdrop-blur-sm p-5 sm:p-6 shadow-xl shadow-black/20 hover:border-amber-400 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-[#facc15] text-center pb-3 mb-4 border-b border-amber-500/30">
                বাজারের অন্যান্য চুড়ি
              </h3>

              <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-red-400 text-sm leading-none font-bold mt-1">
                    ⊗
                  </span>
                  <span>নিম্নমানের পাতলা টিন বা পলিশ করা নকল প্লাস্টিক</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-red-400 text-sm leading-none font-bold mt-1">
                    ⊗
                  </span>
                  <span>সামান্য ঘাম বা পানিতেই দ্রুত রঙ বিবর্ণ ও কালচে হয়ে যায়</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-red-400 text-sm leading-none font-bold mt-1">
                    ⊗
                  </span>
                  <span>অসমান ধারালো কিনারা থাকায় হাত কেটে যাওয়ার ভয় থাকে</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="shrink-0 text-red-400 text-sm leading-none font-bold mt-1">
                    ⊗
                  </span>
                  <span>সাধারণ পলিব্যাগে পাঠানোয় পরিবহনে ভেঙে নষ্ট হয়</span>
                </li>
              </ul>

              <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-center gap-1.5 text-xs text-rose-300 font-semibold">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>টাকা ও সময়ের অপচয়</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
