import React from 'react';

interface ProductJarPodiumProps {
  size?: 'normal' | 'large' | 'compact';
  className?: string;
}

export const ProductJarPodium: React.FC<ProductJarPodiumProps> = ({
  size = 'normal',
  className = '',
}) => {
  const scale = size === 'large' ? 1.15 : size === 'compact' ? 0.8 : 1.0;

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Ambient Glow behind podium */}
      <div 
        className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.25) 0%, rgba(136, 19, 55, 0.4) 50%, transparent 75%)',
          filter: 'blur(30px)',
          bottom: '10%'
        }}
      />

      <svg
        viewBox="0 0 500 500"
        className="w-full max-w-[420px] md:max-w-[480px] h-auto drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          {/* Gradients for Golden Podium */}
          <linearGradient id="podiumTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c59132" />
            <stop offset="30%" stopColor="#f7e19b" />
            <stop offset="50%" stopColor="#fffae0" />
            <stop offset="70%" stopColor="#eec667" />
            <stop offset="100%" stopColor="#b37f26" />
          </linearGradient>

          <linearGradient id="podiumSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c59132" />
            <stop offset="50%" stopColor="#966718" />
            <stop offset="100%" stopColor="#63410b" />
          </linearGradient>

          <linearGradient id="podiumBaseSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8d6216" />
            <stop offset="100%" stopColor="#462c05" />
          </linearGradient>

          {/* Glass & Powder Gradients */}
          <linearGradient id="powderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a0817" />
            <stop offset="25%" stopColor="#78112b" />
            <stop offset="50%" stopColor="#911434" />
            <stop offset="75%" stopColor="#6e0e26" />
            <stop offset="100%" stopColor="#440715" />
          </linearGradient>

          <linearGradient id="glassSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="95%" stopColor="rgba(255,255,255,0.35)" />
          </linearGradient>

          {/* Green Cap Gradients */}
          <linearGradient id="capGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e6316" />
            <stop offset="35%" stopColor="#559929" />
            <stop offset="50%" stopColor="#7cc947" />
            <stop offset="70%" stopColor="#4c8b23" />
            <stop offset="100%" stopColor="#255410" />
          </linearGradient>

          <linearGradient id="capRidge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#75c241" />
            <stop offset="100%" stopColor="#2a5c13" />
          </linearGradient>

          {/* Fresh Beetroot Gradients */}
          <radialGradient id="beetSliceCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b3123d" />
            <stop offset="45%" stopColor="#960d31" />
            <stop offset="75%" stopColor="#6b0722" />
            <stop offset="100%" stopColor="#3d0312" />
          </radialGradient>

          <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="0" dy="12" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Golden Stepped Podium Platform */}
        <g id="GoldenPodium" transform="translate(0, 50)">
          {/* Base Step Shadow */}
          <ellipse cx="250" cy="385" rx="210" ry="45" fill="#1f030a" opacity="0.6" filter="blur(6px)" />
          
          {/* Bottom Podium Cylinder */}
          <path d="M 55,340 C 55,370 445,370 445,340 L 445,365 C 445,395 55,395 55,365 Z" fill="url(#podiumBaseSide)" />
          <ellipse cx="250" cy="340" rx="195" ry="32" fill="url(#podiumTop)" stroke="#a1701b" strokeWidth="1" />

          {/* Top Raised Platform Cylinder */}
          <path d="M 75,320 C 75,348 425,348 425,320 L 425,338 C 425,366 75,366 75,338 Z" fill="url(#podiumSide)" />
          <ellipse cx="250" cy="320" rx="175" ry="28" fill="url(#podiumTop)" stroke="#f5dd94" strokeWidth="1.5" />
          
          {/* Specular highlight rim */}
          <path d="M 120,328 C 190,340 310,340 380,328" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.75" fill="none" />
        </g>

        {/* Jar Drop Shadow on Podium */}
        <ellipse cx="280" cy="345" rx="85" ry="22" fill="#2d040e" opacity="0.75" filter="blur(4px)" />

        {/* 2. Glass Jar & Powder Body */}
        <g id="BeetrootJar" transform="translate(160, 45)">
          {/* Jar Base Curve & Glass Body */}
          <rect x="35" y="100" width="165" height="195" rx="26" fill="url(#powderGradient)" />

          {/* Granular Texture Inside Powder */}
          <g opacity="0.25">
            <circle cx="55" cy="140" r="1.5" fill="#fca5a5" />
            <circle cx="95" cy="120" r="2" fill="#fff" />
            <circle cx="160" cy="150" r="1.5" fill="#fff" />
            <circle cx="80" cy="220" r="2" fill="#fecdd3" />
            <circle cx="140" cy="260" r="1.5" fill="#fca5a5" />
            <circle cx="170" cy="190" r="2" fill="#fff" />
            <circle cx="65" cy="270" r="1.5" fill="#fff" />
          </g>

          {/* Glass Shoulder taper to neck */}
          <path d="M 35,120 C 35,90 60,78 72,75 L 163,75 C 175,78 200,90 200,120 Z" fill="url(#powderGradient)" />
          
          {/* Product Label (White with Branding) */}
          <g id="JarLabel">
            {/* Label Background Paper with subtle curve */}
            <path d="M 40,118 C 110,126 130,126 195,118 L 195,248 C 130,256 110,256 40,248 Z" fill="#ffffff" />
            
            {/* Red accent ribbons */}
            <path d="M 40,118 C 110,126 130,126 195,118 L 195,123 C 130,131 110,131 40,123 Z" fill="#b91c1c" />
            <path d="M 40,243 C 110,251 130,251 195,243 L 195,248 C 130,256 110,256 40,248 Z" fill="#b91c1c" />

            {/* Hiramon Logo Emblem */}
            <g transform="translate(85, 127)">
              <ellipse cx="32" cy="14" rx="28" ry="11" fill="#fff" stroke="#e11d48" strokeWidth="1.2" />
              {/* Leaves in emblem */}
              <path d="M 14,14 C 18,7 26,9 26,14 C 26,19 18,21 14,14 Z" fill="#22c55e" />
              <path d="M 18,14 C 22,8 28,10 28,14 C 28,18 22,20 18,14 Z" fill="#15803d" />
              <text x="34" y="18" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="10" fill="#9f1239">
                Hiramon
              </text>
            </g>

            {/* Spray Dried Banner */}
            <g transform="translate(68, 155)">
              <rect x="0" y="0" width="100" height="13" rx="2" fill="#c026d3" opacity="0.1" />
              <text x="50" y="9.5" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="8.5" fill="#dc2626" letterSpacing="0.8px">
                Spray Dried
              </text>
            </g>

            {/* Beetroot Title */}
            <text x="118" y="185" textAnchor="middle" fontFamily="'Brush Script MT', cursive, serif" fontStyle="italic" fontWeight="bold" fontSize="22" fill="#881337">
              Beetroot
            </text>

            {/* Bengali Product Name */}
            <text x="118" y="202" textAnchor="middle" fontFamily="'Hind Siliguri', sans-serif" fontWeight="700" fontSize="13" fill="#1e293b">
              বিটরুট পাউডার
            </text>

            {/* Vegetarian Green Dot Logo */}
            <g transform="translate(176, 134)">
              <rect x="0" y="0" width="10" height="10" fill="none" stroke="#16a34a" strokeWidth="1" />
              <circle cx="5" cy="5" r="3" fill="#16a34a" />
            </g>

            {/* Batch & Expiry Micro-Text */}
            <g transform="translate(48, 215)" opacity="0.8">
              <text x="0" y="7" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="5.5" fill="#475569" fontWeight="600">
                October 2025
              </text>
              <text x="0" y="15" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="5.5" fill="#475569" fontWeight="600">
                October 2027
              </text>
            </g>

            {/* Net Weight */}
            <text x="175" y="228" textAnchor="end" fontFamily="'Hind Siliguri', sans-serif" fontSize="6.5" fill="#475569" fontWeight="bold">
              নেট ওজন : ২০০ গ্রাম
            </text>
          </g>

          {/* Glass Bottle Highlights & Specular Overlay */}
          <path d="M 35,100 L 35,290 C 45,296 55,296 65,296 L 65,100 Z" fill="url(#glassSpecular)" opacity="0.7" />
          <path d="M 180,100 L 180,296 C 190,296 195,293 200,290 L 200,100 Z" fill="url(#glassSpecular)" opacity="0.6" />
          
          {/* Glass Jar Neck */}
          <rect x="68" y="62" width="100" height="16" fill="url(#powderGradient)" />
          <rect x="68" y="62" width="100" height="16" fill="url(#glassSpecular)" opacity="0.5" />

          {/* 3. Textured Lime Green Screw Lid */}
          <g id="JarLid">
            {/* Lid Base Rim */}
            <ellipse cx="118" cy="74" rx="55" ry="8" fill="#1b410b" />
            <rect x="63" y="44" width="110" height="26" rx="4" fill="url(#capGreen)" />
            {/* Lid Grooves */}
            {Array.from({ length: 18 }).map((_, i) => (
              <line 
                key={i} 
                x1={67 + i * 5.8} 
                y1={46} 
                x2={67 + i * 5.8} 
                y2={68} 
                stroke="#3e7a1e" 
                strokeWidth="1.5" 
                opacity="0.6" 
              />
            ))}
            {/* Top Cap Ellipse */}
            <ellipse cx="118" cy="44" rx="55" ry="9" fill="url(#capGreen)" stroke="#74b93f" strokeWidth="1" />
            <ellipse cx="118" cy="44" rx="48" ry="7" fill="none" stroke="#a0e46d" strokeWidth="1" opacity="0.5" />
          </g>
        </g>

        {/* 3. Fresh Cut Beetroots at the Base (Foreground) */}
        <g id="FreshBeetroots" transform="translate(130, 240)">
          {/* Whole Beetroot Bulb */}
          <g transform="translate(45, 60)">
            <ellipse cx="50" cy="65" rx="36" ry="32" fill="#58081f" />
            <path d="M 50,96 C 48,110 44,120 40,126" stroke="#58081f" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Skin textures */}
            <path d="M 25,60 C 40,55 60,58 75,64" stroke="#831032" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M 30,75 C 45,70 65,72 72,78" stroke="#831032" strokeWidth="1.5" fill="none" opacity="0.6" />
            
            {/* Green Beet Leaves & Stems */}
            <path d="M 45,40 C 42,20 30,5 15, -15" stroke="#be123c" strokeWidth="3.5" fill="none" />
            <path d="M 52,38 C 55,18 70,0 85,-18" stroke="#be123c" strokeWidth="3" fill="none" />
            {/* Crisp Green Leaf blades */}
            <path d="M 15,-15 C 5,-28 10,-45 25,-40 C 35,-35 32,-18 20,-12 Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
            <path d="M 18,-28 L 22,-20" stroke="#be123c" strokeWidth="1.2" />
            <path d="M 85,-18 C 98,-32 115,-25 110,-10 C 105,5 92,-5 83,-15 Z" fill="#16a34a" stroke="#166534" strokeWidth="1" />
          </g>

          {/* Sliced Beetroot Disc with Concentric Rings */}
          <g transform="translate(0, 80)">
            <ellipse cx="48" cy="45" rx="34" ry="24" fill="#3d0413" />
            <ellipse cx="48" cy="43" rx="32" ry="22" fill="url(#beetSliceCenter)" stroke="#e11d48" strokeWidth="1.5" />
            {/* Concentric rings */}
            <ellipse cx="48" cy="43" rx="24" ry="16" fill="none" stroke="#fb7185" strokeWidth="1.2" opacity="0.6" strokeDasharray="6 3" />
            <ellipse cx="48" cy="43" rx="16" ry="10" fill="none" stroke="#f43f5e" strokeWidth="1.2" opacity="0.7" />
            <ellipse cx="48" cy="43" rx="8" ry="5" fill="#f43f5e" opacity="0.8" />
            {/* Specular sheen of fresh cut beet juice */}
            <path d="M 32,38 C 42,32 55,32 64,37" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" fill="none" />
          </g>

          {/* Scattered beet powder crumbs on podium */}
          <circle cx="15" cy="120" r="2.5" fill="#9f1239" opacity="0.8" />
          <circle cx="28" cy="128" r="1.5" fill="#e11d48" opacity="0.9" />
          <circle cx="85" cy="132" r="2" fill="#881337" opacity="0.7" />
          <circle cx="102" cy="125" r="1.5" fill="#be123c" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
};
