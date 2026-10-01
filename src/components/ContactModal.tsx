import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, MessageCircle, Send, Check } from 'lucide-react';
import { CdbBanglesLogo } from './PaymentLogos';
import { ContactMessage } from '../data/messages';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (message: ContactMessage) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSendMessage }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('bn-BD', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}`;

    const newMsg: ContactMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim() || 'কোনো বার্তা যোগ করা হয়নি',
      date: formattedDate,
      status: 'New',
    };

    onSendMessage?.(newMsg);
    setSent(true);

    setTimeout(() => {
      setSent(false);
      setName('');
      setPhone('');
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#5a1427] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-2xl font-bold tracking-tight">যোগাযোগ করুন</h3>
          <p className="text-xs text-rose-200 mt-1">
            যেকোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Contact Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href="tel:+8801516566277"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-[#5a1427] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-500 block">হটলাইন নম্বর</span>
                <span className="font-bold text-slate-900 font-mono">+8801516-566277</span>
              </div>
            </a>

            <a
              href="https://wa.me/8801516566277"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-emerald-700 block font-medium">হোয়াটসঅ্যাপ চ্যাট</span>
                <span className="font-bold text-emerald-900 font-mono">+8801516-566277</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 px-1">
            <MapPin className="w-4 h-4 text-[#5a1427] shrink-0" />
            <span>ঢাকা, বাংলাদেশ (সারাদেশে হোম ডেলিভারি প্রযোজ্য)</span>
          </div>

          {/* Quick Message Form */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-bold text-slate-800 mb-3">আমাদের একটি বার্তা পাঠান:</h4>
            
            {sent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! ধন্যবাদ।</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="আপনার নাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-[#5a1427]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="মোবাইল নম্বর"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-[#5a1427] font-mono"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="আপনার কোনো প্রশ্ন বা পরামর্শ থাকলে লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:border-[#5a1427] resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#5a1427] hover:bg-[#430c1b] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>বার্তা পাঠান</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
