import { Language } from "@/types";

type TranslationKeys = {
  nav: {
    search: string;
    cart: string;
    home: string;
    categories: string;
    deals: string;
    signin: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    secondary: string;
  };
  sections: {
    categories: string;
    trending: string;
    recommended: string;
    deals: string;
    featured: string;
  };
  product: {
    addToCart: string;
    outOfStock: string;
    related: string;
    youMayAlso: string;
    reviews: string;
    inStock: string;
    weight: string;
    brand: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
    continueShopping: string;
    items: string;
  };
  search: {
    placeholder: string;
    noResults: string;
    filters: string;
    category: string;
    priceRange: string;
    allCategories: string;
    results: string;
  };
  checkout: {
    cart: string;
    delivery: string;
    payment: string;
    confirmation: string;
    placeOrder: string;
    orderConfirmed: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    payWith: string;
    momo: string;
    momoNumber: string;
    cash: string;
    card: string;
    back: string;
    next: string;
    orderSummary: string;
    deliveryDetails: string;
    thankYou: string;
    orderNumber: string;
  };
  categories: {
    fruits: string;
    vegetables: string;
    beverages: string;
    snacks: string;
    household: string;
    dairy: string;
    meat: string;
    bakery: string;
  };
  badges: {
    new: string;
    sale: string;
    trending: string;
    organic: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    contact: string;
    followUs: string;
    rights: string;
    address: string;
    phone: string;
    email: string;
  };
  misc: {
    dark: string;
    light: string;
    language: string;
    rwf: string;
    off: string;
    viewAll: string;
    addedToCart: string;
    removedFromCart: string;
  };
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    nav: {
      search: "Search products...",
      cart: "Cart",
      home: "Home",
      categories: "Categories",
      deals: "Deals",
      signin: "Sign In",
    },
    hero: {
      title: "Fresh Groceries Delivered Fast",
      subtitle: "Shop from thousands of fresh products — fruits, vegetables, snacks and more. All delivered to your door.",
      cta: "Shop Now",
      secondary: "View Deals",
    },
    sections: {
      categories: "Shop by Category",
      trending: "Trending Now",
      recommended: "Recommended for You",
      deals: "Today's Best Deals",
      featured: "Featured Products",
    },
    product: {
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      related: "Related Products",
      youMayAlso: "You May Also Like",
      reviews: "reviews",
      inStock: "In Stock",
      weight: "Weight",
      brand: "Brand",
    },
    cart: {
      title: "Your Cart",
      empty: "Your cart is empty",
      total: "Total",
      checkout: "Checkout",
      remove: "Remove",
      continueShopping: "Continue Shopping",
      items: "items",
    },
    search: {
      placeholder: "Search for products, categories...",
      noResults: "No products found",
      filters: "Filters",
      category: "Category",
      priceRange: "Price Range",
      allCategories: "All Categories",
      results: "results found",
    },
    checkout: {
      cart: "Cart",
      delivery: "Delivery",
      payment: "Payment",
      confirmation: "Confirmation",
      placeOrder: "Place Order",
      orderConfirmed: "Order Confirmed!",
      fullName: "Full Name",
      phone: "Phone Number",
      address: "Street Address",
      city: "City",
      district: "District",
      payWith: "Pay With",
      momo: "Mobile Money (MoMo)",
      momoNumber: "MoMo Number",
      cash: "Cash on Delivery",
      card: "Bank Card",
      back: "Back",
      next: "Next",
      orderSummary: "Order Summary",
      deliveryDetails: "Delivery Details",
      thankYou: "Thank you for your order!",
      orderNumber: "Order Number",
    },
    categories: {
      fruits: "Fruits",
      vegetables: "Vegetables",
      beverages: "Beverages",
      snacks: "Snacks",
      household: "Household",
      dairy: "Dairy",
      meat: "Meat",
      bakery: "Bakery",
    },
    badges: {
      new: "New",
      sale: "Sale",
      trending: "Trending",
      organic: "Organic",
    },
    footer: {
      tagline: "Your trusted smart market for fresh and quality products.",
      quickLinks: "Quick Links",
      contact: "Contact Us",
      followUs: "Follow Us",
      rights: "All rights reserved.",
      address: "KG 11 Ave, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "support@simbamarket.rw",
    },
    misc: {
      dark: "Dark",
      light: "Light",
      language: "Language",
      rwf: "RWF",
      off: "OFF",
      viewAll: "View All",
      addedToCart: "Added to cart!",
      removedFromCart: "Removed from cart",
    },
  },
  fr: {
    nav: {
      search: "Rechercher des produits...",
      cart: "Panier",
      home: "Accueil",
      categories: "Catégories",
      deals: "Offres",
      signin: "Se Connecter",
    },
    hero: {
      title: "Épicerie Fraîche Livrée Rapidement",
      subtitle: "Achetez parmi des milliers de produits frais — fruits, légumes, snacks et plus encore.",
      cta: "Acheter Maintenant",
      secondary: "Voir les Offres",
    },
    sections: {
      categories: "Acheter par Catégorie",
      trending: "Tendances Actuelles",
      recommended: "Recommandé pour Vous",
      deals: "Meilleures Offres du Jour",
      featured: "Produits en Vedette",
    },
    product: {
      addToCart: "Ajouter au Panier",
      outOfStock: "Rupture de Stock",
      related: "Produits Similaires",
      youMayAlso: "Vous Aimerez Aussi",
      reviews: "avis",
      inStock: "En Stock",
      weight: "Poids",
      brand: "Marque",
    },
    cart: {
      title: "Votre Panier",
      empty: "Votre panier est vide",
      total: "Total",
      checkout: "Commander",
      remove: "Supprimer",
      continueShopping: "Continuer les Achats",
      items: "articles",
    },
    search: {
      placeholder: "Rechercher des produits, catégories...",
      noResults: "Aucun produit trouvé",
      filters: "Filtres",
      category: "Catégorie",
      priceRange: "Fourchette de Prix",
      allCategories: "Toutes les Catégories",
      results: "résultats trouvés",
    },
    checkout: {
      cart: "Panier",
      delivery: "Livraison",
      payment: "Paiement",
      confirmation: "Confirmation",
      placeOrder: "Passer la Commande",
      orderConfirmed: "Commande Confirmée!",
      fullName: "Nom Complet",
      phone: "Numéro de Téléphone",
      address: "Adresse",
      city: "Ville",
      district: "District",
      payWith: "Payer Avec",
      momo: "Mobile Money (MoMo)",
      momoNumber: "Numéro MoMo",
      cash: "Paiement à la Livraison",
      card: "Carte Bancaire",
      back: "Retour",
      next: "Suivant",
      orderSummary: "Récapitulatif de Commande",
      deliveryDetails: "Détails de Livraison",
      thankYou: "Merci pour votre commande!",
      orderNumber: "Numéro de Commande",
    },
    categories: {
      fruits: "Fruits",
      vegetables: "Légumes",
      beverages: "Boissons",
      snacks: "Collations",
      household: "Ménage",
      dairy: "Produits Laitiers",
      meat: "Viande",
      bakery: "Boulangerie",
    },
    badges: {
      new: "Nouveau",
      sale: "Solde",
      trending: "Tendance",
      organic: "Bio",
    },
    footer: {
      tagline: "Votre marché intelligent de confiance pour des produits frais et de qualité.",
      quickLinks: "Liens Rapides",
      contact: "Contactez-nous",
      followUs: "Suivez-nous",
      rights: "Tous droits réservés.",
      address: "KG 11 Ave, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "support@simbamarket.rw",
    },
    misc: {
      dark: "Sombre",
      light: "Clair",
      language: "Langue",
      rwf: "RWF",
      off: "RÉDUIT",
      viewAll: "Voir Tout",
      addedToCart: "Ajouté au panier!",
      removedFromCart: "Retiré du panier",
    },
  },
  kin: {
    nav: {
      search: "Shakisha ibicuruzwa...",
      cart: "Agashitoro",
      home: "Ahabanza",
      categories: "Amacyamu",
      deals: "Amasoko",
      signin: "Injira",
    },
    hero: {
      title: "Ivyokurya Bishya Biza Vuba",
      subtitle: "Guza mu bibazo by'ibicuruzwa binyuranye — imbuto, imboga, ibyo kurya no bindi byinshi.",
      cta: "Guza Nonaha",
      secondary: "Reba Amasoko",
    },
    sections: {
      categories: "Guza Hakurikijwe Icyiciro",
      trending: "Bikunzwe Ubu",
      recommended: "Byasabwe Kubwawe",
      deals: "Amasoko Meza y'Uyu Munsi",
      featured: "Ibicuruzwa Bihamye",
    },
    product: {
      addToCart: "Shyira mu Gasitoro",
      outOfStock: "Ntibihari",
      related: "Ibicuruzwa Bisa",
      youMayAlso: "Urashobora Nkunda",
      reviews: "ibitekerezo",
      inStock: "Bihari",
      weight: "Ibiro",
      brand: "Ikigo",
    },
    cart: {
      title: "Agashitoro Kawe",
      empty: "Agashitoro kawe nkagera ubusa",
      total: "Igiteranyo",
      checkout: "Soza Ugure",
      remove: "Kura",
      continueShopping: "Gukomeza Kugura",
      items: "ibicuruzwa",
    },
    search: {
      placeholder: "Shakisha ibicuruzwa, amacyamu...",
      noResults: "Nta bicuruzwa byabonetse",
      filters: "Gusungura",
      category: "Icyiciro",
      priceRange: "Ihame ry'Ibiciro",
      allCategories: "Amacyamu Yose",
      results: "ibisubizo byabonetse",
    },
    checkout: {
      cart: "Agashitoro",
      delivery: "Kuzana",
      payment: "Kwishyura",
      confirmation: "Kwemeza",
      placeOrder: "Soza Itumba",
      orderConfirmed: "Itumba Ryemejwe!",
      fullName: "Amazina Yose",
      phone: "Numero ya Telefone",
      address: "Aderesi",
      city: "Umujyi",
      district: "Akarere",
      payWith: "Ishyura Hakoreshejwe",
      momo: "Amafaranga kuri Telefone (MoMo)",
      momoNumber: "Numero ya MoMo",
      cash: "Amafaranga Igihe cy'Itumanaho",
      card: "Karite ya Banki",
      back: "Subira Inyuma",
      next: "Komeza",
      orderSummary: "Incamake y'Itumba",
      deliveryDetails: "Ibisobanuro by'Itumanaho",
      thankYou: "Murakoze kubwa itumba ryawe!",
      orderNumber: "Nomero y'Itumba",
    },
    categories: {
      fruits: "Imbuto",
      vegetables: "Imboga",
      beverages: "Inzoga n'Amazi",
      snacks: "Ibyo Kurya Gato",
      household: "Ibikoresho by'Urugo",
      dairy: "Amata n'Ibiyavuyemo",
      meat: "Inyama",
      bakery: "Umutsima n'Ibiyavuyemo",
    },
    badges: {
      new: "Gishya",
      sale: "Amasoko",
      trending: "Bikunzwe",
      organic: "Kamere",
    },
    footer: {
      tagline: "Isoko ryawe ry'ubwenge ry'ibicuruzwa bishya kandi nziza.",
      quickLinks: "Inyuma Yihuse",
      contact: "Twandikire",
      followUs: "Dukurikire",
      rights: "Uburenganzira bwose bwabitswe.",
      address: "KG 11 Ave, Kigali, u Rwanda",
      phone: "+250 788 000 000",
      email: "support@simbamarket.rw",
    },
    misc: {
      dark: "Umukara",
      light: "Umweru",
      language: "Ururimi",
      rwf: "RWF",
      off: "REDUCTION",
      viewAll: "Reba Byose",
      addedToCart: "Byashyiwe mu gasitoro!",
      removedFromCart: "Byakuwe mu gasitoro",
    },
  },
};

export function t(lang: Language, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations[lang];
  for (const k of keys) {
    if (value && typeof value === "object") {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}

export default translations;
