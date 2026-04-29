import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Star, Check, MapPin } from 'lucide-react';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, generateImageUrl, getProductRating } from '../utils/helpers';

export default function ProductCard({ product }) {
  const { cart, addToCart, updateCartQuantity, selectedBranch } = useSimba();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart.find((item) => item.id === product.id);
  const inCart = Boolean(cartItem);
  const quantity = cartItem?.quantity || 0;
  const rating = getProductRating(product.id);

  const branchStock = selectedBranch
    ? (product.stockByBranch?.[selectedBranch.id] || 0)
    : (product.totalStock || 0);
  const isInStock = branchStock > 0;
  const imgSrc = imageError ? generateImageUrl(product) : product.image;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product.id, 1);
    if (result.ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
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
        {!isInStock && (
          <div className="product-card-oos-overlay">
            <span>{t('outOfStock')}</span>
          </div>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-card-category">{product.categoryName}</span>
          <div className="product-card-rating">
            <Star size={10} fill="#F59E0B" stroke="none" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <h3 className="product-card-name">{product.name}</h3>

        <span className="product-card-unit">{product.unit}</span>

        {selectedBranch && isInStock && (
          <div className="product-card-branch-stock">
            <MapPin size={10} />
            <span>{branchStock} {t('stockLeft')} {selectedBranch.name}</span>
          </div>
        )}

        <div className="product-card-footer">
          <div>
            <span className="product-card-price">{formatPrice(product.price)}</span>
            <span className="product-card-price-currency"> RWF</span>
          </div>

          {inCart ? (
            <div className="quantity-controls">
              <button className="qty-btn" onClick={handleDecrement} aria-label="Decrease">
                <Minus size={13} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={handleIncrement} aria-label="Increase">
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              className={`add-to-cart-btn${justAdded ? ' added' : ''}`}
              onClick={handleAddToCart}
              id={`add-cart-${product.id}`}
              disabled={!isInStock}
              aria-label={t('addToCart')}
            >
              {justAdded
                ? <Check size={14} />
                : <ShoppingCart size={14} />}
              <span>{justAdded ? t('added') : isInStock ? t('addToCart') : t('outOfStock')}</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
