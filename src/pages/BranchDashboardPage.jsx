import { useMemo, useState } from 'react';
import {
  BarChart2, Package, Clock, CheckCircle2, XCircle,
  MapPin, User, RefreshCw, ChevronDown, AlertCircle,
  Truck, Store,
} from 'lucide-react';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';

function fmtCurrency(n) {
  return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);
}

function fmtTime(iso) {
  return new Date(iso).toLocaleString('en-RW', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const STATUS_META = {
  Pending:    { color: '#b45309', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b', Icon: Clock },
  Processing: { color: '#1d4ed8', bg: 'rgba(59,130,246,0.12)',  dot: '#3b82f6', Icon: RefreshCw },
  Delivered:  { color: '#065f46', bg: 'rgba(16,185,129,0.12)', dot: '#10b981', Icon: CheckCircle2 },
  Cancelled:  { color: '#b91c1c', bg: 'rgba(239,68,68,0.12)',  dot: '#ef4444', Icon: XCircle },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700',
      background: m.bg, color: m.color,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: m.dot, display: 'inline-block', flexShrink: 0 }} />
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, Icon, color = 'var(--primary)' }) {
  return (
    <div className="simba-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color, fontFamily: 'var(--font-heading)' }}>{value}</div>
        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Manager view ── */
function ManagerView({ orders, selectedBranch, orderStatuses, updateOrderStatus, store }) {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const revenue = orders.filter((o) => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);

  return (
    <div>
      {/* Stats */}
      <div className="simba-metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', marginBottom: 24 }}>
        <StatCard label="Pending" value={orders.filter((o) => o.status === 'Pending').length} Icon={Clock} color="#b45309" />
        <StatCard label="Processing" value={orders.filter((o) => o.status === 'Processing').length} Icon={RefreshCw} color="#1d4ed8" />
        <StatCard label="Delivered" value={orders.filter((o) => o.status === 'Delivered').length} Icon={CheckCircle2} color="#065f46" />
        <StatCard label="Revenue" value={fmtCurrency(revenue)} sub="from delivered orders" Icon={BarChart2} color="var(--primary)" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('filterStatus')}:</span>
        {['all', ...orderStatuses].map((s) => (
          <button key={s} type="button" onClick={() => setStatusFilter(s)} style={{
            padding: '6px 14px', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit',
            border: `2px solid ${statusFilter === s ? 'var(--primary)' : 'var(--border-color)'}`,
            background: statusFilter === s ? 'var(--primary-glow)' : 'var(--bg-card)',
            color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)',
            transition: 'all 150ms',
          }}>
            {s === 'all' ? t('allStatuses') : s}
            {s !== 'all' && <span style={{ marginLeft: 5, opacity: 0.65 }}>({orders.filter((o) => o.status === s).length})</span>}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="simba-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Package size={48} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)', marginBottom: 12 }} />
          <h3>{t('noBranchOrders')}</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {filtered.map((order) => (
            <div key={order.id} className="simba-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{order.id}</div>
                  <div style={{ fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={14} /> {order.userName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {order.userEmail} · {fmtTime(order.createdAt)}
                  </div>
                  {order.pickupSlot && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {order.pickupSlot}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <StatusBadge status={order.status} />
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>{fmtCurrency(order.total)}</div>
                </div>
              </div>

              {/* Items */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                {order.items.map((item) => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', padding: '3px 0' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 700 }}>{fmtCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Status control */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('orderStatus')}:</span>
                {orderStatuses.map((status) => (
                  <button key={status} type="button" onClick={() => updateOrderStatus(order.id, status)} style={{
                    padding: '6px 14px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', transition: 'all 150ms',
                    border: `2px solid ${order.status === status ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: order.status === status ? 'var(--primary)' : 'var(--bg-card)',
                    color: order.status === status ? '#fff' : 'var(--text-secondary)',
                  }}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Staff view ── */
function StaffView({ orders, currentUser, updateOrderStatus }) {
  const { t } = useLanguage();
  const myOrders = useMemo(() =>
    orders.filter((o) => ['Pending', 'Processing'].includes(o.status)),
    [orders]
  );

  return (
    <div>
      <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <AlertCircle size={16} style={{ color: '#1d4ed8', flexShrink: 0 }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1d4ed8' }}>
          Showing active orders — {myOrders.length} need attention
        </span>
      </div>

      {myOrders.length === 0 ? (
        <div className="simba-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <CheckCircle2 size={48} strokeWidth={1.5} style={{ color: 'var(--accent-emerald)', marginBottom: 12 }} />
          <h3>All clear! No pending orders.</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {myOrders.map((order) => (
            <div key={order.id} className="simba-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={14} /> {order.userName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {fmtTime(order.createdAt)}
                  </div>
                  {order.pickupSlot && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> Pickup: {order.pickupSlot}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <StatusBadge status={order.status} />
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{fmtCurrency(order.total)}</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                {order.items.map((item) => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', padding: '3px 0' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 700 }}>{fmtCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {order.status === 'Pending' && (
                  <button type="button" className="simba-primary-button"
                    onClick={() => updateOrderStatus(order.id, 'Processing')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RefreshCw size={14} /> Start Processing
                  </button>
                )}
                {order.status === 'Processing' && (
                  <button type="button" className="simba-primary-button"
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <CheckCircle2 size={14} /> Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function BranchDashboardPage() {
  const { store, selectedBranch, setSelectedBranch, updateOrderStatus, orderStatuses, currentUser } = useSimba();
  const { t } = useLanguage();

  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const isStaff   = currentUser?.role === 'staff';

  const branchOrders = useMemo(() => {
    if (!store || !selectedBranch) return [];
    return store.orders
      .filter((o) => o.branchId === selectedBranch.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [store, selectedBranch]);

  const branches = store?.branches.filter((b) => b.status === 'active') || [];

  return (
    <div className="simba-page">
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Store size={24} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              {t('branchDashboard')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>{t('branchDashSubtitle')}</p>
          {currentUser && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                padding: '3px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                background: isManager ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)',
                color: isManager ? '#6d28d9' : '#1d4ed8',
              }}>
                {isManager ? 'Manager View' : 'Staff View'}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {currentUser.name} · {currentUser.email}
              </span>
            </div>
          )}
        </div>

        {/* Branch selector */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <select
            value={selectedBranch?.id || ''}
            onChange={(e) => setSelectedBranch(e.target.value)}
            style={{
              padding: '8px 14px', borderRadius: 10, border: '2px solid var(--primary)',
              background: 'var(--bg-card)', color: 'var(--text-primary)', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {!selectedBranch ? (
        <div className="simba-panel" style={{ textAlign: 'center', padding: 48 }}>
          <MapPin size={48} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)', marginBottom: 12 }} />
          <h3>Select a branch to manage orders</h3>
        </div>
      ) : isManager ? (
        <ManagerView
          orders={branchOrders}
          selectedBranch={selectedBranch}
          orderStatuses={orderStatuses}
          updateOrderStatus={updateOrderStatus}
          store={store}
        />
      ) : isStaff ? (
        <StaffView
          orders={branchOrders}
          currentUser={currentUser}
          updateOrderStatus={updateOrderStatus}
        />
      ) : (
        <div className="simba-panel" style={{ textAlign: 'center', padding: 48 }}>
          <AlertCircle size={40} strokeWidth={1.5} style={{ color: 'var(--accent-red)', marginBottom: 12 }} />
          <h3>Access requires Manager or Staff role.</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Ask your admin to assign your role.
          </p>
        </div>
      )}
    </div>
  );
}
