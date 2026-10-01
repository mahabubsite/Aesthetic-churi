import React, { useState } from 'react';
import { BenefitsPromoCard } from './BenefitsPromoCard';
import { CheckCircle2, ChevronRight, Info } from 'lucide-react';

interface BenefitsSectionProps {
  onOrderClick: () => void;
  onUsageClick?: () => void;
}

interface BenefitItem {
  id: number;
  text: string;
  detail: string;
}

const benefitsData: BenefitItem[] = [
  {
    id: 1,
    text: 'ফ্যাটি লিভার ভালো করে',
    detail: 'বিটরুটে থাকা বেটেইন উপাদান লিভারে জমে থাকা চর্বি দূর করতে এবং লিভারের কোষ পুনর্গঠনে সহায়তা করে।',
  },
  {
    id: 2,
    text: 'উচ্চ রক্তচাপ এবং রক্তে শর্করার মাত্রা নিয়ন্ত্রণ',
    detail: 'প্রাকৃতিক নাইট্রেট রক্তনালী প্রসারিত করে রক্তপ্রবাহ সহজ করে এবং রক্তচাপ ও গ্লুকোজ লেভেল নিয়ন্ত্রণে রাখে।',
  },
  {
    id: 3,
    text: 'স্মৃতি শক্তি বাড়াতে সাহায্য করে',
    detail: 'মস্তিষ্কে রক্ত ও অক্সিজেনের সরবরাহ বৃদ্ধি করে স্মৃতিশক্তি এবং মস্তিষ্কের কার্যক্ষমতা তীক্ষ্ণ করে।',
  },
  {
    id: 4,
    text: 'উচ্চ রক্তচাপ নিয়ন্ত্রণে রাখে',
    detail: 'নিয়মিত বিটরুট জুস সেবনে সিস্টোলিক ও ডায়াস্টোলিক রক্তচাপ স্বাভাবিক মাত্রায় থাকে।',
  },
  {
    id: 5,
    text: 'হৃদরোগের সমস্যা কমায়',
    detail: 'অ্যান্টিঅক্সিডেন্ট ও পটাশিয়াম হৃদযন্ত্রের পেশী শক্তিশালী রাখে এবং হার্ট অ্যাটাকের ঝুঁকি হ্রাস করে।',
  },
  {
    id: 6,
    text: 'ডায়াবেটিস নিয়ন্ত্রণে রাখে',
    detail: 'বিটরুটের আলফা-লাইপোইক অ্যাসিড ইনসুলিনের সংবেদনশীলতা বাড়িয়ে সুগার স্পাইক রোধ করে।',
  },
  {
    id: 7,
    text: 'কিডনি ও লিভার ভালো রাখে',
    detail: 'শরীরের ক্ষতিকর টক্সিন ও বর্জ্য প্রস্রাবের মাধ্যমে বের করে দিয়ে কিডনি ও লিভারকে সতেজ রাখে।',
  },
  {
    id: 8,
    text: 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে',
    detail: 'ভিটামিন সি, জিংক ও আয়রনে ভরপুর যা শরীরের রোগ প্রতিরোধ ক্ষমতা বহুগুণ বাড়িয়ে দেয়।',
  },
];

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ onOrderClick, onUsageClick }) => {
  const [activeInfo, setActiveInfo] = useState<number | null>(null);

  return (
    <section id="benefits" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header matching screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#551627] tracking-tight mb-3">
            বিটরুটের উপকারিতা
          </h2>
          <p className="text-base sm:text-lg text-slate-700 font-medium">
            বিটরুট জুস নিয়মিত খেলে আমরা যে সব রোগ থেকে মুক্তি পাবো:
          </p>
        </div>

        {/* 2-Column Content matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Benefits Promo Banner Graphic */}
          <div className="lg:col-span-6 flex justify-center">
            <BenefitsPromoCard className="w-full max-w-[460px]" />
          </div>

          {/* Right Column: 8 Health Benefits List matching screenshot */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3.5">
              {benefitsData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveInfo(activeInfo === item.id ? null : item.id)}
                  className="group flex flex-col p-2.5 sm:p-3 rounded-xl hover:bg-rose-50/60 transition-all duration-200 cursor-pointer border border-transparent hover:border-rose-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Dark burgundy checkmark icon matching screenshot */}
                      <div className="w-6 h-6 rounded-full bg-[#551627] flex items-center justify-center shrink-0 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-[#551627] transition-colors">
                        {item.text}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-slate-400 group-hover:text-[#551627] p-1 transition-colors"
                      title="বিস্তারিত দেখুন"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expandable Health Detail */}
                  {activeInfo === item.id && (
                    <div className="mt-2 ml-9 p-3 bg-rose-50 rounded-lg text-xs sm:text-sm text-slate-700 leading-relaxed border-l-2 border-[#551627] animate-fadeIn">
                      <p>{item.detail}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Red Action Button matching screenshot */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onOrderClick}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-3.5 text-base sm:text-lg font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 rounded-full shadow-md shadow-red-900/30 transition-all duration-200 cursor-pointer border border-red-500/40"
              >
                অর্ডার করুন
              </button>

              {onUsageClick && (
                <button
                  onClick={onUsageClick}
                  type="button"
                  className="text-sm font-semibold text-[#551627] hover:underline flex items-center gap-1 cursor-pointer py-2"
                >
                  <span>কীভাবে খাবেন জানুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
