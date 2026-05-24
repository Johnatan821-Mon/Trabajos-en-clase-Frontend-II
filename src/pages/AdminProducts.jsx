import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';
import styles from '../styles/AdminProducts.module.css';

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const data = await productService.getProductsAsync();

        if (!isMounted) return;

        setProducts(data);
      } catch (error) {
        if (!isMounted) return;

        setLoadError(
          error instanceof Error ? error.message : 'No fue posible cargar los productos.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return products;

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(normalizedSearch) ||
        (p.categoryName ?? p.category ?? '').toLowerCase().includes(normalizedSearch) ||
        (p.description ?? '').toLowerCase().includes(normalizedSearch)
    );
  }, [products, search]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setSubmitError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
    setSubmitError('');
  };

  const handleEditStart = (product) => {
    setEditingProduct(product);
    setSubmitError('');
    setIsFormOpen(true);
  };

  const handleAddProduct = async (productData) => {
    try {
      const newProduct = await productService.createProductAsync(productData);
      setProducts((prev) => [...prev, newProduct]);
      handleCloseForm();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No fue posible crear el producto.'
      );
    }
  };

  const handleEditSubmit = async (updatedProduct) => {
    try {
      const saved = await productService.updateProductAsync(updatedProduct.id, updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      handleCloseForm();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No fue posible actualizar el producto.'
      );
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.deleteProductAsync(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));

      if (editingProduct?.id === id) {
        handleCloseForm();
      }
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'No fue posible eliminar el producto.'
      );
    }
  };

  const handleToggleLike = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const wasLiked = Boolean(p.isLiked);
        const currentLikes = Number(p.likes) || 0;

        return {
          ...p,
          isLiked: !wasLiked,
          likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
        };
      })
    );
  };

  if (isLoading) {
    return <p className={styles.loadingText}>Cargando productos...</p>;
  }

  if (loadError && products.length === 0) {
    return <p className={styles.errorText}>{loadError}</p>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de productos</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/admin')}
          >
            Volver al panel
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/products')}
          >
            Ver catálogo
          </button>
          {!isFormOpen && (
            <button type="button" className={styles.primaryButton} onClick={handleOpenCreate}>
              Agregar producto
            </button>
          )}
        </div>
      </div>

      {isFormOpen ? (
        <>
          {submitError && <p className={styles.errorMessage}>{submitError}</p>}
          <ProductForm
            initialValues={editingProduct}
            isEditing={Boolean(editingProduct)}
            onCancel={handleCloseForm}
            onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
          />
        </>
      ) : (
        <>
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <p className={styles.emptyText}>No hay productos que coincidan con la búsqueda.</p>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  category={product.categoryName ?? product.category}
                  price={product.price}
                  rating={product.rating}
                  stock={product.stock ?? product.stockQty}
                  image={product.image}
                  description={product.description}
                  likes={product.likes}
                  isLiked={product.isLiked}
                  onToggleLike={() => handleToggleLike(product.id)}
                  onDelete={() => handleDeleteProduct(product.id)}
                  onEdit={() => handleEditStart(product)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AdminProducts;
