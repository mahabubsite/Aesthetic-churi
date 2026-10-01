export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  bangleName: string;
  verified: boolean;
  createdAt: number;
}

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'ফারজানা ইয়াসমিন তন্নি',
    location: 'উত্তরা, ঢাকা',
    rating: 5,
    date: '২ দিন আগে',
    comment: 'Aesthetic customized churi থেকে আমার শাড়ির ম্যাচিং করে কাস্টমাইজড চুড়ি বানিয়ে নিয়েছিলাম। নিখুঁত ফিনিশিং এবং রঙ একদম পারফেক্ট মিলেছে! সত্যি অপূর্ব!',
    bangleName: 'কাস্টমাইজড কুন্দন ও সিল্ক কাড়া সেট',
    verified: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-2',
    name: 'নুসরাত জাহান রিমু',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    rating: 5,
    date: '৪ দিন আগে',
    comment: 'গোল্ড প্লেটেড জয়পুরী বালা সেটটা নিয়েছিলাম। ছবিতে যেমন দেখেছি বাস্তবে আরও বেশি গর্জিয়াস! ২-৬ সাইজ আমার হাতে একদম পারফেক্ট বসেছে। প্যাকেজিংটাও খুব সুন্দর ছিল।',
    bangleName: 'গোল্ড প্লেটেড জয়পুরী চুড়ি সেট',
    verified: true,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-3',
    name: 'তাসলিমা আক্তার',
    location: 'উপশহর, সিলেট',
    rating: 5,
    date: '১ সপ্তাহ আগে',
    comment: 'আমার বিয়ের অনুষ্ঠানের জন্য ব্রাইডাল চুড়া সেটটি কাস্টমাইজ করে অর্ডার করেছিলাম। কুন্দন আর লটকনের কাজগুলো একদম নিখুঁত ছিল। ধন্যবাদ Aesthetic customized churi টিমকে!',
    bangleName: 'রয়্যাল ব্রাইডাল চুড়া ও লটকন সেট',
    verified: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-4',
    name: 'সুমাইয়া জাহান',
    location: 'ধানমন্ডি, ঢাকা',
    rating: 5,
    date: '১ সপ্তাহ আগে',
    comment: 'কাচের রেশমি চুড়ির গ্লেজ আর টুংটাং মিষ্টি শব্দ মন কেড়ে নিয়েছে। ভেলভেট বক্সে খুব যত্ন সহকারে পৌঁছে দিয়েছে। আমি আবার অর্ডার করবো ইনশাআল্লাহ।',
    bangleName: 'ফিরোজাবাদী রেশমি কাচের চুড়ি (রয়েল মেরুন)',
    verified: true,
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-5',
    name: 'মেহজাবিন চৌধুরী',
    location: 'খুলনা সদর',
    rating: 5,
    date: '২ সপ্তাহ আগে',
    comment: 'যেকোনো পোশাকের সাথে মিলিয়ে চুড়ি বানানোর এমন দারুণ সুবিধা আগে দেখিনি। তাদের কাস্টমার সার্ভিস ও দ্রুত ডেলিভারির জন্য ৫ স্টার!',
    bangleName: 'হ্যান্ডমেড কাস্টমাইজড ব্রাইডাল কাড়া',
    verified: true,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  }
];
