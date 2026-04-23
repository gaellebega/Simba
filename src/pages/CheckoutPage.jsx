import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';
import { formatPrice } from '../utils/helpers';

const PICKUP_SLOTS = [
  '08:00 – 10:00',
  '10:00 – 12:00',
  '12:00 – 14:00',
  '14:00 – 16:00',
  '16:00 – 18:00',
];

const DEPOSIT = 1000;

export default function CheckoutPage() {
  const {
    currentUser,
    store,
    cart,
    cartSummary,
    selectedBranch,
    selectedBranchId,
    setSelectedBranch,
    createOrder,
    showToast,
  } = useSimba();

  const [pickupDay, setPickupDay] = useState('today');
  const [pickupSlot, setPickupSlot] = useState('');
  const [momoNumber, setMomoNumber] = useState(currentUser?.phone || '');
  const [momoProvider, setMomoProvider] = useState('mtn');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const activeBranches = (store?.branches || []).filter((b) => b.status === 'active');

  if (confirmedOrder) {
    return (
      <div className="simba-page simba-auth-page">
        <div className="simba-panel" style={{ textAlign: 'center', maxWidth: 480, padding: '48px 32px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✅</div>
          <h1 style={{ marginBottom: '8px' }}>Order confirmed!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Ready for pickup at <strong>{confirmedOrder.branchName}</strong>
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {pickupDay === 'today' ? 'Today' : 'Tomorrow'} · {pickupSlot}
          </p>
          <div className="simba-panel" style={{ background: 'var(--bg-secondary)', marginBottom: '24px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Order ID</p>
            <p style={{ fontWeight: '800', fontFamily: 'monospace' }}>{confirmedOrder.id}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/account" className="simba-primary-button">My orders</Link>
            <Link to="/catalog" className="simba-secondary-button">Keep shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="simba-page simba-auth-page">
        <div className="simba-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Add products before checking out.
          </p>
          <Link to="/catalog" className="simba-primary-button">Browse products</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickupSlot) {
      showToast('Please choose a pickup time slot.', 'error');
      return;
    }
    if (!momoNumber.trim()) {
      showToast('Please enter your mobile money number.', 'error');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const result = createOrder({
        name: currentUser.name,
        address: `Pickup: ${selectedBranch?.name || 'Branch'} · ${pickupDay === 'today' ? 'Today' : 'Tomorrow'} ${pickupSlot}`,
        notes: notes.trim(),
      });
      if (result.ok) {
        setConfirmedOrder(result.order);
        showToast('Order placed! See you at the branch.');
      } else {
        showToast(result.message, 'error');
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="simba-page">
      <div className="simba-section-heading">
        <h1>Checkout — Pickup Order</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose your branch, pickup time, and confirm with a small deposit.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          alignItems: 'start',
        }}>
          <div style={{ display: 'grid', gap: '20px' }}>

            {/* Step 1: Branch */}
            <div className="simba-panel">
              <h2 style={{ marginBottom: '4px' }}>1. Choose pickup branch</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem' }}>
                Where will you collect your order?
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                {activeBranches.map((branch) => (
                  <label
                    key={branch.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: `2px solid ${selectedBranchId === branch.id ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: selectedBranchId === branch.id ? 'var(--primary-glow)' : 'var(--bg-primary)',
                      transition: 'all 150ms',
                    }}
                  >
                    <input
                      type="radio"
                      name="branch"
                      value={branch.id}
                      checked={selectedBranchId === branch.id}
                      onChange={() => setSelectedBranch(branch.id)}
                      style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: '700' }}>📍 {branch.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{branch.location}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Pickup time */}
            <div className="simba-panel">
              <h2 style={{ marginBottom: '4px' }}>2. Choose pickup time</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem' }}>
                When will you come to collect?
              </p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                {['today', 'tomorrow'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setPickupDay(day)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      border: `2px solid ${pickupDay === day ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: pickupDay === day ? 'var(--primary-glow)' : 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '10px',
              }}>
                {PICKUP_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPickupSlot(slot)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                      border: `2px solid ${pickupSlot === slot ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: pickupSlot === slot ? 'var(--primary-glow)' : 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    🕐 {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Deposit */}
            <div className="simba-panel">
              <h2 style={{ marginBottom: '4px' }}>3. Confirm with deposit</h2>
              <div style={{
                background: 'rgba(255, 107, 0, 0.07)',
                border: '1px solid rgba(255, 107, 0, 0.25)',
                borderRadius: '12px',
                padding: '14px 16px',
                margin: '12px 0 16px',
              }}>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  {DEPOSIT.toLocaleString()} RWF deposit required
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  This secures your pickup slot. The remaining balance is paid at the branch.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                {[
                  { key: 'mtn', label: '📱 MTN MoMo' },
                  { key: 'airtel', label: '📱 Airtel Money' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMomoProvider(key)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      border: `2px solid ${momoProvider === key ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: momoProvider === key ? 'var(--primary-glow)' : 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {momoProvider === 'mtn' ? 'MTN' : 'Airtel'} mobile money number
                </span>
                <input
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="07X XXX XXXX"
                  required
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    width: '100%',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything we should know about your order..."
                  rows={2}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    width: '100%',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="simba-panel simba-order-summary" style={{ position: 'sticky', top: '160px' }}>
            <h2 style={{ marginBottom: '16px' }}>Order summary</h2>

            <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>×{item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem', flexShrink: 0 }}>
                    {formatPrice(item.price * item.quantity)} RWF
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '14px',
              display: 'grid',
              gap: '10px',
            }}>
              <div className="simba-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>{formatPrice(cartSummary.total)} RWF</span>
              </div>
              <div className="simba-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Deposit (MoMo)</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{DEPOSIT.toLocaleString()} RWF</span>
              </div>
              <div className="simba-summary-row" style={{
                fontWeight: '800',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '10px',
              }}>
                <span>Due at branch</span>
                <span>{formatPrice(Math.max(0, cartSummary.total - DEPOSIT))} RWF</span>
              </div>
            </div>

            <button
              type="submit"
              className="simba-primary-button"
              disabled={isProcessing}
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '16px', fontSize: '1rem' }}
            >
              {isProcessing ? 'Confirming…' : `Pay deposit — ${DEPOSIT.toLocaleString()} RWF`}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '10px' }}>
              Remaining {formatPrice(Math.max(0, cartSummary.total - DEPOSIT))} RWF paid at the branch
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
