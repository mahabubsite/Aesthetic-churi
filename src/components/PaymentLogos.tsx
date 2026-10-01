import React from 'react';

// Official bKash Logo SVG
export const BkashLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg viewBox="0 0 120 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 28L18 8L36 24L12 28Z" fill="#D12053" />
    <path d="M18 8L29 3L36 24L18 8Z" fill="#E2136E" />
    <path d="M29 3L44 8L36 24L29 3Z" fill="#F44382" />
    <path d="M44 8L47 20L36 24L44 8Z" fill="#C4165A" />
    <text x="50" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="18" fill="#E2136E" letterSpacing="-0.5px">
      bKash
    </text>
  </svg>
);

// Official Rocket (Dutch-Bangla Bank) Logo SVG
export const RocketLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg viewBox="0 0 120 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="30" height="30" rx="8" fill="#8C3494" />
    <path d="M17 10L22 17L19 17L19 25L15 25L15 17L12 17L17 10Z" fill="#FFFFFF" />
    <path d="M14 26L20 26L17 30L14 26Z" fill="#FFA500" />
    <text x="38" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="#8C3494">
      Rocket
    </text>
  </svg>
);

// Official Nagad Logo SVG
export const NagadLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg viewBox="0 0 120 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="20" r="14" fill="#F7941D" />
    <path d="M18 10C18 10 24 16 24 21C24 24.3 21.3 27 18 27C14.7 27 12 24.3 12 21C12 16 18 10 18 10Z" fill="#ED1C24" />
    <path d="M18 16C18 16 21 19 21 22C21 23.7 19.7 25 18 25C16.3 25 15 22 15 19 18 16 18 16Z" fill="#FEE589" />
    <text x="38" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="17" fill="#F7941D">
      নগদ
    </text>
  </svg>
);

// Official Upay Logo SVG
export const UpayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg viewBox="0 0 120 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="28" height="28" rx="8" fill="#005697" />
    <path d="M12 14v8a6 6 0 0 0 12 0v-8h-3.5v8a2.5 2.5 0 0 1-5 0v-8H12z" fill="#FCB913" />
    <circle cx="24" cy="14" r="2.5" fill="#FCB913" />
    <text x="38" y="26" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="17" fill="#005697">
      upay
    </text>
  </svg>
);

// Aesthetic customized churi Brand Logo
export const AestheticChuriLogo: React.FC<{ className?: string; logoUrl?: string; name?: string }> = ({
  className = 'h-9 sm:h-11',
  logoUrl = '/churilogo.png',
  name = 'Aesthetic customized churi',
}) => (
  <div className="flex items-center">
    <img
      src={logoUrl || '/churilogo.png'}
      alt={name}
      className={`h-9 sm:h-11 w-auto max-w-[190px] sm:max-w-[240px] object-contain transition-transform duration-200 hover:scale-102 ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/churilogo.png';
      }}
    />
  </div>
);

// Backward-compatibility alias
export const CdbBanglesLogo = AestheticChuriLogo;

// Protibha Tech Designer Credit Logo matching user request
export const ProtibhaTechLogo: React.FC<{ className?: string }> = ({ className = 'h-5' }) => (
  <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
    <div className="w-5 h-5 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-sm flex items-center justify-center text-white font-black text-[10px] shadow-xs">
      PT
    </div>
    <span className="font-bold tracking-wider text-xs text-white">
      Protibha <span className="text-amber-400 font-semibold">Tech</span>
    </span>
  </div>
);

// Cyber Developer BD Logo alias for compatibility
export const CyberDeveloperLogo = ProtibhaTechLogo;

// Dynamic Payment Method Icon with graceful fallback to built-in vector logos
export const PaymentMethodIcon: React.FC<{
  methodId: string;
  name?: string;
  iconUrl?: string;
  className?: string;
}> = ({ methodId, name = '', iconUrl, className = 'h-6 max-h-6 max-w-[80px] object-contain' }) => {
  const [hasError, setHasError] = React.useState(false);

  // If iconUrl is provided and not errored
  if (iconUrl && iconUrl.trim() !== '' && !hasError) {
    return (
      <img
        src={iconUrl.trim()}
        alt={name || methodId}
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback to high-quality vector SVGs
  const idLower = methodId.toLowerCase();
  if (idLower === 'bkash' || idLower.includes('বিকাশ')) return <BkashLogo className={className} />;
  if (idLower === 'nagad' || idLower.includes('নগদ')) return <NagadLogo className={className} />;
  if (idLower === 'rocket' || idLower.includes('রকেট')) return <RocketLogo className={className} />;
  if (idLower === 'upay' || idLower.includes('উপায়')) return <UpayLogo className={className} />;

  // Default Banknote / Cash icon
  return (
    <svg className="w-6 h-6 text-[#551627]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
};
