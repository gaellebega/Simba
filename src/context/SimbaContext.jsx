import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSession,
  computeAdminStats,
  computeCartSummary,
  createId,
  createSeedData,
  createSession,
  getUserBySession,
  hashSecret,
  loadCarts,
  loadSelectedBranchId,
  loadSession,
  loadStore,
  mapProductsById,
  ORDER_STATUSES,
  saveCarts,
  saveSelectedBranchId,
  saveSession,
  saveStore,
  slugify,
} from '../services/simbaStore';

const SimbaContext = createContext(null);

function toCartKey(user) {
  return user?.id || 'guest';
}

export function SimbaProvider({ children }) {
  const [store, setStore] = useState(null);
  const [session, setSession] = useState(null);
  const [selectedBranchId, setSelectedBranchIdState] = useState('');
  const [carts, setCarts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function initialize() {
      setLoading(true);
      setError('');

      try {
        let currentStore = loadStore();

        if (!currentStore) {
          const response = await fetch('/simba_products.json');
          const payload = await response.json();
          currentStore = await createSeedData(payload.products || []);
          saveStore(currentStore);
        }

        const currentSession = loadSession();
        const currentUser = getUserBySession(currentStore, currentSession);

        if (!active) {
          return;
        }

        if (!currentUser) {
          clearSession();
        }

        setStore(currentStore);
        setSession(currentUser ? currentSession : null);
        setCarts(loadCarts());
        setSelectedBranchIdState(loadSelectedBranchId(currentStore.branches[0]?.id || ''));
      } catch (initError) {
        console.error(initError);
        if (active) {
          setError('Failed to load Simba Supermarket data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  const currentUser = useMemo(() => {
    if (!store || !session) {
      return null;
    }
    return getUserBySession(store, session);
  }, [store, session]);

  const selectedBranch = useMemo(() => {
    if (!store) {
      return null;
    }
    return store.branches.find((branch) => branch.id === selectedBranchId) || store.branches[0] || null;
  }, [store, selectedBranchId]);

  const activeCartKey = toCartKey(currentUser);
  const activeCartItems = carts[activeCartKey] || [];
  const productMap = useMemo(() => mapProductsById(store?.products || []), [store?.products]);

  const cart = useMemo(() => {
    return activeCartItems
      .map((item) => {
        const product = productMap[item.productId];
        if (!product) {
          return null;
        }

        const branchStock = selectedBranch ? product.stockByBranch[selectedBranch.id] || 0 : product.totalStock;

        return {
          ...product,
          quantity: item.quantity,
          availableStock: branchStock,
        };
      })
      .filter(Boolean);
  }, [activeCartItems, productMap, selectedBranch]);

  const cartSummary = useMemo(() => computeCartSummary(cart), [cart]);
  const adminStats = useMemo(() => (store ? computeAdminStats(store) : null), [store]);

  function commitStore(updater) {
    setStore((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater;
      saveStore(next);
      return next;
    });
  }

  function commitCarts(nextCarts) {
    setCarts(nextCarts);
    saveCarts(nextCarts);
  }

  function setSelectedBranch(branchId) {
    setSelectedBranchIdState(branchId);
    saveSelectedBranchId(branchId);
  }

  function showToast(message, type = 'success') {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }

  function dismissToast(toastId) {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }

  async function signIn(email, password) {
    if (!store) {
      return { ok: false, message: 'Store not ready yet.' };
    }

    const user = store.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { ok: false, message: 'Account not found.' };
    }

    const passwordHash = await hashSecret(password);
    if (passwordHash !== user.passwordHash) {
      return { ok: false, message: 'Invalid password.' };
    }

    const nextSession = createSession(user);
    saveSession(nextSession);
    setSession(nextSession);
    return { ok: true, user };
  }

  async function signUp(form) {
    if (!store) {
      return { ok: false, message: 'Store not ready yet.' };
    }

    const email = form.email.trim().toLowerCase();
    if (store.users.some((user) => user.email.toLowerCase() === email)) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const passwordHash = await hashSecret(form.password);
    const user = {
      id: createId('user'),
      name: form.name.trim(),
      email,
      phone: form.phone?.trim() || '',
      role: 'customer',
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    const nextStore = {
      ...store,
      users: [user, ...store.users],
    };

    saveStore(nextStore);
    setStore(nextStore);

    const nextSession = createSession(user);
    saveSession(nextSession);
    setSession(nextSession);

    return { ok: true, user };
  }

  function signOut() {
    clearSession();
    setSession(null);
  }

  async function resetPassword(email, newPassword) {
    if (!store) return { ok: false, message: 'Store not ready.' };
    const normalised = email.trim().toLowerCase();
    const user = store.users.find((u) => u.email.toLowerCase() === normalised);
    if (!user) return { ok: false, message: 'No account found with that email.' };
    const passwordHash = await hashSecret(newPassword);
    commitStore((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === user.id ? { ...u, passwordHash } : u)),
    }));
    return { ok: true };
  }

  function upsertCartItem(productId, quantity) {
    const nextItems = [...activeCartItems];
    const existingIndex = nextItems.findIndex((item) => item.productId === productId);

    if (existingIndex >= 0) {
      if (quantity <= 0) {
        nextItems.splice(existingIndex, 1);
      } else {
        nextItems[existingIndex] = { ...nextItems[existingIndex], quantity };
      }
    } else if (quantity > 0) {
      nextItems.push({ productId, quantity });
    }

    commitCarts({
      ...carts,
      [activeCartKey]: nextItems,
    });
  }

  function addToCart(productId, quantity = 1) {
    if (!store || !selectedBranch) {
      return { ok: false, message: 'Please choose a branch first.' };
    }

    const product = productMap[productId];
    if (!product) {
      return { ok: false, message: 'Product not found.' };
    }

    const existing = activeCartItems.find((item) => item.productId === productId);
    const nextQuantity = (existing?.quantity || 0) + quantity;
    const availableStock = product.stockByBranch[selectedBranch.id] || 0;

    if (availableStock < nextQuantity) {
      return { ok: false, message: 'Not enough stock at the selected branch.' };
    }

    upsertCartItem(productId, nextQuantity);
    showToast(`${product.name} added to cart.`);
    return { ok: true, message: `${product.name} added to cart.` };
  }

  function updateCartQuantity(productId, quantity) {
    upsertCartItem(productId, quantity);
  }

  function removeFromCart(productId) {
    upsertCartItem(productId, 0);
  }

  function clearCart() {
    commitCarts({
      ...carts,
      [activeCartKey]: [],
    });
  }

  function createOrder(form) {
    if (!store || !currentUser) {
      return { ok: false, message: 'You need to sign in before checkout.' };
    }
    if (!selectedBranch) {
      return { ok: false, message: 'Please choose a branch.' };
    }
    if (cart.length === 0) {
      return { ok: false, message: 'Your cart is empty.' };
    }

    const insufficient = cart.find((item) => item.quantity > item.availableStock);
    if (insufficient) {
      return { ok: false, message: `Insufficient stock for ${insufficient.name}.` };
    }

    const order = {
      id: createId('order'),
      userId: currentUser.id,
      userName: form.name.trim(),
      userEmail: currentUser.email,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: cartSummary.total,
      status: 'Pending',
      deliveryAddress: form.address.trim(),
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextProducts = store.products.map((product) => {
      const orderedItem = cart.find((item) => item.id === product.id);
      if (!orderedItem) {
        return product;
      }

      const nextStockByBranch = {
        ...product.stockByBranch,
        [selectedBranch.id]: Math.max(0, (product.stockByBranch[selectedBranch.id] || 0) - orderedItem.quantity),
      };

      return {
        ...product,
        stockByBranch: nextStockByBranch,
        branchIds: Object.entries(nextStockByBranch)
          .filter(([, quantity]) => quantity > 0)
          .map(([branchId]) => branchId),
        totalStock: Object.values(nextStockByBranch).reduce((sum, value) => sum + value, 0),
      };
    });

    const nextStore = {
      ...store,
      products: nextProducts,
      orders: [order, ...store.orders],
    };

    saveStore(nextStore);
    setStore(nextStore);
    clearCart();

    return { ok: true, order };
  }

  function updateOrderStatus(orderId, status) {
    if (!ORDER_STATUSES.includes(status)) {
      return;
    }

    commitStore((previous) => ({
      ...previous,
      orders: previous.orders.map((order) => (
        order.id === orderId ? { ...order, status } : order
      )),
    }));
  }

  function saveBranch(branch) {
    commitStore((previous) => {
      const exists = previous.branches.some((item) => item.id === branch.id);
      const nextBranch = exists
        ? branch
        : {
            ...branch,
            id: createId('branch'),
          };

      return {
        ...previous,
        branches: exists
          ? previous.branches.map((item) => (item.id === branch.id ? nextBranch : item))
          : [nextBranch, ...previous.branches],
      };
    });
  }

  function deleteBranch(branchId) {
    commitStore((previous) => ({
      ...previous,
      branches: previous.branches.filter((branch) => branch.id !== branchId),
      products: previous.products.map((product) => {
        const nextStockByBranch = { ...product.stockByBranch };
        delete nextStockByBranch[branchId];
        return {
          ...product,
          stockByBranch: nextStockByBranch,
          branchIds: product.branchIds.filter((id) => id !== branchId),
          totalStock: Object.values(nextStockByBranch).reduce((sum, value) => sum + value, 0),
        };
      }),
    }));
  }

  function saveCategory(category) {
    commitStore((previous) => {
      const exists = previous.categories.some((item) => item.id === category.id);
      const nextCategory = exists
        ? { ...category, slug: slugify(category.name) }
        : {
            ...category,
            id: createId('category'),
            slug: slugify(category.name),
          };

      return {
        ...previous,
        categories: exists
          ? previous.categories.map((item) => (item.id === nextCategory.id ? nextCategory : item))
          : [nextCategory, ...previous.categories],
      };
    });
  }

  function deleteCategory(categoryId) {
    commitStore((previous) => {
      const replacement = previous.categories.find((item) => item.id !== categoryId);
      return {
        ...previous,
        categories: previous.categories.filter((category) => category.id !== categoryId),
        products: previous.products.map((product) => (
          product.categoryId === categoryId
            ? {
                ...product,
                categoryId: replacement?.id || product.categoryId,
                categoryName: replacement?.name || product.categoryName,
              }
            : product
        )),
      };
    });
  }

  function saveProduct(product) {
    commitStore((previous) => {
      const exists = previous.products.some((item) => item.id === product.id);
      const category = previous.categories.find((item) => item.id === product.categoryId);
      const stockByBranch = product.stockByBranch || {};
      const nextProduct = {
        ...product,
        id: exists ? product.id : createId('product'),
        slug: slugify(product.name),
        categoryName: category?.name || product.categoryName || 'General',
        branchIds: Object.entries(stockByBranch)
          .filter(([, quantity]) => Number(quantity) > 0)
          .map(([branchId]) => branchId),
        totalStock: Object.values(stockByBranch).reduce((sum, value) => sum + Number(value || 0), 0),
      };

      return {
        ...previous,
        products: exists
          ? previous.products.map((item) => (item.id === nextProduct.id ? nextProduct : item))
          : [nextProduct, ...previous.products],
      };
    });
  }

  function deleteProduct(productId) {
    commitStore((previous) => ({
      ...previous,
      products: previous.products.filter((product) => product.id !== productId),
    }));
  }

  function updateUserRole(userId, role) {
    commitStore((previous) => ({
      ...previous,
      users: previous.users.map((user) => (
        user.id === userId ? { ...user, role } : user
      )),
    }));
  }

  function addReview({ productId, rating, comment }) {
    if (!currentUser) {
      return { ok: false, message: 'Sign in to leave a review.' };
    }

    const review = {
      id: createId('review'),
      productId,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    commitStore((previous) => ({
      ...previous,
      reviews: [review, ...previous.reviews],
    }));

    return { ok: true };
  }

  const value = {
    loading,
    error,
    store,
    session,
    currentUser,
    selectedBranch,
    selectedBranchId,
    setSelectedBranch,
    cart,
    cartSummary,
    adminStats,
    orderStatuses: ORDER_STATUSES,
    toasts,
    showToast,
    dismissToast,
    isCartOpen,
    setIsCartOpen,
    signIn,
    signUp,
    signOut,
    resetPassword,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    updateOrderStatus,
    saveBranch,
    deleteBranch,
    saveCategory,
    deleteCategory,
    saveProduct,
    deleteProduct,
    updateUserRole,
    addReview,
  };

  return <SimbaContext.Provider value={value}>{children}</SimbaContext.Provider>;
}

export function useSimba() {
  const context = useContext(SimbaContext);
  if (!context) {
    throw new Error('useSimba must be used inside SimbaProvider');
  }
  return context;
}
