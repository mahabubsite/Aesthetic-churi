export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isDefault?: boolean;
}

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-1', name: 'কাচের চুড়ি', slug: 'glass-bangles', description: 'আসল রেশমি ও ফিরোজাবাদী কাচের চুড়ি' },
  { id: 'cat-2', name: 'গোল্ড প্লেটেড', slug: 'gold-plated', description: '১ গ্রাম গোল্ড প্লেটিং জয়পুরী বালা' },
  { id: 'cat-3', name: 'ব্রাইডাল চুড়া', slug: 'bridal-chuda', description: 'বিয়ে ও ব্রাইডাল স্পেশাল রাজকীয় সেট' },
  { id: 'cat-4', name: 'কাস্টমাইজড চুড়ি', slug: 'customized-churi', description: 'হাতের ছোঁয়াতেই কাস্টম কালার ও ডিজাইন' },
  { id: 'cat-5', name: 'ভেলভেট ও রেশmi', slug: 'velvet-silk', description: 'সফট ভেলভেট ও গর্জিয়াস রেশমি চুড়ি' },
  { id: 'cat-6', name: 'কুন্দন ও অ্যান্টিক', slug: 'kundan-antique', description: 'সূক্ষ্ম কুন্দন পাথর ও অ্যান্টিক পলিশ' },
  { id: 'cat-7', name: 'লটকন ও ঝুমকা চুড়ি', slug: 'latkan-jhumka', description: 'হাতের সৌন্দর্য বাড়াতে ঝুলন্ত লটকন ও ঝুমকা' },
];
