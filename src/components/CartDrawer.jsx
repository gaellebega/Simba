import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDrawer() {
  const {
    cart, cartSummary, isCartOpen, setIsCartOpen,
    updateCartQuantity, removeFromCart, selectedBranch,
  } = useSimba();
  const { t } = useLanguage();

  const deliveryFee = cartSummary.total >= 50000 ? 0 : 2000;

  return (
    <>
      <div
        className={`simba-drawer-overlay${isCartOpen ? ' open' : ''}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`simba-cart-drawer${isCartOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('cartTitle')}
      >
        {/* Header */}
        <div className="simba-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
              {t('cartTitle')}
            </h2>
            {cartSummary.count > 0 && (
              <span className="simba-chip">{cartSummary.count}</span>
            )}
          </div>
          <button
            className="simba-drawer-close"
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Branch badge */}
        {selectedBranch && (
          <div className="simba-drawer-branch">
            <MapPin size={13} />
            {selectedBranch.name}
          </div>
        )}

        {/* Body */}
        <div className="simba-drawer-body">
          {cart.length === 0 ? (
            <div className="simba-empty-state">
              <ShoppingBag size={48} strokeWidth={1.5} style={{ color: 'var(--text-tertiary)', marginBottom: '12px' }} />
              <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{t('drawerEmpty')}</p>
              <button
                className="simba-primary-button"
                type="button"
                style={{ marginTop: 16 }}
                onClick={() => setIsCartOpen(false)}
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <div className="simba-drawer-item-list">
              {cart.map((item) => (
                <article key={item.id} className="simba-drawer-item">
                  <img src={item.image} alt={item.name} />
                  <div className="simba-drawer-item-body">
                    <p className="simba-drawer-item-name">{item.name}</p>
                    <p className="simba-drawer-item-price">{formatCurrency(item.price)}</p>
                    <div className="simba-qty-row">
                      <button
                        className="simba-qty-btn"
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="simba-qty-value">{item.quantity}</span>
                      <button
                        className="simba-qty-btn"
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.availableStock}
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        className="simba-remove-btn"
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={t('remove')}
                        title={t('remove')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="simba-drawer-footer">
            <div className="simba-summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>{t('subtotal')}</span>
              <span style={{ fontWeight: '700' }}>{formatCurrency(cartSummary.total)}</span>
            </div>
            <div className="simba-summary-row">
              <span style={{ color: 'var(--text-secondary)' }}>{t('deliveryFee')}</span>
              <span>
                {deliveryFee === 0
                  ? <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>{t('free')}</span>
                  : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="simba-summary-row simba-summary-total" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
              <strong>{t('total')}</strong>
              <strong style={{ color: 'var(--primary)' }}>{formatCurrency(cartSummary.total + deliveryFee)}</strong>
            </div>
            <div className="simba-drawer-actions">
              <Link
                className="simba-secondary-button"
                to="/cart"
                onClick={() => setIsCartOpen(false)}
              >
                {t('viewCart')}
              </Link>
              <Link
                className="simba-primary-button"
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {t('checkout')} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
