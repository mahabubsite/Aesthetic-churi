export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
  status: 'New' | 'Replied' | 'Resolved';
  adminNote?: string;
}

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'MSG-101',
    name: 'ফারহানা ইসলাম',
    phone: '01711223344',
    message: 'আপনাদের গোল্ড প্লেটেড জয়পুরী চুড়ির রঙ কতদিন ভালো থাকবে? আর বিয়ের জন্য ৫০ সেটের স্পেশাল ডিসকাউন্ট পাওয়া যাবে কি?',
    date: '৩০ সেপ্টেম্বর ২০২৬, ১০:৩০ AM',
    status: 'New',
  },
  {
    id: 'MSG-102',
    name: 'তানজিলা হক',
    phone: '01988776655',
    message: 'আমার চুড়ির সাইজ ২-৪ লাগবে। ব্রাইডাল সেটের সাথে কি ম্যাচিং টিকলি পাওয়া যাবে?',
    date: '২৯ সেপ্টেম্বর ২০২৬, ০৪:১৫ PM',
    status: 'Replied',
    adminNote: 'কাস্টমারকে ফোনে জানানো হয়েছে সাইজ ২-৪ স্টকে আছে।',
  },
];
