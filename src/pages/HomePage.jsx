import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryImage, getCategoryIcon } from '../utils/helpers';

export default function HomePage() {
  const { store } = useSimba();
  const { t } = useLanguage();

  const products = store?.products || [];
  const categoryNames = useMemo(
    () => (store?.categories || []).map((c) => c.name),
    [store],
  );

  const featuredProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 12);
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((product) => {
      counts[product.categoryName] = (counts[product.categoryName] || 0) + 1;
    });
    return counts;
  }, [products]);

  const promoCollections = useMemo(() => ([
    {
      id: 'food',
      title: t('promotionOne'),
      text: t('promotionOneText'),
      category: 'Food Products',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'cleaning',
      title: t('promotionTwo'),
      text: t('promotionTwoText'),
      category: 'Cleaning & Sanitary',
      image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'baby',
      title: t('promotionThree'),
      text: t('promotionThreeText'),
      category: 'Baby Products',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
    },
  ]), [t]);

  return (
    <div id="home-page">
      <CategoryNav categories={categoryNames} activeCategory="" />
      <Hero
        productCount={products.length}
        categoryCount={categoryNames.length}
        spotlightProducts={featuredProducts.slice(0, 3)}
      />

      <section className="service-strip" id="services">
        <div className="container service-strip-grid">
          <article className="service-card">
            <div className="service-card-icon">🛍️</div>
            <h3>Easy Pickup</h3>
            <p>Order online, collect at your nearest Simba branch at a time that suits you.</p>
          </article>
          <article className="service-card">
            <div className="service-card-icon">🌿</div>
            <h3>{t('freshSelection')}</h3>
            <p>{t('serviceFreshText')}</p>
          </article>
          <article className="service-card">
            <div className="service-card-icon">🔒</div>
            <h3>{t('securePayments')}</h3>
            <p>{t('serviceSecureText')}</p>
          </article>
          <article className="service-card">
            <div className="service-card-icon">📍</div>
            <h3>9 Branches</h3>
            <p>Kigali branches across Remera, Kimironko, Kacyiru, Nyamirambo, Gikondo and more.</p>
          </article>
        </div>
      </section>

      <section className="container promo-section" id="promotions">
        <div className="section-header">
          <div>
            <p className="eyebrow">{t('weeklyPromotions')}</p>
            <h2 className="section-title">{t('whyShopSimba')}</h2>
          </div>
          <Link to="/category/all" className="ghost-link">
            {t('viewAll')}
          </Link>
        </div>
        <div className="promo-grid">
          {promoCollections.map((promo) => (
            <Link
              key={promo.id}
              to={`/category/${encodeURIComponent(promo.category)}`}
              className="promo-card"
            >
              <img src={promo.image} alt={promo.title} />
              <div className="promo-card-overlay" />
              <div className="promo-card-content">
                <p className="eyebrow">{promo.category}</p>
                <h3>{promo.title}</h3>
                <p>{promo.text}</p>
                <span className="promo-link">{t('promoCta')}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container category-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">{t('browseCategories')}</p>
            <h2 className="section-title">{t('browseCategories')}</h2>
          </div>
          <Link to="/category/all" className="ghost-link">
            {t('viewAll')}
          </Link>
        </div>
        <div className="categories-grid" id="categories-grid">
          {categoryNames.map((category) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
              className="category-card"
              id={`category-card-${category.replace(/[^a-zA-Z]/g, '')}`}
            >
              <div
                className="category-card-bg"
                style={{ backgroundImage: `url(${getCategoryImage(category)})` }}
              />
              <div className="category-card-overlay" />
              <div className="category-card-content">
                <div className="category-card-name">
                  {getCategoryIcon(category)} {category}
                </div>
                <div className="category-card-count">
                  {categoryCounts[category] || 0} {t('showingProducts')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container">
        <ProductGrid products={featuredProducts} title={t('featuredProducts')} />
      </section>
    </div>
  );
}
