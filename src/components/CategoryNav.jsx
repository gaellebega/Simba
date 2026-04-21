import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryIcon } from '../utils/helpers';

export default function CategoryNav({ categories, activeCategory }) {
  const { t } = useLanguage();

  const renderNavItems = (prefix) => (
    <>
      <li key={`${prefix}-all`}>
        <Link
          to="/category/all"
          className={`category-nav-item ${activeCategory === 'all' ? 'active' : ''}`}
          id={`${prefix}-cat-nav-all`}
        >
          {t('allCategories')}
        </Link>
      </li>
      {categories.map((category) => (
        <li key={`${prefix}-${category}`}>
          <Link
            to={`/category/${encodeURIComponent(category)}`}
            className={`category-nav-item ${activeCategory === category ? 'active' : ''}`}
            id={`${prefix}-cat-nav-${category.replace(/[^a-zA-Z]/g, '')}`}
          >
            {getCategoryIcon(category)} {category}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <nav className="category-nav" id="category-nav">
      <div className="container">
        <div className="category-scroll-wrapper">
          <ul className="category-nav-list marquee-anim">
            {renderNavItems('group1')}
          </ul>
          <ul className="category-nav-list marquee-anim" aria-hidden="true">
            {renderNavItems('group2')}
          </ul>
        </div>
      </div>
    </nav>
  );
}
