import React, { useState, useEffect } from 'react';
import {
  User,
  ShoppingBag,
  FileText,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  LogOut,
  ExternalLink,
  Package,
  Calendar,
  CreditCard,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Lock,
} from 'lucide-react';
import { OrderData } from './OrderPage';
import { BangleIllustration } from './BangleIllustrations';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderData[];
  onSelectOrder?: (order: OrderData) => void;
  onContactClick?: () => void;
  onExploreProducts?: () => void;
  onAdminSignInClick?: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  orders = [],
  onSelectOrder,
  onContactClick,
  onExploreProducts,
  onAdminSignInClick,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'policies'>('orders');
  const [selectedPolicy, setSelectedPolicy] = useState<'shipping' | 'return' | 'refund' | 'privacy'>('shipping');

  // Customer phone number & details
  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      return localStorage.getItem('cdb_customer_phone') || '';
    } catch {
      return '';
    }
  });

  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem('cdb_customer_name') || '';
    } catch {
      return '';
    }
  });

  const [customerAddress, setCustomerAddress] = useState(() => {
    try {
      return localStorage.getItem('cdb_customer_address') || '';
    } catch {
      return '';
    }
  });

  // Input state for entering phone number if not saved
  const [inputPhone, setInputPhone] = useState(customerPhone);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    try {
      const savedP = localStorage.getItem('cdb_customer_phone');
      if (savedP) {
        setCustomerPhone(savedP);
        setInputPhone(savedP);
      }
      const savedN = localStorage.getItem('cdb_customer_name');
      if (savedN) setCustomerName(savedN);
      const savedA = localStorage.getItem('cdb_customer_address');
      if (savedA) setCustomerAddress(savedA);
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter orders by customer phone number
  const cleanPhone = (p: string) => p.replace(/[^\d]/g, '').slice(-10); // match last 10 digits
  const targetPhoneSuffix = customerPhone ? cleanPhone(customerPhone) : '';

  const customerOrders = targetPhoneSuffix
    ? orders.filter((o) => {
        if (!o.phone) return false;
        return cleanPhone(o.phone).includes(targetPhoneSuffix) || targetPhoneSuffix.includes(cleanPhone(o.phone));
      })
    : [];

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputPhone.trim();
    if (!clean) return;

    setCustomerPhone(clean);
    try {
      localStorage.setItem('cdb_customer_phone', clean);
      if (customerName) localStorage.setItem('cdb_customer_name', customerName);
      if (customerAddress) localStorage.setItem('cdb_customer_address', customerAddress);
    } catch {
      // ignore
    }
    setIsEditingPhone(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('cdb_customer_phone');
    } catch {
      // ignore
    }
    setCustomerPhone('');
    setInputPhone('');
    setIsEditingPhone(true);
  };

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            ডেলিভারি সম্পন্ন
          </span>
        );
      case 'Shipped':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-600" />
            ডেলিভারিতে আছে
          </span>
        );
      case 'Confirmed':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            অর্ডার কনফার্মড
          </span>
        );
      case 'Cancelled':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            অর্ডার বাতিল
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 border border-slate-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            অপেক্ষমাণ (Pending)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4a0e1e] via-[#5a1427] to-[#3a0815] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>গ্রাহক প্রোফাইল ও অ্যাকাউন্ট</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                  অটো সেভ
                </span>
              </h3>
              <p className="text-xs text-rose-100/90 font-medium">
                {customerPhone ? `ফোন: ${customerPhone}` : 'অর্ডার হিস্টোরি ও পলিসি নীতিমালা'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 shrink-0 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 sm:px-4 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#551627] text-[#551627]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>আমার অর্ডারসমূহ</span>
            {customerOrders.length > 0 && (
              <span className="bg-[#551627] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                {customerOrders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 sm:px-4 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#551627] text-[#551627]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>প্রোফাইল তথ্য</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`py-3 px-3 sm:px-4 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'policies'
                ? 'border-[#551627] text-[#551627]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>পলিসি পেজসমূহ (৪টি)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-800 text-xs sm:text-sm">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>আপনার মোবাইল নাম্বার ও প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
            </div>
          )}

          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Account / Phone Header Info */}
              {!customerPhone || isEditingPhone ? (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>আপনার মোবাইল নাম্বার দিয়ে অর্ডারগুলো চেক করুন</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    অর্ডার করার সময় যে মোবাইল নাম্বার ব্যবহার করেছেন, সেটি লিখলে স্বয়ংক্রিয়ভাবে আপনার পূর্বের সকল অর্ডার ও স্ট্যাটাস দেখতে পারবেন।
                  </p>
                  <form onSubmit={handleSavePhone} className="flex gap-2">
                    <input
                      type="tel"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      placeholder="যেমন: 01712-345678"
                      required
                      className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#551627] hover:bg-[#430c1b] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      অর্ডার দেখুন
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-[#551627] font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">সংযুক্ত মোবাইল অ্যাকাউন্ট:</span>
                      <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                        {customerPhone}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(true)}
                    className="text-xs text-[#551627] hover:underline font-bold cursor-pointer"
                  >
                    নাম্বার পরিবর্তন
                  </button>
                </div>
              )}

              {/* Order List */}
              {customerPhone && customerOrders.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-700 text-sm">
                    এই নাম্বারে এখনো কোনো অর্ডার পাওয়া যায়নি
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    সাইট থেকে যেকোনো চুড়ি অর্ডার করার সময় এই মোবাইল নাম্বারটি প্রদান করলে স্বয়ংক্রিয়ভাবে এখানে আপনার অর্ডার লিস্ট যুক্ত হবে।
                  </p>
                  {onExploreProducts && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onExploreProducts();
                      }}
                      className="px-4 py-2 bg-[#551627] hover:bg-[#430c1b] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      চুড়ির কালেকশন দেখুন
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-rose-200 hover:shadow-md transition-all space-y-3"
                    >
                      {/* Top Bar of Order Card */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-xs sm:text-sm text-[#551627] bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                            #{ord.orderId}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(ord.orderDate).toLocaleDateString('bn-BD', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>{getStatusBadge(ord.status)}</div>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2">
                        {ord.items && ord.items.length > 0 ? (
                          ord.items.map((it: any, idx: number) => {
                            const itemName = it.name || it.product?.name || 'কাস্টমাইজড চুড়ি';
                            const itemImage = it.product?.images?.[0] || it.image || (it.product?.images && it.product.images[0]);
                            return (
                              <div key={idx} className="flex items-center gap-2.5 text-xs">
                                {itemImage ? (
                                  <img
                                    src={itemImage}
                                    alt={itemName}
                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-xs font-bold text-[#551627]">
                                    চুড়ি
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <span className="font-bold text-slate-900 block truncate">
                                    {itemName}
                                  </span>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                    <span>সাইজ: {it.size}</span>
                                    <span>•</span>
                                    <span>পরিমাণ: {it.quantity}টি</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-slate-700">
                            <span className="font-bold">{ord.product?.name || 'চুড়ি অর্ডার'}</span>
                            <span className="text-slate-500 text-[11px] ml-2">
                              (সাইজ: {ord.selectedSize || 'N/A'}, পরিমাণ: {ord.quantity || 1}টি)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delivery and Payment Footer of Card */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[11px] text-slate-500 block">
                            পেমেন্ট: {ord.paymentMethod.toUpperCase()} {ord.paymentSenderNumber ? `(${ord.paymentSenderNumber})` : ''}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            ডেলিভারি এরিয়া: {ord.shippingArea === 'emergency' ? '⚡ জরুরী ডেলিভারি' : ord.shippingArea === 'dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">সর্বমোট বিল</span>
                            <span className="font-mono font-black text-sm sm:text-base text-[#551627]">
                              {ord.total}৳
                            </span>
                          </div>
                          {onSelectOrder && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onSelectOrder(ord);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-800 hover:text-[#551627] font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                            >
                              রসিদ দেখুন
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE INFORMATION */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-[#551627]" />
                  <span>আপনার ব্যক্তিগত ও ডেলিভারি তথ্য</span>
                </h4>
                <p className="text-xs text-slate-500">
                  অর্ডারের সময় যে তথ্য দিয়েছিলেন তা এখানে স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকে। প্রয়োজনে আপনি আপডেট করতে পারেন।
                </p>

                <form onSubmit={handleSavePhone} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs">
                      গ্রাহকের নাম:
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="আপনার নাম লিখুন"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#551627]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs">
                      মোবাইল নাম্বার (অ্যাকাউন্ট আইডি):
                    </label>
                    <input
                      type="tel"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#551627]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-xs">
                      ডিফল্ট ডেলিভারি ঠিকানা:
                    </label>
                    <textarea
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="রোড, বাড়ি, থানা, জেলা"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#551627]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#551627] hover:bg-[#430c1b] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      তথ্য সেভ করুন
                    </button>

                    {customerPhone && (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>লগআউট / নাম্বার মুছুন</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Quick Contact Box */}
              <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#551627] block text-xs">কোনো প্রশ্ন বা জিজ্ঞাসা আছে?</span>
                  <span className="text-[11px] text-slate-600">আমাদের কাস্টমার কেয়ার প্রতিনিধি সাথে কথা বলুন</span>
                </div>
                {onContactClick && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContactClick();
                    }}
                    className="px-3 py-1.5 bg-[#551627] hover:bg-[#430c1b] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
                  >
                    যোগাযোগ
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 4 POLICY PAGES (Requested by user) */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              {/* Policy selector pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPolicy('shipping')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-1 ${
                    selectedPolicy === 'shipping'
                      ? 'bg-rose-50 border-[#551627] text-[#551627] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#551627]" />
                  <span>১. ডেলিভারি ও শিপিং</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPolicy('return')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-1 ${
                    selectedPolicy === 'return'
                      ? 'bg-rose-50 border-[#551627] text-[#551627] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-[#551627]" />
                  <span>২. রিটার্ন ও এক্সচেঞ্জ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPolicy('refund')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-1 ${
                    selectedPolicy === 'refund'
                      ? 'bg-rose-50 border-[#551627] text-[#551627] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#551627]" />
                  <span>৩. রিফান্ড পলিসি</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPolicy('privacy')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-1 ${
                    selectedPolicy === 'privacy'
                      ? 'bg-rose-50 border-[#551627] text-[#551627] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#551627]" />
                  <span>৪. শর্ত ও গোপনীয়তা</span>
                </button>
              </div>

              {/* Policy Content Viewer */}
              <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 leading-relaxed text-xs sm:text-sm">
                {selectedPolicy === 'shipping' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#551627] font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                      <Truck className="w-5 h-5 text-[#551627]" />
                      <span>🚚 ডেলিভারি ও শিপিং পলিসি (Delivery & Shipping Policy)</span>
                    </div>
                    <p className="text-slate-700">
                      <strong>Aesthetic customized churi</strong> গ্রাহকদের দ্রুততম সময়ে তাদের পছন্দের চুড়িগুলো পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                      <li>
                        <strong>ঢাকার ভিতরে ডেলিভারি:</strong> অর্ডার কনফার্মেশনের পর ২৪ থেকে ৪৮ ঘণ্টার মধ্যে সরাসরি হোম ডেলিভারি করা হয়।
                      </li>
                      <li>
                        <strong>ঢাকার বাইরে ডেলিভারি:</strong> দেশের যেকোনো জেলা বা উপজেলায় স্টিডফাস্ট বা সুন্দরবন কুরিয়ারের মাধ্যমে ২ থেকে ৩ কার্যদিবসের মধ্যে পৌঁছে দেওয়া হয়।
                      </li>
                      <li>
                        <strong>⚡ জরুরী ডেলিভারি (Emergency Delivery):</strong> বিশেষ অনুষ্ঠান, বিয়ে বা জন্মদিনের জন্য গ্রাহক চাইলে জরুরী ২৪ ঘণ্টার মধ্যে সুপারফাস্ট এক্সপ্রেস ডেলিভারি সুবিধা পাবেন।
                      </li>
                      <li>
                        <strong>প্যাকেজিং নিরাপত্তা:</strong> প্রতিটি চুড়ি সেট বাবল র‍্যাপ এবং প্রিমিয়াম হার্ডবক্স প্যাকেজিংয়ে সুরক্ষিত করে পাঠানো হয় যাতে পরিবহনে কোনো ক্ষতি না হয়।
                      </li>
                      <li>
                        <strong>পার্সেল চেক:</strong> ডেলিভারিম্যান উপস্থিত থাকা অবস্থায় পার্সেল খুলে চুড়ির সংখ্যা ও অক্ষত অবস্থা দেখে নেওয়ার অনুরোধ করা হচ্ছে।
                      </li>
                    </ul>
                  </div>
                )}

                {selectedPolicy === 'return' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#551627] font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                      <RotateCcw className="w-5 h-5 text-[#551627]" />
                      <span>🔄 রিটার্ন ও সাইজ পরিবর্তন পলিসি (Return & Exchange Policy)</span>
                    </div>
                    <p className="text-slate-700">
                      আমরা চাই প্রতিটি গ্রাহক তাদের পছন্দের চুড়িতে শতভাগ সন্তুষ্ট থাকুন।
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                      <li>
                        <strong>সাইজ অমিল বা পরিবর্তন:</strong> চুড়ির সাইজ (২.৪, ২.৬, ২.৮ ইত্যাদি) আপনার হাতে না মিললে পার্সেল পাওয়ার ৭২ ঘণ্টার মধ্যে যোগাযোগ করে সহজেই সাইজ এক্সচেঞ্জ করতে পারবেন।
                      </li>
                      <li>
                        <strong>ত্রুটিযুক্ত পণ্য:</strong> পার্সেল পাওয়ার পর যদি কোনো চুড়ি ভাঙা বা ক্ষতিগ্রস্ত থাকে, তবে ডেলিভারিম্যান থাকা অবস্থায় কিংবা পার্সেল খোলার ভিডিওসহ আমাদের হোয়াটসঅ্যাপে জানালে বিনামূল্যে নতুন পণ্য পাঠানো হবে।
                      </li>
                      <li>
                        <strong>শর্তাবলী:</strong> এক্সচেঞ্জের পণ্যটি অব্যবহৃত এবং মূল বক্সসহ অক্ষত থাকতে হবে।
                      </li>
                      <li>
                        <strong>যোগাযোগের মাধ্যম:</strong> রিটার্নের জন্য আমাদের হটলাইন বা হোয়াটসঅ্যাপ নাম্বারে অর্ডার আইডি উল্লেখ করে মেসেজ পাঠাতে হবে।
                      </li>
                    </ul>
                  </div>
                )}

                {selectedPolicy === 'refund' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#551627] font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                      <CreditCard className="w-5 h-5 text-[#551627]" />
                      <span>🛡️ রিফান্ড পলিসি ও গ্যারান্টি (Refund & Money-Back Policy)</span>
                    </div>
                    <p className="text-slate-700">
                      গ্রাহকের আস্থার সুরক্ষায় আমাদের রিফান্ড প্রক্রিয়া অত্যন্ত স্বচ্ছ ও সহজ।
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                      <li>
                        <strong>ক্যাশ অন ডেলিভারি সুরক্ষা:</strong> আমাদের অধিকাংশ অর্ডারে কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই; পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন।
                      </li>
                      <li>
                        <strong>অগ্রিম পেমেন্টকৃত অর্ডারের রিফান্ড:</strong> যদি বিকাশ, নগদ, রকেট বা উপায়ের মাধ্যমে পেমেন্ট করে থাকেন এবং কোনো কারণে আমরা পণ্য ডেলিভারি দিতে ব্যর্থ হই, তাহলে ২৪-৭২ ঘণ্টার মধ্যে শতভাগ টাকা আপনার ওয়ালেটে ফেরত দেওয়া হবে।
                      </li>
                      <li>
                        <strong>রিটার্নকৃত পণ্যের রিফান্ড:</strong> ফেরত পাঠানো পণ্য আমাদের কোয়ালিটি চেকে পৌঁছানোর পর ২ কার্যদিবসের মধ্যে সরাসরি বিকাশ বা নগদে রিফান্ড সম্পন্ন করা হয়।
                      </li>
                    </ul>
                  </div>
                )}

                {selectedPolicy === 'privacy' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#551627] font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                      <ShieldCheck className="w-5 h-5 text-[#551627]" />
                      <span>🔒 গোপনীয়তা নীতি ও সাধারণ শর্তাবলী (Privacy Policy & Terms)</span>
                    </div>
                    <p className="text-slate-700">
                      গ্রাহকের তথ্যের গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার।
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                      <li>
                        <strong>তথ্য সংগ্রহ ও ব্যবহার:</strong> গ্রাহকের নাম, মোবাইল নাম্বার এবং ডেলিভারি ঠিকানা শুধুমাত্র পার্সেল পৌঁছানো এবং অর্ডার ট্র্যাকিংয়ের উদ্দেশ্যে ব্যবহৃত হয়।
                      </li>
                      <li>
                        <strong>নিরাপত্তা ও গোপনীয়তা:</strong> আমরা কখনই আপনার ফোন নাম্বার বা ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষ বা স্প্যাম মার্কেটিংয়ের কাছে প্রকাশ করি না।
                      </li>
                      <li>
                        <strong>স্বয়ংক্রিয় অ্যাকাউন্ট:</strong> আপনার সুবিধার জন্য মোবাইল নাম্বার দিয়ে অটো-অ্যাকাউন্ট তৈরি হয় যাতে আপনি পরবর্তী যেকোনো সময়ে পূর্বের অর্ডারগুলোর স্ট্যাটাস সহজে দেখতে পারেন।
                      </li>
                      <li>
                        <strong>ছবি ও রিভিউ:</strong> গ্রাহকের অনুমতি ব্যতীত কোনো ছবি সোশ্যাল মিডিয়ায় প্রচার করা হয় না।
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Policy Section: Admin / Staff Sign In as requested */}
              <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px]">অভ্যন্তরীণ ডেটা ও সিকিউরিটি ব্যবস্থাপনা</span>
                </div>
                {onAdminSignInClick && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAdminSignInClick();
                    }}
                    className="inline-flex items-center gap-1.5 text-[#551627] hover:text-white font-bold py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-[#551627] border border-rose-200 hover:border-[#551627] transition-all cursor-pointer shadow-xs active:scale-95"
                    title="অনুমোদিত অ্যাডমিন সাইন ইন"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>সাইন ইন (Sign In)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 hidden sm:inline">
            Aesthetic customized churi – গ্রাহক সুরক্ষায় বিশ্বস্ত
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
