import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';
import styles from '../styles/AdminProducts.module.css';

const ADMIN_FILTERS = Object.freeze({ activeOnly: false });

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const [prodsData, catsData] = await Promise.all([
          productService.getProductsAsync(ADMIN_FILTERS),
          productService.getCategoriesAsync(),
        ]);

        if (!isMounted) return;

        setProducts(Array.isArray(prodsData) ? prodsData : []);
        setCategories(
          Array.isArray(catsData)
            ? catsData.map((c) => ({ id: c.id, name: c.name }))
            : []
        );
      } catch (error) {
        if (!isMounted) return;
        setLoadError(
          error instanceof Error ? error.message : 'No fue posible cargar los datos.'
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
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
    setSubmitError('');
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSubmitError('');
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleEditStart = (product) => {
    setSubmitError('');
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddProduct = async (productData) => {
    setIsSaving(true);
    setSubmitError('');

    try {
      const nextProducts = await productService.createProductAsync(productData, products, ADMIN_FILTERS);
      setProducts(nextProducts);
      handleCloseForm();
      return { ok: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No fue posible crear el producto.';
      setSubmitError(message);
      return { ok: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (updatedProduct) => {
    setIsSaving(true);
    setSubmitError('');

    try {
      const nextProducts = await productService.updateProductAsync(updatedProduct, products, ADMIN_FILTERS);
      setProducts(nextProducts);
      handleCloseForm();
      return { ok: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No fue posible actualizar el producto.';
      setSubmitError(message);
      return { ok: false, error: message };
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setSubmitError('');
    try {
      const nextProducts = await productService.deleteProductAsync(id, products, ADMIN_FILTERS);
      setProducts(nextProducts);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No fue posible eliminar el producto.'
      );
    }

    if (editingProduct?.id === id) handleCloseForm();
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
        </div>
      </div>

      {isFormOpen ? (
        <ProductForm
          initialValues={editingProduct}
          categories={categories}
          isEditing={Boolean(editingProduct)}
          isSubmitting={isSaving}
          submitError={submitError}
          onCancel={handleCloseForm}
          onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
        />
      ) : (
        <>
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleOpenCreate}
            >
              Agregar producto
            </button>
          </div>

          {submitError && <p className={styles.errorMessage}>{submitError}</p>}

          {filteredProducts.length === 0 ? (
            <p className={styles.emptyText}>No hay productos que coincidan con la búsqueda.</p>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => (
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
