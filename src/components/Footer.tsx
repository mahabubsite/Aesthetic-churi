import React from 'react';
import { ProtibhaTechLogo, AestheticChuriLogo } from './PaymentLogos';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
  logoUrl?: string;
  footerLogoUrl?: string;
  siteName?: string;
  hotlinePhone?: string;
  whatsappNumber?: string;
  socialUrls?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export const Footer: React.FC<FooterProps> = ({
  onAdminClick,
  logoUrl,
  footerLogoUrl,
  siteName = 'Aesthetic customized churi',
  hotlinePhone = '+8801516-566277',
  whatsappNumber = '8801516566277',
  socialUrls,
}) => {
  const effectiveFooterLogo = footerLogoUrl || logoUrl || '/churilogo.png';
  const cleanWa = (whatsappNumber || '8801516566277').replace(/[^\d]/g, '');
  const formattedWa = cleanWa.startsWith('880') ? cleanWa : cleanWa.startsWith('0') ? `88${cleanWa}` : `880${cleanWa}`;

  const socialLinks = [
    {
      name: 'Facebook',
      url: socialUrls?.facebook || 'https://facebook.com',
      hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: socialUrls?.instagram || 'https://instagram.com',
      hoverColor: 'hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: socialUrls?.youtube || 'https://youtube.com',
      hoverColor: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: socialUrls?.tiktok || 'https://tiktok.com',
      hoverColor: 'hover:bg-[#000000] hover:border-[#00f2fe] hover:text-[#00f2fe]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/${formattedWa}?text=Hello%20Aesthetic%20customized%20churi`,
      hoverColor: 'hover:bg-[#25D366] hover:border-[#25D366]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 0C5.397 0 0 5.397 0 12.031c0 2.122.553 4.195 1.603 6.02L.055 24l6.128-1.607a12.007 12.007 0 0 0 5.848 1.513h.005c6.633 0 12.03-5.397 12.03-12.031 0-3.213-1.251-6.234-3.524-8.508C18.267 1.251 15.244 0 12.031 0zm0 22.029h-.004a9.98 9.98 0 0 1-5.088-1.39l-.365-.217-3.778.991 1.008-3.682-.237-.378a9.957 9.957 0 0 1-1.528-5.322c0-5.514 4.485-9.999 10.001-9.999 2.671 0 5.183 1.04 7.07 2.928a9.94 9.94 0 0 1 2.93 7.071c0 5.515-4.486 10-10.007 10zm5.478-7.485c-.3-.15-1.777-.877-2.052-.977-.275-.1-.475-.15-.675.15-.2.3-.775.977-.95 1.177-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.489-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.492-.505-.675-.515-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.899 1.225 3.099.15.2 2.115 3.23 5.124 4.529.716.309 1.275.493 1.71.632.72.229 1.375.197 1.893.119.578-.087 1.777-.726 2.027-1.427.25-.701.25-1.302.175-1.427-.075-.125-.275-.2-.575-.35z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#110508] text-white border-t border-rose-950/40 relative overflow-hidden">
      {/* Decorative subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-rose-900/10 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-white/10 text-xs sm:text-sm">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <Truck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">সারাদেশে হোম ডেলিভারি</span>
              <span className="text-[11px] text-slate-400">২৪ থেকে ৪৮ ঘণ্টায় পৌঁছে যাবে</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">১০০% প্রিমিয়াম ফিনিশিং</span>
              <span className="text-[11px] text-slate-400">খাঁটি ব্রাস ও রেশমি কাচ</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">সহজ রিটার্ন পলিসি</span>
              <span className="text-[11px] text-slate-400">সাইজ পরিবর্তন সুবিধা</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
            <Headphones className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">কাস্টমার সাপোর্ট</span>
              <span className="text-[11px] text-slate-400">সকাল ৯টা - রাত ১০টা</span>
            </div>
          </div>
        </div>

        {/* Middle Footer Section: Brand info + Social Links */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Brand Info */}
          <div className="max-w-md space-y-2.5">
            <div className="flex items-center justify-center md:justify-start">
              <img
                src={effectiveFooterLogo}
                alt={siteName}
                className="h-10 sm:h-12 w-auto max-w-[200px] object-contain drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/churilogo.png';
                }}
              />
            </div>
            <p className="text-xs text-rose-100/90 leading-relaxed font-normal">
              হাতের ছোঁয়াতেই প্রকাশ পাক আপনার স্টাইল। 💃 যেকোনো আউফিটের সাথে মিলিয়ে যেকোনো ডিজাইনের চুড়ি বানিয়ে নিন আমাদের সাথে।
            </p>
          </div>

          {/* Social Links matching request */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <span>সোশ্যাল মিডিয়ায় যুক্ত থাকুন</span>
            </span>

            {/* Social Icons list */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-full bg-white/10 hover:text-white border border-white/15 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-slate-300 shadow-sm ${social.hoverColor}`}
                  title={`${social.name} এ আমাদের ফলো করুন`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <p className="text-[11px] text-slate-400">
              নতুন ডিজাইন ও অফার জানতে আমাদের সোশ্যাল পেজে যুক্ত থাকুন
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Designer Credit */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="tracking-wide text-center sm:text-left">
            Copyright © 2026 <span className="font-bold text-white">{siteName}</span>. All Rights Reserved.
          </div>

          <div className="flex items-center gap-2">
            <span>Website Design By:</span>
            <ProtibhaTechLogo className="h-5" />
          </div>
        </div>

      </div>
    </footer>
  );
};
