import { Link } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const { cart, cartSummary, updateCartQuantity, removeFromCart } = useSimba();
  const { t } = useLanguage();

  if (cart.length === 0) {
    return (
      <div className="simba-page simba-auth-page">
        <div className="simba-panel" style={{ textAlign: 'center', padding: '48px 24px', maxWidth: '420px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
          <h1 style={{ marginBottom: '8px' }}>{t('emptyCart')}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{t('emptyCartText')}</p>
          <Link to="/category/all" className="simba-primary-button">
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="simba-page">
      <div className="simba-section-heading">
        <h1>{t('shoppingCart')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{cart.length} {t('items')}</p>
      </div>

      <div className="simba-cart-layout" style={{ alignItems: 'start' }}>
        <div className="simba-cart-list">
          {cart.map((item) => (
            <article key={item.id} className="simba-cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.categoryName}</span>
                <div style={{ fontWeight: '700', marginTop: '2px' }}>{item.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.unit}</div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', marginTop: '6px' }}>
                  {formatPrice(item.price)} RWF
                </div>
              </div>
              <div className="simba-cart-actions">
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                  {formatPrice(item.price * item.quantity)} RWF
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ color: 'var(--accent-red)', fontWeight: '600', fontSize: '0.85rem' }}
                >
                  {t('remove')}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="simba-panel simba-order-summary">
          <h2 style={{ marginBottom: '16px' }}>{t('cartSummary')}</h2>
          <div className="simba-summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>{t('subtotal')}</span>
            <span>{formatPrice(cartSummary.total)} RWF</span>
          </div>
          <div className="simba-summary-row" style={{ fontWeight: '800', fontSize: '1.1rem', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
            <span>{t('total')}</span>
            <span>{formatPrice(cartSummary.total)} RWF</span>
          </div>
          <Link
            to="/checkout"
            className="simba-primary-button"
            style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}
          >
            {t('proceedCheckout')}
          </Link>
          <Link
            to="/category/all"
            className="simba-secondary-button"
            style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}
