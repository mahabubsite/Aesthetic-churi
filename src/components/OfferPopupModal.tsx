import React, { useState, useEffect } from 'react';
import { Sparkles, X, Gift, ArrowRight } from 'lucide-react';
import { StoreSettings } from '../data/settings';

interface OfferPopupModalProps {
  settings: StoreSettings;
  forceOpen?: boolean;
  onCloseTest?: () => void;
  onActionClick?: () => void;
}

export const OfferPopupModal: React.FC<OfferPopupModalProps> = ({
  settings,
  forceOpen = false,
  onCloseTest,
  onActionClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (!settings.promoPopupEnabled) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem('cdb_promo_popup_dismissed');
      if (!dismissed) {
        // Show after a gentle 1.5 second delay on page visit
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, [settings.promoPopupEnabled, forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (forceOpen && onCloseTest) {
      onCloseTest();
    }
    try {
      sessionStorage.setItem('cdb_promo_popup_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleAction = () => {
    handleClose();
    if (onActionClick) {
      onActionClick();
    } else if (settings.promoPopupButtonUrl) {
      if (settings.promoPopupButtonUrl.startsWith('#')) {
        const el = document.querySelector(settings.promoPopupButtonUrl);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = settings.promoPopupButtonUrl;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-400/40 overflow-hidden transform transition-all animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
          aria-label="পপআপ বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Optional Custom Image Header */}
        {settings.promoPopupImage ? (
          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
            <img
              src={settings.promoPopupImage}
              alt={settings.promoPopupTitle || 'স্পেশাল অফার'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1611591475879-11442168926b?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Gift className="w-3.5 h-3.5" />
                সীমিত সময়ের অফার
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#4a0e1e] via-[#65152c] to-[#3a0815] text-white p-6 text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform rotate-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="inline-block bg-white/20 text-amber-300 font-black text-[11px] px-3 py-0.5 rounded-full mb-1">
              🎉 বিশেষ আকর্ষণ
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 text-center space-y-3">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
            {settings.promoPopupTitle || 'স্পেশাল অফার ঘোষণা!'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {settings.promoPopupText ||
              'যেকোনো ২টি চুড়ি অর্ডার করলেই পাচ্ছেন স্পেশাল প্রিমিয়াম গিফট বক্স সম্পূর্ণ ফ্রি! স্টক সীমিত, এখনই বুকিং দিন।'}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleAction}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{settings.promoPopupButtonText || 'অফারটি উপভোগ করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer py-1"
            >
              এখন নয়, পরে দেখব
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
