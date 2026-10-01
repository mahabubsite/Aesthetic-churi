import React from 'react';

export const BeetrootIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Green Beet Leaves */}
    <path
      d="M22 22C20 14 14 8 8 6C6 14 12 20 20 22"
      fill="#16A34A"
      stroke="#15803D"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 10L19 19" stroke="#BE123C" strokeWidth="1.2" strokeLinecap="round" />

    <path
      d="M26 22C28 14 34 8 40 6C42 14 36 20 28 22"
      fill="#15803D"
      stroke="#166534"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M36 10L29 19" stroke="#BE123C" strokeWidth="1.2" strokeLinecap="round" />

    <path
      d="M24 20C24 11 22 5 24 2C26 5 28 11 26 20"
      fill="#22C55E"
      stroke="#16A34A"
      strokeWidth="1.2"
    />

    {/* Beetroot Bulb */}
    <path
      d="M24 18C15 18 10 24 10 32C10 40 22 45 24 47C26 45 38 40 38 32C38 24 33 18 24 18Z"
      fill="#881337"
    />
    {/* Bulb Highlight */}
    <path
      d="M17 26C15 30 15 36 19 40"
      stroke="#BE123C"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Concentric subtle rings */}
    <path
      d="M23 23C18 25 14 31 16 37"
      stroke="#E11D48"
      strokeWidth="1"
      opacity="0.6"
      strokeLinecap="round"
    />
    <circle cx="28" cy="27" r="1.5" fill="#FB7185" opacity="0.8" />
  </svg>
);
