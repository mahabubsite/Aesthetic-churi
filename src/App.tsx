/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCarousel } from './components/ProductCarousel';
import { ComparisonSection } from './components/ComparisonSection';
import { PhoneOrderBanner } from './components/PhoneOrderBanner';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';
import { OrderPage, OrderData } from './components/OrderPage';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ContactModal } from './components/ContactModal';
import { BangleSizeGuideModal } from './components/BangleSizeGuideModal';
import { TrackOrdersModal } from './components/TrackOrdersModal';
import { PhoneCallDialog } from './components/PhoneCallDialog';
import { FloatingHotline } from './components/FloatingHotline';
import { SavedBanglesModal } from './components/SavedBanglesModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { OfferPopupModal } from './components/OfferPopupModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { BangleProduct, BANGLES_PRODUCTS } from './data/banglesData';
import { StoreSettings, DEFAULT_SETTINGS } from './data/settings';
import { ContactMessage, INITIAL_MESSAGES } from './data/messages';
import { ProductCategory, INITIAL_CATEGORIES } from './data/categories';
import { CustomerReview, INITIAL_REVIEWS } from './data/reviewsData';
import {
  fetchAllAdminData,
  createFirebaseOrder,
  createFirebaseReview,
  createFirebaseMessage,
  syncAdminProducts,
  syncAdminOrders,
  syncAdminCategories,
  syncAdminSettings,
} from './services/apiService';

export default function App() {
  const [products, setProducts] = useState<BangleProduct[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  const [activeReceiptOrder, setActiveReceiptOrder] = useState<OrderData | null>(null);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Product View Detail Modal state
  const [viewingProduct, setViewingProduct] = useState<BangleProduct | null>(null);

  // Checkout state
  const [checkoutItems, setCheckoutItems] = useState<
    Array<{ product: BangleProduct; size: string; quantity: number }> | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<BangleProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('২-৬ (2.6)');

  // Admin Dashboard Mode
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Modal visibility states
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isTrackOrdersOpen, setIsTrackOrdersOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load existing products, orders, cart, messages and settings from localStorage and Firebase on mount
  useEffect(() => {
    // 1. Initial instant load from localStorage
    try {
      const savedProducts = localStorage.getItem('cdb_bangles_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = localStorage.getItem('cdb_bangles_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSettings = localStorage.getItem('cdb_store_settings');
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedBangles = localStorage.getItem('cdb_saved_bangles');
      if (savedBangles) setSavedProductIds(JSON.parse(savedBangles));

      const savedCart = localStorage.getItem('cdb_bangles_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedMessages = localStorage.getItem('cdb_contact_messages');
      if (savedMessages) setMessages(JSON.parse(savedMessages));

      const savedCategories = localStorage.getItem('cdb_bangles_categories');
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedReviews = localStorage.getItem('cdb_customer_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));
    } catch {
      // ignore
    }

    // 2. Fetch live data from Firebase (Admin SDK connected database: aestheticcustomizedchuri)
    fetchAllAdminData()
      .then((data) => {
        setProducts(data.products || []);
        try {
          localStorage.setItem('cdb_bangles_products', JSON.stringify(data.products || []));
        } catch {}

        setOrders(data.orders || []);
        try {
          localStorage.setItem('cdb_bangles_orders', JSON.stringify(data.orders || []));
        } catch {}

        setCategories(data.categories || []);
        try {
          localStorage.setItem('cdb_bangles_categories', JSON.stringify(data.categories || []));
        } catch {}

        setReviews(data.reviews || []);
        try {
          localStorage.setItem('cdb_customer_reviews', JSON.stringify(data.reviews || []));
        } catch {}

        setMessages(data.messages || []);
        try {
          localStorage.setItem('cdb_contact_messages', JSON.stringify(data.messages || []));
        } catch {}

        if (data.settings) {
          setSettings(data.settings);
          try {
            localStorage.setItem('cdb_store_settings', JSON.stringify(data.settings));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('Firebase sync status (using cached store data):', err.message);
      });
  }, []);

  const refreshAllFirebaseData = async () => {
    try {
      const data = await fetchAllAdminData();
      setProducts(data.products || []);
      setOrders(data.orders || []);
      setCategories(data.categories || []);
      setReviews(data.reviews || []);
      setMessages(data.messages || []);
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.error('Error refreshing from Firebase:', err);
    }
  };

  const handleUpdateProducts = (updatedProducts: BangleProduct[]) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem('cdb_bangles_products', JSON.stringify(updatedProducts));
    } catch {
      // ignore
    }
    syncAdminProducts(updatedProducts).catch(() => {});
  };

  const handleUpdateOrders = (updatedOrders: OrderData[]) => {
    setOrders(updatedOrders);
    try {
      localStorage.setItem('cdb_bangles_orders', JSON.stringify(updatedOrders));
    } catch {
      // ignore
    }
    syncAdminOrders(updatedOrders).catch(() => {});
  };

  const handleUpdateSettings = (updatedSettings: StoreSettings) => {
    setSettings(updatedSettings);
    try {
      localStorage.setItem('cdb_store_settings', JSON.stringify(updatedSettings));
    } catch {
      // ignore
    }
    syncAdminSettings(updatedSettings).catch(() => {});
  };

  const handleUpdateMessages = (updatedMessages: ContactMessage[]) => {
    setMessages(updatedMessages);
    try {
      localStorage.setItem('cdb_contact_messages', JSON.stringify(updatedMessages));
    } catch {
      // ignore
    }
  };

  const handleUpdateCategories = (updatedCategories: ProductCategory[]) => {
    setCategories(updatedCategories);
    try {
      localStorage.setItem('cdb_bangles_categories', JSON.stringify(updatedCategories));
    } catch {
      // ignore
    }
    syncAdminCategories(updatedCategories).catch(() => {});
  };

  const handleUpdateReviews = (updatedReviews: CustomerReview[]) => {
    setReviews(updatedReviews);
    try {
      localStorage.setItem('cdb_customer_reviews', JSON.stringify(updatedReviews));
    } catch {
      // ignore
    }
  };

  const handleAddReview = (newReview: CustomerReview) => {
    const updated = [newReview, ...reviews];
    handleUpdateReviews(updated);
    createFirebaseReview(newReview).catch(() => {});
  };

  const handleSendMessage = (newMsg: ContactMessage) => {
    const updated = [newMsg, ...messages];
    handleUpdateMessages(updated);
    createFirebaseMessage(newMsg).catch(() => {});
  };

  // Cart operations
  const handleAddToCart = (product: BangleProduct, size?: string, quantity = 1) => {
    const itemSize = size || product.sizes[0];
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.product.id === product.id && it.size === itemSize
      );

      let updated: CartItem[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx].quantity += quantity;
      } else {
        updated = [...prev, { product, size: itemSize, quantity }];
      }

      try {
        localStorage.setItem('cdb_bangles_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      try {
        localStorage.setItem('cdb_bangles_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      try {
        localStorage.setItem('cdb_bangles_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleCheckoutFromCart = () => {
    if (cartItems.length === 0) return;
    setCheckoutItems(cartItems);
    setSelectedProduct(cartItems[0].product);
    setSelectedSize(cartItems[0].size);
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: BangleProduct, size: string, quantity = 1) => {
    setCheckoutItems([{ product, size, quantity }]);
    setSelectedProduct(product);
    setSelectedSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (productId: string) => {
    setSavedProductIds((prev) => {
      let updated: string[];
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
      } else {
        updated = [...prev, productId];
      }
      try {
        localStorage.setItem('cdb_saved_bangles', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const scrollToProducts = () => {
    setSelectedProduct(null);
    setCheckoutItems(null);
    setIsAdminOpen(false);
    setTimeout(() => {
      const el = document.getElementById('our-products');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleOrderSuccess = (newOrder: OrderData) => {
    const updated = [newOrder, ...orders];
    handleUpdateOrders(updated);
    createFirebaseOrder(newOrder).catch(() => {});
    setActiveReceiptOrder(newOrder);
    setSelectedProduct(null);
    setCheckoutItems(null);
    // Clear cart on successful order
    setCartItems([]);
    try {
      localStorage.removeItem('cdb_bangles_cart');
    } catch {
      // ignore
    }
  };

  // If Admin Panel is opened, display the full admin dashboard
  if (isAdminOpen) {
    return (
      <AdminPanel
        products={products}
        orders={orders}
        settings={settings}
        messages={messages}
        categories={categories}
        reviews={reviews}
        onUpdateProducts={handleUpdateProducts}
        onUpdateOrders={handleUpdateOrders}
        onUpdateSettings={handleUpdateSettings}
        onUpdateMessages={handleUpdateMessages}
        onUpdateCategories={handleUpdateCategories}
        onUpdateReviews={handleUpdateReviews}
        onRefreshAllData={refreshAllFirebaseData}
        onExit={() => setIsAdminOpen(false)}
      />
    );
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] selection:bg-rose-900 selection:text-white">
      {/* 1. Header / Navbar with Clean Mobile Floating Badges for Wishlist, Cart & Orders */}
      <Navbar
        onContactClick={() => setIsContactOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onTrackOrderClick={() => setIsTrackOrdersOpen(true)}
        onProductsClick={scrollToProducts}
        onSavedBanglesClick={() => setIsSavedModalOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        orderCount={orders.length}
        savedCount={savedProductIds.length}
        cartCount={totalCartCount}
        logoUrl={settings.logoUrl || '/churilogo.png'}
        headerLogoUrl={settings.headerLogoUrl || settings.logoUrl || '/churilogo.png'}
        siteName={settings.siteName || 'Aesthetic customized churi'}
        hotlinePhone={settings.hotlinePhone}
        whatsappNumber={settings.whatsappNumber}
        announcementText={settings.announcementText}
      />

      <main className="flex-1">
        {selectedProduct ? (
          /* Dedicated Order Page when customer proceeds to checkout */
          <OrderPage
            initialProduct={selectedProduct}
            initialSize={selectedSize}
            initialItems={checkoutItems || undefined}
            catalogProducts={products}
            settings={settings}
            onBack={() => {
              setSelectedProduct(null);
              setCheckoutItems(null);
            }}
            onOrderSuccess={handleOrderSuccess}
          />
        ) : (
          /* Main Landing Page */
          <>
            {/* 2. Hero Section for Bangles (Supports custom square image upload from admin) */}
            <HeroSection
              onExploreClick={scrollToProducts}
              heroSquareImage={settings.heroSquareImage}
            />

            {/* 3. Our Products Carousel with dynamic products, uploaded images, and SKU */}
            <ProductCarousel
              products={products}
              availableCategories={categories.map((c) => c.name)}
              onSelectProduct={(product, size) => handleBuyNow(product, size, 1)}
              onViewProduct={(product) => setViewingProduct(product)}
              onAddToCart={(product, size) => handleAddToCart(product, size, 1)}
              savedProductIds={savedProductIds}
              onToggleSave={handleToggleSave}
            />

            {/* 4. Comparison Section ("আমরা VS অন্যরা") (Supports custom square image upload from admin) */}
            <ComparisonSection
              comparisonSquareImage={settings.comparisonSquareImage}
            />

            {/* 5. Phone Order Banner */}
            <PhoneOrderBanner
              onCallClick={() => setIsPhoneDialogOpen(true)}
              whatsappNumber={settings.whatsappNumber}
            />

            {/* 6. Social Proof & Customer Reviews */}
            <CustomerReviews
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          </>
        )}
      </main>

      {/* 7. Footer with Configured Social Media Links (Admin entry is hidden for public) */}
      <Footer
        logoUrl={settings.logoUrl || '/churilogo.png'}
        footerLogoUrl={settings.footerLogoUrl || settings.logoUrl || '/churilogo.png'}
        siteName={settings.siteName || 'Aesthetic customized churi'}
        socialUrls={{
          facebook: settings.facebookUrl,
          instagram: settings.instagramUrl,
          youtube: settings.youtubeUrl,
          tiktok: settings.tiktokUrl,
        }}
        hotlinePhone={settings.hotlinePhone}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Floating Hotline & WhatsApp buttons */}
      <FloatingHotline
        onCallClick={() => setIsPhoneDialogOpen(true)}
        whatsappNumber={settings.whatsappNumber}
        hotlinePhone={settings.hotlinePhone}
      />

      {/* Product Detail Popup (Interactive Photo Carousel, SKU, Order Now & Add to Cart) */}
      <ProductDetailModal
        product={viewingProduct}
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        onAddToCart={(prod, size, quantity) => handleAddToCart(prod, size, quantity)}
        onBuyNow={(prod, size, quantity) => handleBuyNow(prod, size, quantity)}
        isSaved={viewingProduct ? savedProductIds.includes(viewingProduct.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutFromCart}
        onExplore={scrollToProducts}
      />

      {/* Modals & Dialogs */}
      <SavedBanglesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedProductIds={savedProductIds}
        onToggleSave={handleToggleSave}
        onSelectProduct={(prod, sz) => handleBuyNow(prod, sz, 1)}
        onExploreClick={scrollToProducts}
      />

      <OrderSuccessModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        siteName={settings.siteName || 'Aesthetic customized churi'}
        logoUrl={settings.logoUrl || '/churilogo.png'}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onSendMessage={handleSendMessage}
      />

      <BangleSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onExploreClick={scrollToProducts}
      />

      <TrackOrdersModal
        isOpen={isTrackOrdersOpen}
        onClose={() => setIsTrackOrdersOpen(false)}
        orders={orders as any}
        onSelectOrder={(ord) => setActiveReceiptOrder(ord as any)}
      />

      <PhoneCallDialog
        isOpen={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        hotlinePhone={settings.hotlinePhone}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Customer Profile & Auto Account Modal (Requested: Mobile Profile icon, Auto account by phone number, 4 policy pages) */}
      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={orders as any}
        onSelectOrder={(ord) => setActiveReceiptOrder(ord as any)}
        onContactClick={() => setIsContactOpen(true)}
        onExploreProducts={scrollToProducts}
        onAdminSignInClick={() => setIsAdminLoginOpen(true)}
      />

      {/* Admin Sign-In Modal (Opened only from Policy Page -> Sign In) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminOpen(true);
        }}
        settings={settings}
      />

      {/* Entrance Offer Popup Modal (Requested: Admin manageable popup with image & text) */}
      <OfferPopupModal
        settings={settings}
        onActionClick={scrollToProducts}
      />
    </div>
  );
}
