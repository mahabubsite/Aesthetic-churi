import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface FloatingHotlineProps {
  onCallClick: () => void;
  whatsappNumber?: string;
  hotlinePhone?: string;
}

export const FloatingHotline: React.FC<FloatingHotlineProps> = ({ onCallClick, whatsappNumber, hotlinePhone }) => {
  const [isVisible, setIsVisible] = useState(true);

  const cleanWa = (whatsappNumber || '8801516566277').replace(/[^\d]/g, '');
  const formattedWa = cleanWa.startsWith('880') ? cleanWa : cleanWa.startsWith('0') ? `88${cleanWa}` : `880${cleanWa}`;

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // Show only while the hero section is visible in the viewport
        // Once scrolled past the hero section, rect.bottom goes above top of screen
        setIsVisible(rect.bottom > 80);
      } else {
        // Fallback: only show in top 400px of page
        setIsVisible(window.scrollY < 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col gap-2.5 items-end transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
      }`}
    >
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${formattedWa}?text=I%20want%20to%20order%20Aesthetic%20Customized%20Churi`}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        title="হোয়াটসঅ্যাপে চ্যাট করুন"
      >
        <span className="hidden sm:inline-block text-xs font-bold pl-2 pr-1 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
          হোয়াটসঅ্যাপ
        </span>
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Phone Call Floating Button */}
      <button
        onClick={onCallClick}
        type="button"
        className="group flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
        title="সরাসরি ফোন করুন"
      >
        <span className="hidden sm:inline-block text-xs font-bold pl-2 pr-1 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
          ফোন করুন
        </span>
        <Phone className="w-6 h-6 animate-pulse" />
      </button>
    </div>
  );
};
