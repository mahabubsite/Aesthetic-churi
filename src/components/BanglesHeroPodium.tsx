import React from 'react';

export const BanglesHeroPodium: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Ambient Warm Golden & Ruby Glow */}
      <div 
        className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(159, 18, 57, 0.45) 50%, transparent 75%)',
          filter: 'blur(30px)',
          bottom: '12%'
        }}
      />

      <svg
        viewBox="0 0 500 500"
        className="w-full max-w-[360px] sm:max-w-[420px] h-auto drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
      >
        <defs>
          {/* Gradients for Square Golden Stepped Podium */}
          <linearGradient id="podiumTopSquare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="25%" stopColor="#f5dd94" />
            <stop offset="50%" stopColor="#c59132" />
            <stop offset="75%" stopColor="#ffd875" />
            <stop offset="100%" stopColor="#966718" />
          </linearGradient>

          <linearGradient id="podiumLeftSideSquare" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#966718" />
            <stop offset="50%" stopColor="#63410b" />
            <stop offset="100%" stopColor="#3d2605" />
          </linearGradient>

          <linearGradient id="podiumRightSideSquare" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d8a642" />
            <stop offset="50%" stopColor="#a3731d" />
            <stop offset="100%" stopColor="#573a0c" />
          </linearGradient>

          <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FEF3C7" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="heroRubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="50%" stopColor="#9F1239" />
            <stop offset="100%" stopColor="#4C0519" />
          </linearGradient>

          <linearGradient id="velvetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="50%" stopColor="#4C0519" />
            <stop offset="100%" stopColor="#1E0108" />
          </linearGradient>
        </defs>

        {/* 1. 3D Square Stepped Gold Podium Platform (Under Shape) */}
        <g id="SquareGoldenPodium">
          {/* Base Cast Shadow */}
          <polygon
            points="250,445 460,380 250,320 40,380"
            fill="#120105"
            opacity="0.75"
            filter="blur(8px)"
          />

          {/* LOWER SQUARE STEP */}
          {/* Lower Step Left Side */}
          <polygon
            points="55,360 250,415 250,442 55,387"
            fill="url(#podiumLeftSideSquare)"
          />
          {/* Lower Step Right Side */}
          <polygon
            points="250,415 445,360 445,387 250,442"
            fill="url(#podiumRightSideSquare)"
          />
          {/* Lower Step Top Face */}
          <polygon
            points="250,335 445,360 250,415 55,360"
            fill="url(#podiumTopSquare)"
            stroke="#e5b854"
            strokeWidth="1"
          />

          {/* UPPER RAISED SQUARE STEP */}
          {/* Upper Step Left Side */}
          <polygon
            points="85,320 250,370 250,398 85,348"
            fill="url(#podiumLeftSideSquare)"
          />
          {/* Upper Step Right Side */}
          <polygon
            points="250,370 415,320 415,348 250,398"
            fill="url(#podiumRightSideSquare)"
          />
          {/* Upper Step Top Face */}
          <polygon
            points="250,290 415,320 250,370 85,320"
            fill="url(#podiumTopSquare)"
            stroke="#fff2b3"
            strokeWidth="1.5"
          />

          {/* Gold Edge Highlights on the Square Podium */}
          <line x1="85" y1="320" x2="250" y2="370" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
          <line x1="250" y1="370" x2="415" y2="320" stroke="#ffd875" strokeWidth="2" opacity="0.85" strokeLinecap="round" />
          <line x1="250" y1="370" x2="250" y2="398" stroke="#ffffff" strokeWidth="1.8" opacity="0.75" />

          {/* Royal Burgundy Velvet Square Cushion Mat on Top */}
          <polygon
            points="250,300 385,325 250,360 115,325"
            fill="url(#velvetGrad)"
            stroke="#be123c"
            strokeWidth="1.2"
          />
          {/* Stitched Gold Trim around Velvet Mat */}
          <polygon
            points="250,303 380,325 250,357 120,325"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.8"
            strokeDasharray="4 3"
          />
        </g>

        {/* 2. Royal Velvet Jewellery Cushion Stand */}
        <g id="VelvetDisplay" transform="translate(145, 95)">
          {/* Velvet Stand Shadow on Square Cushion */}
          <ellipse cx="105" cy="235" rx="85" ry="18" fill="#180105" opacity="0.8" filter="blur(4px)" />

          {/* Vertical Bangle Roll / Arm */}
          <rect x="70" y="80" width="70" height="145" rx="35" fill="url(#velvetGrad)" stroke="#9F1239" strokeWidth="1.5" />

          {/* Stack of Rich Royal Bangles on Display */}
          {/* Bangle 1 (Heavy Gold Bala at Bottom) */}
          <ellipse cx="105" cy="195" rx="68" ry="22" fill="none" stroke="url(#heroGoldGrad)" strokeWidth="14" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = 105 + Math.cos(angle) * 68;
            const y = 195 + Math.sin(angle) * 22;
            return <circle key={i} cx={x} cy={y} r="3" fill="#FFF" stroke="#78350F" strokeWidth="0.8" />;
          })}

          {/* Bangle 2 & 3 (Ruby Glass Bangles) */}
          <ellipse cx="105" cy="179" rx="66" ry="21" fill="none" stroke="url(#heroRubyGrad)" strokeWidth="7" />
          <ellipse cx="105" cy="167" rx="66" ry="21" fill="none" stroke="url(#heroRubyGrad)" strokeWidth="7" />

          {/* Bangle 4 (Gold Filigree Center Ring) */}
          <ellipse cx="105" cy="153" rx="67" ry="21" fill="none" stroke="url(#heroGoldGrad)" strokeWidth="10" />
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i * 36 * Math.PI) / 180;
            const x = 105 + Math.cos(angle) * 67;
            const y = 153 + Math.sin(angle) * 21;
            return <circle key={i} cx={x} cy={y} r="2.8" fill="#10B981" stroke="#78350F" strokeWidth="0.6" />;
          })}

          {/* Bangle 5 & 6 (Ruby Silk Bangles) */}
          <ellipse cx="105" cy="139" rx="66" ry="21" fill="none" stroke="url(#heroRubyGrad)" strokeWidth="7" />
          <ellipse cx="105" cy="127" rx="66" ry="21" fill="none" stroke="url(#heroRubyGrad)" strokeWidth="7" />

          {/* Bangle 7 (Top Crown Heavy Gold Bala) */}
          <ellipse cx="105" cy="111" rx="68" ry="22" fill="none" stroke="url(#heroGoldGrad)" strokeWidth="14" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = 105 + Math.cos(angle) * 68;
            const y = 111 + Math.sin(angle) * 22;
            return <circle key={i} cx={x} cy={y} r="3" fill="#FFF" stroke="#78350F" strokeWidth="0.8" />;
          })}

          {/* Latkan Jhumka hanging down from top bangle */}
          <g transform="translate(165, 120)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="0" cy="14" r="3" fill="#E11D48" />
            <circle cx="0" cy="28" r="3" fill="#F59E0B" />
            {/* Bell */}
            <path d="M -9,40 C -9,34 9,34 9,40 L 11,48 L -11,48 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
            <circle cx="-6" cy="52" r="1.8" fill="#FFF" />
            <circle cx="0" cy="53" r="2.2" fill="#FFF" />
            <circle cx="6" cy="52" r="1.8" fill="#FFF" />
          </g>

          {/* Top Cushion Cap */}
          <ellipse cx="105" cy="80" rx="35" ry="12" fill="#BE123C" stroke="#F43F5E" strokeWidth="1" />
        </g>

        {/* 3. Foreground Loose Bangles on the Square Platform */}
        <g id="ForegroundBangles" transform="translate(85, 305)">
          {/* Tilted Front Bangle */}
          <ellipse cx="65" cy="35" rx="42" ry="18" fill="none" stroke="url(#heroGoldGrad)" strokeWidth="8" transform="rotate(-22 65 35)" />
          <ellipse cx="65" cy="35" rx="38" ry="16" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeDasharray="6 8" transform="rotate(-22 65 35)" />
          
          {/* Loose Pearl beads on podium */}
          <circle cx="15" cy="42" r="3.5" fill="#FFF" stroke="#E5E7EB" strokeWidth="0.5" />
          <circle cx="26" cy="48" r="2.5" fill="#FFF" stroke="#E5E7EB" strokeWidth="0.5" />
          <circle cx="125" cy="45" r="3" fill="#FFF" stroke="#E5E7EB" strokeWidth="0.5" />
          <circle cx="136" cy="38" r="2" fill="#FFF" stroke="#E5E7EB" strokeWidth="0.5" />
        </g>

        {/* Sparkle Stars */}
        <g fill="#FFF" opacity="0.9">
          <path d="M 90,140 Q 90,150 80,150 Q 90,150 90,160 Q 90,150 100,150 Q 90,150 90,140 Z" fill="#FDE68A" />
          <path d="M 400,160 Q 400,170 390,170 Q 400,170 400,180 Q 400,170 410,170 Q 400,170 400,160 Z" fill="#FDE68A" />
          <path d="M 140,290 Q 140,298 132,298 Q 140,298 140,306 Q 140,298 148,298 Q 140,298 140,290 Z" fill="#FFF" />
          <path d="M 360,280 Q 360,288 352,288 Q 360,288 360,296 Q 360,288 368,288 Q 360,288 360,280 Z" fill="#FFF" />
        </g>
      </svg>
    </div>
  );
};
