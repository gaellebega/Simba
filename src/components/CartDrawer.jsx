import { Link } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDrawer() {
  const {
    cart,
    cartSummary,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    selectedBranch,
  } = useSimba();

  const deliveryFee = cartSummary.total >= 50000 ? 0 : 2000;

  return (
    <>
      <div
        className={`simba-drawer-overlay${isCartOpen ? ' open' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`simba-cart-drawer${isCartOpen ? ' open' : ''}`}>
        <div className="simba-drawer-header">
          <h2>
            Cart
            {' '}
            <span className="simba-chip">{cartSummary.count}</span>
          </h2>
          <button className="simba-drawer-close" type="button" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="simba-drawer-body">
          {cart.length === 0 ? (
            <div className="simba-empty-state">
              <p>Your cart is empty.</p>
              <button
                className="simba-primary-button"
                type="button"
                style={{ marginTop: 12 }}
                onClick={() => setIsCartOpen(false)}
              >
                Continue shopping
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
                      >
                        −
                      </button>
                      <span className="simba-qty-value">{item.quantity}</span>
                      <button
                        className="simba-qty-btn"
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.availableStock}
                      >
                        +
                      </button>
                      <button
                        className="simba-remove-btn"
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="simba-drawer-footer">
            <p className="simba-drawer-branch">
              Branch:
              {' '}
              <strong>{selectedBranch?.name}</strong>
            </p>
            <div className="simba-summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(cartSummary.total)}</span>
            </div>
            <div className="simba-summary-row">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'Free (≥ RWF 50,000)' : formatCurrency(deliveryFee)}</span>
            </div>
            <div className="simba-summary-row simba-summary-total">
              <strong>Total</strong>
              <strong>{formatCurrency(cartSummary.total + deliveryFee)}</strong>
            </div>
            <div className="simba-drawer-actions">
              <Link
                className="simba-secondary-button"
                to="/cart"
                onClick={() => setIsCartOpen(false)}
              >
                View cart
              </Link>
              <Link
                className="simba-primary-button"
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
