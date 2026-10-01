import React from 'react';
import { BangleProduct, BANGLES_PRODUCTS } from '../data/banglesData';
import { BangleIllustration } from './BangleIllustrations';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface SavedBanglesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProductIds: string[];
  onToggleSave: (productId: string) => void;
  onSelectProduct: (product: BangleProduct, selectedSize: string) => void;
  onExploreClick: () => void;
}

export const SavedBanglesModal: React.FC<SavedBanglesModalProps> = ({
  isOpen,
  onClose,
  savedProductIds,
  onToggleSave,
  onSelectProduct,
  onExploreClick,
}) => {
  if (!isOpen) return null;

  const savedProducts = BANGLES_PRODUCTS.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-[#5a1427] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-6 h-6 text-rose-300 fill-rose-300" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Saved Bangles (পছন্দের চুড়ি তালিকা)
            </h3>
          </div>
          <p className="text-xs text-rose-200">
            আপনার পছন্দের তালিকায় {savedProducts.length} টি চুড়ি সংরক্ষিত রয়েছে
          </p>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {savedProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-300">
                <Heart className="w-7 h-7 stroke-1" />
              </div>
              <p className="text-base font-bold text-slate-800">কোনো চুড়ি সংরক্ষিত নেই</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                পণ্য তালিকার চুড়িগুলোতে <strong>হার্ট (Heart)</strong> আইকনে ক্লিক করে আপনার পছন্দের চুড়ি সেভ করে রাখুন।
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onExploreClick();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5a1427] hover:bg-[#430c1b] text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <span>চুড়ি কালেকশন দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-rose-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <BangleIllustration type={product.imageType} className="w-14 h-14" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wide">
                          {product.category}
                        </span>
                        {product.sku && (
                          <span className="text-[9px] font-mono font-bold text-[#551627] bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                            {product.sku}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {product.setCount} • সাইজ: {product.sizes[0]}
                      </p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-extrabold text-[#551627] text-sm font-mono">
                          {product.price}৳
                        </span>
                        <span className="text-[11px] text-slate-400 line-through font-mono">
                          {product.originalPrice}৳
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <button
                      onClick={() => onToggleSave(product.id)}
                      type="button"
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(product, product.sizes[0]);
                      }}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>অর্ডার করুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              সর্বমোট {savedProducts.length} টি পছন্দের চুড়ি সংরক্ষিত
            </span>
            <button
              onClick={() => {
                onClose();
                onExploreClick();
              }}
              className="text-[#5a1427] hover:underline font-bold cursor-pointer"
            >
              আরও চুড়ি দেখুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
