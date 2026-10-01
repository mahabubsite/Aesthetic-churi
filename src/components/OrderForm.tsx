import React, { useState } from 'react';
import { BeetrootIcon } from './BeetrootIllustration';
import { BkashLogo, RocketLogo, NagadLogo } from './PaymentLogos';
import { Lock, Plus, Minus, Check, Copy, AlertCircle, Truck, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface OrderData {
  orderId: string;
  customerName: string;
  country: string;
  address: string;
  phone: string;
  shippingArea: 'dhaka' | 'outside';
  shippingCost: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  total: number;
  paymentMethod: 'bkash' | 'rocket' | 'nagad' | 'cod';
  paymentSenderNumber?: string;
  transactionId?: string;
  orderDate: string;
  status: 'Pending' | 'Confirmed';
}

interface OrderFormProps {
  onOrderSuccess: (order: OrderData) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onOrderSuccess }) => {
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingArea, setShippingArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'rocket' | 'nagad' | 'cod'>('bkash');
  
  // Payment gateway specific inputs
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // UI states
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing constants matching screenshot
  const unitPrice = 500;
  const shippingCost = shippingArea === 'dhaka' ? 80 : 120;
  const subtotal = unitPrice * quantity;
  const total = subtotal + shippingCost;

  // Merchant/Personal numbers for payment gateways
  const merchantNumbers = {
    bkash: '01712-345678',
    rocket: '01812-3456789',
    nagad: '01912-345678',
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text.replace(/[^0-9]/g, ''));
    setCopiedNumber(type);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'আপনার নাম লিখুন';
    }

    if (!address.trim()) {
      newErrors.address = 'সম্পূর্ণ ঠিকানা লিখুন (যেমন: বাড়ি নং, রোড, থানা, জেলা)';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'মোবাইল নাম্বার লিখুন';
    } else if (cleanPhone.length < 11 || (!cleanPhone.startsWith('01') && !cleanPhone.startsWith('8801'))) {
      newErrors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন: 017XXXXXXXX)';
    }

    if (paymentMethod !== 'cod') {
      if (!senderNumber.trim()) {
        newErrors.senderNumber = `আপনার ${paymentMethod} নাম্বারটি লিখুন`;
      }
      if (!transactionId.trim()) {
        newErrors.transactionId = 'ট্রানজেকশন আইডি (TrxID) লিখুন';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);

    const generatedOrderId = 'CDB-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: OrderData = {
      orderId: generatedOrderId,
      customerName,
      country,
      address,
      phone,
      shippingArea,
      shippingCost,
      quantity,
      unitPrice,
      subtotal,
      total,
      paymentMethod,
      paymentSenderNumber: paymentMethod !== 'cod' ? senderNumber : undefined,
      transactionId: paymentMethod !== 'cod' ? transactionId : undefined,
      orderDate: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: 'Confirmed',
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('cdb_beetroot_orders') || '[]');
      localStorage.setItem('cdb_beetroot_orders', JSON.stringify([newOrder, ...existing]));
    } catch {
      // ignore storage error
    }

    setTimeout(() => {
      setIsSubmitting(false);
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#e11d48', '#facc15', '#16a34a', '#881337'],
        });
      } catch {
        // fallback
      }
      onOrderSuccess(newOrder);
    }, 400);
  };

  return (
    <section id="order-section" className="py-14 md:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Main Form Container with Burgundy Border matching screenshot */}
        <div className="bg-white rounded-3xl border-2 border-[#8b1e3f] p-6 sm:p-10 shadow-xl shadow-rose-950/5">
          
          {/* Header Title matching screenshot */}
          <div className="text-center pb-8 border-b border-slate-100">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#551627] tracking-tight">
              অর্ডার করতে নিচের ফর্মটি পূরণ করুন
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে যোগাযোগ করবে।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Column: Billing Details */}
            <div className="lg:col-span-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Billing details
              </h3>

              {/* Field 1: Customer Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors({ ...errors, customerName: '' });
                  }}
                  placeholder="আপনার পুরো নাম লিখুন"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm sm:text-base outline-none transition-all ${
                    errors.customerName
                      ? 'border-red-500 bg-red-50/40 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 focus:border-[#551627] focus:ring-2 focus:ring-rose-900/10'
                  }`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.customerName}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Country / Region */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm sm:text-base bg-white outline-none focus:border-[#551627] focus:ring-2 focus:ring-rose-900/10 transition-all font-medium text-slate-700 cursor-pointer"
                >
                  <option value="Bangladesh">Bangladesh</option>
                </select>
              </div>

              {/* Field 3: Full Address */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  আপনার সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  placeholder="বাসা নং, রোড নং, এলাকা, থানা, জেলা"
                  className={`w-full px-3.5 py-2 rounded-lg border text-sm sm:text-base outline-none transition-all resize-none ${
                    errors.address
                      ? 'border-red-500 bg-red-50/40 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 focus:border-[#551627] focus:ring-2 focus:ring-rose-900/10'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </div>

              {/* Field 4: Mobile Number */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  আপনার মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="01XXXXXXXXX"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm sm:text-base outline-none transition-all font-mono ${
                    errors.phone
                      ? 'border-red-500 bg-red-50/40 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 focus:border-[#551627] focus:ring-2 focus:ring-rose-900/10'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Shipping Area Selection matching screenshot */}
              <div className="pt-2">
                <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#551627]" />
                  <span>Shipping</span>
                </h4>

                <div className="space-y-2 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  <label
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      shippingArea === 'dhaka' ? 'bg-rose-50/60 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingArea === 'dhaka'}
                        onChange={() => setShippingArea('dhaka')}
                        className="w-4 h-4 text-[#551627] focus:ring-[#551627]"
                      />
                      <span className="text-sm text-slate-800">ঢাকার ভেতরে:</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 font-mono">80.00৳</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      shippingArea === 'outside' ? 'bg-rose-50/60 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingArea === 'outside'}
                        onChange={() => setShippingArea('outside')}
                        className="w-4 h-4 text-[#551627] focus:ring-[#551627]"
                      />
                      <span className="text-sm text-slate-800">সারা বাংলাদেশ:</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 font-mono">120.00৳</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Your Order & Payment Gateway */}
            <div className="lg:col-span-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Your order
              </h3>

              {/* Order Summary Table matching screenshot */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-sm">
                
                {/* Table Header */}
                <div className="flex items-center justify-between p-3 bg-slate-50 font-bold text-slate-700">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>

                {/* Beetroot Product Row matching screenshot */}
                <div className="flex items-center justify-between p-3.5 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                      <BeetrootIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">বিটরুট</p>
                      <p className="text-xs text-slate-500">হীরামন স্প্রে ড্রাইড ২০০ গ্রাম</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Selector Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2 py-1 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        title="কমান"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900 font-mono">
                        × {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2 py-1 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        title="বাড়ান"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-slate-900 font-mono">
                      {subtotal.toFixed(2)}৳
                    </span>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between p-3 bg-white text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {subtotal.toFixed(2)}৳
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between p-3 bg-white text-slate-700">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900 text-xs sm:text-sm">
                    {shippingArea === 'dhaka' ? 'ঢাকার ভেতরে: 80.00৳' : 'সারা বাংলাদেশ: 120.00৳'}
                  </span>
                </div>

                {/* Total matching screenshot */}
                <div className="flex items-center justify-between p-3.5 bg-rose-50/50 font-extrabold text-base text-slate-900">
                  <span>Total</span>
                  <span className="font-mono text-lg text-[#551627]">
                    {total.toFixed(2)}৳
                  </span>
                </div>

              </div>

              {/* Payment Gateways Selection matching screenshot */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Payment Method
                </p>

                {/* 1. bKash Option */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <label
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      paymentMethod === 'bkash' ? 'bg-pink-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="w-4 h-4 text-[#e2136e] focus:ring-[#e2136e]"
                      />
                      <span className="text-sm font-bold text-slate-800">bKash</span>
                    </div>
                    <BkashLogo className="h-6" />
                  </label>

                  {/* bKash Payment Box matching screenshot */}
                  {paymentMethod === 'bkash' && (
                    <div className="p-4 bg-[#ececec] border-t border-slate-300 space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">bKash payment Gateway</span>
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          Send Money
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-300">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-500">bKash Number :</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {merchantNumbers.bkash}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(merchantNumbers.bkash, 'bkash')}
                          className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded border border-slate-300 font-medium cursor-pointer"
                        >
                          {copiedNumber === 'bkash' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>কপি করুন</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            bKash Number
                          </label>
                          <input
                            id="senderNumber"
                            type="tel"
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="017XXXXXXXX"
                            className="w-full bg-white px-3 py-2 rounded border border-slate-300 text-xs sm:text-sm font-mono outline-none focus:border-[#e2136e]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            bKash Transaction ID
                          </label>
                          <input
                            id="transactionId"
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="8N7A6D5EE7M"
                            className="w-full bg-white px-3 py-2 rounded border border-slate-300 text-xs sm:text-sm font-mono uppercase outline-none focus:border-[#e2136e]"
                          />
                        </div>
                      </div>

                      {(errors.senderNumber || errors.transactionId) && (
                        <p className="text-xs text-red-600 font-medium">
                          {errors.senderNumber || errors.transactionId}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Rocket Option matching screenshot */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <label
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      paymentMethod === 'rocket' ? 'bg-purple-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'rocket'}
                        onChange={() => setPaymentMethod('rocket')}
                        className="w-4 h-4 text-[#8C3494] focus:ring-[#8C3494]"
                      />
                      <span className="text-sm font-bold text-slate-800">Rocket</span>
                    </div>
                    <RocketLogo className="h-6" />
                  </label>

                  {paymentMethod === 'rocket' && (
                    <div className="p-4 bg-[#ececec] border-t border-slate-300 space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Rocket Payment Gateway</span>
                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          Send Money
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-300">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-500">Rocket Number :</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {merchantNumbers.rocket}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(merchantNumbers.rocket, 'rocket')}
                          className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded border border-slate-300 font-medium cursor-pointer"
                        >
                          {copiedNumber === 'rocket' ? 'কপি হয়েছে' : 'কপি করুন'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Rocket Number
                          </label>
                          <input
                            type="tel"
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="018XXXXXXXX"
                            className="w-full bg-white px-3 py-2 rounded border border-slate-300 text-xs sm:text-sm font-mono outline-none focus:border-[#8C3494]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Transaction ID
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="TrxID"
                            className="w-full bg-white px-3 py-2 rounded border border-slate-300 text-xs sm:text-sm font-mono uppercase outline-none focus:border-[#8C3494]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Nagad Option matching screenshot */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <label
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      paymentMethod === 'nagad' ? 'bg-orange-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="w-4 h-4 text-[#F7941D] focus:ring-[#F7941D]"
                      />
                      <span className="text-sm font-bold text-slate-800">Nagad</span>
                    </div>
                    <NagadLogo className="h-6" />
                  </label>

                  {paymentMethod === 'nagad' && (
                    <div className="p-4 bg-[#ececec] border-t border-slate-300 space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Nagad Payment Gateway</span>
                        <span className="text-[11px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                          Send Money
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-300">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-500">Nagad Number :</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {merchantNumbers.nagad}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(merchantNumbers.nagad, 'nagad')}
                          className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded border border-slate-300 font-medium cursor-pointer"
                        >
                          {copiedNumber === 'nagad' ? 'কপি হয়েছে' : 'কপি করুন'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Nagad Number
                          </label>
                          <input
                            type="tel"
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="019XXXXXXXX"
                            className="w-full bg-white px-3 py-2 rounded border border-slate-300 text-xs sm:text-sm font-mono outline-none focus:border-[#F7941D]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Transaction ID
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="TrxID"
                            className="w-full bg-white px-3 py-2 rounded border border-slate-300 text-xs sm:text-sm font-mono uppercase outline-none focus:border-[#F7941D]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Cash On Delivery Option */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <label
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      paymentMethod === 'cod' ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">ক্যাশ অন ডেলিভারি</span>
                        <span className="text-[11px] text-slate-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</span>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-600" />
                  </label>
                </div>

              </div>

              {/* Privacy Notice matching screenshot */}
              <p className="text-[11px] text-slate-500 leading-normal pt-1">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <span className="underline cursor-pointer">privacy policy</span>.
              </p>

              {/* Submit Order Button matching screenshot */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#374151] hover:bg-[#1f2937] active:scale-[0.99] text-white font-bold text-base sm:text-lg rounded-xl shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'অর্ডার প্রক্রিয়াধীন...' : `🔒 অর্ডার করুন ${total.toFixed(2)}৳`}
                </span>
              </button>

            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
