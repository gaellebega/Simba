import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, generateImageUrl, getCategoryIcon, getProductRating } from '../utils/helpers';
import ProductGrid from '../components/ProductGrid';

export default function ProductPage() {
  const { productId } = useParams();
  const { store, cart, addToCart, updateCartQuantity } = useSimba();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const product = useMemo(
    () => store?.products.find((item) => item.id === productId),
    [store, productId],
  );

  const relatedProducts = useMemo(() => {
    if (!product || !store) return [];
    return store.products
      .filter((item) => item.categoryName === product.categoryName && item.id !== product.id)
      .slice(0, 8);
  }, [store, product]);

  if (!store || !product) {
    return (
      <div className="simba-page simba-auth-page">
        <div className="simba-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ marginBottom: '16px' }}>Product not found</h3>
          <Link to="/" className="simba-primary-button">{t('backToHome')}</Link>
        </div>
      </div>
    );
  }

  const cartItem = cart.find((item) => item.id === product.id);
  const inCart = Boolean(cartItem);
  const quantity = cartItem?.quantity || 0;
  const imgSrc = imageError ? generateImageUrl(product) : product.image;
  const rating = getProductRating(product.id);
  const isInStock = (product.totalStock || 0) > 0;

  const handleAddToCart = () => {
    const result = addToCart(product.id, 1);
    if (result.ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <div className="simba-page">
      <div className="breadcrumb" style={{ marginBottom: '24px' }}>
        <Link to="/">{t('home')}</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/category/${encodeURIComponent(product.categoryName)}`}>
          {product.categoryName}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span>{product.name}</span>
      </div>

      <div className="simba-product-page">
        <div className="simba-product-visual">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImageError(true)}
            style={{ borderRadius: '20px', width: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="simba-panel simba-product-body">
          <span className="simba-chip">
            {getCategoryIcon(product.categoryName)} {product.categoryName}
          </span>

          <h1 className="simba-product-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginTop: '16px' }}>
            {product.name}
          </h1>

          <div className="simba-product-insights">
            <strong style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>
              {formatPrice(product.price)} RWF
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f59e0b', letterSpacing: '2px' }}>
                {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {rating.toFixed(1)} / 5
              </span>
            </div>
            <span className={`simba-stock ${isInStock ? 'in' : 'out'}`}>
              {isInStock ? `✓ ${t('inStock')}` : `✕ ${t('outOfStock')}`}
            </span>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {t('unit')}: <strong>{product.unit}</strong>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.7' }}>
            {product.description}
          </p>

          {inCart ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="quantity-controls" style={{ transform: 'scale(1.15)', transformOrigin: 'left' }}>
                <button className="qty-btn" onClick={() => updateCartQuantity(product.id, quantity - 1)}>-</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => updateCartQuantity(product.id, quantity + 1)}>+</button>
              </div>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>{t('added')}</span>
            </div>
          ) : (
            <button
              className="simba-primary-button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              id="product-add-cart"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}
            >
              {justAdded ? `✓ ${t('added')}` : isInStock ? t('addToCart') : t('outOfStock')}
            </button>
          )}

          <Link
            to="/checkout"
            className="simba-secondary-button"
            style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}
          >
            Proceed to checkout
          </Link>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="simba-section">
          <ProductGrid products={relatedProducts} title={t('relatedProducts')} showCount={false} />
        </div>
      )}
    </div>
  );
}
