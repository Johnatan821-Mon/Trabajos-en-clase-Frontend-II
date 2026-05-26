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
    const saved = await productService.createProductAsync(product);
    setProductsState((prev) => {
      const maxId = prev.reduce((acc, item) => Math.max(acc, item.id), 0);
      const nextId = saved?.id ?? maxId + 1;

      return [
        ...prev,
        {
          ...product,
          ...saved,
          id: nextId,
          likes: Number(product.likes) || 0,
          isLiked: Boolean(product.isLiked),
        },
      ];
    });

    handleCloseForm();
  };

  const handleDeleteProduct = async (id) => {
    await productService.deleteProductAsync(id);
    setProductsState((prev) => prev.filter((product) => product.id !== id));

    if (editingProduct?.id === id) {
      handleCloseForm();
    }
  };

  const handleEditStart = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleEditSubmit = async (updatedProduct) => {
    const saved = await productService.updateProductAsync(updatedProduct.id, updatedProduct);
    setProductsState((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id
          ? {
              ...updatedProduct,
              ...saved,
              likes: Number(updatedProduct.likes ?? product.likes) || 0,
              isLiked: Boolean(updatedProduct.isLiked ?? product.isLiked),
            }
          : product
      )
    );
    handleCloseForm();
  };

  const handleToggleLike = (id) => {
    setProductsState((prev) => {
      return prev.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const currentLikes = Number(product.likes) || 0;
        const wasLiked = Boolean(product.isLiked);

        return {
          ...product,
          isLiked: !wasLiked,
          likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
        };
      });
    });
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
                category={product.category}
                price={product.price}
                rating={product.rating}
                stock={product.stock}
                image={product.image}
                description={product.description}
                likes={product.likes}
                isLiked={product.isLiked}
                onToggleLike={() => handleToggleLike(product.id)}
                onAddToCart={handleAddToCart}
                disableAddToCart={product.stock === 0}
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