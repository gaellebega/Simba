import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { t } = useLanguage();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 50000 ? 0 : 2000;

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="confirmation">
          <div className="empty-cart-icon">🛒</div>
          <h1 className="confirmation-title">{t('emptyCart')}</h1>
          <p className="confirmation-text">{t('emptyCartText')}</p>
          <Link to="/category/all" className="hero-cta">
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">{t('home')}</Link>
          <span className="breadcrumb-separator">/</span>
          <span>{t('cart')}</span>
        </div>

        <div className="section-header cart-page-header">
          <div>
            <h1 className="section-title">{t('shoppingCart')}</h1>
            <p className="section-copy">
              {cart.length} {t('items')} ready for checkout.
            </p>
          </div>
          <Link to="/category/all" className="ghost-link">
            {t('continueShopping')}
          </Link>
        </div>

        <div className="cart-page-grid">
          <div className="cart-page-items">
            {cart.map((item) => (
              <article key={item.id} className="cart-line-item">
                <div className="cart-line-thumb">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-line-main">
                  <div className="cart-line-copy">
                    <span className="eyebrow">{item.category}</span>
                    <h2>{item.name}</h2>
                    <p>{item.unit}</p>
                  </div>
                  <div className="cart-line-actions">
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      {t('remove')}
                    </button>
                  </div>
                </div>
                <div className="cart-line-price">{formatPrice(item.price * item.quantity)} RWF</div>
              </article>
            ))}
          </div>

          <aside className="order-summary cart-page-summary">
            <h2 className="order-summary-title">{t('cartSummary')}</h2>
            <div className="cart-summary-row">
              <span>{t('subtotal')}</span>
              <span>{formatPrice(subtotal)} RWF</span>
            </div>
            <div className="cart-summary-row">
              <span>{t('deliveryFee')}</span>
              <span>{deliveryFee === 0 ? t('free') : `${formatPrice(deliveryFee)} RWF`}</span>
            </div>
            <div className="cart-summary-row">
              <span>{t('estimatedDelivery')}</span>
              <span>2-4 hrs</span>
            </div>
            <div className="cart-summary-total">
              <span>{t('total')}</span>
              <span>{formatPrice(subtotal + deliveryFee)} RWF</span>
            </div>
            <Link to="/checkout" className="checkout-btn">
              {t('proceedCheckout')}
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
