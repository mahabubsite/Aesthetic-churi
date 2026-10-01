import React, { useState } from 'react';
import { X, Phone, PhoneCall, MessageCircle, Clock, Check } from 'lucide-react';

interface PhoneCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotlinePhone?: string;
  whatsappNumber?: string;
}

export const PhoneCallDialog: React.FC<PhoneCallDialogProps> = ({
  isOpen,
  onClose,
  hotlinePhone = '+8801516-566277',
  whatsappNumber = '8801516566277',
}) => {
  const [callbackNumber, setCallbackNumber] = useState('');
  const [requested, setRequested] = useState(false);

  if (!isOpen) return null;

  const cleanWa = (whatsappNumber || '8801516566277').replace(/[^\d]/g, '');
  const formattedWa = cleanWa.startsWith('880') ? cleanWa : cleanWa.startsWith('0') ? `88${cleanWa}` : `880${cleanWa}`;
  const cleanPhone = (hotlinePhone || '01700000000').replace(/[^\d+]/g, '');

  const handleCallbackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackNumber) return;
    setRequested(true);
    setTimeout(() => {
      setRequested(false);
      setCallbackNumber('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#501323] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <PhoneCall className="w-5 h-5 text-amber-300" />
            <h3 className="text-xl font-bold tracking-tight">হটলাইনে কল করুন</h3>
          </div>
          <p className="text-xs text-rose-200">
            আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে কথা বলতে নিচের যেকোনো একটি মাধ্যম বেছে নিন
          </p>
        </div>

        <div className="p-6 space-y-4">
          
          <div className="space-y-2.5">
            {/* Hotline 1 */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-between p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#501323] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">হটলাইন (সকাল ৯টা - রাত ১০টা)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{hotlinePhone}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#501323] text-white rounded-full text-xs font-bold">
                কল দিন
              </span>
            </a>

            {/* WhatsApp Direct */}
            <a
              href={`https://wa.me/${formattedWa}?text=I%20want%20to%20order%20Aesthetic%20Customized%20Churi`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-emerald-800 block">হোয়াটসঅ্যাপ সাপোর্ট</span>
                  <span className="font-mono font-bold text-emerald-950 text-sm">{whatsappNumber}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
                চ্যাট
              </span>
            </a>
          </div>

          {/* Request Callback */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2">
              কলব্যাকের অনুরোধ জানান (আমরা আপনাকে কল করব):
            </h4>

            {requested ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>অনুরোধ জমা হয়েছে! ৫-১০ মিনিটের মধ্যে কল করা হবে।</span>
              </div>
            ) : (
              <form onSubmit={handleCallbackRequest} className="flex gap-2">
                <input
                  type="tel"
                  required
                  placeholder="আপনার ফোন নম্বর দিন"
                  value={callbackNumber}
                  onChange={(e) => setCallbackNumber(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none font-mono focus:border-[#501323]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#501323] hover:bg-[#3d0e1b] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  সাবমিট
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
