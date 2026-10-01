import React, { useState, useRef } from 'react';
import { BangleProduct } from '../data/banglesData';
import { BangleIllustration } from './BangleIllustrations';
import {
  X,
  Star,
  ShoppingBag,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Check,
  Plus,
  Minus,
  Gift,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProductDetailModalProps {
  product: BangleProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: BangleProduct, size: string, quantity: number) => void;
  onBuyNow: (product: BangleProduct, size: string, quantity: number) => void;
  isSaved?: boolean;
  onToggleSave?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  isSaved = false,
  onToggleSave,
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '২-৬ (2.6)');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Check if product has custom uploaded images
  const hasUploadedImages = Boolean(product.images && product.images.length > 0);

  // Gallery angles representation for default vector artwork
  const galleryViews = [
    { id: 0, label: 'সামনের দৃশ্য', subtitle: 'পূর্ণাঙ্গ সেট' },
    { id: 1, label: 'হাতে পরা লুক', subtitle: 'আভিজাত্য লুক' },
    { id: 2, label: 'কারুকাজ ডিটেইল', subtitle: 'ক্লোজ-আপ' },
    { id: 3, label: 'গিফট বক্স প্যাকিং', subtitle: 'ভেলভেট বক্স' },
  ];

  const totalSlides = hasUploadedImages ? product.images!.length : galleryViews.length;

  const prevSlide = () => {
    setActiveImageIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveImageIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-rose-50 text-rose-800 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
              {product.category}
            </span>
            {product.sku && (
              <span className="text-xs bg-slate-100 text-slate-800 font-mono font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                SKU: {product.sku}
              </span>
            )}
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              স্টকে আছে
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(product.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600'
                }`}
                title={isSaved ? "উইশলিস্ট থেকে সরান" : "উইশলিস্টে যুক্ত করুন"}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
              </button>
            )}

            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* PRODUCT PHOTO CAROUSEL (Slider with Arrows, Touch-Swipe & Dots) */}
          <div className="relative group">
            {/* Carousel Display Stage */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-slate-50 border border-slate-200 flex items-center justify-center p-4 overflow-hidden shadow-inner select-none"
            >
              {/* Badges on Top Left */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.isBestSeller && (
                  <span className="bg-[#b91c1c] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    বেস্টসেলার
                  </span>
                )}
                {product.isPopular && (
                  <span className="bg-[#d97706] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    জনপ্রিয়
                  </span>
                )}
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md font-mono self-start">
                  -{discountPercent}% ছাড়
                </span>
              </div>

              {/* Angle watermark tag on Top Right */}
              <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs pointer-events-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>
                  {activeImageIndex + 1}/{totalSlides} • {hasUploadedImages ? `ছবি ${activeImageIndex + 1}` : galleryViews[activeImageIndex].label}
                </span>
              </div>

              {/* Prev / Next Carousel Arrow Buttons */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200 transition-all hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next photo"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200 transition-all hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Display Current Active Photo Slide */}
              <div className="transition-all duration-300 transform flex items-center justify-center w-full h-full">
                {hasUploadedImages ? (
                  <div className="flex items-center justify-center w-full h-full p-2 animate-fadeIn">
                    <img
                      src={product.images![activeImageIndex]}
                      alt={`${product.name} ছবি ${activeImageIndex + 1}`}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-md"
                    />
                  </div>
                ) : (
                  <>
                    {activeImageIndex === 0 && (
                      <div className="flex flex-col items-center animate-fadeIn">
                        <BangleIllustration type={product.imageType} className="w-56 h-48 sm:w-64 sm:h-56" />
                      </div>
                    )}
                    {activeImageIndex === 1 && (
                      <div className="relative flex flex-col items-center animate-fadeIn">
                        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-amber-300/70 p-2 bg-gradient-to-tr from-rose-900 to-amber-900 shadow-xl flex items-center justify-center">
                          <BangleIllustration type={product.imageType} className="w-40 h-40 scale-110" />
                        </div>
                        <span className="text-[10px] font-bold text-rose-900 mt-2 bg-rose-100/90 px-3 py-0.5 rounded-full shadow-2xs">
                          হাতে পরা অবস্থায় রয়্যাল লুক
                        </span>
                      </div>
                    )}
                    {activeImageIndex === 2 && (
                      <div className="relative flex flex-col items-center animate-fadeIn">
                        <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-dashed border-amber-400 shadow-md">
                          <BangleIllustration type={product.imageType} className="w-48 h-48 sm:w-56 sm:h-56 scale-125" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-900 mt-2 bg-amber-100/90 px-3 py-0.5 rounded-full shadow-2xs">
                          নিখুঁত ১ গ্রাম গোল্ড ও কাচের কারুকাজ
                        </span>
                      </div>
                    )}
                    {activeImageIndex === 3 && (
                      <div className="relative flex flex-col items-center text-center animate-fadeIn">
                        <div className="w-48 h-36 sm:w-56 sm:h-44 rounded-2xl bg-gradient-to-br from-[#551627] to-[#25030b] border-2 border-amber-400/80 p-4 shadow-xl flex items-center justify-center text-white">
                          <div className="space-y-1">
                            <Gift className="w-8 h-8 text-amber-300 mx-auto animate-bounce" />
                            <p className="font-bold text-xs text-amber-200">প্রিমিয়াম ভেলভেট জুয়েলারি বক্স</p>
                            <p className="text-[10px] text-rose-200">সুরক্ষিত প্যাকেজিংসহ ফ্রি ডেলিভারি বক্স</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#551627] mt-2 bg-rose-100/90 px-3 py-0.5 rounded-full shadow-2xs">
                          উপহার দেওয়ার জন্য সম্পূর্ণ প্রস্তুত
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Carousel Pagination Dots at Bottom Center */}
              <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center gap-1.5 z-10 pointer-events-auto">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeImageIndex === idx
                        ? 'w-6 h-2 bg-[#551627] shadow-xs'
                        : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile swipe instruction */}
            <div className="text-center pt-1.5">
              <span className="text-[11px] text-slate-400 font-medium">
                👈 সোয়াইপ করুন বা অ্যারো চিহ্নে ক্লিক করে অন্যান্য ছবি দেখুন 👉
              </span>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1 flex-wrap gap-1">
                <div className="flex items-center gap-1 font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount} কাস্টমার রিভিউ)</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-[#551627] font-semibold">{product.setCount}</span>
                  {product.sku && (
                    <span className="font-mono text-xs font-bold text-[#551627] bg-amber-50 px-2 py-0.5 rounded border border-amber-300 shadow-2xs">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 p-3 rounded-xl bg-rose-50/60 border border-rose-100">
              <span className="text-2xl sm:text-3xl font-black text-[#551627] font-mono">
                {product.price}৳
              </span>
              <span className="text-sm text-slate-400 line-through font-mono">
                {product.originalPrice}৳
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full ml-auto">
                আপনি বাঁচাচ্ছেন {product.originalPrice - product.price}৳
              </span>
            </div>

            {/* Size Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800">
                  সাইজ নির্বাচন করুন:
                </label>
                <span className="text-[11px] text-rose-800 font-semibold">
                  নির্বাচিত: <strong className="font-bold">{selectedSize}</strong>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#551627] text-white shadow-sm ring-2 ring-rose-900/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-800">পরিমাণ (সেট):</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm font-mono text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Key Trust Highlights */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>২৪-৪৮ ঘণ্টায় দ্রুত ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>১০০% খাঁটি কোয়ালিটি গ্যারান্টি</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions (Add to Cart & Buy Now) */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-t border-slate-200 flex items-center gap-3">
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCartClick}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>কার্টে যোগ হয়েছে!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-amber-900" />
                <span>কার্টে যোগ করুন</span>
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNowClick}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md shadow-red-900/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>সরাসরি অর্ডার করুন ({product.price * quantity}৳)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
