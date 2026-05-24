import { appConfig } from '../config';
import { loadSessionToken } from '../utils/authStorage';
import { loadProducts, saveProducts } from '../utils/productsStorage';

import { requestJson } from './http';

const normalizeCategory = (product) => {
  const categoryId = Number(product?.categoryId ?? product?.category?.id ?? 0);
  const categoryName = String(
    product?.categoryName ?? product?.category?.name ?? product?.category ?? 'Sin categoría'
  ).trim();

  return { categoryId, categoryName };
};

const normalizeProduct = (product) => {
  const { categoryId, categoryName } = normalizeCategory(product);
  const stock =
    Number.isFinite(Number(product?.stockQty ?? product?.stock)) &&
    Number(product?.stockQty ?? product?.stock) >= 0
      ? Number(product?.stockQty ?? product?.stock)
      : 0;
  const rating = Math.min(5, Math.max(1, Number(product?.rating) || 1));

  return {
    id: Number(product?.id),
    name: String(product?.name ?? 'Producto').trim(),
    description: String(product?.description ?? '').trim(),
    category: categoryName,
    categoryId,
    categoryName,
    price: Number(product?.price) || 0,
    rating,
    stock,
    stockQty: stock,
    image: String(product?.image ?? '').trim(),
    sku: String(product?.sku ?? '').trim(),
    isActive: product?.isActive !== false,
    likes: Number(product?.likes) || 0,
    isLiked: Boolean(product?.isLiked),
  };
};

const extractProducts = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.products)) {
    return response.products;
  }

  return [];
};

const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set('search', filters.search);
  }

  if (filters.categoryId) {
    params.set('categoryId', String(filters.categoryId));
  }

  if (filters.categoryName) {
    params.set('categoryName', filters.categoryName);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

const applyLocalFilters = (products, filters = {}) => {
  let filtered = products;

  if (filters.isActive !== undefined) {
    filtered = filtered.filter((p) => p.isActive === filters.isActive);
  }

  if (filters.categoryName) {
    const normalizedCategory = String(filters.categoryName).trim().toLowerCase();
    filtered = filtered.filter(
      (p) => p.categoryName.toLowerCase() === normalizedCategory
    );
  }

  if (filters.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === Number(filters.categoryId));
  }

  if (filters.search) {
    const normalizedSearch = String(filters.search).trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(normalizedSearch) ||
        p.description.toLowerCase().includes(normalizedSearch) ||
        p.sku.toLowerCase().includes(normalizedSearch)
    );
  }

  return filtered;
};

function getProducts(filters = {}) {
  const products = loadProducts().map(normalizeProduct);
  return applyLocalFilters(products, filters);
}

function getProductById(id) {
  const normalizedId = Number(id);
  return loadProducts()
    .map(normalizeProduct)
    .find((p) => p.id === normalizedId) ?? null;
}

function createProduct(productData) {
  const products = loadProducts();
  const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
  const newProduct = normalizeProduct({ ...productData, id: maxId + 1 });
  saveProducts([...products, newProduct]);
  return newProduct;
}

function updateProduct(productId, updates) {
  const normalizedId = Number(productId);
  let updatedProduct = null;

  const nextProducts = loadProducts().map((p) => {
    if (Number(p.id) !== normalizedId) {
      return p;
    }

    updatedProduct = normalizeProduct({ ...p, ...updates, id: p.id });
    return updatedProduct;
  });

  saveProducts(nextProducts);
  return updatedProduct;
}

function deleteProduct(productId) {
  const normalizedId = Number(productId);
  const products = loadProducts();
  saveProducts(products.filter((p) => Number(p.id) !== normalizedId));
}

async function getProductsAsync(filters = {}) {
  if (!appConfig.useRemoteApi) {
    return getProducts(filters);
  }

  const query = buildQueryString(filters);
  const response = await requestJson(`/products${query}`, { method: 'GET' });
  const products = extractProducts(response).map(normalizeProduct);
  saveProducts(products);
  return applyLocalFilters(products, filters);
}

async function getProductByIdAsync(id) {
  const normalizedId = Number(id);

  if (!appConfig.useRemoteApi) {
    return getProductById(normalizedId);
  }

  const response = await requestJson(`/products/${normalizedId}`, { method: 'GET' });
  return normalizeProduct(response);
}

async function createProductAsync(productData) {
  if (!appConfig.useRemoteApi) {
    return createProduct(productData);
  }

  const token = loadSessionToken();
  const response = await requestJson('/admin/products', {
    method: 'POST',
    body: productData,
    token,
  });

  return normalizeProduct(response);
}

async function updateProductAsync(productId, updates) {
  const normalizedId = Number(productId);

  if (!appConfig.useRemoteApi) {
    return updateProduct(normalizedId, updates);
  }

  const token = loadSessionToken();
  const response = await requestJson(`/admin/products/${normalizedId}`, {
    method: 'PUT',
    body: updates,
    token,
  });

  return normalizeProduct(response);
}

async function deleteProductAsync(productId) {
  const normalizedId = Number(productId);

  if (!appConfig.useRemoteApi) {
    return deleteProduct(normalizedId);
  }

  const token = loadSessionToken();
  await requestJson(`/admin/products/${normalizedId}`, {
    method: 'DELETE',
    token,
  });
}

const productService = {
  createProduct,
  createProductAsync,
  deleteProduct,
  deleteProductAsync,
  getProductById,
  getProductByIdAsync,
  getProducts,
  getProductsAsync,
  updateProduct,
  updateProductAsync,
};

export { productService };
export default productService;
