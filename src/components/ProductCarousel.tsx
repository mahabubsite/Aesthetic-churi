import React, { useState, useRef } from 'react';
import { BangleProduct, BANGLES_PRODUCTS } from '../data/banglesData';
import { BangleIllustration } from './BangleIllustrations';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';

interface ProductCarouselProps {
  products?: BangleProduct[];
  availableCategories?: string[];
  onSelectProduct: (product: BangleProduct, selectedSize: string) => void;
  onViewProduct?: (product: BangleProduct) => void;
  onAddToCart?: (product: BangleProduct, selectedSize: string) => void;
  savedProductIds?: string[];
  onToggleSave?: (productId: string) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  availableCategories,
  onSelectProduct,
  onViewProduct,
  onAddToCart,
  savedProductIds = [],
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  const [productSizes, setProductSizes] = useState<Record<string, string>>({});
  const [cartAddedId, setCartAddedId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const allProducts = products || [];

  // Dynamically compute category tabs from props or products
  const productCats = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));
  const categories = ['সব', ...(availableCategories && availableCategories.length > 0 ? availableCategories : productCats)];

  const filteredProducts = selectedCategory === 'সব'
    ? allProducts
    : allProducts.filter((p) => p.category === selectedCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSizeChange = (productId: string, size: string) => {
    setProductSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCartClick = (e: React.MouseEvent, product: BangleProduct, size: string) => {
    e.stopPropagation();
    onAddToCart?.(product, size);
    setCartAddedId(product.id);
    setTimeout(() => setCartAddedId(null), 1500);
  };

  return (
    <section id="our-products" className="pt-6 pb-12 md:pt-8 md:pb-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#551627] tracking-tight">
            প্রিমিয়াম চুড়ি কালেকশন
          </h2>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-rose-900 transition-colors shadow-2xs cursor-pointer active:scale-90"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-rose-900 transition-colors shadow-2xs cursor-pointer active:scale-90"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#551627] text-white shadow-md shadow-rose-950/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Carousel Container */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-rose-200 p-8 text-center max-w-lg mx-auto shadow-xs my-6">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
            <h3 className="font-bold text-[#551627] text-base mb-1">
              ডাটাবেজে কোনো প্রোডাক্ট পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500">
              আপনার Firebase ডাটাবেজে নতুন কাস্টমাইজড চুড়ি প্রোডাক্ট যুক্ত করতে অ্যাডমিন প্যানেল ব্যবহার করুন।
            </p>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-3.5 sm:gap-6 overflow-x-auto pb-5 sm:pb-8 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 touch-pan-x"
          >
            {filteredProducts.map((product) => {
              const currentSize = productSizes[product.id] || product.sizes[0];
              const isSaved = savedProductIds.includes(product.id);
              const isJustAdded = cartAddedId === product.id;
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <div
                  key={product.id}
                  onClick={() => onViewProduct?.(product)}
                  className="w-[76vw] max-w-[275px] sm:w-[305px] md:w-[325px] shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between overflow-hidden snap-start group cursor-pointer"
                >
                  {/* Product Image Stage */}
                  <div className="relative bg-gradient-to-b from-rose-50/60 to-amber-50/40 p-2.5 sm:p-4 border-b border-slate-100 flex items-center justify-center min-h-[175px] sm:min-h-[200px]">
                    {/* Badges on Top Left */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
                      {product.isBestSeller && (
                        <span className="bg-[#b91c1c] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                          বেস্টসেলার
                        </span>
                      )}
                    {product.isPopular && (
                      <span className="bg-[#d97706] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        জনপ্রিয়
                      </span>
                    )}
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md font-mono self-start">
                      -{discountPercent}% ছাড়
                    </span>
                  </div>

                  {/* Top Right Action Buttons: Wishlist & Quick Add to Cart */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 flex items-center gap-1.5">
                    {/* Quick Add to Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCartClick(e, product, currentSize)}
                      aria-label="Add to cart"
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md backdrop-blur-md active:scale-90 ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white scale-110'
                          : 'bg-white/95 text-slate-600 hover:text-amber-800 hover:bg-amber-50 border border-amber-200/80 hover:scale-105'
                      }`}
                      title="কার্টে যোগ করুন"
                    >
                      {isJustAdded ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>

                    {/* Premium Jewel Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave?.(product.id);
                      }}
                      aria-label={isSaved ? "Saved to wishlist" : "Add to wishlist"}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md backdrop-blur-md active:scale-90 ${
                        isSaved
                          ? 'bg-gradient-to-tr from-rose-600 to-rose-700 text-white ring-2 ring-amber-300/80 shadow-rose-900/30 scale-105'
                          : 'bg-white/95 text-slate-400 hover:text-rose-600 hover:bg-white border border-amber-200/60 hover:border-rose-300 hover:scale-105'
                      }`}
                      title={isSaved ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় সংরক্ষণ করুন"}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                          isSaved ? 'fill-white text-white drop-shadow-xs' : 'stroke-[2]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bangle Illustration or Custom Uploaded Image */}
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-40 h-32 sm:w-48 sm:h-40 object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : product.imageType ? (
                    <BangleIllustration type={product.imageType as any} className="w-40 h-32 sm:w-48 sm:h-40 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-40 h-32 sm:w-48 sm:h-40 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-tr from-amber-50 to-rose-50 rounded-xl border border-amber-200/60 group-hover:scale-105 transition-transform duration-300">
                      <Sparkles className="w-8 h-8 text-amber-500 mb-1 animate-pulse" />
                      <span className="text-[10px] font-bold text-[#551627]">Aesthetic কাস্টমাইজড চুড়ি</span>
                      <span className="text-[9px] text-slate-500 mt-0.5">অর্ডার অনুযায়ী স্পেশাল ডিজাইন</span>
                    </div>
                  )}

                  {/* Quick View Tag on Bottom */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>বিস্তারিত দেখুন</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
                  <div>
                    {/* Category, SKU & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-rose-800 text-[11px] sm:text-xs">{product.category}</span>
                        {product.sku && (
                          <span className="text-[10px] font-mono font-bold text-[#551627] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shadow-2xs">
                            SKU: {product.sku}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 font-bold text-slate-700 text-[11px] sm:text-xs">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Customization Note Badge */}
                    {product.customizationNote && (
                      <div className="mb-1">
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>{product.customizationNote}</span>
                        </span>
                      </div>
                    )}

                    {/* Name */}
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-[#551627] transition-colors">
                      {product.name}
                    </h3>

                    {/* Set details */}
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                      প্যাক সাইজ: <span className="font-semibold text-slate-700">{product.setCount}</span>
                    </p>

                    {/* Size Selector */}
                    <div className="mt-2.5 sm:mt-3" onClick={(e) => e.stopPropagation()}>
                      <label className="text-[10px] sm:text-[11px] font-bold text-slate-600 block mb-1">
                        সাইজ পছন্দ করুন:
                      </label>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {product.sizes.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleSizeChange(product.id, sz)}
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                              currentSize === sz
                                ? 'bg-[#551627] text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="pt-2.5 sm:pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-baseline justify-between mb-2.5 sm:mb-3">
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="text-lg sm:text-xl font-extrabold text-[#551627] font-mono">
                          {product.price}৳
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-400 line-through font-mono">
                          {product.originalPrice}৳
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ইন স্টক
                      </span>
                    </div>

                    {/* Action Buttons: Add to Cart + Buy Now */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCartClick(e, product, currentSize)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                        title="কার্টে যোগ করুন"
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>যোগ হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>কার্ট</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product, currentSize)}
                        className="flex-2 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>অর্ডার করুন</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        )}

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-center gap-2 pt-2 text-slate-400 text-[11px] font-medium">
          <span>👈 ডানে-বামে সোয়াইপ করুন | ক্লিক করে বিস্তারিত দেখুন 👉</span>
        </div>

        {/* Carousel indicator footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-medium">
            ছবি বা কার্ডে ক্লিক করে একাধিক অ্যাঙ্গেলের ছবি ও বিস্তারিত দেখুন
          </p>
        </div>
      </div>
    </section>
  );
};
