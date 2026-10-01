import React, { useState, useEffect, useRef } from 'react';
import { Star, ShieldCheck, ChevronLeft, ChevronRight, PlusCircle, X, Sparkles, Heart } from 'lucide-react';
import { CustomerReview, INITIAL_REVIEWS } from '../data/reviewsData';

interface CustomerReviewsProps {
  reviews?: CustomerReview[];
  onAddReview?: (review: CustomerReview) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews = [],
  onAddReview,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bangleName, setBangleName] = useState('');
  const [comment, setComment] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const reviewList = reviews || [];

  // Auto-slide carousel one by one (ektar por ekta asbe)
  useEffect(() => {
    if (isPaused || reviewList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviewList.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, reviewList.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewList.length) % reviewList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewList.length);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      location: location.trim() || 'বাংলাদেশ',
      rating,
      date: 'আজকে',
      comment: comment.trim(),
      bangleName: bangleName.trim() || 'Aesthetic কাস্টমাইজড চুড়ি',
      verified: true,
      createdAt: Date.now(),
    };

    onAddReview?.(newRev);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
      setName('');
      setLocation('');
      setBangleName('');
      setComment('');
      setRating(5);
      setCurrentIndex(0); // View the newly added review first
    }, 1200);
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 bg-white border-t border-rose-100/60 relative overflow-hidden">
      {/* Background Subtle Sparkle Accent */}
      <div className="absolute top-0 right-10 w-48 h-48 bg-amber-50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-48 h-48 bg-rose-50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Add Review Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200/80 mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>৪.৯ / ৫ রেটিং (১৫,০০০+ খুশী গ্রাহকের আস্থা)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#551627] tracking-tight">
              গ্রাহকদের বাস্তব অভিজ্ঞতা ও রিভিউ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              যাঁরা Aesthetic customized churi পরে নিজেদের সাজিয়েছেন এবং চমৎকার মতামত শেয়ার করেছেন
            </p>
          </div>

          {/* Add Review Trigger Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#551627] to-[#7f1d38] hover:from-[#430f1e] hover:to-[#5c1327] text-white font-bold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-amber-400/40 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>একটি রিভিউ দিন (Write Review)</span>
          </button>
        </div>

        {/* CAROUSEL SLIDER (Ektar Por Ekta Asbe) */}
        {reviewList.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-rose-200 text-center max-w-xl mx-auto shadow-xs my-4">
            <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2 opacity-80" />
            <h4 className="font-bold text-[#551627] text-base mb-1">এখনও কোনো কাস্টমার রিভিউ নেই</h4>
            <p className="text-xs text-slate-500 mb-4">
              আপনি প্রথম রিভিউ দিয়ে আপনার অভিজ্ঞতা শেয়ার করতে পারেন!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#551627] text-white font-bold text-xs rounded-full shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>রিভিউ লিখুন</span>
            </button>
          </div>
        ) : (
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Active Review Card Slide */}
          <div className="relative min-h-[220px] bg-gradient-to-b from-[#FCFAF7] to-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-xl shadow-rose-900/5 transition-all duration-500 flex flex-col justify-between">
            {/* Top Row: Stars + Date + Verified Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < (reviewList[currentIndex]?.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {reviewList[currentIndex]?.date}
                  </span>
                  {reviewList[currentIndex]?.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      ভেরিফাইড ক্রেতা
                    </span>
                  )}
                </div>
              </div>

              {/* Bangle Highlight Tag */}
              <div className="inline-block mb-3">
                <span className="text-xs font-bold text-[#551627] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/70 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>ক্রয়কৃত: {reviewList[currentIndex]?.bangleName}</span>
                </span>
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic font-serif">
                "{reviewList[currentIndex]?.comment}"
              </p>
            </div>

            {/* Bottom Row: Customer Name & City */}
            <div className="pt-4 mt-4 border-t border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#551627] to-amber-700 text-amber-200 font-bold flex items-center justify-center text-xs shadow-xs">
                  {reviewList[currentIndex]?.name?.slice(0, 2) || 'AC'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {reviewList[currentIndex]?.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {reviewList[currentIndex]?.location}
                  </span>
                </div>
              </div>

              {/* Slide Counter */}
              <span className="text-xs text-slate-400 font-mono">
                {currentIndex + 1} / {reviewList.length}
              </span>
            </div>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            type="button"
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 hover:text-[#551627] hover:border-amber-300 flex items-center justify-center transition-transform active:scale-90 cursor-pointer z-10"
            title="আগের রিভিউ"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            type="button"
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 hover:text-[#551627] hover:border-amber-300 flex items-center justify-center transition-transform active:scale-90 cursor-pointer z-10"
            title="পরের রিভিউ"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Indicators / Dots */}
          <div className="flex justify-center items-center gap-1.5 mt-5">
            {reviewList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                type="button"
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-[#551627]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`রিভিউ ${idx + 1}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        )}

      </div>

      {/* WRITE A REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#330812] to-[#551627] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base sm:text-lg font-serif text-amber-300">
                  আপনার রিভিউ ও রেটিং দিন
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <Star className="w-7 h-7 fill-emerald-500 text-emerald-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">ধন্যবাদ! আপনার মূল্যবান রিভিউটি যুক্ত হয়েছে</h4>
                <p className="text-xs text-slate-500">আপনার মতামত সাইটের কাস্টমার রিভিউ ক্যারোসালে প্রদর্শিত হবে।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-5 sm:p-6 space-y-4 text-xs">
                {/* Star Rating Selector */}
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-center space-y-1.5">
                  <label className="block text-slate-700 font-bold text-xs">
                    রেটিং সিলেক্ট করুন: ({rating} স্টার)
                  </label>
                  <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-200 text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      আপনার নাম <span className="text-rose-600">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: ফারিয়া ইসলাম"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      শহর / এলাকা:
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="যেমন: মিরপুর, ঢাকা"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                {/* Bangle / Product Name */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    কোন চুড়িটি কিনেছেন / কাস্টমাইজ করেছেন:
                  </label>
                  <input
                    type="text"
                    value={bangleName}
                    onChange={(e) => setBangleName(e.target.value)}
                    placeholder="যেমন: জয়পুরী গোল্ড প্লেটেড কাড়া সেট"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    আপনার অভিজ্ঞতা ও মন্তব্য <span className="text-rose-600">*</span>:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="চুড়ির সাইজ, ফিনিশিং, কোয়ালিটি ও সার্ভিস সম্পর্কে আপনার অনুভূতি লিখুন..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-amber-500 font-medium leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#551627] hover:bg-[#3f0f1c] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border border-amber-400/40"
                  >
                    রিভিউ সাবমিট করুন (Submit Review)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
