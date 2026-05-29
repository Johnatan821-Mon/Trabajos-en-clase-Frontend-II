import { useEffect, useState } from 'react';

import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import styles from './ProductList.module.css';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import productService from '../services/productService';

function ProductList() {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [productsState, setProductsState] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState('');

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast(`"${product.name}" agregado al carrito`);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    productService.getProductsAsync().then(setProductsState).catch(() => {});
    productService.getCategoriesAsync()
      .then((cats) => setCategories(Array.isArray(cats) ? cats.map((c) => ({ id: c.id, name: c.name })) : []))
      .catch(() => {});
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleAddProduct = async (product) => {
    try {
      const nextProducts = await productService.createProductAsync(product, productsState);
      setProductsState(nextProducts);
      handleCloseForm();
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible crear el producto.';
      return { ok: false, error: message };
    }
  };

  const handleDeleteProduct = async (id) => {
    const nextProducts = await productService.deleteProductAsync(id, productsState);
    setProductsState(nextProducts);
    if (editingProduct?.id === id) handleCloseForm();
  };

  const handleEditStart = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleEditSubmit = async (updatedProduct) => {
    try {
      const nextProducts = await productService.updateProductAsync(updatedProduct, productsState);
      setProductsState(nextProducts);
      handleCloseForm();
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible actualizar el producto.';
      return { ok: false, error: message };
    }
  };

  return (
    <div className={styles.container}>
      {toast && <div className={styles.toast}>{toast}</div>}
      <header className={styles.header}>
        <h1 className={styles.title}>Nuestros Productos</h1>
        <p className={styles.subtitle}>
          Encuentra los mejores productos de tecnología para tu setup
        </p>
      </header>

      {isAdmin && isFormOpen ? (
        <ProductForm
          initialValues={editingProduct}
          categories={categories}
          isEditing={Boolean(editingProduct)}
          onCancel={handleCloseForm}
          onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
        />
      ) : (
        <>
          {isAdmin && (
            <div className={styles.toolbar}>
              <button className={styles.btnAdd} type="button" onClick={handleOpenCreate}>
                Agregar producto
              </button>
            </div>
          )}

          <div className={styles.grid}>
            {productsState.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.categoryName ?? product.category}
                price={product.price}
                rating={product.rating}
                stock={product.stock ?? product.stockQty}
                image={product.image}
                description={product.description}
                onAddToCart={handleAddToCart}
                disableAddToCart={(product.stock ?? product.stockQty) === 0}
                onDelete={isAdmin ? () => handleDeleteProduct(product.id) : undefined}
                onEdit={isAdmin ? () => handleEditStart(product) : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;