export interface PaymentMethodConfig {
  id: string; // 'cod', 'bkash', 'nagad', 'rocket', 'upay' or custom
  name: string;
  iconUrl?: string; // custom icon URL or uploaded image data
  accountNumber?: string;
  accountType?: 'Personal' | 'Merchant' | 'Agent';
  instructions?: string;
  isActive: boolean;
}

export interface StoreSettings {
  shippingInsideDhaka: number;
  shippingOutsideDhaka: number;
  shippingEmergency: number; // Emergency fast delivery charge
  hotlinePhone: string;
  whatsappNumber: string;
  storeEmail?: string;
  storeAddress?: string;
  storeWorkingHours?: string;
  topbarContactText?: string;
  merchantBkash: string;
  merchantNagad: string;
  merchantRocket: string;
  merchantUpay: string;
  announcementText: string;
  adminPin: string;
  // Site Identity & Separate Branding Logos
  siteName: string;
  logoUrl?: string; // fallback / default
  headerLogoUrl?: string; // Top Site / Navbar Logo
  footerLogoUrl?: string; // Footer Logo
  detailsTagline?: string;
  // Hero & Comparison custom square images
  heroSquareImage?: string;
  comparisonSquareImage?: string;
  // Social Media links
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  // Dynamic Payment Methods configuration
  paymentMethods?: PaymentMethodConfig[];
  // Promotional Offer Popup
  promoPopupEnabled?: boolean;
  promoPopupImage?: string;
  promoPopupTitle?: string;
  promoPopupText?: string;
  promoPopupButtonText?: string;
  promoPopupButtonUrl?: string;
}

export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'cod',
    name: 'ক্যাশ অন ডেলিভারি (Cash On Delivery)',
    iconUrl: '',
    accountNumber: '',
    accountType: 'Personal',
    instructions: 'পণ্য হাতে পেয়ে ডেলিভারিম্যানকে মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।',
    isActive: true,
  },
  {
    id: 'bkash',
    name: 'বিকাশ (bKash)',
    iconUrl: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/bkash.png',
    accountNumber: '01712-345678',
    accountType: 'Personal',
    instructions: 'আমাদের বিকাশ পার্সোনাল নাম্বারে সেন্ড মানি করুন। এরপর নিচে আপনার বিকাশ নাম্বার ও ট্রানজেকশন আইডি (TrxID) লিখুন।',
    isActive: true,
  },
  {
    id: 'nagad',
    name: 'নগদ (Nagad)',
    iconUrl: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/nagad.png',
    accountNumber: '01912-345678',
    accountType: 'Personal',
    instructions: 'আমাদের নগদ পার্সোনাল নাম্বারে সেন্ড মানি করুন এবং ট্রানজেকশন আইডি (TrxID) প্রদান করুন।',
    isActive: true,
  },
  {
    id: 'rocket',
    name: 'রকেট (Rocket)',
    iconUrl: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/rocket.png',
    accountNumber: '01812-3456789',
    accountType: 'Personal',
    instructions: 'আমাদের রকেট নাম্বারে টাকা পাঠিয়ে আপনার রকেট নাম্বার ও TrxID নিচে লিখুন।',
    isActive: true,
  },
  {
    id: 'upay',
    name: 'উপায় (Upay)',
    iconUrl: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/upay.png',
    accountNumber: '01512-345678',
    accountType: 'Personal',
    instructions: 'আমাদের উপায় ওয়ালেটে টাকা পাঠিয়ে TrxID প্রদান করুন।',
    isActive: true,
  },
];

export const DEFAULT_SETTINGS: StoreSettings = {
  shippingInsideDhaka: 80,
  shippingOutsideDhaka: 120,
  shippingEmergency: 180, // Emergency fast delivery charge
  hotlinePhone: '+8801516-566277',
  whatsappNumber: '8801516566277',
  storeEmail: 'aestheticcustomizedchuri@gmail.com',
  storeAddress: 'ঢাকা, বাংলাদেশ',
  storeWorkingHours: 'সকাল ৯:০০ টা - রাত ১০:০০ টা (প্রতিদিন)',
  topbarContactText: 'হটলাইন:',
  merchantBkash: '01712-345678',
  merchantNagad: '01912-345678',
  merchantRocket: '01812-3456789',
  merchantUpay: '01512-345678',
  announcementText: 'আজকের স্পেশাল অফার: যেকোনো ২টি চুড়ি সেটে ফ্রি প্রিমিয়াম গিফট বক্স!',
  adminPin: '1234',
  siteName: 'Aesthetic customized churi',
  logoUrl: '/churilogo.png',
  headerLogoUrl: '/churilogo.png',
  footerLogoUrl: '/churilogo.png',
  detailsTagline: 'হাতের ছোঁয়াতেই প্রকাশ পাক আপনার স্টাইল। 💃 যেকোনো আউফিটের সাথে মিলিয়ে যেকোনো ডিজাইনের চুড়ি বানিয়ে নিন আমাদের সাথে।',
  heroSquareImage: '',
  comparisonSquareImage: '',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  tiktokUrl: 'https://tiktok.com',
  paymentMethods: DEFAULT_PAYMENT_METHODS,
  promoPopupEnabled: false,
  promoPopupImage: '',
  promoPopupTitle: 'স্পেশাল অফার ঘোষণা!',
  promoPopupText: 'যেকোনো ২টি চুড়ি অর্ডার করলেই পাচ্ছেন স্পেশাল প্রিমিয়াম গিফট বক্স ফ্রি!',
  promoPopupButtonText: 'অর্ডার করতে ক্লিক করুন',
  promoPopupButtonUrl: '#our-products',
};
