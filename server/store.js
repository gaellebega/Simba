import { readFile } from 'fs/promises';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

function slugify(value) {
  return String(value || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const BRANCHES = [
  { id: 'branch-remera',    name: 'Remera',    location: 'Remera, near Amahoro Stadium, Kigali', contact: '+250 788 100 100', status: 'active', region: 'Kigali' },
  { id: 'branch-kimironko', name: 'Kimironko', location: 'Kimironko Market Road, Gasabo, Kigali', contact: '+250 788 100 101', status: 'active', region: 'Kigali' },
  { id: 'branch-kacyiru',   name: 'Kacyiru',   location: 'Kacyiru, KG 11 Ave, Gasabo, Kigali', contact: '+250 788 100 102', status: 'active', region: 'Kigali' },
  { id: 'branch-nyamirambo',name: 'Nyamirambo',location: 'Nyamirambo Commercial Center, Nyarugenge, Kigali', contact: '+250 788 100 103', status: 'active', region: 'Kigali' },
  { id: 'branch-gikondo',   name: 'Gikondo',   location: 'Gikondo, KK 15 Rd, Kicukiro, Kigali', contact: '+250 788 100 104', status: 'active', region: 'Kigali' },
  { id: 'branch-kanombe',   name: 'Kanombe',   location: 'Kanombe, near Kigali International Airport', contact: '+250 788 100 105', status: 'active', region: 'Kigali' },
  { id: 'branch-kinyinya',  name: 'Kinyinya',  location: 'Kinyinya, Gasabo, Kigali', contact: '+250 788 100 106', status: 'active', region: 'Kigali' },
  { id: 'branch-kibagabaga',name: 'Kibagabaga',location: 'Kibagabaga, Gasabo, Kigali', contact: '+250 788 100 107', status: 'active', region: 'Kigali' },
  { id: 'branch-nyanza',    name: 'Nyanza',    location: 'Nyanza Town, Southern Province', contact: '+250 788 100 108', status: 'active', region: 'Outside Kigali' },
];

export const db = {
  users: [],
  products: [],
  categories: [],
  branches: [...BRANCHES],
  orders: [],
  reviews: [],
};

export async function initStore() {
  try {
    const jsonPath = join(__dirname, '..', 'public', 'simba_products.json');
    const raw = await readFile(jsonPath, 'utf-8');
    const payload = JSON.parse(raw);
    const catalogProducts = payload.products || [];

    const uniqueCategories = [...new Set(catalogProducts.map((p) => p.category).filter(Boolean))].sort();
    db.categories = uniqueCategories.map((name, i) => ({
      id: `category-${i + 1}`,
      name,
      slug: slugify(name),
      description: `${name} products from Simba Supermarket.`,
    }));

    const catMap = Object.fromEntries(db.categories.map((c) => [c.name, c]));

    db.products = catalogProducts.slice(0, 180).map((p, i) => {
      const stockByBranch = BRANCHES.reduce((acc, b, idx) => {
        const seed = (Number(p.id) % (idx + 5)) + idx * 3;
        acc[b.id] = seed % 4 === 0 ? 0 : 8 + (seed % 12);
        return acc;
      }, {});
      const branchIds = Object.entries(stockByBranch).filter(([, q]) => q > 0).map(([id]) => id);
      const totalStock = Object.values(stockByBranch).reduce((s, v) => s + v, 0);
      const cat = catMap[p.category] || db.categories[0];
      return {
        id: `product-${p.id}`,
        legacyId: p.id,
        name: p.name,
        slug: slugify(p.name),
        description: `${p.name} is available through Simba Supermarket branches.`,
        price: p.price,
        image: p.image,
        unit: p.unit || 'pcs',
        categoryId: cat?.id,
        categoryName: p.category,
        stockByBranch,
        branchIds,
        totalStock,
        featured: i % 9 === 0,
        trendingScore: 100 - (i % 17) * 3,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      };
    });

    db.users = [
      { id: 'user-admin',    name: 'Simba Admin',  email: 'admin@simba.rw',    phone: '+250788000001', role: 'admin',    passwordHash: hashPassword('Admin123!'),    createdAt: new Date().toISOString() },
      { id: 'user-manager',  name: 'Branch Manager',email: 'manager@simba.rw', phone: '+250788000003', role: 'manager',  passwordHash: hashPassword('Manager123!'),  createdAt: new Date().toISOString() },
      { id: 'user-staff',    name: 'Staff Member', email: 'staff@simba.rw',    phone: '+250788000004', role: 'staff',    passwordHash: hashPassword('Staff123!'),    createdAt: new Date().toISOString() },
      { id: 'user-customer', name: 'Aline Uwase',  email: 'customer@simba.rw', phone: '+250788000002', role: 'customer', passwordHash: hashPassword('Customer123!'), createdAt: new Date().toISOString() },
    ];

    console.log(`  Store initialised: ${db.products.length} products, ${db.categories.length} categories`);
  } catch (err) {
    console.error('Failed to init store:', err.message);
  }
}

export { createId, hashPassword, slugify };
