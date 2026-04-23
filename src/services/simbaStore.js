const STORE_KEY = 'simba-store-v3';
const SESSION_KEY = 'simba-session-v1';
const BRANCH_KEY = 'simba-branch-v1';
const CART_KEY = 'simba-carts-v1';

export const ORDER_STATUSES = ['Pending', 'Processing', 'Delivered', 'Cancelled'];

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function hashSecret(value) {
  const source = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', source);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createBranches() {
  return [
    {
      id: 'branch-remera',
      name: 'Remera',
      location: 'Remera, near Amahoro Stadium, Kigali',
      contact: '+250 788 100 100',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-kimironko',
      name: 'Kimironko',
      location: 'Kimironko Market Road, Gasabo, Kigali',
      contact: '+250 788 100 101',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-kacyiru',
      name: 'Kacyiru',
      location: 'Kacyiru, KG 11 Ave, Gasabo, Kigali',
      contact: '+250 788 100 102',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-nyamirambo',
      name: 'Nyamirambo',
      location: 'Nyamirambo Commercial Center, Nyarugenge, Kigali',
      contact: '+250 788 100 103',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-gikondo',
      name: 'Gikondo',
      location: 'Gikondo, KK 15 Rd, Kicukiro, Kigali',
      contact: '+250 788 100 104',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-kanombe',
      name: 'Kanombe',
      location: 'Kanombe, near Kigali International Airport',
      contact: '+250 788 100 105',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-kinyinya',
      name: 'Kinyinya',
      location: 'Kinyinya, Gasabo, Kigali',
      contact: '+250 788 100 106',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-kibagabaga',
      name: 'Kibagabaga',
      location: 'Kibagabaga, Gasabo, Kigali',
      contact: '+250 788 100 107',
      status: 'active',
      region: 'Kigali',
    },
    {
      id: 'branch-nyanza',
      name: 'Nyanza',
      location: 'Nyanza Town, Southern Province',
      contact: '+250 788 100 108',
      status: 'active',
      region: 'Outside Kigali',
    },
  ];
}

function createCategoryDescription(name) {
  const descriptions = {
    'Food Products': 'Pantry essentials, beverages, snacks and fresh staples for everyday shopping.',
    'Cleaning & Sanitary': 'Household cleaning solutions, tissue products and hygiene supplies.',
    'Kitchenware & Electronics': 'Useful tools, cookware and practical home electronics.',
    'Baby Products': 'Trusted care products for babies, kids and parents.',
    'Cosmetics & Personal Care': 'Daily body care, beauty and personal hygiene picks.',
    'Alcoholic Drinks': 'Wines, spirits and adult beverages for celebrations and hosting.',
    'Sports & Fitness': 'Equipment and accessories that support active living.',
    'Stationery': 'Office, school and desk essentials.',
    General: 'Everyday items that support household and personal needs.',
  };

  return descriptions[name] || 'Curated products available across Simba Supermarket branches.';
}

function createCategories(catalogProducts) {
  const uniqueNames = [...new Set(catalogProducts.map((item) => item.category).filter(Boolean))].sort();
  return uniqueNames.map((name, index) => ({
    id: `category-${index + 1}`,
    name,
    slug: slugify(name),
    description: createCategoryDescription(name),
  }));
}

function createBranchStock(productId, branches) {
  return branches.reduce((accumulator, branch, index) => {
    const seed = (Number(productId) % (index + 5)) + index * 3;
    accumulator[branch.id] = seed % 4 === 0 ? 0 : 8 + (seed % 12);
    return accumulator;
  }, {});
}

function createDescription(product) {
  return `${product.name} is available through Simba Supermarket with dependable branch pickup and delivery support.`;
}

function normalizeProducts(catalogProducts, categories, branches) {
  const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category]));

  return catalogProducts.slice(0, 180).map((product, index) => {
    const branchStock = createBranchStock(product.id, branches);
    const branchIds = Object.entries(branchStock)
      .filter(([, quantity]) => quantity > 0)
      .map(([branchId]) => branchId);

    return {
      id: `product-${product.id}`,
      legacyId: product.id,
      name: product.name,
      slug: slugify(product.name),
      description: createDescription(product),
      price: product.price,
      image: product.image,
      unit: product.unit || 'pcs',
      categoryId: categoryMap[product.category]?.id || categories[0]?.id,
      categoryName: product.category,
      branchIds,
      stockByBranch: branchStock,
      totalStock: Object.values(branchStock).reduce((sum, value) => sum + value, 0),
      featured: index % 9 === 0,
      trendingScore: 100 - (index % 17) * 3,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    };
  });
}

function createReviews(products) {
  return products.slice(0, 18).map((product, index) => ({
    id: `review-${index + 1}`,
    productId: product.id,
    userId: 'user-customer',
    userName: 'Aline Uwase',
    rating: 4 + (index % 2),
    comment: index % 3 === 0
      ? 'Fast delivery and the branch stock matched the app.'
      : 'Fresh product, smooth checkout and helpful staff.',
    createdAt: new Date(Date.now() - index * 43200000).toISOString(),
  }));
}

async function createUsers() {
  return [
    {
      id: 'user-admin',
      name: 'Simba Admin',
      email: 'admin@simba.rw',
      phone: '+250788000001',
      role: 'admin',
      passwordHash: await hashSecret('Admin123!'),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-customer',
      name: 'Aline Uwase',
      email: 'customer@simba.rw',
      phone: '+250788000002',
      role: 'customer',
      passwordHash: await hashSecret('Customer123!'),
      createdAt: new Date().toISOString(),
    },
  ];
}

function createSeedOrders(products, branches) {
  const first = products[0];
  const second = products[1];
  const third = products[2];
  const branch = branches[0];

  return [
    {
      id: 'order-1001',
      userId: 'user-customer',
      userName: 'Aline Uwase',
      userEmail: 'customer@simba.rw',
      branchId: branch.id,
      branchName: branch.name,
      items: [
        { productId: first.id, name: first.name, price: first.price, quantity: 2 },
        { productId: second.id, name: second.name, price: second.price, quantity: 1 },
      ],
      total: first.price * 2 + second.price,
      status: 'Delivered',
      deliveryAddress: 'Kicukiro, Kigali',
      notes: 'Leave at reception',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'order-1002',
      userId: 'user-customer',
      userName: 'Aline Uwase',
      userEmail: 'customer@simba.rw',
      branchId: branches[1].id,
      branchName: branches[1].name,
      items: [
        { productId: third.id, name: third.name, price: third.price, quantity: 3 },
      ],
      total: third.price * 3,
      status: 'Processing',
      deliveryAddress: 'Kimironko, Kigali',
      notes: 'Call on arrival',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
    },
  ];
}

export async function createSeedData(catalogProducts) {
  const branches = createBranches();
  const categories = createCategories(catalogProducts);
  const products = normalizeProducts(catalogProducts, categories, branches);
  const users = await createUsers();

  return {
    meta: {
      storeName: 'Simba Supermarket',
      currency: 'RWF',
      initializedAt: new Date().toISOString(),
    },
    branches,
    categories,
    products,
    users,
    orders: createSeedOrders(products, branches),
    reviews: createReviews(products),
  };
}

export function loadStore() {
  return readJson(STORE_KEY, null);
}

export function saveStore(store) {
  writeJson(STORE_KEY, store);
}

export function loadSession() {
  return readJson(SESSION_KEY, null);
}

export function saveSession(session) {
  writeJson(SESSION_KEY, session);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loadSelectedBranchId(defaultValue = '') {
  try {
    return localStorage.getItem(BRANCH_KEY) || defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveSelectedBranchId(branchId) {
  localStorage.setItem(BRANCH_KEY, branchId);
}

export function loadCarts() {
  return readJson(CART_KEY, {});
}

export function saveCarts(carts) {
  writeJson(CART_KEY, carts);
}

export function createSession(user) {
  return {
    userId: user.id,
    token: `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
}

export function getUserBySession(store, session) {
  if (!session || !session.userId || session.expiresAt < Date.now()) {
    return null;
  }
  return store.users.find((user) => user.id === session.userId) || null;
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function mapProductsById(products) {
  return Object.fromEntries(products.map((product) => [product.id, product]));
}

export function computeCartSummary(cartItems) {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return { count, total };
}

export function computeAdminStats(store) {
  const nonCancelledOrders = store.orders.filter((order) => order.status !== 'Cancelled');
  const totalSales = nonCancelledOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = store.orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length;

  const soldCounts = {};
  store.orders.forEach((order) => {
    order.items.forEach((item) => {
      soldCounts[item.productId] = (soldCounts[item.productId] || 0) + item.quantity;
    });
  });

  const mostSoldProducts = Object.entries(soldCounts)
    .map(([productId, quantity]) => {
      const product = store.products.find((item) => item.id === productId);
      return {
        productId,
        name: product?.name || 'Unknown product',
        quantity,
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    totalSales,
    activeOrders,
    mostSoldProducts,
    totalUsers: store.users.length,
    totalProducts: store.products.length,
  };
}
