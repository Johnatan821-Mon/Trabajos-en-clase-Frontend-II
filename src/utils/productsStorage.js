import { products as seedProducts } from '../data/products';

const STORAGE_KEY = 'products';
const DEFAULT_RATING = 3;
const DEFAULT_LIKES = 0;

const seedById = new Map(seedProducts.map((product) => [product.id, product]));

const clampRating = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_RATING;
  return Math.min(5, Math.max(1, parsed));
};

const clampLikes = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_LIKES;
  return Math.max(0, Math.trunc(parsed));
};

const normalizeProduct = (product) => {
  const seedProduct = seedById.get(product?.id);

  return {
    ...seedProduct,
    ...product,
    rating: clampRating(product?.rating ?? seedProduct?.rating ?? DEFAULT_RATING),
    likes: clampLikes(product?.likes ?? seedProduct?.likes ?? DEFAULT_LIKES),
    isLiked: Boolean(product?.isLiked ?? seedProduct?.isLiked ?? false),
  };
};

export function loadProducts() {
  if (typeof window === 'undefined') {
    return seedProducts.map(normalizeProduct);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return seedProducts.map(normalizeProduct);
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : seedProducts.map(normalizeProduct);
  } catch {
    return seedProducts.map(normalizeProduct);
  }
}

export function saveProducts(products) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalized = Array.isArray(products) ? products.map(normalizeProduct) : [];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export const PRODUCTS_STORAGE_KEY = STORAGE_KEY;
export const PRODUCTS_DEFAULT_RATING = DEFAULT_RATING;
export const PRODUCTS_DEFAULT_LIKES = DEFAULT_LIKES;