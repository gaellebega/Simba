import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import { useSimba } from '../context/SimbaContext';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryImage, getCategoryIcon } from '../utils/helpers';

const SERVICES = [
  {
    icon: '🛍️',
    title: 'Easy Pickup',
    text: 'Order online, collect at your nearest Simba branch at a time that suits you.',
  },
  {
    icon: '🌿',
    title: 'Fresh Selection',
    text: 'Everyday essentials, pantry staples and household favourites — always in stock.',
  },
  {
    icon: '🔒',
    title: 'Secure Checkout',
    text: 'Pay with MTN MoMo or Airtel Money. Fast, safe, and mobile-first.',
  },
  {
    icon: '📍',
    title: '9 Branches',
    text: 'Remera, Kimironko, Kacyiru, Nyamirambo, Gikondo, Kanombe and more across Kigali.',
  },
];

export default function HomePage() {
  const { store, selectedBranch, setSelectedBranch } = useSimba();
  const { t } = useLanguage();

  const products = store?.products || [];
  const branches = store?.branches || [];

  const categoryNames = useMemo(
    () => (store?.categories || []).map((c) => c.name),
    [store],
  );

  const featuredProducts = useMemo(() => {
    let pool = products;
    if (selectedBranch) {
      pool = products.filter((p) => (p.stockByBranch?.[selectedBranch.id] || 0) > 0);
    }
    return [...pool]
      .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      .slice(0, 12);
  }, [products, selectedBranch]);

  const categoryCounts = useMemo(() => {
    const source = selectedBranch
      ? products.filter((p) => (p.stockByBranch?.[selectedBranch.id] || 0) > 0)
      : products;
    const counts = {};
    source.forEach((p) => {
      counts[p.categoryName] = (counts[p.categoryName] || 0) + 1;
    });
    return counts;
  }, [products, selectedBranch]);

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
      />

      {/* Services strip */}
      <section className="service-strip" id="services">
        <div className="container service-strip-grid">
          {SERVICES.map((s) => (
            <article className="service-card" key={s.title}>
              <div className="service-card-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Branch selector strip */}
      <section className="container" style={{ paddingTop: '48px' }} id="branches">
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Our Branches</p>
            <h2 className="section-title">Choose your nearest location</h2>
          </div>
        </div>
        <div className="branch-strip-grid">
          {branches.filter((b) => b.status === 'active').map((branch) => {
            const isSelected = selectedBranch?.id === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranch(branch.id)}
                className={`branch-pick-card${isSelected ? ' active' : ''}`}
              >
                <span className="branch-pick-icon">📍</span>
                <strong>{branch.name}</strong>
                <span className="branch-pick-region">{branch.region}</span>
                {isSelected && <span className="branch-pick-check">✓ Selected</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Promo collections */}
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

      {/* Category grid */}
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

      {/* Featured products */}
      <section className="container" style={{ paddingBottom: '64px' }}>
        <ProductGrid
          products={featuredProducts}
          title={selectedBranch
            ? `${t('featuredProducts')} · ${selectedBranch.name}`
            : t('featuredProducts')}
        />
      </section>
    </div>
  );
}
