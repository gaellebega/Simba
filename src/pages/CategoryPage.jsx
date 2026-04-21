import { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CategoryNav from '../components/CategoryNav';
import ProductGrid from '../components/ProductGrid';
import FilterPanel from '../components/FilterPanel';
import { useLanguage } from '../context/LanguageContext';

const PRODUCTS_PER_PAGE = 24;

export default function CategoryPage({ products, categories }) {
  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();

  const searchQuery = searchParams.get('search') || '';
  const decodedCategory = decodeURIComponent(categoryName || 'all');

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [sortBy, setSortBy] = useState('default');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (decodedCategory !== 'all') {
      result = result.filter((product) => product.category === decodedCategory);
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    result = result.filter((product) => {
      const min = priceRange[0] || 0;
      const max = priceRange[1] || Infinity;
      return product.price >= min && product.price <= max;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, decodedCategory, selectedCategories, searchQuery, priceRange, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, Infinity]);
    setSortBy('default');
  };

  const pageTitle = decodedCategory === 'all'
    ? (searchQuery ? `"${searchQuery}"` : t('allProducts'))
    : `${t('productsIn')} ${decodedCategory}`;

  return (
    <div id="category-page">
      <CategoryNav categories={categories} activeCategory={decodedCategory} />

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
        <div className="breadcrumb">
          <Link to="/">{t('home')}</Link>
          <span className="breadcrumb-separator">/</span>
          <span>{decodedCategory === 'all' ? t('allProducts') : decodedCategory}</span>
        </div>

        <div className="section-header">
          <h1 className="section-title">{pageTitle}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="product-count">
              {filteredProducts.length} {t('showingProducts')}
            </span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="default">{t('sortDefault')}</option>
              <option value="price-asc">{t('sortPriceLow')}</option>
              <option value="price-desc">{t('sortPriceHigh')}</option>
              <option value="name-asc">{t('sortNameAZ')}</option>
              <option value="name-desc">{t('sortNameZA')}</option>
            </select>
          </div>
        </div>

        <button
          className="filter-toggle-mobile"
          onClick={() => setShowMobileFilter(true)}
          id="filter-toggle-mobile"
        >
          {t('filters')}
        </button>

        <div className={`page-layout ${decodedCategory === 'all' ? 'has-sidebar' : ''}`}>
          {decodedCategory === 'all' && (
            <FilterPanel
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onClear={handleClearFilters}
              showMobile={showMobileFilter}
              onCloseMobile={() => setShowMobileFilter(false)}
              categoryCounts={categoryCounts}
            />
          )}

          <div className="page-content">
            <ProductGrid products={visibleProducts} showCount={false} />

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button
                  className="hero-cta"
                  style={{ display: 'inline-flex' }}
                  onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
                  id="load-more-btn"
                >
                  {t('loadMore')} ({filteredProducts.length - visibleCount} {t('showingProducts')})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
