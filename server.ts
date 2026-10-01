import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { BANGLES_PRODUCTS } from './src/data/banglesData.js';
import { INITIAL_CATEGORIES } from './src/data/categories.js';
import { INITIAL_REVIEWS } from './src/data/reviewsData.js';
import { DEFAULT_SETTINGS, DEFAULT_PAYMENT_METHODS } from './src/data/settings.js';

const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const ADMIN_EMAIL = 'robiuletc@gmail.com';
const PROJECT_ID = 'aestheticcustomizedchuri';

// Initialize Firebase Admin SDK
let adminDb: Firestore | null = null;
let firebaseInitialized = false;

try {
  let serviceAccount: any = null;
  const keyPath = path.resolve('firebase-admin-key.json');
  if (fs.existsSync(keyPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  }

  if (serviceAccount && !getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: PROJECT_ID,
    });
    adminDb = getFirestore();
    firebaseInitialized = true;
    console.log(`[Firebase Admin] Successfully connected to Firebase Project: ${PROJECT_ID}`);
  } else if (getApps().length) {
    adminDb = getFirestore();
    firebaseInitialized = true;
  }

  // Ensure Firebase Authentication admin user exists with requested password
  if (firebaseInitialized) {
    (async () => {
      try {
        const auth = getAdminAuth();
        try {
          const user = await auth.getUserByEmail(ADMIN_EMAIL);
          await auth.updateUser(user.uid, {
            password: 'Mohammad_robiul',
            emailVerified: true,
          });
          console.log(`[Firebase Admin Auth] Admin user ${ADMIN_EMAIL} password updated successfully.`);
        } catch (err: any) {
          if (err.code === 'auth/user-not-found') {
            await auth.createUser({
              email: ADMIN_EMAIL,
              password: 'Mohammad_robiul',
              displayName: 'Admin Robiul',
              emailVerified: true,
            });
            console.log(`[Firebase Admin Auth] Admin user ${ADMIN_EMAIL} created successfully.`);
          }
        }
      } catch (authErr: any) {
        console.warn('[Firebase Admin Auth] Warning syncing admin user:', authErr.message);
      }
    })();
  }
} catch (err) {
  console.error('[Firebase Admin] Initialization warning:', err);
}

// --- API ROUTES ---

// Admin Firebase Authentication verify endpoint
app.post('/api/admin/firebase-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPass === 'Mohammad_robiul') {
      try {
        const auth = getAdminAuth();
        let uid = 'admin-user';
        try {
          const user = await auth.getUserByEmail(ADMIN_EMAIL);
          uid = user.uid;
        } catch {
          const newUser = await auth.createUser({
            email: ADMIN_EMAIL,
            password: 'Mohammad_robiul',
            emailVerified: true,
          });
          uid = newUser.uid;
        }
        const customToken = await auth.createCustomToken(uid);
        return res.json({ success: true, email: ADMIN_EMAIL, customToken });
      } catch {
        return res.json({ success: true, email: ADMIN_EMAIL });
      }
    } else {
      return res.status(401).json({ success: false, error: 'ভুল জিমেইল অথবা পাসওয়ার্ড!' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Clear all demo data from Firestore (Products, Reviews, Messages)
app.post('/api/admin/clear-demo-data', async (_req: Request, res: Response) => {
  if (!adminDb) return res.status(503).json({ error: 'Database not initialized' });
  try {
    const demoProductIds = BANGLES_PRODUCTS.map(p => p.id);
    const demoReviewIds = INITIAL_REVIEWS.map(r => r.id);
    const demoCategoryIds = INITIAL_CATEGORIES.map(c => c.id);

    const batch = adminDb.batch();
    for (const id of demoProductIds) {
      batch.delete(adminDb.collection('products').doc(id));
    }
    for (const id of demoReviewIds) {
      batch.delete(adminDb.collection('reviews').doc(id));
    }
    for (const id of demoCategoryIds) {
      batch.delete(adminDb.collection('categories').doc(id));
    }
    await batch.commit();

    console.log('[Firebase Admin] Demo data cleared from Firestore successfully.');
    res.json({ success: true, message: 'সব ডেমো ডাটা Firebase থেকে মুছে ফেলা হয়েছে' });
  } catch (err: any) {
    console.error('[Firebase Admin] Error clearing demo data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health & connection status
app.get('/api/firebase-status', async (_req: Request, res: Response) => {
  if (!adminDb) {
    return res.json({
      connected: false,
      projectId: PROJECT_ID,
      adminEmail: ADMIN_EMAIL,
      firestoreMode: 'Not connected',
      error: 'Firebase Admin not initialized',
    });
  }

  try {
    const [ordersCount, productsCount, reviewsCount] = await Promise.all([
      adminDb.collection('orders').count().get().then((s: any) => s.data().count).catch(() => 0),
      adminDb.collection('products').count().get().then((s: any) => s.data().count).catch(() => 0),
      adminDb.collection('reviews').count().get().then((s: any) => s.data().count).catch(() => 0),
    ]);

    res.json({
      connected: true,
      projectId: PROJECT_ID,
      adminEmail: ADMIN_EMAIL,
      firestoreMode: 'Firebase Admin SDK Live',
      orderCount: ordersCount,
      productCount: productsCount,
      reviewCount: reviewsCount,
    });
  } catch (err: any) {
    res.json({
      connected: true,
      projectId: PROJECT_ID,
      adminEmail: ADMIN_EMAIL,
      firestoreMode: 'Firebase Admin Active (Querying)',
      error: err.message,
    });
  }
});

// Admin fetch all data (Orders, Products, Categories, Reviews, Messages, Settings)
app.get('/api/admin/all-data', async (_req: Request, res: Response) => {
  if (!adminDb) {
    return res.status(503).json({ error: 'Database not initialized' });
  }

  try {
    const [ordersSnap, productsSnap, categoriesSnap, reviewsSnap, messagesSnap, settingsDoc] =
      await Promise.all([
        adminDb.collection('orders').orderBy('createdAt', 'desc').get().catch(async () => {
          return adminDb!.collection('orders').get();
        }),
        adminDb.collection('products').get(),
        adminDb.collection('categories').get(),
        adminDb.collection('reviews').get(),
        adminDb.collection('messages').get(),
        adminDb.collection('settings').doc('store_settings').get(),
      ]);

    // Return strictly what exists in the connected database without fallback to demo data
    const orders = ordersSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const products = productsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const categories = categoriesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const reviews = reviewsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const messages = messagesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const savedData = (settingsDoc.data() || {}) as any;
    const settings = settingsDoc.exists
      ? {
          ...DEFAULT_SETTINGS,
          ...savedData,
          paymentMethods:
            Array.isArray(savedData.paymentMethods) && savedData.paymentMethods.length > 0
              ? savedData.paymentMethods
              : DEFAULT_PAYMENT_METHODS,
        }
      : DEFAULT_SETTINGS;

    res.json({
      orders,
      products,
      categories,
      reviews,
      messages,
      settings,
    });
  } catch (err: any) {
    console.error('[Firebase Admin] Error fetching all data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create Order (Customer checkout)
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const orderId = orderData.id || `ACC-${Date.now().toString().slice(-6)}`;
    const finalOrder = {
      ...orderData,
      id: orderId,
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: orderData.status || 'Pending',
    };

    if (adminDb) {
      await adminDb.collection('orders').doc(orderId).set(finalOrder);
    }

    res.json({ success: true, orderId, order: finalOrder });
  } catch (err: any) {
    console.error('[Firebase Admin] Order creation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Order Status (Admin)
app.post('/api/admin/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!adminDb) return res.status(503).json({ error: 'DB not available' });

    await adminDb.collection('orders').doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Order (Admin)
app.delete('/api/admin/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!adminDb) return res.status(503).json({ error: 'DB not available' });
    await adminDb.collection('orders').doc(id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Batch Save Products (Admin)
app.post('/api/admin/products', async (req: Request, res: Response) => {
  try {
    const { products } = req.body;
    if (!adminDb || !Array.isArray(products)) return res.status(400).json({ error: 'Invalid payload' });

    const batch = adminDb.batch();
    for (const prod of products) {
      const docRef = adminDb.collection('products').doc(prod.id);
      batch.set(docRef, prod, { merge: true });
    }
    await batch.commit();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product (Admin)
app.delete('/api/admin/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!adminDb) return res.status(503).json({ error: 'DB not available' });
    await adminDb.collection('products').doc(id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Batch Save Categories (Admin)
app.post('/api/admin/categories', async (req: Request, res: Response) => {
  try {
    const { categories } = req.body;
    if (!adminDb || !Array.isArray(categories)) return res.status(400).json({ error: 'Invalid payload' });

    const batch = adminDb.batch();
    for (const cat of categories) {
      const docRef = adminDb.collection('categories').doc(cat.id);
      batch.set(docRef, cat, { merge: true });
    }
    await batch.commit();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Customer Review
app.post('/api/reviews', async (req: Request, res: Response) => {
  try {
    const review = req.body;
    const reviewId = review.id || `rev-${Date.now()}`;
    const payload = { ...review, id: reviewId, createdAt: review.createdAt || new Date().toISOString() };
    if (adminDb) {
      await adminDb.collection('reviews').doc(reviewId).set(payload);
    }
    res.json({ success: true, review: payload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Review (Admin)
app.delete('/api/admin/reviews/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!adminDb) return res.status(503).json({ error: 'DB not available' });
    await adminDb.collection('reviews').doc(id).delete();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Contact Message
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const message = req.body;
    const msgId = message.id || `msg-${Date.now()}`;
    const payload = { ...message, id: msgId, timestamp: message.timestamp || new Date().toISOString() };
    if (adminDb) {
      await adminDb.collection('messages').doc(msgId).set(payload);
    }
    res.json({ success: true, message: payload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Save Store Settings (Admin)
app.post('/api/admin/settings', async (req: Request, res: Response) => {
  try {
    const settings = req.body;
    if (adminDb) {
      await adminDb.collection('settings').doc('store_settings').set(settings, { merge: true });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- VITE DEV / PRODUCTION INTEGRATION ---
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aesthetic customized churi] Server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
