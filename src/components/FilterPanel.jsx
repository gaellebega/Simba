import { useLanguage } from '../context/LanguageContext';

export default function FilterPanel({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onClear,
  showMobile,
  onCloseMobile,
  categoryCounts,
}) {
  const { t } = useLanguage();

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((item) => item !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <aside className={`filter-panel ${showMobile ? 'show-mobile' : ''}`} id="filter-panel">
      <button className="filter-close-mobile" onClick={onCloseMobile}>Close</button>

      <div className="filter-section">
        <h3 className="filter-title">{t('priceRange')}</h3>
        <div className="filter-range">
          <input
            type="number"
            className="filter-input"
            placeholder={t('minPrice')}
            value={priceRange[0] || ''}
            onChange={(e) => onPriceChange([e.target.value ? Number(e.target.value) : 0, priceRange[1]])}
            id="filter-min-price"
          />
          <span>-</span>
          <input
            type="number"
            className="filter-input"
            placeholder={t('maxPrice')}
            value={priceRange[1] || ''}
            onChange={(e) => onPriceChange([priceRange[0], e.target.value ? Number(e.target.value) : Infinity])}
            id="filter-max-price"
          />
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">{t('categories')}</h3>
        <div className="filter-checkbox-list">
          {categories.map((category) => (
            <label key={category} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
              />
              <span>{category}</span>
              {categoryCounts && (
                <span className="filter-checkbox-count">{categoryCounts[category] || 0}</span>
              )}
            </label>
          ))}
        </div>
      </div>

      <button
        className="add-to-cart-btn"
        onClick={onClear}
        style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
        id="clear-filters"
      >
        {t('clearFilters')}
      </button>
    </aside>
  );
}
