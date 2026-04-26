import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Share2, MessageCircle, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <BrandLogo compact />
            <p className="footer-brand-desc">{t('aboutSimba')}</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook" className="footer-social-link"><Globe size={16} /></a>
              <a href="#" aria-label="Instagram" className="footer-social-link"><Share2 size={16} /></a>
              <a href="#" aria-label="WhatsApp" className="footer-social-link"><MessageCircle size={16} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="footer-title">{t('quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">{t('home')}</Link></li>
              <li><Link to="/category/all" className="footer-link">{t('shop')}</Link></li>
              <li><a href="/#services" className="footer-link">{t('about')}</a></li>
              <li><a href="/#footer" className="footer-link">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="footer-title">{t('customerService')}</h4>
            <ul className="footer-links">
              <li><Link to="/cart" className="footer-link">{t('viewCart')}</Link></li>
              <li><a href="/#services" className="footer-link">{t('faq')}</a></li>
              <li><a href="/#services" className="footer-link">{t('shipping')}</a></li>
              <li><a href="/#footer" className="footer-link">{t('privacy')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-title">{t('contactUs')}</h4>
            <ul className="footer-links">
              <li className="footer-contact-item">
                <MapPin size={14} />
                <span>KG 11 Ave, Kigali, Rwanda</span>
              </li>
              <li className="footer-contact-item">
                <Phone size={14} />
                <span>+250 788 123 456</span>
              </li>
              <li className="footer-contact-item">
                <Mail size={14} />
                <span>info@simba.rw</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t('footerRights')}</span>
          <div className="footer-payments">
            <span className="footer-payment-chip">MTN MoMo</span>
            <span className="footer-payment-chip">Airtel Money</span>
            <span className="footer-payment-chip">Cash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
