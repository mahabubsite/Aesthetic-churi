import React from 'react';

export const BenefitsPromoCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border-4 border-emerald-900/20 bg-gradient-to-b from-emerald-950/20 to-amber-950/40 p-4 shadow-xl ${className}`}>
      {/* Outer Card Frame matching screenshot */}
      <div className="relative rounded-xl overflow-hidden bg-white shadow-inner flex flex-col aspect-square max-w-[460px] mx-auto">
        
        {/* Top Header Banner matching screenshot */}
        <div className="bg-[#1b4421] text-white py-2.5 px-3 text-center shadow-md z-10">
          <p className="text-xs md:text-sm font-semibold text-emerald-100">
            ত্বকে উজ্জ্বলতা, শরীরে শক্তি যোগায়
          </p>
          <p className="text-xs md:text-sm font-bold text-amber-300">
            স্প্রে ড্রাইড বিটরুট পাউডার
          </p>
        </div>

        {/* Center Graphic Showcase: Jars, Fresh Beets, and Juice */}
        <div className="relative flex-1 bg-gradient-to-b from-amber-50 via-rose-50/40 to-amber-100 flex items-center justify-center p-3 overflow-hidden">
          
          {/* Subtle wooden texture gradient at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#8d5b36] via-[#b37748] to-transparent opacity-80" />
          {/* Table surface line */}
          <div className="absolute bottom-1/3 inset-x-0 h-1 bg-[#6c401f] opacity-40 shadow-sm" />

          {/* SVG Illustration of Jars Arrangement + Juice Glass */}
          <svg viewBox="0 0 400 320" className="w-full h-full relative z-10">
            <defs>
              {/* Juice gradient */}
              <linearGradient id="juiceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9f1239" />
                <stop offset="50%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4c0519" />
              </linearGradient>
            </defs>

            {/* Background Warm Glow */}
            <circle cx="200" cy="130" r="100" fill="#fef3c7" opacity="0.6" filter="blur(20px)" />

            {/* Left Background Jar */}
            <g transform="translate(65, 80) scale(0.65)" opacity="0.9">
              <rect x="20" y="50" width="100" height="120" rx="14" fill="#600b21" />
              <rect x="25" y="60" width="90" height="75" fill="#ffffff" rx="4" />
              <text x="70" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#881337">Beetroot</text>
              <rect x="35" y="30" width="70" height="22" rx="4" fill="#3f7e1b" />
            </g>

            {/* Right Background Jar */}
            <g transform="translate(245, 80) scale(0.65)" opacity="0.9">
              <rect x="20" y="50" width="100" height="120" rx="14" fill="#600b21" />
              <rect x="25" y="60" width="90" height="75" fill="#ffffff" rx="4" />
              <text x="70" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#881337">Beetroot</text>
              <rect x="35" y="30" width="70" height="22" rx="4" fill="#3f7e1b" />
            </g>

            {/* Main Center Jar */}
            <g transform="translate(135, 70)">
              {/* Jar Shadow */}
              <ellipse cx="65" cy="180" rx="60" ry="12" fill="#3f1f0a" opacity="0.5" filter="blur(4px)" />
              {/* Powder body */}
              <rect x="15" y="45" width="100" height="130" rx="16" fill="#780f2b" />
              {/* White Label */}
              <rect x="20" y="60" width="90" height="85" fill="#ffffff" rx="4" />
              <ellipse cx="65" cy="74" rx="20" ry="8" fill="#fff" stroke="#e11d48" strokeWidth="1" />
              <text x="65" y="77" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#9f1239">Hiramon</text>
              <text x="65" y="96" textAnchor="middle" fontFamily="'Brush Script MT', cursive, serif" fontSize="16" fontWeight="bold" fill="#881337">Beetroot</text>
              <text x="65" y="110" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">বিটরুট পাউডার</text>
              {/* Expiry badge */}
              <text x="30" y="125" fontSize="4.5" fill="#64748b" fontWeight="600">October 2025</text>
              <text x="30" y="132" fontSize="4.5" fill="#64748b" fontWeight="600">October 2027</text>
              {/* Green Cap */}
              <rect x="30" y="24" width="70" height="23" rx="4" fill="#4d9426" stroke="#2e6316" strokeWidth="1" />
              <line x1="30" y1="36" x2="100" y2="36" stroke="#68bf38" strokeWidth="1.5" />
            </g>

            {/* Glass of Beetroot Juice on Left */}
            <g transform="translate(25, 140)">
              <ellipse cx="30" cy="115" rx="25" ry="6" fill="#2d0510" opacity="0.4" />
              {/* Glass Shape */}
              <path d="M 12,25 L 18,110 C 18,116 42,116 42,110 L 48,25 Z" fill="url(#juiceGrad)" opacity="0.95" />
              <ellipse cx="30" cy="25" rx="18" ry="4" fill="#be123c" />
              <path d="M 15,35 L 20,105" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
              {/* Fresh mint garnish */}
              <path d="M 28,25 C 24,15 32,10 38,18 C 34,22 30,24 28,25 Z" fill="#22c55e" />
            </g>

            {/* Fresh Cut Beetroots on Wooden Surface */}
            <g transform="translate(245, 180)">
              {/* Whole bulb */}
              <ellipse cx="35" cy="45" rx="24" ry="20" fill="#4c0618" />
              {/* Leaves */}
              <path d="M 35,30 C 35,15 45,5 55,-5" stroke="#be123c" strokeWidth="2.5" fill="none" />
              <path d="M 55,-5 C 65,-12 75,-5 70,5 C 65,10 58,5 55,-5 Z" fill="#15803d" />
              {/* Slice */}
              <ellipse cx="10" cy="55" rx="22" ry="14" fill="#881337" stroke="#e11d48" strokeWidth="1" />
              <ellipse cx="10" cy="55" rx="14" ry="9" fill="none" stroke="#fb7185" strokeWidth="1" opacity="0.7" />
              <circle cx="10" cy="55" r="4" fill="#fb7185" />
            </g>
          </svg>

          {/* 100% Organic & Natural Seal Badge (Bottom Right matching screenshot) */}
          <div className="absolute bottom-10 right-4 z-20 flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-emerald-400 bg-emerald-800 text-white shadow-lg p-1 text-center scale-95">
            <span className="text-[12px] font-black leading-tight text-amber-300">100%</span>
            <span className="text-[7.5px] font-extrabold uppercase tracking-tight text-white">ORGANIC</span>
            <span className="text-[6.5px] font-semibold text-emerald-200">NATURAL</span>
          </div>

          {/* Small packet badge bottom-left */}
          <div className="absolute bottom-8 left-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md shadow-sm border border-slate-200 text-[10px] font-bold text-rose-900">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            প্রিমিয়াম কোয়ালিটি
          </div>
        </div>

        {/* Footer Link matching screenshot */}
        <div className="bg-[#123117] text-white py-1.5 px-3 text-center text-[11px] font-medium tracking-wide">
          www.hiramonfood.com
        </div>
      </div>
    </div>
  );
};
