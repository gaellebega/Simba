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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-RW', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_COLORS = {
  Pending: { bg: 'rgba(245,158,11,0.12)', text: '#b45309' },
  Processing: { bg: 'rgba(59,130,246,0.12)', text: '#1d4ed8' },
  Delivered: { bg: 'rgba(16,185,129,0.12)', text: '#065f46' },
  Cancelled: { bg: 'rgba(239,68,68,0.12)', text: '#b91c1c' },
};

export default function AccountPage() {
  const { currentUser, store, showToast, signOut } = useSimba();
  const [activeTab, setActiveTab] = useState('orders');

  const orders = useMemo(() => (
    store.orders
      .filter((order) => order.userId === currentUser?.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  ), [store.orders, currentUser]);

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="simba-page">

      {/* Profile header */}
      <section className="simba-account-header simba-panel" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #ff8d35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            color: '#fff',
            fontWeight: '800',
            flexShrink: 0,
          }}>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.4rem', marginBottom: '2px' }}>{currentUser?.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{currentUser?.email}</p>
            {currentUser?.phone && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{currentUser.phone}</p>
            )}
            <span style={{
              display: 'inline-block',
              marginTop: '6px',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              background: currentUser?.role === 'admin' ? 'rgba(139,92,246,0.12)' : 'rgba(16,185,129,0.12)',
              color: currentUser?.role === 'admin' ? '#6d28d9' : '#065f46',
            }}>
              {currentUser?.role === 'admin' ? '⚡ Admin' : '🛒 Customer'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="simba-secondary-button">
                Admin Panel
              </Link>
            )}
            <Link to="/catalog" className="simba-primary-button">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['orders', 'stats'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: `2px solid ${activeTab === tab ? 'var(--primary)' : 'var(--border-color)'}`,
              background: activeTab === tab ? 'var(--primary-glow)' : 'var(--bg-card)',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 150ms',
              fontFamily: 'inherit',
            }}
          >
            {tab === 'orders' ? `My Orders (${orders.length})` : 'Summary'}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <section className="simba-section">
          {pendingCount > 0 && (
            <div style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#92400e',
            }}>
              ⏳ You have {pendingCount} pending order{pendingCount > 1 ? 's' : ''} awaiting confirmation.
            </div>
          )}

          {orders.length === 0 ? (
            <div className="simba-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <h3 style={{ marginBottom: '8px' }}>No orders yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Start shopping and your orders will appear here.
              </p>
              <Link to="/catalog" className="simba-primary-button">Browse products</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {orders.map((order) => {
                const statusStyle = STATUS_COLORS[order.status] || {};
                return (
                  <div key={order.id} className="simba-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {order.id}
                        </div>
                        <div style={{ fontWeight: '700', marginTop: '2px' }}>
                          📍 {order.branchName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <span style={{
                        padding: '5px 14px',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        flexShrink: 0,
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}:
                        {' '}
                        {order.items.slice(0, 3).map((i) => i.name).join(', ')}
                        {order.items.length > 3 && ` +${order.items.length - 3} more`}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                          {formatCurrency(order.total)}
                        </span>
                        {order.deliveryAddress && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {order.deliveryAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <section className="simba-section">
          <div className="simba-metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <div className="simba-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{orders.length}</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.875rem' }}>Total orders</div>
            </div>
            <div className="simba-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                {orders.filter((o) => o.status === 'Delivered').length}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.875rem' }}>Delivered</div>
            </div>
            <div className="simba-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                {formatCurrency(orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0))}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.875rem' }}>Total spent</div>
            </div>
            <div className="simba-panel" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b45309' }}>
                {orders.filter((o) => o.status === 'Pending').length}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.875rem' }}>Pending</div>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="simba-panel" style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '14px' }}>Branches visited</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[...new Set(orders.map((o) => o.branchName))].map((branch) => (
                  <span
                    key={branch}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: 'var(--primary-glow)',
                      color: 'var(--primary)',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                    }}
                  >
                    📍 {branch}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
