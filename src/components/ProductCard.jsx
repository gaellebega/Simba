import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, generateImageUrl, getProductRating } from '../utils/helpers';

export default function ProductCard({ product }) {
  const { cart, addToCart, updateCartQuantity } = useSimba();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const inCart = Boolean(cartItem);
  const quantity = cartItem?.quantity || 0;
  const rating = getProductRating(product.id);
  const isInStock = (product.totalStock || 0) > 0;
  const imgSrc = imageError ? generateImageUrl(product) : product.image;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product.id, 1);
    if (result.ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1000);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartQuantity(product.id, quantity - 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card" id={`product-${product.id}`}>
      <div className="product-card-image">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImageError(true)}
        />
        {isInStock && <span className="product-card-badge">{t('inStock')}</span>}
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.categoryName}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating">
          <span>{rating.toFixed(1)}</span>
          <span className="product-card-rating-stars">★★★★★</span>
        </div>
        <span className="product-card-unit">{product.unit}</span>
        <div className="product-card-footer">
          <div>
            <span className="product-card-price">{formatPrice(product.price)}</span>
            <span className="product-card-price-currency"> RWF</span>
          </div>
          {inCart ? (
            <div className="quantity-controls">
              <button className="qty-btn" onClick={handleDecrement}>-</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={handleIncrement}>+</button>
            </div>
          ) : (
            <button
              className={`add-to-cart-btn ${justAdded ? 'added' : ''}`}
              onClick={handleAddToCart}
              id={`add-cart-${product.id}`}
              disabled={!isInStock}
            >
              <span>{justAdded ? t('added') : isInStock ? t('addToCart') : t('outOfStock')}</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
