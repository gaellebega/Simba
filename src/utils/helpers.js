export function formatPrice(price) {
  return new Intl.NumberFormat('en-RW').format(Math.round(price));
}

export function generateImageUrl(product) {
  const colors = [
    'FF6B00', '10B981', '3B82F6', 'EC4899', 'F59E0B',
    '06B6D4', 'EF4444', '84CC16', '6366F1',
  ];
  const numericId = parseInt(String(product.id).replace(/\D/g, '') || '0', 10);
  const color = colors[numericId % colors.length];
  const name = encodeURIComponent(product.name.substring(0, 25));
  return `https://placehold.co/300x300/${color}/ffffff?text=${name}`;
}

export function getCategoryIcon(category) {
  const icons = {
    'Cosmetics & Personal Care': '\u2728',
    'Alcoholic Drinks': '\uD83C\uDF77',
    'Food Products': '\uD83C\uDF4E',
    'Kitchenware & Electronics': '\uD83C\uDF7D',
    General: '\u25A0',
    'Cleaning & Sanitary': '\uD83E\uDDFC',
    'Sports & Fitness': '\uD83C\uDFCB',
    Stationery: '\u270E',
    'Baby Products': '\uD83D\uDC76',
  };
  return icons[category] || '\u25A0';
}

export function getCategoryImage(category) {
  const images = {
    'Cosmetics & Personal Care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    'Alcoholic Drinks': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=300&fit=crop',
    'Food Products': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    'Kitchenware & Electronics': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    General: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop',
    'Cleaning & Sanitary': 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=300&fit=crop',
    'Sports & Fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    Stationery: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
    'Baby Products': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
  };
  return images[category] || images.General;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SIM-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getProductRating(id) {
  const numericId = parseInt(String(id).replace(/\D/g, '') || '0', 10);
  return 4 + ((numericId % 9) / 10);
}
