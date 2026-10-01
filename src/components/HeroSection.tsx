import React from 'react';
import { BanglesHeroPodium } from './BanglesHeroPodium';
import { Sparkles, ShieldCheck, Gem, Gift } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  heroSquareImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, heroSquareImage }) => {
  return (
    <section id="hero" className="relative overflow-hidden hero-pattern text-white pt-6 pb-8 md:pt-10 md:pb-12">
      {/* Background Decorative Sparkles & Bokeh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-6 w-28 h-28 rounded-full bg-rose-950/80 border border-amber-600/30 blur-xs" />
        <div className="absolute -top-12 right-1/4 w-40 h-40 rounded-full bg-amber-900/40 border border-amber-500/30 blur-xs" />
        <div className="absolute -bottom-8 left-1/3 w-32 h-32 rounded-full bg-rose-950/70 border border-rose-600/40 blur-xs" />
        <div className="absolute top-1/4 right-10 w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping opacity-70" />
        <div className="absolute top-2/3 left-10 w-2.5 h-2.5 rounded-full bg-amber-200 animate-pulse opacity-60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
          
          {/* Left Column: Bengali Headline & Copy tailored to Bangles (order-2 on mobile, order-1 on desktop) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left order-2 lg:order-1">
            
            {/* Brand Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400/15 text-amber-300 rounded-full text-xs sm:text-sm font-bold border border-amber-400/40 backdrop-blur-xs shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Aesthetic customized churi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#facc15] leading-[1.25] tracking-tight">
              হাতের ছোঁয়াতেই প্রকাশ পাক
              <br />
              <span className="text-[#facc15] drop-shadow-sm">আপনার স্টাইল 💃</span>
            </h1>

            {/* Description Text with User's Exact Tagline */}
            <p className="text-slate-100 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal opacity-95">
              যেকোনো আউফিটের সাথে মিলিয়ে যেকোনো ডিজাইনের চুড়ি বানিয়ে নিন আমাদের সাথে। আসল কাচের রেশমি চুড়ি, ১ গ্রাম গোল্ড প্লেটেড জয়পুরী কাড়া এবং গর্জিয়াস ব্রাইডাল চুড়া সেট।
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClick}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-3.5 text-lg font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 rounded-full shadow-lg shadow-red-900/40 transition-all duration-200 cursor-pointer border border-red-500/40"
              >
                <Gem className="w-5 h-5 text-amber-300" />
                <span>চুড়ি কালেকশন দেখুন</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-rose-200/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ক্যাশ অন ডেলিভারি ও গিফট বক্স প্যাকিং</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-rose-900/60 grid grid-cols-3 gap-2 text-center lg:text-left">
              <div>
                <p className="text-xl font-black text-amber-300">১০০%</p>
                <p className="text-xs text-rose-200">আসল ফিনিশিং</p>
              </div>
              <div>
                <p className="text-xl font-black text-amber-300">২৪-৪৮ ঘঃ</p>
                <p className="text-xs text-rose-200">সারাদেশে ডেলিভারি</p>
              </div>
              <div>
                <p className="text-xl font-black text-amber-300">১৫,০০০+</p>
                <p className="text-xs text-rose-200">খুশি কাস্টমার</p>
              </div>
            </div>

          </div>

          {/* Right Column: Royal Bangles on Golden Podium in Square Shape Frame (order-1 on mobile, order-2 on desktop) */}
          <div className="lg:col-span-6 flex justify-center items-center pt-1 lg:pt-0 order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-[290px] sm:max-w-[360px] lg:max-w-[410px] rounded-3xl bg-gradient-to-b from-[#350713]/80 via-[#22040b]/90 to-[#120206] p-3 sm:p-5 border-2 border-amber-400/40 shadow-2xl shadow-black/60 flex items-center justify-center overflow-hidden group">
              {/* Corner Ornamental Gold Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-300/80 rounded-tl" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-300/80 rounded-tr" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-300/80 rounded-bl" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-300/80 rounded-br" />

              {/* Bangles on 3D Square Podium or Uploaded Hero Square Image */}
              {heroSquareImage ? (
                <img
                  src={heroSquareImage}
                  alt="Royal Bangles"
                  className="w-full h-full object-cover rounded-2xl scale-100 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <BanglesHeroPodium className="w-full h-full scale-100 group-hover:scale-105 transition-transform duration-500" />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
