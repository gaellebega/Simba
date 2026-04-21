import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ productCount, categoryCount }) {
  const { t } = useLanguage();

  return (
    <section className="hero" id="hero">
      {/* Background supermarket image */}
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1920&q=80"
          alt=""
          loading="eager"
        />
      </div>
      <div className="hero-overlay" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>🦁</span>
              {t('heroBadge')}
            </div>

            <h1 className="hero-title">{t('heroTitle')}</h1>
            <p className="hero-subtitle">{t('heroSubtitle')}</p>

            <div className="hero-cta-group">
              <Link to="/category/all" className="hero-cta" id="hero-cta">
                {t('heroCta')} →
              </Link>
              <a href="/#promotions" className="hero-secondary-cta">
                {t('heroSecondaryCta')}
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">{productCount}+</div>
                <div className="hero-stat-label">{t('heroProducts')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{categoryCount}</div>
                <div className="hero-stat-label">{t('heroCategories')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">2-4h</div>
                <div className="hero-stat-label">{t('heroDelivery')}</div>
              </div>
            </div>
          </div>

          {/* Floating feature cards */}
          <div className="hero-cards">
            <div className="hero-feature-card">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
                alt="Fresh groceries"
              />
              <div className="hero-feature-card-body">
                <strong>Fresh Groceries</strong>
                <span>Daily restocked</span>
              </div>
            </div>
            <div className="hero-feature-card hero-feature-card-offset">
              <img
                src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80"
                alt="Fast delivery"
              />
              <div className="hero-feature-card-body">
                <strong>Fast Delivery</strong>
                <span>2-4h across Kigali</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
