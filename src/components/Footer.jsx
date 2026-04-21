import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <BrandLogo compact />
            <p className="footer-brand-desc">{t('aboutSimba')}</p>
          </div>

          <div>
            <h4 className="footer-title">{t('quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">{t('home')}</Link></li>
              <li><Link to="/category/all" className="footer-link">{t('shop')}</Link></li>
              <li><a href="/#services" className="footer-link">{t('about')}</a></li>
              <li><a href="/#footer" className="footer-link">{t('contact')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">{t('customerService')}</h4>
            <ul className="footer-links">
              <li><Link to="/cart" className="footer-link">{t('viewCart')}</Link></li>
              <li><a href="/#services" className="footer-link">{t('faq')}</a></li>
              <li><a href="/#services" className="footer-link">{t('shipping')}</a></li>
              <li><a href="/#footer" className="footer-link">{t('privacy')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">{t('contactUs')}</h4>
            <ul className="footer-links">
              <li><span className="footer-link">KG 11 Ave, Kigali</span></li>
              <li><span className="footer-link">+250 788 123 456</span></li>
              <li><span className="footer-link">info@simba.rw</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t('footerRights')}</span>
          <div className="footer-payments">
            <span className="footer-payment-icon">MTN MoMo</span>
            <span className="footer-payment-icon">Airtel</span>
            <span className="footer-payment-icon">Cash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
