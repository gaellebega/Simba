import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Clock, ShoppingBag, Banknote, Smartphone } from 'lucide-react';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/helpers';

const PICKUP_SLOTS = [
  '08:00 – 10:00',
  '10:00 – 12:00',
  '12:00 – 14:00',
  '14:00 – 16:00',
  '16:00 – 18:00',
];

const DEPOSIT = 1000;

const PAYMENT_STEPS = ['Connecting', 'Authorising', 'Confirming'];

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
  const { t } = useLanguage();

  const [pickupDay, setPickupDay]     = useState('today');
  const [pickupSlot, setPickupSlot]   = useState('');
  const [momoNumber, setMomoNumber]   = useState(currentUser?.phone || '');
  const [momoProvider, setMomoProvider] = useState('mtn');
  const [paymentType, setPaymentType] = useState('momo'); // 'momo' | 'cash'
  const [notes, setNotes]             = useState('');
  const [payStep, setPayStep]         = useState(-1); // -1=idle, 0-2=step, 3=done
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const activeBranches = (store?.branches || []).filter((b) => b.status === 'active');

  /* ── Order confirmed screen ── */
  if (confirmedOrder) {
    return (
      <div className="simba-page simba-auth-page">
        <div className="simba-panel" style={{ textAlign: 'center', maxWidth: 480, padding: '48px 32px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✅</div>
          <h1 style={{ marginBottom: '8px' }}>{t('orderConfirmed')}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {t('readyAt')} <strong>{confirmedOrder.branchName}</strong>
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {pickupDay === 'today' ? t('today') : t('tomorrow')} · {pickupSlot}
          </p>
          <div className="simba-panel" style={{ background: 'var(--bg-secondary)', marginBottom: '24px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t('orderNumber')}</p>
            <p style={{ fontWeight: '800', fontFamily: 'monospace', fontSize: '1rem' }}>{confirmedOrder.id}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/account" className="simba-primary-button">{t('myOrders')}</Link>
            <Link to="/catalog" className="simba-secondary-button">{t('keepShopping')}</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Empty cart ── */
  if (cart.length === 0) {
    return (
      <div className="simba-page simba-auth-page">
        <div className="simba-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ marginBottom: '8px' }}>{t('emptyCart')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{t('emptyCartText')}</p>
          <Link to="/catalog" className="simba-primary-button">{t('continueShopping')}</Link>
        </div>
      </div>
    );
  }

  /* ── Payment simulation ── */
  const isProcessing = payStep >= 0 && payStep < 3;

  async function simulatePayment() {
    return new Promise((resolve) => {
      let step = 0;
      setPayStep(step);
      const advance = () => {
        step += 1;
        if (step < 3) {
          setPayStep(step);
          setTimeout(advance, 700);
        } else {
          setPayStep(3);
          resolve();
        }
      };
      setTimeout(advance, 700);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupSlot) {
      showToast(t('errorPickupSlot'), 'error');
      return;
    }
    if (paymentType === 'momo' && !momoNumber.trim()) {
      showToast(t('errorMomoNumber'), 'error');
      return;
    }

    await simulatePayment();

    const result = createOrder({
      name: currentUser.name,
      address: `Pickup: ${selectedBranch?.name || 'Branch'} · ${pickupDay === 'today' ? t('today') : t('tomorrow')} ${pickupSlot}`,
      notes: notes.trim(),
    });

    if (result.ok) {
      setConfirmedOrder(result.order);
      showToast(t('orderPlaced'));
    } else {
      showToast(result.message, 'error');
      setPayStep(-1);
    }
  };

  return (
    <div className="simba-page">
      <div className="simba-section-heading">
        <h1>{t('checkoutTitle')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('checkoutSubtitle')}</p>
      </div>

      {/* Payment animation overlay */}
      {isProcessing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div className="simba-panel" style={{ textAlign: 'center', padding: '40px 48px', maxWidth: '360px', width: '90%' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
              {momoProvider === 'mtn' ? '📱' : '📱'}
            </div>
            <h2 style={{ marginBottom: '20px' }}>
              {momoProvider === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {PAYMENT_STEPS.map((step, i) => (
                <div key={step} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  opacity: i <= payStep ? 1 : 0.35,
                  transition: 'opacity 300ms',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: i < payStep ? 'var(--accent-emerald)' : i === payStep ? 'var(--primary)' : 'var(--bg-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i <= payStep ? '#fff' : 'var(--text-tertiary)',
                    fontWeight: '700', fontSize: '0.85rem',
                    transition: 'background 300ms',
                  }}>
                    {i < payStep ? '✓' : i + 1}
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{step}…</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Simulating {DEPOSIT.toLocaleString()} RWF deposit
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="simba-checkout-grid">
          <div style={{ display: 'grid', gap: '20px' }}>

            {/* Step 1: Branch */}
            <div className="simba-panel">
              <h2 style={{ marginBottom: '4px' }}>1. {t('chooseBranch')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem' }}>
                {t('chooseBranchHint')}
              </p>
              <div style={{ display: 'grid', gap: '10px' }}>
                {activeBranches.map((branch) => (
                  <label
                    key={branch.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                      borderRadius: '12px', cursor: 'pointer',
                      border: `2px solid ${selectedBranchId === branch.id ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: selectedBranchId === branch.id ? 'var(--primary-glow)' : 'var(--bg-primary)',
                      transition: 'all 150ms',
                    }}
                  >
                    <input
                      type="radio" name="branch" value={branch.id}
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
              <h2 style={{ marginBottom: '4px' }}>2. {t('chooseTime')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.875rem' }}>
                {t('chooseTimeHint')}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                {[
                  { val: 'today',    label: t('today') },
                  { val: 'tomorrow', label: t('tomorrow') },
                ].map(({ val, label }) => (
                  <button key={val} type="button" onClick={() => setPickupDay(val)} style={{
                    flex: 1, padding: '10px', borderRadius: '10px', fontWeight: '700',
                    border: `2px solid ${pickupDay === val ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: pickupDay === val ? 'var(--primary-glow)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 150ms', fontFamily: 'inherit',
                  }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '10px' }}>
                {PICKUP_SLOTS.map((slot) => (
                  <button key={slot} type="button" onClick={() => setPickupSlot(slot)} style={{
                    padding: '12px 8px', borderRadius: '10px', fontWeight: '600', fontSize: '0.85rem',
                    cursor: 'pointer', transition: 'all 150ms',
                    border: `2px solid ${pickupSlot === slot ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: pickupSlot === slot ? 'var(--primary-glow)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)', fontFamily: 'inherit',
                  }}>
                    🕐 {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="simba-panel">
              <h2 style={{ marginBottom: '4px' }}>3. {t('confirmDeposit')}</h2>

              {/* Payment type selector */}
              <div style={{ display: 'flex', gap: 10, margin: '14px 0' }}>
                {[
                  { key: 'momo', label: 'Mobile Money', Icon: Smartphone },
                  { key: 'cash', label: 'Cash at Branch', Icon: Banknote },
                ].map(({ key, label, Icon }) => (
                  <button key={key} type="button" onClick={() => setPaymentType(key)} style={{
                    flex: 1, padding: '12px', borderRadius: 10, fontWeight: 700,
                    border: `2px solid ${paymentType === key ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: paymentType === key ? 'var(--primary-glow)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 150ms', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>

              {paymentType === 'cash' ? (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#065f46', marginBottom: 4 }}>
                    <Banknote size={16} /> Cash payment at branch
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Pay the full amount when you pick up your order. Please bring exact change.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{
                    background: 'rgba(255,107,0,0.07)', border: '1px solid rgba(255,107,0,0.25)',
                    borderRadius: 12, padding: '14px 16px', marginBottom: 14,
                  }}>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                      {DEPOSIT.toLocaleString()} RWF {t('depositRequired')}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('depositHint')}</p>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    {[
                      { key: 'mtn',    label: 'MTN MoMo',    color: '#FFCB00' },
                      { key: 'airtel', label: 'Airtel Money', color: '#EF4444' },
                    ].map(({ key, label, color }) => (
                      <button key={key} type="button" onClick={() => setMomoProvider(key)} style={{
                        flex: 1, padding: 12, borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        border: `2px solid ${momoProvider === key ? color : 'var(--border-color)'}`,
                        background: momoProvider === key ? `${color}18` : 'var(--bg-primary)',
                        color: 'var(--text-primary)', transition: 'all 150ms',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}>
                        <Smartphone size={15} /> {label}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {momoProvider === 'mtn' ? 'MTN' : 'Airtel'} {t('momoNumber')}
                    </span>
                    <input
                      type="tel" value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      placeholder={t('momoNumberPlaceholder')}
                      required={paymentType === 'momo'}
                      style={{
                        border: '1px solid var(--border-color)', borderRadius: 12,
                        padding: '12px 14px', width: '100%', background: 'var(--bg-primary)',
                        color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('notes')}</span>
                <textarea
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')} rows={2}
                  style={{
                    border: '1px solid var(--border-color)', borderRadius: 12,
                    padding: '12px 14px', width: '100%', background: 'var(--bg-primary)',
                    color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Order Summary sidebar */}
          <div className="simba-panel simba-order-summary" style={{ position: 'sticky', top: '160px' }}>
            <h2 style={{ marginBottom: '16px' }}>{t('orderSummary')}</h2>
            <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'grid', gap: '10px' }}>
              <div className="simba-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>{t('subtotal')}</span>
                <span>{formatPrice(cartSummary.total)} RWF</span>
              </div>
              <div className="simba-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Deposit ({momoProvider === 'mtn' ? 'MTN' : 'Airtel'})</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{DEPOSIT.toLocaleString()} RWF</span>
              </div>
              <div className="simba-summary-row" style={{ fontWeight: '800', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <span>{t('dueAtBranch')}</span>
                <span>{formatPrice(Math.max(0, cartSummary.total - DEPOSIT))} RWF</span>
              </div>
            </div>

            <button
              type="submit"
              className="simba-primary-button"
              disabled={isProcessing}
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {isProcessing
                ? t('processing')
                : paymentType === 'cash'
                  ? 'Confirm Pickup Order'
                  : `${t('payDeposit')} — ${DEPOSIT.toLocaleString()} RWF`}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '10px' }}>
              {paymentType === 'cash'
                ? `Full ${formatPrice(cartSummary.total)} RWF paid at branch`
                : `${formatPrice(Math.max(0, cartSummary.total - DEPOSIT))} RWF ${t('dueAtBranch').toLowerCase()}`}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
