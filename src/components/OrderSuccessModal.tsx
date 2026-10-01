import React, { useState } from 'react';
import { OrderData } from './OrderPage';
import { CheckCircle, Download, MessageCircle, X, Loader2, Check, ShieldCheck, Printer, Sparkles, Gem } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { toPng } from 'html-to-image';

interface OrderSuccessModalProps {
  order: OrderData | null;
  onClose: () => void;
  siteName?: string;
  logoUrl?: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  siteName = 'Aesthetic customized churi',
  logoUrl = '/churilogo.png',
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!order) return null;

  const handleDownloadReceiptImage = async () => {
    const invoiceElement = document.getElementById('printable-invoice');
    if (!invoiceElement) return;

    try {
      setIsDownloading(true);

      // Brief delay to ensure all DOM elements are painted
      await new Promise((resolve) => setTimeout(resolve, 200));

      let dataUrl = '';

      try {
        // html2canvas-pro has native support for modern CSS color spaces including oklch(), lab(), and Tailwind CSS v4
        const canvas = await html2canvas(invoiceElement, {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FCFAF7',
          logging: false,
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('printable-invoice');
            if (el) {
              // Ensure crisp rendering without mobile overflow
              el.style.transform = 'none';
              el.style.maxWidth = '750px';
              el.style.margin = '0 auto';
            }
          },
        });
        dataUrl = canvas.toDataURL('image/png');
      } catch (canvasErr) {
        console.warn('html2canvas-pro capture failed, attempting html-to-image fallback:', canvasErr);
        // Fallback to html-to-image with skipFonts to avoid remote stylesheet CORS rules
        dataUrl = await toPng(invoiceElement, {
          quality: 0.95,
          pixelRatio: 2,
          skipFonts: true,
          backgroundColor: '#FCFAF7',
          cacheBust: true,
        });
      }

      if (!dataUrl) {
        throw new Error('Failed to generate image data URL');
      }

      const downloadLink = document.createElement('a');
      downloadLink.download = `Aesthetic-Customized-Churi-Receipt-${order.orderId}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating receipt image:', err);
      // Fallback: trigger print dialog if canvas capture fails
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const items =
    order.items && order.items.length > 0
      ? order.items
      : order.product
      ? [
          {
            id: order.product.id,
            productId: order.product.id,
            sku: order.product.sku,
            name: order.product.name,
            imageType: order.product.imageType,
            size: order.selectedSize || '২-৬ (2.6)',
            quantity: order.quantity || 1,
            unitPrice: order.unitPrice || order.product.price,
            subtotal: order.subtotal,
          },
        ]
      : [];

  const itemsText = items.map((i) => `${i.name} [SKU: ${i.sku || 'N/A'}] (সাইজ: ${i.size}, ${i.quantity}টি)`).join(', ');

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি Aesthetic customized churi থেকে চুড়ি অর্ডার করেছি।\nঅর্ডার আইডি: #${order.orderId}\nপণ্যসমূহ: ${itemsText}\nনাম: ${order.customerName}\nমোবাইল: ${order.phone}\nমোট বিল: ${order.total}৳`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-6 border border-amber-500/30">
        
        {/* Top Header Notification Bar */}
        <div className="bg-gradient-to-r from-[#330812] via-[#520f20] to-[#330812] text-white p-4 sm:p-5 text-center relative border-b-2 border-[#D4AF37]">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-xs border border-amber-300 shadow-md">
            <CheckCircle className="w-6 h-6 text-amber-300" />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-amber-300 tracking-tight font-serif">
            ধন্যবাদ! আপনার চুড়ির অর্ডারটি সফল হয়েছে
          </h3>
          <p className="text-xs text-rose-100/90 mt-1 max-w-md mx-auto">
            নিচে আপনার অফিসিয়াল ইনভয়েস রসিদ প্রস্তুত করা হয়েছে। আপনি এটি প্রিমিয়াম ইমেজ হিসেবে ডাউনলোড করে সংরক্ষণ করুন।
          </p>
        </div>

        {/* ULTRA-PREMIUM ROYAL JEWELRY INVOICE RECEIPT (CAPTURED AS HIGH-RES IMAGE) */}
        <div className="p-2 sm:p-5 bg-stone-100/70 overflow-x-auto">
          <div
            id="printable-invoice"
            className="w-full bg-[#FCFAF7] rounded-2xl p-5 sm:p-7 shadow-xl border-2 border-[#C5A059] relative text-slate-800 space-y-4"
            style={{
              boxShadow: '0 10px 30px -5px rgba(85, 22, 39, 0.15), 0 0 0 1px #E6CA65',
            }}
          >
            {/* Delicate Inner Decorative Gold Border */}
            <div className="absolute inset-2 border border-[#D4AF37]/40 pointer-events-none rounded-xl" />

            {/* Corner Filigree Flourish Accents */}
            <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#9A7B38]" />
            <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#9A7B38]" />
            <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#9A7B38]" />
            <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#9A7B38]" />

            {/* Royal Invoice Header */}
            <div className="border-b-2 border-[#4A0E1C] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start mb-1.5">
                  <img
                    src={logoUrl || '/churilogo.png'}
                    alt={siteName}
                    className="h-12 sm:h-14 w-auto max-w-[220px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/churilogo.png';
                    }}
                  />
                </div>
                <p className="text-[11px] text-stone-600 font-medium">
                  অফিসিয়াল ক্রয় ইনভয়েস ও অথেনটিসিটি সার্টিফিকেট • 100% Authentic
                </p>
              </div>

              {/* Invoice Meta Tag Box */}
              <div className="bg-[#3D0A16] text-white px-4 py-2.5 rounded-xl border border-amber-400/80 shadow-sm text-center sm:text-right min-w-[190px]">
                <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-widest">
                  OFFICIAL INVOICE
                </span>
                <span className="text-base font-black font-mono text-white tracking-wider block">
                  #{order.orderId}
                </span>
                <span className="text-[10px] text-rose-200 block font-mono mt-0.5">
                  তারিখ: {order.orderDate}
                </span>
              </div>
            </div>

            {/* Customer & Order Verification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Customer Box */}
              <div className="bg-white/80 p-3 rounded-xl border border-stone-200/90 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#4A0E1C] tracking-wider block border-b border-stone-200 pb-1 flex items-center justify-between">
                  <span>গ্রাহকের বিবরণ (Customer Details)</span>
                  <span className="text-stone-400 font-mono text-[9px]">VERIFIED</span>
                </span>
                <div className="pt-0.5">
                  <span className="text-stone-500 text-[10px] block">গ্রাহকের নাম:</span>
                  <span className="font-bold text-stone-900 text-sm block">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-stone-900 block">{order.phone}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">ডেলিভারি ঠিকানা:</span>
                  <span className="text-stone-800 font-medium leading-tight block">{order.address}</span>
                </div>
              </div>

              {/* Delivery & Payment Box */}
              <div className="bg-white/80 p-3 rounded-xl border border-stone-200/90 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#4A0E1C] tracking-wider block border-b border-stone-200 pb-1 flex items-center justify-between">
                  <span>পেমেন্ট ও ডেলিভারি বিবরণ</span>
                  <span className="text-stone-400 font-mono text-[9px]">DISPATCH READY</span>
                </span>
                <div className="flex justify-between pt-0.5">
                  <span className="text-stone-500">ডেলিভারি এলাকা:</span>
                  <span className="font-bold text-stone-800">
                    {order.shippingArea === 'dhaka' ? 'ঢাকার ভেতরে (২৪ ঘণ্টা)' : 'ঢাকার বাইরে (৪৮ ঘণ্টা)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">পেমেন্ট মাধ্যম:</span>
                  <span className="uppercase font-bold text-[#551627] font-mono">
                    {order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (COD)' : order.paymentMethod}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">TrxID:</span>
                    <span className="font-mono font-bold text-emerald-700">{order.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-stone-200">
                  <span className="text-stone-500">অর্ডার স্ট্যাটাস:</span>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-300">
                    ✓ নিশ্চিত অর্ডার (CONFIRMED)
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table with SKU prominently featured */}
            <div className="rounded-xl border border-stone-300 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#4A0E1C] text-amber-200 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">চুড়ির বিবরণ ও SKU</th>
                    <th className="py-2.5 px-3 text-center">সাইজ</th>
                    <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                    <th className="py-2.5 px-3 text-right">একক মূল্য</th>
                    <th className="py-2.5 px-3 text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/20">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-stone-900 block leading-snug">{item.name}</span>
                        {item.sku ? (
                          <span className="font-mono text-[10px] text-[#4A0E1C] font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300 inline-block mt-0.5">
                            SKU: {item.sku}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-stone-400 inline-block mt-0.5">
                            SKU: CDB-GLD-01
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-[#551627]">
                        {item.size}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-stone-800">
                        {item.quantity} সেট
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-stone-700">
                        {item.unitPrice}৳
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#4A0E1C]">
                        {item.subtotal}৳
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculation & Total Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              {/* Packaging & Authenticity Note */}
              <div className="space-y-1.5 text-[11px] text-stone-700 max-w-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>১০০% খাঁটি কোয়ালিটি ও ফিনিশিং গ্যারান্টি</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  * পার্সেলটি সুরক্ষিত প্রিমিয়াম ভেলভেট জুয়েলারি বক্সে প্যাকিং করা হয়েছে। ডেলিভারি এজেন্টের সামনে পার্সেল চেক করে গ্রহণ করার সুযোগ রয়েছে।
                </p>
              </div>

              {/* Bill Breakdown Card */}
              <div className="w-full sm:w-64 bg-white/95 rounded-xl p-3.5 border border-stone-200 shadow-2xs space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono font-bold">{order.subtotal}৳</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono font-bold">{order.shippingCost}৳</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>ভেলভেট জুয়েলারি বক্স:</span>
                  <span className="font-bold text-emerald-700 font-mono">ফ্রি (০৳)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t-2 border-[#4A0E1C] text-sm font-black text-[#4A0E1C]">
                  <span>সর্বমোট প্রদেয় বিল:</span>
                  <span className="font-mono text-lg text-[#991B1B]">{order.total}৳</span>
                </div>
              </div>
            </div>

            {/* Official Seal & Barcode Footer */}
            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] text-stone-600">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 bg-amber-100 border border-amber-300 rounded font-mono font-bold text-[#4A0E1C] tracking-wider">
                  VERIFIED AUTHENTIC
                </div>
                <span className="font-mono font-semibold">হটলাইন: +8801516-566277</span>
              </div>

              {/* Barcode & Security Hash */}
              <div className="flex flex-col items-center sm:items-end">
                {/* SVG Barcode Representation */}
                <svg className="h-6 w-36" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <rect x="0" y="0" width="2" height="20" fill="#1c1917" />
                  <rect x="4" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="7" y="0" width="3" height="20" fill="#1c1917" />
                  <rect x="12" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="15" y="0" width="2" height="20" fill="#1c1917" />
                  <rect x="19" y="0" width="4" height="20" fill="#1c1917" />
                  <rect x="25" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="28" y="0" width="2" height="20" fill="#1c1917" />
                  <rect x="32" y="0" width="3" height="20" fill="#1c1917" />
                  <rect x="37" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="40" y="0" width="2" height="20" fill="#1c1917" />
                  <rect x="44" y="0" width="4" height="20" fill="#1c1917" />
                  <rect x="50" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="53" y="0" width="3" height="20" fill="#1c1917" />
                  <rect x="58" y="0" width="2" height="20" fill="#1c1917" />
                  <rect x="62" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="65" y="0" width="3" height="20" fill="#1c1917" />
                  <rect x="70" y="0" width="2" height="20" fill="#1c1917" />
                  <rect x="74" y="0" width="4" height="20" fill="#1c1917" />
                  <rect x="80" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="83" y="0" width="2" height="20" fill="#1c1917" />
                  <rect x="87" y="0" width="3" height="20" fill="#1c1917" />
                  <rect x="92" y="0" width="1" height="20" fill="#1c1917" />
                  <rect x="95" y="0" width="3" height="20" fill="#1c1917" />
                </svg>
                <span className="font-mono text-[9px] text-stone-400 mt-0.5">
                  ID: #{order.orderId} • Aesthetic customized churi AUTHENTICATED
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons: Premium Image Receipt Download & WhatsApp Share */}
        <div className="p-3.5 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button
            onClick={handleDownloadReceiptImage}
            disabled={isDownloading}
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-bold rounded-xl transition-all cursor-pointer text-xs sm:text-sm shadow-md active:scale-95 ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#4A0E1C] hover:bg-[#380914] text-white border border-amber-500/40'
            }`}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>রসিদ ইমেজ তৈরি হচ্ছে...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>রসিদ ইমেজ ডাউনলোড সম্পন্ন হয়েছে!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>রসিদ ডাউনলোড করুন (Download Receipt)</span>
              </>
            )}
          </button>

          <a
            href={`https://wa.me/8801516566277?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl transition-colors cursor-pointer text-xs sm:text-sm shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন</span>
          </a>
        </div>

      </div>
    </div>
  );
};
