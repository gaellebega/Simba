import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(amount);
}

const REGIONS = ['Kigali', 'Outside Kigali'];

const DEFAULT_BRANCH = {
  id: '',
  name: '',
  location: '',
  contact: '',
  status: 'active',
  region: 'Kigali',
};

const DEFAULT_CATEGORY = {
  id: '',
  name: '',
  description: '',
};

function createDefaultProduct(branches, categoryId) {
  return {
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    categoryId,
    stockByBranch: Object.fromEntries(branches.map((branch) => [branch.id, 0])),
    featured: false,
    trendingScore: 50,
  };
}

export default function AdminDashboardPage() {
  const {
    store,
    adminStats,
    orderStatuses,
    updateOrderStatus,
    saveBranch,
    deleteBranch,
    saveCategory,
    deleteCategory,
    saveProduct,
    deleteProduct,
    updateUserRole,
  } = useSimba();

  const [branchForm, setBranchForm] = useState(DEFAULT_BRANCH);
  const [categoryForm, setCategoryForm] = useState(DEFAULT_CATEGORY);
  const [productForm, setProductForm] = useState(createDefaultProduct(store.branches, store.categories[0]?.id || ''));
  const [adminProductSearch, setAdminProductSearch] = useState('');

  const productsWithCategory = useMemo(() => {
    const q = adminProductSearch.toLowerCase().trim();
    if (!q) return store.products;
    return store.products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q),
    );
  }, [store.products, adminProductSearch]);

  return (
    <div className="simba-page">
      <section className="simba-section">
        <div className="simba-section-heading">
          <h1>Admin dashboard</h1>
          <p>Manage branches, categories, products, orders and users from one place.</p>
        </div>

        <div className="simba-metric-grid">
          <div className="simba-panel">
            <strong>{formatCurrency(adminStats.totalSales)}</strong>
            <span>Total sales</span>
          </div>
          <div className="simba-panel">
            <strong>{adminStats.activeOrders}</strong>
            <span>Active orders</span>
          </div>
          <div className="simba-panel">
            <strong>{adminStats.totalProducts}</strong>
            <span>Products</span>
          </div>
          <div className="simba-panel">
            <strong>{adminStats.totalUsers}</strong>
            <span>Users</span>
          </div>
        </div>
      </section>

      <section className="simba-admin-grid">
        <div className="simba-panel">
          <h2>Branches</h2>
          <form
            className="simba-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveBranch(branchForm);
              setBranchForm(DEFAULT_BRANCH);
            }}
          >
            <input placeholder="Name" value={branchForm.name} onChange={(event) => setBranchForm((value) => ({ ...value, name: event.target.value }))} required />
            <input placeholder="Location" value={branchForm.location} onChange={(event) => setBranchForm((value) => ({ ...value, location: event.target.value }))} required />
            <input placeholder="Contact" value={branchForm.contact} onChange={(event) => setBranchForm((value) => ({ ...value, contact: event.target.value }))} />
            <select value={branchForm.region} onChange={(event) => setBranchForm((value) => ({ ...value, region: event.target.value }))}>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={branchForm.status} onChange={(event) => setBranchForm((value) => ({ ...value, status: event.target.value }))}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <button className="simba-primary-button" type="submit">Save branch</button>
          </form>
          <div className="simba-list-stack">
            {store.branches.map((branch) => (
              <div key={branch.id} className="simba-list-item">
                <div>
                  <strong>{branch.name}</strong>
                  <p>{branch.location}</p>
                </div>
                <div className="simba-inline-actions">
                  <button className="simba-secondary-button" type="button" onClick={() => setBranchForm(branch)}>Edit</button>
                  <button className="simba-danger-button" type="button" onClick={() => deleteBranch(branch.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="simba-panel">
          <h2>Categories</h2>
          <form
            className="simba-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveCategory(categoryForm);
              setCategoryForm(DEFAULT_CATEGORY);
            }}
          >
            <input placeholder="Category name" value={categoryForm.name} onChange={(event) => setCategoryForm((value) => ({ ...value, name: event.target.value }))} required />
            <textarea placeholder="Description" rows="3" value={categoryForm.description} onChange={(event) => setCategoryForm((value) => ({ ...value, description: event.target.value }))} />
            <button className="simba-primary-button" type="submit">Save category</button>
          </form>
          <div className="simba-list-stack">
            {store.categories.map((category) => (
              <div key={category.id} className="simba-list-item">
                <div>
                  <strong>{category.name}</strong>
                  <p>{category.description}</p>
                </div>
                <div className="simba-inline-actions">
                  <button className="simba-secondary-button" type="button" onClick={() => setCategoryForm(category)}>Edit</button>
                  <button className="simba-danger-button" type="button" onClick={() => deleteCategory(category.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="simba-admin-grid">
        <div className="simba-panel">
          <h2>Products</h2>
          <form
            className="simba-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveProduct(productForm);
              setProductForm(createDefaultProduct(store.branches, store.categories[0]?.id || ''));
            }}
          >
            <input placeholder="Product name" value={productForm.name} onChange={(event) => setProductForm((value) => ({ ...value, name: event.target.value }))} required />
            <textarea placeholder="Description" rows="3" value={productForm.description} onChange={(event) => setProductForm((value) => ({ ...value, description: event.target.value }))} required />
            <input placeholder="Image URL" value={productForm.image} onChange={(event) => setProductForm((value) => ({ ...value, image: event.target.value }))} required />
            <input type="number" placeholder="Price" value={productForm.price} onChange={(event) => setProductForm((value) => ({ ...value, price: Number(event.target.value) }))} required />
            <select value={productForm.categoryId} onChange={(event) => setProductForm((value) => ({ ...value, categoryId: event.target.value }))}>
              {store.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="simba-stock-editor">
              {store.branches.map((branch) => (
                <label key={branch.id}>
                  <span>{branch.name}</span>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stockByBranch?.[branch.id] || 0}
                    onChange={(event) => setProductForm((value) => ({
                      ...value,
                      stockByBranch: {
                        ...value.stockByBranch,
                        [branch.id]: Number(event.target.value),
                      },
                    }))}
                  />
                </label>
              ))}
            </div>
            <button className="simba-primary-button" type="submit">Save product</button>
          </form>

          <div className="simba-admin-search">
            <input
              placeholder={`Search ${store.products.length} products…`}
              value={adminProductSearch}
              onChange={(event) => setAdminProductSearch(event.target.value)}
            />
            {adminProductSearch && (
              <button className="simba-secondary-button" type="button" onClick={() => setAdminProductSearch('')}>
                Clear
              </button>
            )}
          </div>

          <div className="simba-list-stack">
            {productsWithCategory.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', padding: '12px 0' }}>No products match.</p>
            )}
            {productsWithCategory.map((product) => (
              <div key={product.id} className="simba-list-item">
                <div>
                  <Link to={`/product/${product.id}`} className="simba-inline-link">
                    <strong>{product.name}</strong>
                  </Link>
                  <p>
                    {product.categoryName}
                    {' · '}
                    {formatCurrency(product.price)}
                    {' · '}
                    {product.totalStock}
                    {' '}
                    in stock
                  </p>
                </div>
                <div className="simba-inline-actions">
                  <button className="simba-secondary-button" type="button" onClick={() => setProductForm(product)}>Edit</button>
                  <button className="simba-danger-button" type="button" onClick={() => deleteProduct(product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="simba-panel">
          <h2>Orders</h2>
          <div className="simba-table-wrap">
            <table className="simba-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {store.orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userName}</td>
                    <td>{order.branchName}</td>
                    <td>
                      <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="simba-subsection-title">Users</h2>
          <div className="simba-table-wrap">
            <table className="simba-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {store.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select value={user.role} onChange={(event) => updateUserRole(user.id, event.target.value)}>
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="simba-subsection-title">Most sold products</h2>
          <div className="simba-list-stack">
            {adminStats.mostSoldProducts.map((product) => (
              <div key={product.productId} className="simba-list-item">
                <strong>{product.name}</strong>
                <span>{product.quantity} sold</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
