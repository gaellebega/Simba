import { Link } from 'react-router-dom';
import { ShoppingCart, Tag, MapPin, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSimba } from '../context/SimbaContext';

export default function Hero({ productCount, categoryCount }) {
  const { t } = useLanguage();
  const { selectedBranch } = useSimba();

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=85"
          alt="Fresh groceries at Simba Supermarket"
          loading="eager"
        />
      </div>
      <div className="hero-overlay" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <Tag size={13} />
              {t('heroBadge')}
            </div>

            <h1 className="hero-title">
              Simba Supermarket<br />
              <span style={{ color: 'var(--primary)' }}>Trusted Shopping</span><br />
              in Rwanda
            </h1>
            <p className="hero-subtitle">{t('heroSubtitle')}</p>

            {selectedBranch && (
              <div className="hero-branch-badge">
                <MapPin size={14} />
                Shopping at <strong>{selectedBranch.name}</strong>
              </div>
            )}

            <div className="hero-cta-group">
              <Link to="/category/all" className="hero-cta" id="hero-cta">
                <ShoppingCart size={18} />
                {t('heroCta')}
              </Link>
              <a href="#promotions" className="hero-secondary-cta">
                {t('heroSecondaryCta')} <ArrowRight size={15} />
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
                <div className="hero-stat-value">9</div>
                <div className="hero-stat-label">{t('heroBranches')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">2–4h</div>
                <div className="hero-stat-label">{t('heroDelivery')}</div>
              </div>
            </div>
          </div>

          <div className="hero-cards">
            <div className="hero-feature-card">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80"
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
                alt="Fast pickup"
              />
              <div className="hero-feature-card-body">
                <strong>Fast Pickup</strong>
                <span><Clock size={11} /> Ready in 2–4 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
