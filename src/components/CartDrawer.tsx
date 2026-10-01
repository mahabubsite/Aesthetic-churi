import React from 'react';
import { BangleProduct } from '../data/banglesData';
import { BangleIllustration } from './BangleIllustrations';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';

export interface CartItem {
  product: BangleProduct;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onExplore,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slideLeft">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">আপনার শপিং কার্ট</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalCount > 0 ? `মোট ${totalCount} সেট চুড়ি নির্বাচিত` : 'কার্ট খালি'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-700 text-sm">আপনার কার্ট বর্তমানে খালি</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                আমাদের প্রিমিয়াম চুড়ি কালেকশন থেকে আপনার পছন্দের চুড়ি কার্টে যোগ করুন।
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExplore();
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#551627] text-white font-bold text-xs shadow-md hover:bg-[#430f1e] cursor-pointer"
              >
                <span>চুড়ি কালেকশন দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${item.size}-${index}`}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex items-center justify-between gap-3 text-xs"
              >
                {/* Product Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-50 to-rose-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
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

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-xs truncate">
                    {item.product.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center flex-wrap gap-1.5 mt-0.5">
                    {item.product.sku && (
                      <span className="font-mono text-[9px] font-bold text-[#551627] bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                        {item.product.sku}
                      </span>
                    )}
                    <span className="bg-white px-1.5 py-0.2 rounded border border-slate-200 font-semibold text-rose-800 text-[10px]">
                      সাইজ: {item.size}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {item.product.price}৳
                    </span>
                  </div>
                </div>

                {/* Stepper & Total */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(index, -1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs font-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(index, 1)}
                      className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-xs text-[#551627]">
                      {item.product.price * item.quantity}৳
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>সাবটোটাল ({totalCount} সেট):</span>
              <span className="font-mono font-extrabold text-base text-[#551627]">
                {subtotal}৳
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              * ডেলিভারি চার্জ চেকআউট পেজে এরিয়া অনুযায়ী যুক্ত হবে
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3 px-4 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>চেকআউট করুন ({subtotal}৳)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-center text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                আরো চুড়ি পছন্দ করুন
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
