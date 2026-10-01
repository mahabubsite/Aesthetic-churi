import React from 'react';

interface BangleIllustrationProps {
  type?: string;
  className?: string;
}

export const BangleIllustration: React.FC<BangleIllustrationProps> = ({
  type = 'golden-velvet',
  className = 'w-full h-full',
}) => {
  return (
    <div className={`relative flex items-center justify-center p-3 select-none overflow-hidden ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-transparent rounded-2xl pointer-events-none" />

      <svg viewBox="0 0 260 220" className="w-full h-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105">
        <defs>
          {/* Gold Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="25%" stopColor="#E5B942" />
            <stop offset="50%" stopColor="#FFF6CC" />
            <stop offset="75%" stopColor="#C99424" />
            <stop offset="100%" stopColor="#8A5C0E" />
          </linearGradient>

          {/* Deep Ruby / Maroon Gradient */}
          <linearGradient id="rubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="50%" stopColor="#9F1239" />
            <stop offset="100%" stopColor="#4C0519" />
          </linearGradient>

          {/* Emerald Gradient */}
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Glass Gloss */}
          <linearGradient id="glassGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>

          {/* Silver Gradient */}
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="40%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* Stack of Bangles (3D Angled Cylindrical Stack) */}
        <g transform="translate(130, 110) rotate(-15)">
          
          {/* Cast Shadow */}
          <ellipse cx="0" cy="55" rx="75" ry="18" fill="#1e1b18" opacity="0.25" filter="blur(6px)" />

          {/* Layer 1 (Bottom Bangle) */}
          <ellipse cx="0" cy="30" rx="70" ry="24" fill="none" stroke={type.includes('silver') ? 'url(#silverGrad)' : 'url(#goldGrad)'} strokeWidth="10" />
          
          {/* Layer 2 */}
          <ellipse cx="0" cy="18" rx="70" ry="24" fill="none" stroke={type === 'emerald_gold' ? 'url(#emeraldGrad)' : type === 'silk_glass' || type === 'velvet_ruby' ? 'url(#rubyGrad)' : 'url(#goldGrad)'} strokeWidth="8" />

          {/* Layer 3 */}
          <ellipse cx="0" cy="6" rx="70" ry="24" fill="none" stroke={type === 'bridal_chuda' || type === 'shakha_pola' ? '#DC2626' : 'url(#goldGrad)'} strokeWidth="12" />
          {/* Gemstones / Pearls / Filigree dots on Layer 3 */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 25 * Math.PI) / 180;
            const x = Math.cos(angle) * 70;
            const y = 6 + Math.sin(angle) * 24;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={type === 'polki_kada' ? '#FFFBEB' : type === 'bridal_chuda' ? '#FEF08A' : '#FFFFFF'}
                stroke="#B45309"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Layer 4 */}
          <ellipse cx="0" cy="-6" rx="70" ry="24" fill="none" stroke={type === 'silk_glass' ? '#BE123C' : type.includes('emerald') ? 'url(#emeraldGrad)' : 'url(#goldGrad)'} strokeWidth="9" />

          {/* Layer 5 (Top Front Bangle with highest detail) */}
          <ellipse cx="0" cy="-20" rx="70" ry="24" fill="none" stroke={type.includes('silver') ? 'url(#silverGrad)' : 'url(#goldGrad)'} strokeWidth="11" />
          
          {/* Detailed Engravings / Kundan stones on top ring */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = Math.cos(angle) * 70;
            const y = -20 + Math.sin(angle) * 24;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="3.2" fill={type.includes('emerald') ? '#059669' : type.includes('ruby') || type.includes('bridal') ? '#9F1239' : '#FFFFFF'} stroke="#78350F" strokeWidth="0.8" />
                <circle cx={x - 0.8} cy={y - 0.8} r="1" fill="#FFFFFF" opacity="0.9" />
              </g>
            );
          })}

          {/* Latkan / Jhumka Hanging Detail if applicable */}
          {type === 'latkan_jhumka' && (
            <g transform="translate(45, 10)">
              <line x1="0" y1="0" x2="0" y2="35" stroke="#D4AF37" strokeWidth="1.8" />
              <circle cx="0" cy="12" r="2.5" fill="#DC2626" />
              <circle cx="0" cy="24" r="2.5" fill="#D4AF37" />
              {/* Jhumka Bell */}
              <path d="M -8,35 C -8,30 8,30 8,35 L 10,42 L -10,42 Z" fill="#D4AF37" stroke="#78350F" strokeWidth="0.8" />
              {/* Hanging pearls */}
              <circle cx="-6" cy="45" r="1.5" fill="#FFF" />
              <circle cx="0" cy="46" r="1.8" fill="#FFF" />
              <circle cx="6" cy="45" r="1.5" fill="#FFF" />
            </g>
          )}

          {/* Specular Sheen Over Whole Stack */}
          <ellipse cx="0" cy="-20" rx="66" ry="21" fill="none" stroke="url(#glassGloss)" strokeWidth="3" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};
