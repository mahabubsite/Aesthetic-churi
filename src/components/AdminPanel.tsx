import React, { useState } from 'react';
import { BangleProduct } from '../data/banglesData';
import { OrderData } from './OrderPage';
import { StoreSettings } from '../data/settings';
import { ContactMessage } from '../data/messages';
import { ProductCategory, INITIAL_CATEGORIES } from '../data/categories';
import { CustomerReview, INITIAL_REVIEWS } from '../data/reviewsData';
import { BangleIllustration } from './BangleIllustrations';
import { PaymentMethodIcon, BkashLogo, NagadLogo, RocketLogo, UpayLogo } from './PaymentLogos';
import { PaymentMethodConfig, DEFAULT_PAYMENT_METHODS } from '../data/settings';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Truck,
  Search,
  DollarSign,
  ArrowLeft,
  Save,
  Check,
  Phone,
  Tag,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  Share2,
  Send,
  ExternalLink,
  Barcode,
  Layers,
  Star,
  Sparkles,
  Database,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Wallet,
  Copy,
  CheckCircle2,
  ChevronRight,
  Info,
  Percent,
  ToggleLeft,
  ToggleRight,
  Link2,
  Gift,
  Mail,
  MapPin,
  Eye,
  AlertCircle
} from 'lucide-react';
import { OfferPopupModal } from './OfferPopupModal';
import {
  checkFirebaseStatus,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
  deleteReviewAdmin,
  clearDemoDataAdmin,
  FirebaseConnectionStatus,
} from '../services/apiService';

interface AdminPanelProps {
  products: BangleProduct[];
  orders: OrderData[];
  settings: StoreSettings;
  messages: ContactMessage[];
  categories?: ProductCategory[];
  reviews?: CustomerReview[];
  onUpdateProducts: (products: BangleProduct[]) => void;
  onUpdateOrders: (orders: OrderData[]) => void;
  onUpdateSettings: (settings: StoreSettings) => void;
  onUpdateMessages: (messages: ContactMessage[]) => void;
  onUpdateCategories?: (categories: ProductCategory[]) => void;
  onUpdateReviews?: (reviews: CustomerReview[]) => void;
  onRefreshAllData?: () => Promise<void>;
  onExit: () => void;
}

const ProductImagePreview: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center px-1 text-center text-[8px] leading-tight text-slate-400">
        ছবিটি লোড করা যায়নি
      </div>
    );
  }

  return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setHasError(true)} />;
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  settings,
  messages,
  categories,
  reviews,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateSettings,
  onUpdateMessages,
  onUpdateCategories,
  onUpdateReviews,
  onRefreshAllData,
  onExit,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'payments' | 'messages' | 'reviews' | 'settings'>('dashboard');
  
  // Firebase Admin SDK status state
  const [fbStatus, setFbStatus] = useState<FirebaseConnectionStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    checkFirebaseStatus()
      .then((st) => setFbStatus(st))
      .catch(() => {});
  }, []);

  const handleRefreshFromFirebase = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      if (onRefreshAllData) {
        await onRefreshAllData();
      }
      const st = await checkFirebaseStatus();
      setFbStatus(st);
      setSyncFeedback('Firebase Admin SDK থেকে সব ডাটা সফলভাবে রিফ্রেশ হয়েছে!');
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch {
      setSyncFeedback('রিফ্রেশ সম্পন্ন হয়েছে।');
      setTimeout(() => setSyncFeedback(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleClearDemoData = async () => {
    if (!confirm('আপনি কি Firebase থেকে সব ডেমো ডাটা (ডেমো প্রোডাক্ট ও ডেমো রিভিউ) মুছে ফেলতে চান?')) {
      return;
    }
    setIsSyncing(true);
    try {
      const res = await clearDemoDataAdmin();
      if (res.success) {
        setSyncFeedback(res.message || 'সব ডেমো ডাটা মুছে ফেলা হয়েছে!');
        if (onRefreshAllData) {
          await onRefreshAllData();
        }
        const st = await checkFirebaseStatus();
        setFbStatus(st);
        setTimeout(() => setSyncFeedback(null), 5000);
      } else {
        alert(res.message || 'ডেমো ডাটা মুছতে ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      alert('ত্রুটি: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Category management state
  const categoryList = categories || [];
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Reviews management state
  const reviewList = reviews || [];
  
  // Product Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<BangleProduct | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState<{
    id?: string;
    sku: string;
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    description: string;
    sizes: string;
    setCount: string;
    isBestSeller: boolean;
    isPopular: boolean;
    imageType?: string;
    images: string[];
    customizationNote?: string;
    stockStatus?: 'in_stock' | 'made_to_order';
  }>({
    sku: '',
    name: '',
    category: 'কাচের চুড়ি',
    price: 350,
    originalPrice: 480,
    description: '',
    sizes: '২-৪ (2.4), ২-৬ (2.6), ২-৮ (2.8)',
    setCount: '২৪ পিস সেট',
    isBestSeller: false,
    isPopular: false,
    imageType: 'silk_glass',
    images: [],
    customizationNote: 'হ্যান্ডমেড কাস্টমাইজেশন উপলব্ধ',
    stockStatus: 'in_stock',
  });

  // Order Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Messages Search & Filter
  const [messageSearch, setMessageSearch] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({
    ...settings,
    paymentMethods: settings.paymentMethods && settings.paymentMethods.length > 0 ? settings.paymentMethods : DEFAULT_PAYMENT_METHODS,
  });
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Sync settingsForm when props update
  React.useEffect(() => {
    setSettingsForm({
      ...settings,
      paymentMethods: settings.paymentMethods && settings.paymentMethods.length > 0 ? settings.paymentMethods : DEFAULT_PAYMENT_METHODS,
    });
  }, [settings]);

  // Payment methods & sales analytics state
  const [paymentOrderFilter, setPaymentOrderFilter] = useState<string>('all');
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);
  const [paymentSaveMessage, setPaymentSaveMessage] = useState<string | null>(null);
  const [isAddCustomPaymentOpen, setIsAddCustomPaymentOpen] = useState(false);
  const [newPaymentForm, setNewPaymentForm] = useState<PaymentMethodConfig>({
    id: '',
    name: '',
    iconUrl: '',
    accountNumber: '',
    accountType: 'Personal',
    instructions: '',
    isActive: true,
  });

  const OFFICIAL_ICONS: Record<string, string> = {
    bkash: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/bkash.png',
    nagad: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/nagad.png',
    rocket: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/rocket.png',
    upay: 'https://raw.githubusercontent.com/Robiul-Hasan-Robi/logo-assets/main/upay.png',
  };

  const currentPaymentMethods: PaymentMethodConfig[] =
    settingsForm.paymentMethods && settingsForm.paymentMethods.length > 0
      ? settingsForm.paymentMethods
      : DEFAULT_PAYMENT_METHODS;

  // Calculations for Dashboard & Payments
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const newMessagesCount = messages.filter((m) => m.status === 'New').length;

  // Sales Breakdown per Payment Method
  const nonCancelledOrders = orders.filter((o) => o.status !== 'Cancelled');
  
  const paymentBreakdown = currentPaymentMethods.map((pm) => {
    const methodOrders = nonCancelledOrders.filter((o) => {
      const pmId = (o.paymentMethod || '').toLowerCase();
      const targetId = pm.id.toLowerCase();
      if (pmId === targetId) return true;
      if (targetId === 'cod' && (pmId === 'cash' || pmId === 'cod' || pmId.includes('cash') || pmId.includes('ক্যাশ'))) return true;
      if (targetId === 'bkash' && (pmId === 'bkash' || pmId.includes('বিকাশ'))) return true;
      if (targetId === 'nagad' && (pmId === 'nagad' || pmId.includes('নগদ'))) return true;
      if (targetId === 'rocket' && (pmId === 'rocket' || pmId.includes('রকেট'))) return true;
      if (targetId === 'upay' && (pmId === 'upay' || pmId.includes('উপায়'))) return true;
      return false;
    });

    const revenue = methodOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const count = methodOrders.length;
    const percentage = totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) : '0';

    return {
      config: pm,
      revenue,
      count,
      percentage: Number(percentage),
      orders: methodOrders,
    };
  });

  const mobileBankingRevenue = paymentBreakdown
    .filter((p) => p.config.id !== 'cod')
    .reduce((sum, p) => sum + p.revenue, 0);

  const codRevenue = paymentBreakdown
    .filter((p) => p.config.id === 'cod')
    .reduce((sum, p) => sum + p.revenue, 0);

  const deliveredRevenue = orders
    .filter((o) => o.status === 'Delivered' || o.status === 'Confirmed' || o.status === 'Shipped')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const pendingRevenue = orders
    .filter((o) => o.status === 'Pending')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Orders filtered by Payment Method
  const filteredPaymentOrders = orders.filter((o) => {
    if (paymentOrderFilter === 'all') return true;
    const pmId = (o.paymentMethod || '').toLowerCase();
    const target = paymentOrderFilter.toLowerCase();
    if (pmId === target) return true;
    if (target === 'cod' && (pmId === 'cash' || pmId === 'cod' || pmId.includes('cash') || pmId.includes('ক্যাশ'))) return true;
    if (target === 'bkash' && (pmId === 'bkash' || pmId.includes('বিকাশ'))) return true;
    if (target === 'nagad' && (pmId === 'nagad' || pmId.includes('নগদ'))) return true;
    if (target === 'rocket' && (pmId === 'rocket' || pmId.includes('রকেট'))) return true;
    if (target === 'upay' && (pmId === 'upay' || pmId.includes('উপায়'))) return true;
    return false;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = selectedProductCategory === 'all' || p.category === selectedProductCategory;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Messages
  const filteredMessages = messages.filter((m) => {
    return (
      m.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.phone.includes(messageSearch) ||
      m.message.toLowerCase().includes(messageSearch.toLowerCase())
    );
  });

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const autoSku = `AC-NEW-${Math.floor(10 + Math.random() * 90)}`;
    setProductForm({
      sku: autoSku,
      name: '',
      category: categoryList[0]?.name || 'কাচের চুড়ি',
      price: 350,
      originalPrice: 480,
      description: '১০০% খাঁটি কোয়ালিটি এবং নিখুঁত ফিনিশিং।',
      sizes: '২-৪ (2.4), ২-৬ (2.6), ২-৮ (2.8)',
      setCount: '২৪ পিস সেট',
      isBestSeller: false,
      isPopular: false,
      imageType: 'silk_glass',
      images: [],
      customizationNote: 'হ্যান্ডমেড কাস্টমাইজেশন উপলব্ধ',
      stockStatus: 'in_stock',
    });
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: BangleProduct) => {
    setEditingProduct(product);
    setProductForm({
      id: product.id,
      sku: product.sku || `AC-${product.id.slice(-4).toUpperCase()}`,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      sizes: product.sizes.join(', '),
      setCount: product.setCount,
      isBestSeller: !!product.isBestSeller,
      isPopular: !!product.isPopular,
      imageType: product.imageType,
      images: product.images || [],
      customizationNote: product.customizationNote || 'হ্যান্ডমেড কাস্টমাইজেশন উপলব্ধ',
      stockStatus: product.stockStatus || 'in_stock',
    });
    setIsAddProductModalOpen(true);
  };

  // Multiple Image Upload for Product
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const newImages = new Array<string>(filesArray.length);
    let loadedCount = 0;

    filesArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages[index] = event.target.result as string;
        }
        loadedCount++;
        if (loadedCount === filesArray.length) {
          setProductForm((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveProductImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = productForm.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedSku = productForm.sku.trim() || `AC-${Math.floor(100 + Math.random() * 900)}`;

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              sku: generatedSku,
              name: productForm.name,
              category: productForm.category,
              price: Number(productForm.price),
              originalPrice: Number(productForm.originalPrice),
              description: productForm.description,
              sizes: sizesArray.length ? sizesArray : ['২-৬ (2.6)'],
              setCount: productForm.setCount,
              isBestSeller: productForm.isBestSeller,
              isPopular: productForm.isPopular,
              imageType: productForm.imageType,
              images: productForm.images,
              customizationNote: productForm.customizationNote,
              stockStatus: productForm.stockStatus,
            }
          : p
      );
      onUpdateProducts(updated);
    } else {
      const newProduct: BangleProduct = {
        id: `bangle-${Date.now()}`,
        sku: generatedSku,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        rating: 5.0,
        reviewsCount: 1,
        description: productForm.description,
        sizes: sizesArray.length ? sizesArray : ['২-৬ (2.6)'],
        setCount: productForm.setCount,
        primaryColor: '#881337',
        accentColor: '#D4AF37',
        isBestSeller: productForm.isBestSeller,
        isPopular: productForm.isPopular,
        imageType: productForm.imageType,
        images: productForm.images,
        customizationNote: productForm.customizationNote,
        stockStatus: productForm.stockStatus,
      };
      onUpdateProducts([newProduct, ...products]);
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই চুড়ির আইটেমটি ডিলিট করতে চান?')) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  // Category Actions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const exists = categoryList.some(
      (c) => c.name.toLowerCase() === newCatName.trim().toLowerCase()
    );
    if (exists) {
      alert('এই ক্যাটাগরিটি ইতিমধ্যে যুক্ত রয়েছে!');
      return;
    }
    const newCat: ProductCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc.trim() || undefined,
    };
    const updated = [...categoryList, newCat];
    onUpdateCategories?.(updated);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    if (categoryList.length <= 1) {
      alert('কমপক্ষে একটি ক্যাটাগরি থাকা আবশ্যক!');
      return;
    }
    if (confirm(`আপনি কি "${catName}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
      const updated = categoryList.filter((c) => c.id !== catId);
      onUpdateCategories?.(updated);
    }
  };

  // Review Actions
  const handleDeleteReview = (revId: string) => {
    if (confirm('আপনি কি এই কাস্টমার রিভিউটি মুছে ফেলতে চান?')) {
      const updated = reviewList.filter((r) => r.id !== revId);
      onUpdateReviews?.(updated);
      deleteReviewAdmin(revId).catch(() => {});
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderData['status']) => {
    const updated = orders.map((o) =>
      o.orderId === orderId ? { ...o, status: newStatus } : o
    );
    onUpdateOrders(updated);
    updateOrderStatusAdmin(orderId, newStatus).catch(() => {});
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?')) {
      const updated = orders.filter((o) => o.orderId !== orderId);
      onUpdateOrders(updated);
      deleteOrderAdmin(orderId).catch(() => {});
    }
  };

  // Payment Method Actions
  const handleUpdatePaymentMethodField = (
    methodId: string,
    field: keyof PaymentMethodConfig,
    value: any
  ) => {
    const updated = currentPaymentMethods.map((pm) => {
      if (pm.id === methodId) {
        return { ...pm, [field]: value };
      }
      return pm;
    });

    const updatedSettings = {
      ...settingsForm,
      paymentMethods: updated,
    };
    if (field === 'accountNumber') {
      if (methodId === 'bkash') updatedSettings.merchantBkash = value;
      if (methodId === 'nagad') updatedSettings.merchantNagad = value;
      if (methodId === 'rocket') updatedSettings.merchantRocket = value;
      if (methodId === 'upay') updatedSettings.merchantUpay = value;
    }

    setSettingsForm(updatedSettings);
  };

  const handleSaveAllPaymentMethods = (methodsToSave?: PaymentMethodConfig[]) => {
    const finalMethods = methodsToSave || currentPaymentMethods;
    const updated = {
      ...settingsForm,
      paymentMethods: finalMethods,
    };
    setSettingsForm(updated);
    onUpdateSettings(updated);
    setPaymentSaveMessage('পেমেন্ট মেথড ও আইকন সফলভাবে সংরক্ষিত এবং Firebase-এ সিঙ্ক হয়েছে!');
    setTimeout(() => setPaymentSaveMessage(null), 4000);
  };

  const handleAddCustomPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentForm.name.trim()) {
      alert('পেমেন্ট মেথডের নাম লিখুন!');
      return;
    }
    const generatedId = newPaymentForm.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || `pm_${Date.now()}`;
    const newMethod: PaymentMethodConfig = {
      ...newPaymentForm,
      id: generatedId,
      isActive: true,
    };
    const updated = [...currentPaymentMethods, newMethod];
    handleSaveAllPaymentMethods(updated);
    setIsAddCustomPaymentOpen(false);
    setNewPaymentForm({
      id: '',
      name: '',
      iconUrl: '',
      accountNumber: '',
      accountType: 'Personal',
      instructions: '',
      isActive: true,
    });
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    if (['cod', 'bkash', 'nagad'].includes(methodId)) {
      alert('ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ মুছে ফেলা যাবে না, আপনি চাইলে নিষ্ক্রিয় (Inactive) করতে পারেন।');
      return;
    }
    if (confirm('আপনি কি এই পেমেন্ট মেথডটি মুছে ফেলতে চান?')) {
      const updated = currentPaymentMethods.filter((pm) => pm.id !== methodId);
      handleSaveAllPaymentMethods(updated);
    }
  };

  // Messages Actions
  const handleUpdateMessageStatus = (msgId: string, status: ContactMessage['status']) => {
    const updated = messages.map((m) => (m.id === msgId ? { ...m, status } : m));
    onUpdateMessages(updated);
  };

  const handleSaveMessageNote = (msgId: string) => {
    const updated = messages.map((m) =>
      m.id === msgId ? { ...m, adminNote: noteText, status: 'Replied' as const } : m
    );
    onUpdateMessages(updated);
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleDeleteMessage = (msgId: string) => {
    if (confirm('আপনি কি এই বার্তাটি মুছে ফেলতে চান?')) {
      const updated = messages.filter((m) => m.id !== msgId);
      onUpdateMessages(updated);
    }
  };

  // Image Upload for Hero and Comparison Section
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettingsForm((prev) => ({
          ...prev,
          heroSquareImage: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleComparisonImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettingsForm((prev) => ({
          ...prev,
          comparisonSquareImage: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Logo Upload (Legacy fallback)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettingsForm((prev) => ({
          ...prev,
          logoUrl: event.target?.result as string,
          headerLogoUrl: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Top / Header Logo Upload (Separate Logo)
  const handleHeaderLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettingsForm((prev) => ({
          ...prev,
          headerLogoUrl: event.target?.result as string,
          logoUrl: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Footer Logo Upload (Separate Logo)
  const handleFooterLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettingsForm((prev) => ({
          ...prev,
          footerLogoUrl: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Offer Popup Image Upload
  const handlePromoPopupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettingsForm((prev) => ({
          ...prev,
          promoPopupImage: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const [isPreviewOfferPopupOpen, setIsPreviewOfferPopupOpen] = useState(false);

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={settingsForm.logoUrl || '/churilogo.png'}
            alt="Logo"
            className="h-9 sm:h-10 w-auto max-w-[160px] object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/churilogo.png';
            }}
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                Aesthetic customized churi • অ্যাডমিন
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firebase Admin SDK Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              ক্যাটাগরি, প্রোডাক্ট SKU, কাস্টমার রিভিউ, অর্ডার ও স্টোর ব্র্যান্ডিং • অ্যাডমিন: robiuletc@gmail.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefreshFromFirebase}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
            title="Firebase Admin SDK থেকে সব ডাটা লাইভ সিঙ্ক করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden md:inline">{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'Firebase রিফ্রেশ'}</span>
          </button>

          <button
            onClick={onExit}
            type="button"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ওভারভিউ ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>প্রোডাক্ট ও SKU</span>
            </div>
            <span className="bg-slate-900/60 text-amber-400 font-mono text-xs px-2 py-0.5 rounded-full ml-2">
              {products.length}
            </span>
          </button>

          {/* Categories Tab */}
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>ক্যাটাগরি ম্যানেজমেন্ট</span>
            </div>
            <span className="bg-slate-900/60 text-amber-400 font-mono text-xs px-2 py-0.5 rounded-full ml-2">
              {categoryList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার ম্যানেজমেন্ট</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="bg-rose-600 text-white font-mono text-xs px-2 py-0.5 rounded-full animate-pulse ml-2">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Payment Methods & Sales Analytics Tab */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>পেমেন্ট ও সেলস</span>
            </div>
            <span className="bg-amber-400/10 text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-400/20 ml-2">
              {totalRevenue}৳
            </span>
          </button>

          {/* Customer Reviews Tab */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>কাস্টমার রিভিউ</span>
            </div>
            <span className="bg-slate-900/60 text-amber-400 font-mono text-xs px-2 py-0.5 rounded-full ml-2">
              {reviewList.length}
            </span>
          </button>

          {/* Messages Tab */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>গ্রাহক বার্তা</span>
            </div>
            {newMessagesCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-mono text-xs px-2 py-0.5 rounded-full font-bold ml-2">
                {newMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#551627] text-amber-300 shadow-md shadow-rose-950/40 border border-rose-800/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>লোগো, ফটো ও সেটিংস</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  ব্যবসার সার্বিক অগ্রগতি ও রিপোর্ট
                </h2>
                <p className="text-xs text-slate-400">
                  মোট অর্ডার, সংগৃহীত পেমেন্ট এবং সাম্প্রতিক অর্ডার স্ট্যাটাস
                </p>
              </div>

              {/* Firebase Live Database Status Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-white">Firebase ডাটাবেজ:</span>
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-md border border-amber-800/60">
                        {fbStatus?.projectId || 'aestheticcustomizedchuri'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Admin SDK লাইভ কানেক্টেড
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>
                        অ্যাডমিন ইমেইল: <strong className="text-slate-200 font-mono">robiuletc@gmail.com</strong>
                      </span>
                      <span>•</span>
                      <span>
                        সার্ভিস অ্যাকাউন্ট: <strong className="text-slate-200 font-mono text-[10px]">firebase-adminsdk-fbsvc@...</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleRefreshFromFirebase}
                    disabled={isSyncing}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'ফেচ হচ্ছে...' : 'ডাটা রিফ্রেশ'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearDemoData}
                    disabled={isSyncing}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-800/80 rounded-xl font-bold text-xs transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
                    title="Firebase থেকে সব ডেমো প্রোডাক্ট ও ডেমো রিভিউ মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ডেমো ডাটা মুছুন</span>
                  </button>
                </div>
              </div>

              {syncFeedback && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold">মোট সেলস</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {totalRevenue.toLocaleString()} ৳
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">সফল ও চলমান অর্ডার</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold">মোট অর্ডার</span>
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-300 font-mono">
                    {orders.length} টি
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">সব মিলিয়ে গ্রাহক সংখ্যা</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold">নতুন বার্তা</span>
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    {messages.length} টি
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{newMessagesCount} টি অপঠিত</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold">একটিভ প্রোডাক্ট</span>
                    <Package className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-purple-400 font-mono">
                    {products.length} টি
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">ক্যাটালগে প্রদর্শিত</div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>সাম্প্রতিক অর্ডারসমূহ</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    সব অর্ডার দেখুন →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    এখনো কোনো অর্ডার আসেনি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-2">আইডি</th>
                          <th className="pb-2">গ্রাহকের নাম ও ফোন</th>
                          <th className="pb-2">আইটেম সংখ্যা</th>
                          <th className="pb-2">মোট বিল</th>
                          <th className="pb-2">পেমেন্ট</th>
                          <th className="pb-2">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {orders.slice(0, 5).map((order) => {
                          const itemCount = order.items?.length || order.quantity || 1;
                          return (
                            <tr key={order.orderId} className="hover:bg-slate-800/30">
                              <td className="py-2.5 font-mono text-amber-300 font-bold">
                                #{order.orderId}
                              </td>
                              <td className="py-2.5">
                                <div className="font-bold text-slate-200">{order.customerName}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{order.phone}</div>
                              </td>
                              <td className="py-2.5 text-slate-300">
                                {itemCount} টি পণ্য
                              </td>
                              <td className="py-2.5 font-bold font-mono text-emerald-400">
                                {order.total}৳
                              </td>
                              <td className="py-2.5 uppercase text-[10px] font-bold text-slate-300">
                                {order.paymentMethod}
                              </td>
                              <td className="py-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT & SKU */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">প্রোডাক্ট ও SKU ম্যানেজমেন্ট</h2>
                  <p className="text-xs text-slate-400">
                    নতুন চুড়ি যোগ করুন, একাধিক ছবি আপলোড করুন ও কাস্টম SKU নির্ধারণ করুন
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্রোডাক্ট যোগ করুন</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="চুড়ির নাম বা SKU দিয়ে খুঁজুন..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <select
                  value={selectedProductCategory}
                  onChange={(e) => setSelectedProductCategory(e.target.value)}
                  className="w-full sm:w-auto bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="all">সব ক্যাটাগরি</option>
                  <option value="কাচের চুড়ি">কাচের চুড়ি</option>
                  <option value="গোল্ড প্লেটেড">গোল্ড প্লেটেড</option>
                  <option value="ব্রাইডাল চুড়া">ব্রাইডাল চুড়া</option>
                  <option value="ভেলভেট ও রেশমি">ভেলভেট ও রেশমি</option>
                  <option value="কুন্দন ও অ্যান্টিক">কুন্দন ও অ্যান্টিক</option>
                </select>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">চুড়ি</th>
                      <th className="p-3">SKU কোড</th>
                      <th className="p-3">ক্যাটাগরি</th>
                      <th className="p-3">মূল্য</th>
                      <th className="p-3">ফটো সংখ্যা</th>
                      <th className="p-3">সাইজসমূহ</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-900/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded" />
                              ) : (
                                <BangleIllustration type={product.imageType} className="w-full h-full" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs leading-snug line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {product.setCount}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {product.sku || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3 text-rose-300 font-semibold">{product.category}</td>
                        <td className="p-3">
                          <span className="font-black text-amber-300 font-mono text-sm">
                            {product.price}৳
                          </span>
                          <span className="text-[11px] text-slate-500 line-through font-mono block">
                            {product.originalPrice}৳
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">
                          {product.images && product.images.length > 0 ? (
                            <span className="text-emerald-400 font-bold font-mono">
                              {product.images.length} টি ছবি
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono">ডিফল্ট আর্ট</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-300 max-w-[130px] truncate">
                          {product.sizes.join(', ')}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(product)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
                              title="এডিট করুন"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 transition-colors cursor-pointer"
                              title="ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER MANAGEMENT & SKU DETAILS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">অর্ডার ম্যানেজমেন্ট</h2>
                  <p className="text-xs text-slate-400">
                    গ্রাহকদের সম্পূর্ণ অর্ডার বিবরণ, পণ্যের SKU ও স্ট্যাটাস ট্র্যাক করুন
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    মোট অর্ডার: <strong className="text-white font-bold">{orders.length}</strong>
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="অর্ডার নং, নাম বা ফোন দিয়ে খুঁজুন..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
                  {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st === 'all' ? 'সব অর্ডার' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List Cards */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  কোনো অর্ডার খুঁজে পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const items = order.items && order.items.length > 0
                      ? order.items
                      : order.product
                      ? [
                          {
                            id: order.product.id,
                            productId: order.product.id,
                            sku: order.product.sku,
                            name: order.product.name,
                            imageType: order.product.imageType,
                            size: order.selectedSize || '২-৬ (2.6)',
                            quantity: order.quantity || 1,
                            unitPrice: order.unitPrice || order.product.price,
                            subtotal: (order.unitPrice || order.product.price) * (order.quantity || 1),
                          },
                        ]
                      : [];

                    return (
                      <div
                        key={order.orderId}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all space-y-3"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-extrabold text-amber-300">
                              #{order.orderId}
                            </span>
                            <span className="text-xs text-slate-400">
                              {order.orderDate}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order.orderId,
                                  e.target.value as OrderData['status']
                                )
                              }
                              className={`text-xs font-bold px-3 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                order.status === 'Pending'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : order.status === 'Confirmed'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : order.status === 'Shipped'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : order.status === 'Delivered'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              }`}
                            >
                              <option value="Pending">Pending (অপেক্ষমাণ)</option>
                              <option value="Confirmed">Confirmed (নিশ্চিত)</option>
                              <option value="Shipped">Shipped (ডেলিভারিতে)</option>
                              <option value="Delivered">Delivered (পৌঁছেছে)</option>
                              <option value="Cancelled">Cancelled (বাতিল)</option>
                            </select>

                            <button
                              onClick={() => handleDeleteOrder(order.orderId)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="অর্ডার ডিলিট করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                          <div>
                            <span className="text-slate-400 block text-[11px]">গ্রাহকের নাম:</span>
                            <span className="font-bold text-white">{order.customerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">মোবাইল নাম্বার:</span>
                            <a href={`tel:${order.phone}`} className="font-mono font-bold text-emerald-400 hover:underline">
                              {order.phone}
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">ডেলিভারি ঠিকানা:</span>
                            <span className="text-slate-200">{order.address}</span>
                          </div>
                        </div>

                        {/* Ordered Items with SKU */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-400 block">
                            অর্ডার করা পণ্যের বিবরণ ({items.length} টি আইটেম):
                          </span>
                          <div className="divide-y divide-slate-800 bg-slate-950/40 rounded-lg p-2 border border-slate-800/60">
                            {items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1.5 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded bg-slate-800 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center">
                                    {item.quantity}x
                                  </span>
                                  <span className="font-semibold text-slate-200">{item.name}</span>
                                  {item.sku && (
                                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                      SKU: {item.sku}
                                    </span>
                                  )}
                                  <span className="text-[11px] bg-slate-800 text-rose-300 px-1.5 py-0.5 rounded">
                                    সাইজ: {item.size}
                                  </span>
                                </div>
                                <div className="font-mono font-bold text-amber-300">
                                  {item.subtotal}৳
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bill Total */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                          <div className="text-slate-400">
                            পেমেন্ট: <span className="uppercase font-bold text-white">{order.paymentMethod}</span>
                            {order.transactionId && <span className="ml-2 font-mono text-cyan-300">TrxID: {order.transactionId}</span>}
                          </div>
                          <div className="text-sm font-black text-emerald-400 font-mono">
                            সর্বমোট বিল: {order.total}৳
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: PAYMENT METHODS & SALES ANALYTICS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-amber-400" />
                    <span>পেমেন্ট মেথড ও সেলস অ্যানালিটিক্স</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    বিকাশ, নগদ, রকেট, উপায় ও ক্যাশ অন ডেলিভারির সেলস হিসাব এবং আইকন ইমেজ URL আপডেট করুন
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCustomPaymentOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 cursor-pointer shadow-xs transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ নতুন মেথড</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveAllPaymentMethods()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-extrabold cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সব মেথড সংরক্ষণ করুন</span>
                  </button>
                </div>
              </div>

              {/* Feedback Alert */}
              {paymentSaveMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/80 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-lg">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {paymentSaveMessage}
                  </span>
                  <button
                    onClick={() => setPaymentSaveMessage(null)}
                    className="text-emerald-400 hover:text-white p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* SECTION 1: TOP SALES METRICS CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span className="font-semibold">মোট সর্বমোট সেলস (Gross)</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                      {totalRevenue.toLocaleString()} ৳
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      মোট {nonCancelledOrders.length} টি সফল অর্ডার
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span className="font-semibold">সম্পন্ন / ডেলিভার্ড সেলস</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      {deliveredRevenue.toLocaleString()} ৳
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      ডেলিভারি ও কনফার্মড সেলস
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span className="font-semibold">অনলাইন মোবাইল ব্যাংকিং</span>
                    <Wallet className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-pink-400 font-mono">
                      {mobileBankingRevenue.toLocaleString()} ৳
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      বিকাশ, নগদ, রকেট ও উপায়
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span className="font-semibold">ক্যাশ অন ডেলিভারি (COD)</span>
                    <Truck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                      {codRevenue.toLocaleString()} ৳
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      পণ্য হাতে পেয়ে পেমেন্ট
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: METHOD-BY-METHOD SALES BREAKDOWN */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Percent className="w-4 h-4 text-amber-400" />
                      <span>কোন পেমেন্ট মেথডে কত টাকা এসেছে (Sales Breakdown)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      প্রতিটি পেমেন্ট মেথডের মোট সেলস, অর্ডারের সংখ্যা ও শতকরা হার
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                    সর্বমোট: {totalRevenue.toLocaleString()} ৳
                  </span>
                </div>

                {/* Progress bar visual share */}
                {totalRevenue > 0 && (
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 shadow-inner">
                      {paymentBreakdown.map((item) => {
                        if (item.revenue <= 0) return null;
                        const widthPct = `${Math.max(item.percentage, 2)}%`;
                        const colorClass =
                          item.config.id === 'bkash'
                            ? 'bg-[#E2136E]'
                            : item.config.id === 'nagad'
                            ? 'bg-[#F7941D]'
                            : item.config.id === 'rocket'
                            ? 'bg-[#8C3494]'
                            : item.config.id === 'upay'
                            ? 'bg-[#005697]'
                            : 'bg-emerald-600';
                        return (
                          <div
                            key={item.config.id}
                            style={{ width: widthPct }}
                            className={`${colorClass} h-full transition-all duration-500`}
                            title={`${item.config.name}: ${item.revenue}৳ (${item.percentage}%)`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      {paymentBreakdown.map((item) => (
                        <div key={item.config.id} className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              item.config.id === 'bkash'
                                ? 'bg-[#E2136E]'
                                : item.config.id === 'nagad'
                                ? 'bg-[#F7941D]'
                                : item.config.id === 'rocket'
                                ? 'bg-[#8C3494]'
                                : item.config.id === 'upay'
                                ? 'bg-[#005697]'
                                : 'bg-emerald-600'
                            }`}
                          />
                          <span className="font-semibold text-slate-300">{item.config.name}:</span>
                          <span className="font-mono text-white font-bold">{item.revenue.toLocaleString()}৳</span>
                          <span className="text-[10px] text-slate-500 font-mono">({item.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cards for each payment method */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {paymentBreakdown.map((item) => {
                    const isSelected = paymentOrderFilter === item.config.id;
                    return (
                      <div
                        key={item.config.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-800 border-amber-400 ring-1 ring-amber-400/40 shadow-md'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Method Header */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-slate-200">
                                <PaymentMethodIcon
                                  methodId={item.config.id}
                                  name={item.config.name}
                                  iconUrl={item.config.iconUrl}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-sm line-clamp-1">{item.config.name}</h4>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {item.config.accountNumber ? `${item.config.accountType || 'Personal'}: ${item.config.accountNumber}` : 'ক্যাশ পেমেন্ট'}
                                </span>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                item.config.isActive
                                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                                  : 'bg-rose-950/80 text-rose-400 border-rose-800'
                              }`}
                            >
                              {item.config.isActive ? 'সক্রিয়' : 'বন্ধ'}
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block">মোট সংগৃহীত সেলস</span>
                              <span className="text-base sm:text-lg font-black font-mono text-amber-300">
                                {item.revenue.toLocaleString()} ৳
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">অর্ডার সংখ্যা</span>
                              <span className="text-base sm:text-lg font-black font-mono text-white">
                                {item.count} টি
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Button to view orders */}
                        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400 font-bold">
                            শেয়ার: <strong className="text-amber-400">{item.percentage}%</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentOrderFilter(item.config.id);
                              document.getElementById('payment-orders-table')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-xs text-amber-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>অর্ডার দেখুন</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: PAYMENT METHOD CONFIGURATION & ICON URL (User explicit request) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-amber-400" />
                      <span>পেমেন্ট মেথড ও আইকন URL কনফিগারেশন</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      বিকাশ, নগদ, রকেট, উপায় এর আইকন ইমেজ সরাসরি URL দিয়ে পরিবর্তন করুন অথবা প্রিসেট লোগো বেছে নিন
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-lg">
                    মোট {currentPaymentMethods.length} টি পেমেন্ট মেথড কনফিগার করা
                  </span>
                </div>

                {/* List of Payment Methods for editing */}
                <div className="space-y-4">
                  {currentPaymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* 1. Icon Preview & Name */}
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-white p-2 border border-slate-300 flex items-center justify-center shrink-0 shadow-xs relative group overflow-hidden">
                            <PaymentMethodIcon
                              methodId={pm.id}
                              name={pm.name}
                              iconUrl={pm.iconUrl}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <span className="text-[9px] text-white font-mono">প্রিভিউ</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={pm.name}
                                onChange={(e) => handleUpdatePaymentMethodField(pm.id, 'name', e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
                                placeholder="মেথডের নাম"
                              />
                              <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                                ID: {pm.id}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 mt-1 block">
                              চেকআউট পেজে গ্রাহকরা এই নামটি দেখতে পাবেন।
                            </span>
                          </div>
                        </div>

                        {/* Toggle active / Inactive switch */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleUpdatePaymentMethodField(pm.id, 'isActive', !pm.isActive)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                              pm.isActive
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                            }`}
                          >
                            {pm.isActive ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-emerald-400" />
                                <span>চেকআউটে সক্রিয়</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-slate-500" />
                                <span>নিষ্ক্রিয় (বন্ধ)</span>
                              </>
                            )}
                          </button>

                          {/* Delete if custom method */}
                          {!['cod', 'bkash', 'nagad', 'rocket', 'upay'].includes(pm.id) && (
                            <button
                              type="button"
                              onClick={() => handleDeletePaymentMethod(pm.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded-lg border border-rose-900/60 transition-colors cursor-pointer"
                              title="পেমেন্ট মেথড মুছুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* URL input and settings inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                        {/* Icon URL Input */}
                        <div className="lg:col-span-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-slate-300 font-semibold flex items-center gap-1">
                              <Link2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>আইকন ইমেজ URL (Custom Icon URL):</span>
                            </label>
                            {OFFICIAL_ICONS[pm.id] && (
                              <button
                                type="button"
                                onClick={() => handleUpdatePaymentMethodField(pm.id, 'iconUrl', OFFICIAL_ICONS[pm.id])}
                                className="text-[10px] text-amber-400 hover:underline cursor-pointer font-bold"
                              >
                                ⚡ অফিসিয়াল লোগো রিসেট
                              </button>
                            )}
                          </div>
                          <input
                            type="url"
                            value={pm.iconUrl || ''}
                            onChange={(e) => handleUpdatePaymentMethodField(pm.id, 'iconUrl', e.target.value.trim())}
                            placeholder="https://... (পিএনজি/জেপিজি বা এসভিজি লোগো ইমেজ লিংক পেস্ট করুন)"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                          />
                          <span className="text-[10px] text-slate-500 block">
                            ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে আমাদের বিল্ট-ইন ভেক্টর এসভিজি লোগো প্রদর্শিত হবে।
                          </span>
                        </div>

                        {/* Account Number */}
                        <div className="space-y-1">
                          <label className="text-slate-300 font-semibold block">
                            অ্যাকাউন্ট নাম্বার (ফোন/নম্বর):
                          </label>
                          <input
                            type="text"
                            value={pm.accountNumber || ''}
                            onChange={(e) => handleUpdatePaymentMethodField(pm.id, 'accountNumber', e.target.value)}
                            placeholder="যেমন: 01712-345678"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Account Type */}
                        <div className="space-y-1">
                          <label className="text-slate-300 font-semibold block">
                            অ্যাকাউন্ট টাইপ:
                          </label>
                          <select
                            value={pm.accountType || 'Personal'}
                            onChange={(e) => handleUpdatePaymentMethodField(pm.id, 'accountType', e.target.value as any)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                          >
                            <option value="Personal">Personal (পার্সোনাল)</option>
                            <option value="Merchant">Merchant (মার্চেন্ট)</option>
                            <option value="Agent">Agent (এজেন্ট)</option>
                          </select>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-1">
                        <label className="text-slate-300 font-semibold text-xs block">
                          গ্রাহকের জন্য নির্দেশনা টেক্সট:
                        </label>
                        <input
                          type="text"
                          value={pm.instructions || ''}
                          onChange={(e) => handleUpdatePaymentMethodField(pm.id, 'instructions', e.target.value)}
                          placeholder="যেমন: আমাদের বিকাশ নাম্বারে সেন্ড মানি করুন এবং TrxID নিচে লিখুন।"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save All Payment Methods button at bottom */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSaveAllPaymentMethods()}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>পেমেন্ট মেথড ও আইকন পরিবর্তনের সকল তথ্য সেভ করুন</span>
                  </button>
                </div>
              </div>

              {/* SECTION 4: RECENT ORDERS BY PAYMENT METHOD & TrxID VERIFICATION */}
              <div id="payment-orders-table" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>পেমেন্ট অনুযায়ী অর্ডার ট্র্যাকিং ও TrxID ভেরিফিকেশন</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      গ্রাহকদের পাঠানো TrxID এবং সেন্ডার নাম্বার মিলিয়ে অর্ডার ভেরিফাই করুন
                    </p>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    প্রদর্শিত হচ্ছে: <strong className="text-white">{filteredPaymentOrders.length}</strong> টি অর্ডার
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setPaymentOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      paymentOrderFilter === 'all'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    সব মেথড ({orders.length})
                  </button>

                  {currentPaymentMethods.map((pm) => {
                    const count = orders.filter((o) => {
                      const pmId = (o.paymentMethod || '').toLowerCase();
                      const target = pm.id.toLowerCase();
                      if (pmId === target) return true;
                      if (target === 'cod' && (pmId === 'cash' || pmId === 'cod' || pmId.includes('cash') || pmId.includes('ক্যাশ'))) return true;
                      if (target === 'bkash' && (pmId === 'bkash' || pmId.includes('বিকাশ'))) return true;
                      if (target === 'nagad' && (pmId === 'nagad' || pmId.includes('নগদ'))) return true;
                      if (target === 'rocket' && (pmId === 'rocket' || pmId.includes('রকেট'))) return true;
                      if (target === 'upay' && (pmId === 'upay' || pmId.includes('উপায়'))) return true;
                      return false;
                    }).length;

                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentOrderFilter(pm.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          paymentOrderFilter === pm.id
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                        }`}
                      >
                        <span>{pm.name}</span>
                        <span className="font-mono text-[10px] opacity-80">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Orders List Table */}
                {filteredPaymentOrders.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                    এই পেমেন্ট মেথডে এখনও কোনো অর্ডার পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredPaymentOrders.map((ord) => (
                      <div
                        key={ord.orderId}
                        className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        {/* Order & Customer Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-amber-300">#{ord.orderId}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{ord.orderDate}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : ord.status === 'Confirmed'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                  : ord.status === 'Shipped'
                                  ? 'bg-purple-950 text-purple-400 border border-purple-800'
                                  : ord.status === 'Cancelled'
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>

                          <div className="text-slate-300">
                            <strong>{ord.customerName}</strong> •{' '}
                            <a
                              href={`tel:${ord.phone}`}
                              className="text-amber-400 font-mono hover:underline"
                            >
                              {ord.phone}
                            </a>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-md">{ord.address}</p>
                        </div>

                        {/* Payment Verification Details (TrxID & Sender) */}
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 min-w-[220px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">মেথড:</span>
                            <span className="uppercase font-mono font-extrabold text-white text-xs bg-slate-800 px-1.5 py-0.2 rounded">
                              {ord.paymentMethod}
                            </span>
                          </div>

                          {ord.paymentSenderNumber && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">সেন্ডার নাম্বার:</span>
                              <span className="font-mono text-amber-300 font-bold text-[11px]">
                                {ord.paymentSenderNumber}
                              </span>
                            </div>
                          )}

                          {ord.transactionId ? (
                            <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800">
                              <span className="text-slate-400 text-[11px]">TrxID:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-black text-cyan-300 text-xs">
                                  {ord.transactionId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(ord.transactionId || '');
                                    setCopiedTrxId(ord.transactionId || '');
                                    setTimeout(() => setCopiedTrxId(null), 2000);
                                  }}
                                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer transition-colors"
                                  title="TrxID কপি করুন"
                                >
                                  {copiedTrxId === ord.transactionId ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-400">
                              ক্যাশ অন ডেলিভারি (হাতে পেয়ে পেমেন্ট)
                            </div>
                          )}
                        </div>

                        {/* Amount & Status Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <span className="text-base font-black text-amber-300 font-mono">
                            {ord.total}৳
                          </span>

                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                          >
                            <option value="Pending">Pending (অপেক্ষমাণ)</option>
                            <option value="Confirmed">Confirmed (পেমেন্ট নিশ্চিত)</option>
                            <option value="Shipped">Shipped (ডেলিভারিতে)</option>
                            <option value="Delivered">Delivered (সম্পন্ন)</option>
                            <option value="Cancelled">Cancelled (বাতিল)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MODAL: ADD CUSTOM PAYMENT METHOD */}
              {isAddCustomPaymentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 text-xs text-slate-200 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-base font-bold text-amber-300">
                        নতুন পেমেন্ট মেথড যোগ করুন
                      </h4>
                      <button
                        onClick={() => setIsAddCustomPaymentOpen(false)}
                        className="text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleAddCustomPaymentMethod} className="space-y-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          মেথডের নাম (যেমন: Bank Transfer, Cellfin, Tap):
                        </label>
                        <input
                          type="text"
                          required
                          value={newPaymentForm.name}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                          placeholder="মেথডের নাম লিখুন"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          আইকন ইমেজ URL (Icon URL):
                        </label>
                        <input
                          type="url"
                          value={newPaymentForm.iconUrl || ''}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, iconUrl: e.target.value.trim() })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                          placeholder="https://... (ইমেজ URL)"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            অ্যাকাউন্ট টাইপ:
                          </label>
                          <select
                            value={newPaymentForm.accountType || 'Personal'}
                            onChange={(e) => setNewPaymentForm({ ...newPaymentForm, accountType: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="Personal">Personal</option>
                            <option value="Merchant">Merchant</option>
                            <option value="Agent">Agent</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">
                            অ্যাকাউন্ট নাম্বার:
                          </label>
                          <input
                            type="text"
                            value={newPaymentForm.accountNumber || ''}
                            onChange={(e) => setNewPaymentForm({ ...newPaymentForm, accountNumber: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                            placeholder="01xxxxxxxxx"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          গ্রাহকের জন্য নির্দেশনা:
                        </label>
                        <input
                          type="text"
                          value={newPaymentForm.instructions || ''}
                          onChange={(e) => setNewPaymentForm({ ...newPaymentForm, instructions: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                          placeholder="টাকা পাঠিয়ে TrxID প্রদান করুন"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsAddCustomPaymentOpen(false)}
                          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 cursor-pointer"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer"
                        >
                          যোগ করুন
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOMER MESSAGES (Contact Us Queries) */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>গ্রাহক বার্তা ও ইনকোয়ারি</span>
                    {newMessagesCount > 0 && (
                      <span className="bg-amber-500 text-slate-950 font-mono text-xs px-2 py-0.5 rounded-full font-bold">
                        {newMessagesCount} টি নতুন
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400">
                    ওয়েবসাইটের 'যোগাযোগ করুন' ফরম থেকে আসা সকল গ্রাহকের প্রশ্নের তালিকা ও উত্তর
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="নাম, ফোন বা বার্তা দিয়ে খুঁজুন..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Message Cards */}
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  কোনো গ্রাহক বার্তা খুঁজে পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-sm">{msg.name}</span>
                          <a
                            href={`tel:${msg.phone}`}
                            className="font-mono text-xs text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{msg.phone}</span>
                          </a>
                          <span className="text-[11px] text-slate-400 font-mono">{msg.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={msg.status}
                            onChange={(e) =>
                              handleUpdateMessageStatus(msg.id, e.target.value as ContactMessage['status'])
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              msg.status === 'New'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : msg.status === 'Replied'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            <option value="New">New (নতুন বার্তা)</option>
                            <option value="Replied">Replied (উত্তর দেওয়া হয়েছে)</option>
                            <option value="Resolved">Resolved (নিষ্পন্ন)</option>
                          </select>

                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                        <p>{msg.message}</p>
                      </div>

                      {/* Admin Note / Follow-up */}
                      {msg.adminNote && (
                        <div className="p-2.5 bg-blue-950/30 border border-blue-800/40 rounded-lg text-xs text-blue-200">
                          <span className="font-bold text-amber-300 block mb-0.5">অ্যাডমিন নোট:</span>
                          <p>{msg.adminNote}</p>
                        </div>
                      )}

                      {/* Actions: WhatsApp Reply & Note Update */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-2">
                          {editingNoteId === msg.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                placeholder="অ্যাডমিন নোট বা আপডেট লিখুন..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveMessageNote(msg.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                              >
                                সেভ
                              </button>
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg cursor-pointer"
                              >
                                বাতিল
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingNoteId(msg.id);
                                setNoteText(msg.adminNote || '');
                              }}
                              className="text-slate-400 hover:text-amber-300 font-bold underline cursor-pointer"
                            >
                              {msg.adminNote ? 'নোট এডিট করুন' : '+ আপডেট নোট যুক্ত করুন'}
                            </button>
                          )}
                        </div>

                        {/* WhatsApp Direct Message */}
                        <a
                          href={`https://wa.me/88${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `আসসালামু আলাইকুম ${msg.name}, Aesthetic customized churi থেকে আপনার বার্তার বিষয়ে যোগাযোগ করছি।`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp এ রিপ্লাই দিন</span>
                        </a>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PRODUCT CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <span>প্রোডাক্ট ক্যাটাগরি ম্যানেজমেন্ট (Category Management)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    নতুন ক্যাটাগরি যোগ করুন, পরিচালনা করুন এবং ক্যাটাগরি ভিত্তিক চুড়ি প্রদর্শন করুন
                  </p>
                </div>
              </div>

              {/* Add New Category Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>নতুন ক্যাটাগরি যোগ করুন</span>
                </h3>
                <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-5">
                    <label className="block text-slate-300 mb-1 font-semibold text-xs">
                      ক্যাটাগরির নাম <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="যেমন: কাস্টমাইজড ব্রাইডাল চুড়া"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-slate-300 mb-1 font-semibold text-xs">
                      সংক্ষিপ্ত বিবরণ (ঐচ্ছিক):
                    </label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="যেমন: যেকোনো পোশাকের সাথে ম্যাচিং ডিজাইন"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>যোগ করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Category List Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>বিদ্যমান ক্যাটাগরি তালিকা ({categoryList.length}টি)</span>
                  <span className="text-[11px] text-amber-400 font-normal">* এই ক্যাটাগরিগুলো সাইটের ফিল্টার ট্যাবে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">ক্যাটাগরি নাম</th>
                        <th className="py-3 px-4">বিবরণ</th>
                        <th className="py-3 px-4 text-center">সংযুক্ত প্রোডাক্ট</th>
                        <th className="py-3 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {categoryList.map((cat) => {
                        const productCount = products.filter((p) => p.category === cat.name).length;
                        return (
                          <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span className="font-bold text-white text-sm">{cat.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-xs">
                              {cat.description || '—'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono font-bold text-xs border border-slate-700">
                                {productCount}টি প্রোডাক্ট
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                title="ক্যাটাগরি ডিলিট করুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMER REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>কাস্টমার রিভিউ ম্যানেজমেন্ট (Reviews Management)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    ওয়েবসাইটে প্রদর্শিত গ্রাহকদের রেটিং ও মতামত পর্যবেক্ষণ ও পরিচালনা করুন
                  </p>
                </div>
                <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-bold text-xs">
                  মোট রিভিউ: {reviewList.length}টি
                </div>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-slate-700 text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{rev.date}</span>
                      </div>

                      <div className="mb-2">
                        <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 inline-block">
                          {rev.bangleName}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{rev.name}</span>
                        <span className="text-[11px] text-slate-500">{rev.location}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="রিভিউ মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: STORE SETTINGS, LOGO, HERO/COMPARE IMAGE UPLOAD & SOCIAL MEDIA */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">স্টোর ব্র্যান্ডিং, লোগো, ছবি ও সেটিংস</h2>
                <p className="text-xs text-slate-400">
                  ব্র্যান্ড লোগো, হিরো ও কম্পেয়ার স্কয়ার ফটো, সোশ্যাল লিংক ও ডেলিভারি চার্জ পরিবর্তন করুন
                </p>
              </div>

              {saveSettingsSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>সেটিংস পরিবর্তনগুলো সফলভাবে সংরক্ষিত হয়েছে!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                
                {/* 0. BRAND IDENTITY & SEPARATE TOP/FOOTER LOGO UPLOAD */}
                <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-5">
                  <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>টপ সাইট ও ফুটার লোগো আলাদা পরিবর্তন (Separate Header & Footer Logo)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ওয়েবসাইটের উপরের নেভবার লোগো এবং নিচের ফুটার লোগো দুটি সম্পূর্ণ আলাদাভাবে সেট ও আপলোড করতে পারেন।
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. TOP SITE / NAVBAR LOGO */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          🔝 টপ সাইট / নেভবার লোগো (Header Logo)
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                          উপরে দৃশ্যমান
                        </span>
                      </div>

                      <div className="h-20 w-full rounded-xl overflow-hidden border border-amber-400/40 bg-slate-900 flex items-center justify-center p-2 shadow-inner">
                        <img
                          src={settingsForm.headerLogoUrl || settingsForm.logoUrl || '/churilogo.png'}
                          alt="Top Site Logo"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/churilogo.png';
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-300 font-semibold">
                          টপ লোগো ইমেজ লিঙ্ক (URL):
                        </label>
                        <input
                          type="url"
                          value={settingsForm.headerLogoUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            setSettingsForm({ ...settingsForm, headerLogoUrl: val, logoUrl: val || settingsForm.logoUrl });
                          }}
                          placeholder="https://... টপ লোগো URL পেস্ট করুন"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-slate-800">
                        <label className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-lg text-[11px] font-bold cursor-pointer transition-colors border border-slate-700 flex items-center justify-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>টপ লোগো ফাইল আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeaderLogoUpload}
                            className="hidden"
                          />
                        </label>
                        {settingsForm.headerLogoUrl && settingsForm.headerLogoUrl !== '/churilogo.png' && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, headerLogoUrl: '/churilogo.png' })}
                            className="py-1.5 px-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-[11px] font-bold cursor-pointer"
                            title="ডিফল্ট লোগো ফিরিয়ে আনুন"
                          >
                            রিসেট
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2. FOOTER LOGO */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          🔻 ফুটার লোগো (Footer Logo)
                        </span>
                        <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                          নিচের ফুটারে দৃশ্যমান
                        </span>
                      </div>

                      <div className="h-20 w-full rounded-xl overflow-hidden border border-amber-400/40 bg-slate-900 flex items-center justify-center p-2 shadow-inner">
                        <img
                          src={settingsForm.footerLogoUrl || settingsForm.logoUrl || '/churilogo.png'}
                          alt="Footer Logo"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/churilogo.png';
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-300 font-semibold">
                          ফুটার লোগো ইমেজ লিঙ্ক (URL):
                        </label>
                        <input
                          type="url"
                          value={settingsForm.footerLogoUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, footerLogoUrl: e.target.value.trim() })}
                          placeholder="https://... ফুটার লোগো URL পেস্ট করুন"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-slate-800">
                        <label className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-lg text-[11px] font-bold cursor-pointer transition-colors border border-slate-700 flex items-center justify-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>ফুটার লোগো ফাইল আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFooterLogoUpload}
                            className="hidden"
                          />
                        </label>
                        {settingsForm.footerLogoUrl && settingsForm.footerLogoUrl !== '/churilogo.png' && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, footerLogoUrl: '/churilogo.png' })}
                            className="py-1.5 px-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-[11px] font-bold cursor-pointer"
                            title="ডিফল্ট ফুটার লোগো ফিরিয়ে আনুন"
                          >
                            রিসেট
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brand Name & Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        সাইট ব্র্যান্ড নেম (Site Name):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.siteName || 'Aesthetic customized churi'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        ব্র্যান্ড ডিটেইলস ও ট্যাগলাইন (Details Tagline):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.detailsTagline || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, detailsTagline: e.target.value })}
                        placeholder="হাতের ছোঁয়াতেই প্রকাশ পাক আপনার স্টাইল..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
                
                {/* 1. HERO SECTION & COMPARE SECTION SQUARE IMAGE UPLOAD */}
                <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                        <span>সেকশন স্কয়ার ছবি পরিবর্তন (Hero & Compare Section Image Upload)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Firebase ডাটাবেজ / ক্লাউড স্টোরেজ ইমেজ লিংক (URL) পেস্ট করুন অথবা সরাসরি ফাইল আপলোড করুন।
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Hero Section Square Image */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            হিরো সেকশন স্কয়ার ছবি (Hero Square Image)
                          </label>
                          {settingsForm.heroSquareImage ? (
                            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-medium">
                              কাস্টম ছবি সক্রিয়
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium">
                              ডিফল্ট ৩ডি আর্ট সক্রিয়
                            </span>
                          )}
                        </div>

                        {/* Square Preview (1:1 Ratio) */}
                        <div className="relative aspect-square w-36 sm:w-40 rounded-xl bg-slate-900 border-2 border-slate-700/80 flex items-center justify-center overflow-hidden mx-auto shadow-md group">
                          {settingsForm.heroSquareImage ? (
                            <>
                              <img
                                src={settingsForm.heroSquareImage}
                                alt="Hero Square Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/330812/facc15?text=Invalid+Image+URL';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-white bg-black/70 px-2 py-1 rounded">লাইভ প্রিভিউ (1:1)</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-3">
                              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                              <span className="text-[11px] text-slate-400 block font-medium">ডিফল্ট ৩ডি গোল্ডেন পোডিয়াম</span>
                            </div>
                          )}
                        </div>

                        {/* Image URL Input (Firebase / Direct Link) */}
                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-300 font-semibold">
                            ইমেজ লিংক / Firebase Storage URL:
                          </label>
                          <input
                            type="url"
                            value={settingsForm.heroSquareImage || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroSquareImage: e.target.value.trim() })}
                            placeholder="https://... (Firebase বা যেকোনো ছবি URL পেস্ট করুন)"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      {/* File Upload & Reset Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-center cursor-pointer font-bold text-xs transition-colors border border-slate-700 shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>ছবি ফাইল আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleHeroImageUpload}
                              className="hidden"
                            />
                          </label>
                          {settingsForm.heroSquareImage && (
                            <button
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, heroSquareImage: '' })}
                              className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-lg cursor-pointer text-xs font-semibold transition-colors"
                              title="ছবি মুছে ডিফল্ট ৩ডি আর্ট ফিরিয়ে আনুন"
                            >
                              রিসেট
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 text-center">
                          অনলাইন URL দিলে সরাসরি লোড হবে, অথবা ডিভাইস থেকে আপলোড করতে পারেন।
                        </p>
                      </div>
                    </div>

                    {/* Compare Section Square Image */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            কম্পেয়ার সেকশন স্কয়ার ছবি (Compare Square Image)
                          </label>
                          {settingsForm.comparisonSquareImage ? (
                            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-medium">
                              কাস্টম ছবি সক্রিয়
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium">
                              ডিফল্ট ৩ডি আর্ট সক্রিয়
                            </span>
                          )}
                        </div>

                        {/* Square Preview (1:1 Ratio) */}
                        <div className="relative aspect-square w-36 sm:w-40 rounded-xl bg-slate-900 border-2 border-slate-700/80 flex items-center justify-center overflow-hidden mx-auto shadow-md group">
                          {settingsForm.comparisonSquareImage ? (
                            <>
                              <img
                                src={settingsForm.comparisonSquareImage}
                                alt="Compare Square Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/330812/facc15?text=Invalid+Image+URL';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-white bg-black/70 px-2 py-1 rounded">লাইভ প্রিভিউ (1:1)</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-3">
                              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                              <span className="text-[11px] text-slate-400 block font-medium">ডিফল্ট ৩ডি কোয়ালিটি আর্ট</span>
                            </div>
                          )}
                        </div>

                        {/* Image URL Input (Firebase / Direct Link) */}
                        <div className="space-y-1">
                          <label className="block text-[11px] text-slate-300 font-semibold">
                            ইমেজ লিংক / Firebase Storage URL:
                          </label>
                          <input
                            type="url"
                            value={settingsForm.comparisonSquareImage || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, comparisonSquareImage: e.target.value.trim() })}
                            placeholder="https://... (Firebase বা যেকোনো ছবি URL পেস্ট করুন)"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      {/* File Upload & Reset Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-center cursor-pointer font-bold text-xs transition-colors border border-slate-700 shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>ছবি ফাইল আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleComparisonImageUpload}
                              className="hidden"
                            />
                          </label>
                          {settingsForm.comparisonSquareImage && (
                            <button
                              type="button"
                              onClick={() => setSettingsForm({ ...settingsForm, comparisonSquareImage: '' })}
                              className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-lg cursor-pointer text-xs font-semibold transition-colors"
                              title="ছবি মুছে ডিফল্ট ৩ডি আর্ট ফিরিয়ে আনুন"
                            >
                              রিসেট
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 text-center">
                          অনলাইন URL দিলে সরাসরি লোড হবে, অথবা ডিভাইস থেকে আপলোড করতে পারেন।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. SOCIAL MEDIA LINKS CONFIGURATION */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span>সোশ্যাল মিডিয়া পেজ লিংকসমূহ (Footer Social Links)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">ফেসবুক পেজ লিংক (Facebook URL):</label>
                      <input
                        type="url"
                        value={settingsForm.facebookUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">ইনস্টাগ্রাম লিংক (Instagram URL):</label>
                      <input
                        type="url"
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">ইউটিউব চ্যানেল লিংক (YouTube URL):</label>
                      <input
                        type="url"
                        value={settingsForm.youtubeUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                        placeholder="https://youtube.com/@channel"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">টিকটক লিংক (TikTok URL):</label>
                      <input
                        type="url"
                        value={settingsForm.tiktokUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                        placeholder="https://tiktok.com/@profile"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. DELIVERY CHARGES (Including Emergency Delivery) */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>ডেলিভারি চার্জ ও ইমার্জেন্সি ডেলিভারি কনফিগারেশন</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">ঢাকার ভেতর ডেলিভারি চার্জ (টাকা):</label>
                      <input
                        type="number"
                        value={settingsForm.shippingInsideDhaka}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            shippingInsideDhaka: Number(e.target.value),
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">ঢাকার বাইরে ডেলিভারি চার্জ (টাকা):</label>
                      <input
                        type="number"
                        value={settingsForm.shippingOutsideDhaka}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            shippingOutsideDhaka: Number(e.target.value),
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-amber-400 mb-1 font-bold">⚡ ইমার্জেন্সি ডেলিভারি চার্জ (টাকা):</label>
                      <input
                        type="number"
                        value={settingsForm.shippingEmergency ?? 180}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            shippingEmergency: Number(e.target.value),
                          })
                        }
                        className="w-full bg-slate-950 border border-amber-500/50 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 4. MOBILE BANKING NUMBERS */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>মোবাইল ব্যাংকিং পেমেন্ট নাম্বার (বিকাশ, নগদ, রকেট, উপায়)</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('payments')}
                      className="text-xs text-amber-400 hover:text-white bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-slate-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>পেমেন্ট ও সেলস ট্যাবে আইকন ও মেথড পরিচালনা করুন</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 text-xs">বিকাশ (bKash) নাম্বার:</label>
                      <input
                        type="text"
                        value={settingsForm.merchantBkash}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({ ...settingsForm, merchantBkash: val });
                          handleUpdatePaymentMethodField('bkash', 'accountNumber', val);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-xs">নগদ (Nagad) নাম্বার:</label>
                      <input
                        type="text"
                        value={settingsForm.merchantNagad}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({ ...settingsForm, merchantNagad: val });
                          handleUpdatePaymentMethodField('nagad', 'accountNumber', val);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-xs">রকেট (Rocket) নাম্বার:</label>
                      <input
                        type="text"
                        value={settingsForm.merchantRocket}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({ ...settingsForm, merchantRocket: val });
                          handleUpdatePaymentMethodField('rocket', 'accountNumber', val);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 text-xs">উপায় (Upay) নাম্বার:</label>
                      <input
                        type="text"
                        value={settingsForm.merchantUpay}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm({ ...settingsForm, merchantUpay: val });
                          handleUpdatePaymentMethodField('upay', 'accountNumber', val);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. CONTACT INFORMATION & TOPBAR NOTICE (User requested Contact Edit & TopBar Notice Only) */}
                <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 flex-wrap gap-2">
                    <h3 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>যোগাযোগ ও কন্টাক্ট ইনফরমেশন এডিট (Contact Information)</span>
                    </h3>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                      ওয়েবসাইটে সরাসরি কার্যকর
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    সাইটের কন্টাক্ট ইনফো, ফ্লোটিং কল বাটন, হোয়াটসঅ্যাপ নম্বর, ইমেইল ও শোরুম ঠিকানা এখান থেকে পরিবর্তন করুন।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-300 font-semibold text-xs">
                        হটলাইন ফোন নাম্বার (Hotline Phone):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.hotlinePhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hotlinePhone: e.target.value })}
                        placeholder="যেমন: +8801516-566277"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-300 font-semibold text-xs">
                        হোয়াটসঅ্যাপ নাম্বার (WhatsApp Number):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        placeholder="যেমন: 8801516566277"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono font-bold focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>অফিসিয়াল ইমেইল এড্রেস (Store Email):</span>
                      </label>
                      <input
                        type="email"
                        value={settingsForm.storeEmail || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeEmail: e.target.value })}
                        placeholder="support@aestheticchuri.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>কাস্টমার সাপোর্ট সময় (Working Hours):</span>
                      </label>
                      <input
                        type="text"
                        value={settingsForm.storeWorkingHours || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeWorkingHours: e.target.value })}
                        placeholder="সকাল ৯:০০ টা - রাত ১০:০০ টা (প্রতিদিন)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-300 font-semibold text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>শোরুম / অফিস ঠিকানা (Store Address):</span>
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.storeAddress || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                      placeholder="ঢাকা, বাংলাদেশ"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* TopBar Announcement Notice */}
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <label className="block text-slate-300 font-semibold text-xs">
                      টপবার স্পেশাল অফার নোটিস ব্যানার (TopBar Notice Banner):
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      placeholder="যেমন: আজকের স্পেশাল অফার: যেকোনো ২টি চুড়ি সেটে ফ্রি প্রিমিয়াম গিফট বক্স!"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      সাইটের সর্বউপরে টপবারে শুধুমাত্র এই নোটিসটি প্রদর্শিত হবে (অনুরোধ অনুযায়ী কোনো ফোন বা বাটন থাকবে না)।
                    </span>
                  </div>

                  {/* Live Mini Preview Box (Notice ONLY) */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      👁️ সাইটের টপবার লাইভ প্রিভিউ (শুধুমাত্র নোটিস):
                    </span>
                    <div className="bg-[#4a0e1e] text-white text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center text-center gap-2 border border-[#64142b] overflow-hidden">
                      <div className="flex items-center gap-2 truncate">
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                          📢 নোটিস
                        </span>
                        <span className="truncate text-rose-100 font-semibold">{settingsForm.announcementText || 'আজকের অফার...'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. PROMOTIONAL OFFER POPUP MODAL (User requested feature: Site entrance offer popup with image & text) */}
                <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-400" />
                      <div>
                        <h3 className="font-bold text-amber-300 text-sm sm:text-base">
                          সাইট এন্ট্রান্স অফার পপআপ (Site Entrance Offer Popup)
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          গ্রাহক ওয়েবসাইটে প্রবেশ করলে মাঝে মাঝে অফার জানিয়ে স্বয়ংক্রিয় পপআপ উইন্ডো আসবে।
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPreviewOfferPopupOpen(true)}
                        className="py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>পপআপ প্রিভিউ দেখুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSettingsForm({
                            ...settingsForm,
                            promoPopupEnabled: !settingsForm.promoPopupEnabled,
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          settingsForm.promoPopupEnabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {settingsForm.promoPopupEnabled ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>পপআপ চালু (Active)</span>
                          </>
                        ) : (
                          <span>পপআপ বন্ধ (Disabled)</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1 text-xs">
                          পপআপ শিরোনাম (Offer Popup Title):
                        </label>
                        <input
                          type="text"
                          value={settingsForm.promoPopupTitle || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, promoPopupTitle: e.target.value })}
                          placeholder="যেমন: স্পেশাল অফার ঘোষণা!"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1 text-xs">
                          অফারের বিস্তারিত টেক্সট (Offer Description):
                        </label>
                        <textarea
                          rows={3}
                          value={settingsForm.promoPopupText || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, promoPopupText: e.target.value })}
                          placeholder="যেকোনো ২টি চুড়ি অর্ডার করলেই পাচ্ছেন স্পেশাল প্রিমিয়াম গিফট বক্স সম্পূর্ণ ফ্রি!"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                            বাটন টেক্সট:
                          </label>
                          <input
                            type="text"
                            value={settingsForm.promoPopupButtonText || ''}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, promoPopupButtonText: e.target.value })
                            }
                            placeholder="অর্ডার করতে ক্লিক করুন"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                            বাটন লিঙ্ক / URL:
                          </label>
                          <input
                            type="text"
                            value={settingsForm.promoPopupButtonUrl || ''}
                            onChange={(e) =>
                              setSettingsForm({ ...settingsForm, promoPopupButtonUrl: e.target.value })
                            }
                            placeholder="#our-products"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Popup Image Upload & Live Thumbnail */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                      <div className="space-y-2">
                        <label className="text-slate-300 font-semibold text-xs block">
                          পপআপ ব্যানার ছবি (Popup Image Upload & URL):
                        </label>

                        {/* Thumbnail preview */}
                        <div className="h-28 w-full rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative group">
                          {settingsForm.promoPopupImage ? (
                            <img
                              src={settingsForm.promoPopupImage}
                              alt="Promo Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1611591475879-11442168926b?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          ) : (
                            <div className="text-center text-slate-500 text-xs">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                              <span>ছবি ছাড়া শুধুমাত্র টেক্সট ব্যানার দেখাবে</span>
                            </div>
                          )}
                        </div>

                        <input
                          type="url"
                          value={settingsForm.promoPopupImage || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, promoPopupImage: e.target.value.trim() })
                          }
                          placeholder="https://... অফার ছবির URL পেস্ট করুন"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-slate-800">
                        <label className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-lg text-[11px] font-bold cursor-pointer transition-colors border border-slate-700 flex items-center justify-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>ছবি ফাইল আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePromoPopupImageUpload}
                            className="hidden"
                          />
                        </label>
                        {settingsForm.promoPopupImage && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, promoPopupImage: '' })}
                            className="py-1.5 px-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            মুছুন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>সেটিংস পরিবর্তনগুলো সেভ করুন</span>
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Add / Edit Product Modal (Supports SKU & Multiple Image Uploads) */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 my-8 text-xs text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-amber-300">
                {editingProduct ? 'চুড়ির তথ্য এডিট করুন' : 'নতুন চুড়ি যোগ করুন (SKU ও ফটো আপলোড)'}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">চুড়ির নাম:</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="যেমন: রয়্যাল কুন্দন চুড়ি সেট"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 flex items-center gap-1 text-xs">
                      <Barcode className="w-3.5 h-3.5 text-amber-400" />
                      <span>প্রোডাক্ট SKU কোড (Unique Product SKU):</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const catPrefix =
                          productForm.category === 'কাচের চুড়ি'
                            ? 'SLK'
                            : productForm.category === 'গোল্ড প্লেটেড'
                            ? 'GLD'
                            : productForm.category === 'ব্রাইডাল চুড়া'
                            ? 'BRD'
                            : productForm.category === 'ভেলভেট ও রেশমি'
                            ? 'VLV'
                            : 'KND';
                        const randomSku = `CDB-${catPrefix}-${Math.floor(10 + Math.random() * 90)}`;
                        setProductForm({ ...productForm, sku: randomSku });
                      }}
                      className="text-[10px] text-amber-400 hover:underline font-mono cursor-pointer font-bold"
                    >
                      ⚡ অটো জেনারেট SKU
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="যেমন: CDB-GLD-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Multiple Product Images Upload Section (Requirement 2) */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>চুড়ির ছবি আপলোড করুন (এক বা একাধিক ছবি আপলোড):</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {productForm.images.length} টি ছবি আপলোড করা হয়েছে
                  </span>
                </div>

                {/* Upload Input Button */}
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl cursor-pointer text-slate-400 hover:text-white transition-colors bg-slate-900/50">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-xs">কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন (একসাথে একাধিক ফাইল)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleImagesUpload}
                    className="hidden"
                  />
                </label>

                {/* URL Input option as alternative */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    id="new-product-img-url"
                    placeholder="অথবা ছবির অনলাইন ইমেজ লিঙ্ক (URL) পেস্ট করে যোগ করুন..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          setProductForm((prev) => ({ ...prev, images: [...prev.images, val] }));
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-product-img-url') as HTMLInputElement;
                      const imageUrl = input?.value.trim();
                      if (input && imageUrl) {
                        setProductForm((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
                        input.value = '';
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    + লিংক যোগ
                  </button>
                </div>

                {/* Preview Uploaded Thumbnails */}
                {productForm.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap pt-1">
                    {productForm.images.map((imgUrl, idx) => (
                      <div key={`${imgUrl}-${idx}`} className="relative w-18 h-18 rounded-lg border-2 border-slate-700 overflow-hidden bg-slate-900 group">
                        <ProductImagePreview src={imgUrl} alt={`Uploaded ${idx + 1}`} />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-amber-400 text-slate-950 font-black text-[8px] px-1 py-0.2 rounded shadow-xs">
                            মূল ছবি
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveProductImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-90 hover:opacity-100 cursor-pointer shadow-md"
                          title="ছবি মুছুন"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ক্যাটাগরি:</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {categoryList.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">কাস্টমাইজেশন ফিচার ট্যাগ:</label>
                  <input
                    type="text"
                    value={productForm.customizationNote || ''}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        customizationNote: e.target.value,
                      })
                    }
                    placeholder="যেমন: হ্যান্ডমেড কাস্টমাইজেশন"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">স্টক স্ট্যাটাস:</label>
                  <select
                    value={productForm.stockStatus || 'in_stock'}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stockStatus: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="in_stock">ইন স্টক (In Stock)</option>
                    <option value="made_to_order">অর্ডারে তৈরি (Made to Order)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">বিক্রয় মূল্য (টাকা):</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">আগের মূল্য (টাকা):</label>
                  <input
                    type="number"
                    required
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">সাইজসমূহ (কমা দিয়ে লিখুন):</label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    placeholder="২-৪ (2.4), ২-৬ (2.6), ২-৮ (2.8)"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">প্যাক সাইজ / সেট বিবরণ:</label>
                  <input
                    type="text"
                    value={productForm.setCount}
                    onChange={(e) => setProductForm({ ...productForm, setCount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    placeholder="যেমন: ২৪ পিস সেট"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">সংক্ষিপ্ত বিবরণ:</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span>বেস্টসেলার ব্যাজ দিন</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={productForm.isPopular}
                    onChange={(e) => setProductForm({ ...productForm, isPopular: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>জনপ্রিয় ব্যাজ দিন</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Offer Popup in Admin Panel */}
      {isPreviewOfferPopupOpen && (
        <OfferPopupModal
          settings={settingsForm}
          forceOpen={true}
          onCloseTest={() => setIsPreviewOfferPopupOpen(false)}
        />
      )}

    </div>
  );
};
