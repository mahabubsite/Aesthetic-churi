import React from 'react';
import { AestheticChuriLogo } from './PaymentLogos';
import { Phone, Heart, ShoppingCart, User } from 'lucide-react';

interface NavbarProps {
  onContactClick: () => void;
  onProfileClick: () => void;
  onTrackOrderClick: () => void;
  onProductsClick?: () => void;
  onSavedBanglesClick?: () => void;
  onCartClick?: () => void;
  orderCount?: number;
  savedCount?: number;
  cartCount?: number;
  logoUrl?: string;
  headerLogoUrl?: string;
  siteName?: string;
  hotlinePhone?: string;
  whatsappNumber?: string;
  announcementText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onContactClick,
  onProfileClick,
  onTrackOrderClick,
  onProductsClick,
  onSavedBanglesClick,
  onCartClick,
  orderCount = 0,
  savedCount = 0,
  cartCount = 0,
  logoUrl,
  headerLogoUrl,
  siteName,
  hotlinePhone = '+8801516-566277',
  whatsappNumber = '8801516566277',
  announcementText = 'আজকের স্পেশাল অফার: যেকোনো ২টি চুড়ি সেটে ফ্রি প্রিমিয়াম গিফট বক্স!',
}) => {
  const effectiveLogo = headerLogoUrl || logoUrl || '/churilogo.png';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      {/* 0. Top Bar: Announcement Notice Only (User request: "site top bar live preview te shudhu notice ta thakbe onno kisu thakbena.") */}
      <div className="bg-[#4a0e1e] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-[#5f1328]">
        <div className="max-w-6xl mx-auto flex items-center justify-center text-center">
          <div className="flex items-center gap-2 overflow-hidden max-w-full">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded tracking-wide shrink-0 shadow-xs">
              📢 নোটিস
            </span>
            <p className="truncate font-semibold text-rose-100 tracking-wide text-xs">
              {announcementText}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Brand Zone: Separate Header / Top Logo */}
        <a href="#hero" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
          <AestheticChuriLogo logoUrl={effectiveLogo} name={siteName} className="h-9 sm:h-11 md:h-12" />
        </a>

        {/* Action Zone: Clean Mobile Icons with Floating Top Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Wishlist Button */}
          <button
            onClick={onSavedBanglesClick}
            type="button"
            className={`relative w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-90 ${
              savedCount > 0
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-600'
            }`}
            title="পছন্দের চুড়ি তালিকা (Wishlist)"
            aria-label={`Wishlist (${savedCount} items)`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                savedCount > 0 ? 'text-rose-600 fill-rose-600' : 'text-slate-600'
              }`}
            />
            <span className="hidden sm:inline font-bold text-xs">Wishlist</span>

            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black flex items-center justify-center shadow-xs border-2 border-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            type="button"
            className={`relative w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-90 ${
              cartCount > 0
                ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                : 'bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-600'
            }`}
            title="শপিং কার্ট (Cart)"
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingCart
              className={`w-4 h-4 ${cartCount > 0 ? 'text-amber-950 stroke-[2.2]' : 'text-slate-600'}`}
            />
            <span className="hidden sm:inline font-bold text-xs">Cart</span>

            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-black flex items-center justify-center shadow-xs border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Profile & Auto Account Button (User request: "যোগাযোগ করুন eta mobile version e cart er side theke soriye deo er jaygay profile icon deo.") */}
          <button
            onClick={onProfileClick}
            type="button"
            className="relative w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-900 transition-all duration-200 cursor-pointer shadow-xs active:scale-90"
            title="আপনার প্রোফাইল, অর্ডার হিস্টোরি ও পলিসি"
            aria-label="Profile"
          >
            <User className="w-4 h-4 text-[#551627]" />
            <span className="hidden sm:inline font-bold text-xs text-[#551627]">প্রোফাইল</span>
          </button>

          {/* Hotline Link (Tablet+) */}
          {hotlinePhone && (
            <a
              href={`tel:${hotlinePhone.replace(/[^\d+]/g, '')}`}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#551627] transition-colors px-1 py-1"
              title="হটলাইন কল করুন"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono">{hotlinePhone}</span>
            </a>
          )}

        </div>
      </div>
    </header>
  );
};
