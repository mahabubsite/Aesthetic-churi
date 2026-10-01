import { BangleProduct } from '../data/banglesData';
import { OrderData } from '../components/OrderPage';
import { StoreSettings } from '../data/settings';
import { ContactMessage } from '../data/messages';
import { ProductCategory } from '../data/categories';
import { CustomerReview } from '../data/reviewsData';

export interface FirebaseConnectionStatus {
  connected: boolean;
  projectId: string;
  adminEmail: string;
  firestoreMode: string;
  orderCount?: number;
  productCount?: number;
  error?: string;
}

export const checkFirebaseStatus = async (): Promise<FirebaseConnectionStatus> => {
  try {
    const res = await fetch('/api/firebase-status');
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch (err: any) {
    return {
      connected: false,
      projectId: 'aestheticcustomizedchuri',
      adminEmail: 'robiuletc@gmail.com',
      firestoreMode: 'Admin SDK / REST',
      error: err.message || 'Server not reachable',
    };
  }
};

export const fetchAllAdminData = async (): Promise<{
  orders: OrderData[];
  products: BangleProduct[];
  categories: ProductCategory[];
  reviews: CustomerReview[];
  messages: ContactMessage[];
  settings: StoreSettings | null;
}> => {
  const res = await fetch('/api/admin/all-data');
  if (!res.ok) {
    throw new Error(`Failed to fetch admin data: ${res.statusText}`);
  }
  return await res.json();
};

export const createFirebaseOrder = async (order: OrderData): Promise<{ success: boolean; orderId?: string }> => {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Order creation failed');
    return await res.json();
  } catch (err) {
    console.error('Failed to save order to Firebase backend:', err);
    return { success: false };
  }
};

export const createFirebaseReview = async (review: CustomerReview): Promise<{ success: boolean }> => {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to submit review to Firebase backend:', err);
    return { success: false };
  }
};

export const createFirebaseMessage = async (msg: ContactMessage): Promise<{ success: boolean }> => {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to send message to Firebase backend:', err);
    return { success: false };
  }
};

export const syncAdminProducts = async (products: BangleProduct[]): Promise<boolean> => {
  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync products:', err);
    return false;
  }
};

export const syncAdminOrders = async (orders: OrderData[]): Promise<boolean> => {
  try {
    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync orders:', err);
    return false;
  }
};

export const updateOrderStatusAdmin = async (orderId: string, status: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to update order status:', err);
    return false;
  }
};

export const deleteOrderAdmin = async (orderId: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete order:', err);
    return false;
  }
};

export const syncAdminCategories = async (categories: ProductCategory[]): Promise<boolean> => {
  try {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync categories:', err);
    return false;
  }
};

export const deleteReviewAdmin = async (reviewId: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/admin/reviews/${encodeURIComponent(reviewId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete review:', err);
    return false;
  }
};

export const syncAdminSettings = async (settings: StoreSettings): Promise<boolean> => {
  try {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save settings:', err);
    return false;
  }
};

export const clearDemoDataAdmin = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch('/api/admin/clear-demo-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};
