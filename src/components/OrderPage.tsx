import React, { useState } from 'react';
import { BangleProduct } from '../data/banglesData';
import { BangleIllustration } from './BangleIllustrations';
import { BkashLogo, RocketLogo, NagadLogo, UpayLogo, PaymentMethodIcon } from './PaymentLogos';
import { StoreSettings, DEFAULT_PAYMENT_METHODS, PaymentMethodConfig } from '../data/settings';
import {
  Lock,
  Plus,
  Minus,
  Check,
  Copy,
  AlertCircle,
  ArrowLeft,
  Truck,
  Banknote,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface OrderItem {
  id: string;
  productId: string;
  sku?: string;
  name: string;
  imageType: BangleProduct['imageType'];
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderData {
  orderId: string;
  items: OrderItem[];
  // Backwards compatibility single product fallbacks
  product?: BangleProduct;
  selectedSize?: string;
  quantity?: number;
  unitPrice?: number;
  subtotal: number;
  shippingArea: 'dhaka' | 'outside' | 'emergency';
  shippingCost: number;
  total: number;
  customerName: string;
  country: string;
  address: string;
  phone: string;
  note?: string;
  paymentMethod: 'bkash' | 'rocket' | 'nagad' | 'upay' | 'cod';
  paymentSenderNumber?: string;
  transactionId?: string;
  orderDate: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface OrderPageProps {
  initialProduct?: BangleProduct;
  initialSize?: string;
  initialItems?: Array<{
    product: BangleProduct;
    size: string;
    quantity: number;
  }>;
  catalogProducts: BangleProduct[];
  settings: StoreSettings;
  onBack: () => void;
  onOrderSuccess: (order: OrderData) => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({
  initialProduct,
  initialSize,
  initialItems,
  catalogProducts,
  settings,
  onBack,
  onOrderSuccess,
}) => {
  // Multi-Product Cart Items in checkout
  const [items, setItems] = useState<
    Array<{
      product: BangleProduct;
      size: string;
      quantity: number;
    }>
  >(
    initialItems && initialItems.length > 0
      ? initialItems
      : initialProduct
      ? [
          {
            product: initialProduct,
            size: initialSize || initialProduct.sizes[0],
            quantity: 1,
          },
        ]
      : []
  );

  const [shippingArea, setShippingArea] = useState<'dhaka' | 'outside' | 'emergency'>('dhaka');
  const [isAddMoreCatalogOpen, setIsAddMoreCatalogOpen] = useState(false);

  // Customer inputs (Auto-loads saved account info if exists)
  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem('cdb_customer_name') || '';
    } catch {
      return '';
    }
  });
  const [address, setAddress] = useState(() => {
    try {
      return localStorage.getItem('cdb_customer_address') || '';
    } catch {
      return '';
    }
  });
  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem('cdb_customer_phone') || '';
    } catch {
      return '';
    }
  });
  const [note, setNote] = useState('');

  // Payment method: cod, bkash, nagad, rocket, upay
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'rocket' | 'nagad' | 'upay' | 'cod'>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Price calculations across all items
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost =
    shippingArea === 'emergency'
      ? (settings.shippingEmergency || 180)
      : shippingArea === 'dhaka'
      ? settings.shippingInsideDhaka
      : settings.shippingOutsideDhaka;
  const total = subtotal + shippingCost;

  // Merchant numbers from store settings
  const merchantNumbers: Record<string, string> = {
    bkash: settings.merchantBkash || '01712-345678',
    rocket: settings.merchantRocket || '01812-3456789',
    nagad: settings.merchantNagad || '01912-345678',
    upay: settings.merchantUpay || '01512-345678',
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text.replace(/[^0-9]/g, ''));
    setCopiedNumber(type);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  // Cart modifications
  const handleQuantityChange = (index: number, delta: number) => {
    setItems((prev) => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty >= 1) {
        next[index].quantity = newQty;
      }
      return next;
    });
  };

  const handleSizeChange = (index: number, newSize: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index].size = newSize;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddMoreProduct = (bangle: BangleProduct) => {
    // If already in list, increase quantity
    const existingIndex = items.findIndex((i) => i.product.id === bangle.id);
    if (existingIndex >= 0) {
      handleQuantityChange(existingIndex, 1);
    } else {
      setItems((prev) => [
        ...prev,
        {
          product: bangle,
          size: bangle.sizes[0],
          quantity: 1,
        },
      ]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'আপনার নাম লিখুন';
    }

    if (!address.trim()) {
      errs.address = 'সম্পূর্ণ ঠিকানা লিখুন (যেমন: বাড়ি নং, রোড, থানা, জেলা)';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errs.phone = 'মোবাইল নাম্বার লিখুন';
    } else if (
      cleanPhone.length < 11 ||
      (!cleanPhone.startsWith('01') && !cleanPhone.startsWith('8801'))
    ) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)';
    }

    if (paymentMethod !== 'cod') {
      if (!senderNumber.trim()) {
        errs.senderNumber = `যে নাম্বার থেকে ${paymentMethod.toUpperCase()} করেছেন তা লিখুন`;
      }
      if (!transactionId.trim()) {
        errs.transactionId = 'ট্রানজেকশন আইডি (TrxID) লিখুন';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const generatedOrderId = `ACC-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('bn-BD', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}`;

    const orderItems: OrderItem[] = items.map((i) => ({
      id: `${i.product.id}-${i.size}`,
      productId: i.product.id,
      sku: i.product.sku,
      name: i.product.name,
      imageType: i.product.imageType,
      size: i.size,
      quantity: i.quantity,
      unitPrice: i.product.price,
      subtotal: i.product.price * i.quantity,
    }));

    const orderData: OrderData = {
      orderId: generatedOrderId,
      items: orderItems,
      product: items[0].product,
      selectedSize: items[0].size,
      quantity: totalItemCount,
      unitPrice: items[0].product.price,
      subtotal,
      shippingArea,
      shippingCost,
      total,
      customerName: customerName.trim(),
      country: 'Bangladesh',
      address: address.trim(),
      phone: phone.trim(),
      note: note.trim(),
      paymentMethod,
      paymentSenderNumber: paymentMethod !== 'cod' ? senderNumber.trim() : undefined,
      transactionId: paymentMethod !== 'cod' ? transactionId.trim() : undefined,
      orderDate: formattedDate,
      status: 'Pending',
    };

    setTimeout(() => {
      try {
        localStorage.setItem('cdb_customer_phone', phone.trim());
        localStorage.setItem('cdb_customer_name', customerName.trim());
        localStorage.setItem('cdb_customer_address', address.trim());
      } catch {
        // ignore
      }
      setIsSubmitting(false);
      onOrderSuccess(orderData);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 md:pb-16 font-sans">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#551627] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরুন</span>
          </button>

          <div className="flex items-center gap-2">
            <img
              src={settings?.logoUrl || '/churilogo.png'}
              alt={settings?.siteName || 'Aesthetic customized churi'}
              className="h-7 sm:h-9 w-auto max-w-[170px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/churilogo.png';
              }}
            />
            <span className="text-xs sm:text-sm font-extrabold text-[#551627] font-serif hidden sm:inline">
              • নিরাপদ চেকআউট
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>১০০% সুরক্ষিত</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        
        {/* Mobile Page Title */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#551627] tracking-tight">
            অর্ডার কনফার্মেশন ও পেমেন্ট
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            নিচের তথ্যগুলো পূরণ করে সরাসরি ক্যাশ অন ডেলিভারি অথবা অনলাইন পেমেন্টে অর্ডার করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          
          {/* STEP 1: MULTI-PRODUCT CART / ORDERED BANGLES LIST */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#551627] text-white text-xs font-bold flex items-center justify-center">
                  ১
                </span>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  আপনার নির্বাচিত চুড়িসমূহ ({items.length} টি ডিজাইন)
                </h2>
              </div>

              <span className="text-xs text-rose-800 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                মোট {totalItemCount} সেট
              </span>
            </div>

            {/* Product items list */}
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Thumbnail & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-amber-50 to-rose-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <BangleIllustration type={item.product.imageType} className="w-full h-full" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                          {item.product.name}
                        </h3>
                        {item.product.sku && (
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                            {item.product.sku}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {item.product.price}৳ × {item.quantity} = <strong className="text-[#551627]">{item.product.price * item.quantity}৳</strong>
                      </p>
                    </div>
                  </div>

                  {/* Size Selector & Quantity Controller */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                    {/* Size Selector */}
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500 hidden xs:inline">সাইজ:</span>
                      <select
                        value={item.size}
                        onChange={(e) => handleSizeChange(idx, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:border-[#551627] cursor-pointer"
                      >
                        {item.product.sizes.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        title="কমান"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs font-mono text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(idx, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                        title="বাড়ান"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Item (if more than 1) */}
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* Quick Add More Bangles Button */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsAddMoreCatalogOpen(!isAddMoreCatalogOpen)}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-amber-500/80 bg-amber-50/50 hover:bg-amber-50 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-700" />
                <span>+ অর্ডারে আরও অন্য ডিজাইনের চুড়ি যোগ করুন (Add More)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAddMoreCatalogOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Quick Add Catalog Drawer */}
              {isAddMoreCatalogOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 animate-fadeIn">
                  {catalogProducts
                    .filter((p) => !items.some((it) => it.product.id === p.id))
                    .slice(0, 6)
                    .map((bangle) => (
                      <div
                        key={bangle.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                            <BangleIllustration type={bangle.imageType} className="w-full h-full" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{bangle.name}</p>
                            <p className="font-mono font-bold text-[#551627]">{bangle.price}৳</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddMoreProduct(bangle)}
                          className="px-2.5 py-1.5 bg-[#551627] hover:bg-[#430f1e] active:scale-95 text-white font-bold text-[11px] rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
                        >
                          + যোগ করুন
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>

          {/* STEP 2: CUSTOMER & DELIVERY ADDRESS FORM */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#551627] text-white text-xs font-bold flex items-center justify-center">
                ২
              </span>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                ডেলিভারি ঠিকানা ও তথ্য
              </h2>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                আপনার পুরো নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: মোছাঃ সালমা খাতুন"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white transition-colors ${
                  errors.customerName ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#551627]'
                }`}
              />
              {errors.customerName && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.customerName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                মোবাইল নাম্বার (ডেলিভারির জন্য) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="যেমন: 01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:bg-white transition-colors ${
                  errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#551627]'
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Delivery Area Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ডেলিভারি এরিয়া বেছে নিন <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShippingArea('dhaka')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    shippingArea === 'dhaka'
                      ? 'border-[#551627] bg-rose-50/70 ring-2 ring-rose-900/10 shadow-xs'
                      : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">ঢাকার ভিতরে</span>
                    <span className="font-mono font-bold text-xs text-[#551627]">
                      {settings.shippingInsideDhaka}৳
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">২৪ ঘণ্টার মধ্যে হোম ডেলিভারি</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingArea('outside')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    shippingArea === 'outside'
                      ? 'border-[#551627] bg-rose-50/70 ring-2 ring-rose-900/10 shadow-xs'
                      : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">ঢাকার বাইরে</span>
                    <span className="font-mono font-bold text-xs text-[#551627]">
                      {settings.shippingOutsideDhaka}৳
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">৪৮ ঘণ্টার মধ্যে ডেলিভারি</span>
                </button>

                {/* Emergency Fast Delivery (User requested feature) */}
                <button
                  type="button"
                  onClick={() => setShippingArea('emergency')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    shippingArea === 'emergency'
                      ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/30 shadow-xs'
                      : 'border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-amber-950 flex items-center gap-1">
                      <span>⚡ ইমার্জেন্সি ডেলিভারি</span>
                    </span>
                    <span className="font-mono font-bold text-xs text-amber-800">
                      {settings.shippingEmergency || 180}৳
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold mt-1">
                    ১২-২৪ ঘণ্টার মধ্যে সুপারফাস্ট এক্সপ্রেস
                  </span>
                </button>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                সম্পূর্ণ ঠিকানা (বাড়ি/রোড, থানা, জেলা) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="যেমন: বাড়ি নং- ১২, রোড নং- ৪, মিরপুর-১০, ঢাকা"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white transition-colors ${
                  errors.address ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-[#551627]'
                }`}
              />
              {errors.address && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.address}
                </p>
              )}
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                বিশেষ কোনো নোট থাকলে লিখুন (ঐচ্ছিক):
              </label>
              <input
                type="text"
                placeholder="যেমন: উপহার বক্সের সাথে স্পেশাল কার্ড দিন"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:border-[#551627]"
              />
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD (COD, BKASH, NAGAD, ROCKET, UPAY) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-[#551627] text-white text-xs font-bold flex items-center justify-center">
                ৩
              </span>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                পেমেন্ট মাধ্যম বেছে নিন
              </h2>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(settings.paymentMethods && settings.paymentMethods.length > 0
                ? settings.paymentMethods.filter((pm) => pm.isActive)
                : DEFAULT_PAYMENT_METHODS
              ).map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#551627] bg-rose-50/70 ring-2 ring-rose-900/10 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <PaymentMethodIcon
                      methodId={pm.id}
                      name={pm.name}
                      iconUrl={pm.iconUrl}
                      className="h-6 max-h-6 max-w-[80px] object-contain"
                    />

                    <span className="font-bold text-xs text-slate-900 line-clamp-1">{pm.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {pm.id === 'cod' ? (
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                          হাতে পেয়ে পেমেন্ট
                        </span>
                      ) : (
                        'সেন্ড মানি'
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Banking Instructions & Verification Inputs */}
            {paymentMethod !== 'cod' && (() => {
              const activePm = (settings.paymentMethods || DEFAULT_PAYMENT_METHODS).find((m) => m.id === paymentMethod);
              const targetNumber = activePm?.accountNumber || merchantNumbers[paymentMethod as keyof typeof merchantNumbers] || '+8801516-566277';
              const targetInstructions = activePm?.instructions || 'আমাদের নাম্বারে টাকা পাঠিয়ে ট্রানজেকশন আইডি নিচে লিখুন।';
              const targetType = activePm?.accountType || 'Personal';

              return (
                <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn text-xs">
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-slate-500 text-[11px]">
                          আমাদের {paymentMethod.toUpperCase()} নাম্বার:
                        </span>
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                          {targetType}
                        </span>
                      </div>
                      <span className="font-mono text-base font-extrabold text-[#551627]">
                        {targetNumber}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(targetNumber, paymentMethod)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#551627] hover:bg-[#430f1e] text-white rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      {copiedNumber === paymentMethod ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    📌 {targetInstructions} মোট প্রদেয়: <strong>{total}৳</strong>
                  </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      যে নাম্বার থেকে পাঠিয়েছেন <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className={`w-full bg-white border rounded-xl p-2.5 font-mono text-xs text-slate-800 focus:outline-none ${
                        errors.senderNumber ? 'border-red-400 bg-red-50/40' : 'border-slate-300 focus:border-[#551627]'
                      }`}
                    />
                    {errors.senderNumber && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.senderNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      TrxID (ট্রানজেকশন আইডি) <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: 9J8B21K4L"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className={`w-full bg-white border rounded-xl p-2.5 font-mono uppercase text-xs text-slate-800 focus:outline-none ${
                        errors.transactionId ? 'border-red-400 bg-red-50/40' : 'border-slate-300 focus:border-[#551627]'
                      }`}
                    />
                    {errors.transactionId && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.transactionId}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

          {/* STEP 4: ORDER SUMMARY & SUBMIT */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              অর্ডার সারাংশ (Order Summary)
            </h3>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>চুড়ির সাবটোটাল ({totalItemCount} সেট):</span>
                <span className="font-mono font-bold text-slate-900">{subtotal}৳</span>
              </div>
              <div className="flex justify-between">
                <span>
                  ডেলিভারি চার্জ ({shippingArea === 'emergency' ? '⚡ জরুরী ডেলিভারি' : shippingArea === 'dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}):
                </span>
                <span className="font-mono font-bold text-slate-900">{shippingCost}৳</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm sm:text-base font-extrabold text-[#551627]">
                <span>সর্বমোট পরিশোধযোগ্য বিল:</span>
                <span className="font-mono text-xl text-rose-700">{total}৳</span>
              </div>
            </div>

            {/* Desktop / In-form Order Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] active:scale-98 text-white font-extrabold text-base transition-all duration-200 shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? 'অর্ডার প্রসেসিং হচ্ছে...'
                    : `অর্ডার কনফার্ম করুন (${total}৳)`}
                </span>
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1 pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্টেড।</span>
            </p>
          </div>

        </form>
      </div>

      {/* Sticky Mobile Floating Order Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-slate-500 block leading-tight">সর্বমোট বিল</span>
          <span className="font-extrabold font-mono text-lg text-[#551627] leading-none">
            {total}৳
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="py-2.5 px-6 bg-[#dc2626] active:scale-95 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার কনফার্ম করুন</span>
        </button>
      </div>
    </div>
  );
};
