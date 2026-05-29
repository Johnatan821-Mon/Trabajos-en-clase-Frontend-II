import { useEffect, useState } from "react";

import styles from "../styles/ProductForm.module.css";

const emptyValues = {
  sku: "",
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  image: "",
  description: "",
};

function ProductForm({ initialValues, categories = [], onSubmit, onCancel, isEditing = false }) {
  const [values, setValues] = useState(emptyValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        sku: initialValues.sku ?? "",
        name: initialValues.name ?? "",
        categoryId: initialValues.categoryId ?? "",
        price: initialValues.price ?? "",
        stock: initialValues.stock ?? initialValues.stockQty ?? "",
        image: initialValues.image ?? "",
        description: initialValues.description ?? "",
      });
    } else {
      setValues(emptyValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const sku = values.sku.trim();
    const name = values.name.trim();
    const categoryId = Number(values.categoryId);
    const image = values.image.trim();
    const description = values.description.trim();
    const price = Number(values.price);
    const stock = Number(values.stock);

    if (!sku) return;
    if (!name) return;
    if (!categoryId) return;
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(stock) || stock < 0) return;

    const parsedRating = Number(initialValues?.rating ?? 3);
    const rating = Number.isFinite(parsedRating) ? Math.min(5, Math.max(1, parsedRating)) : 3;

    onSubmit({
      ...initialValues,
      sku,
      name,
      categoryId,
      price,
      stock,
      stockQty: stock,
      image,
      description,
      rating,
    });

    if (!isEditing) {
      setValues(emptyValues);
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {isEditing ? "Editar producto" : "Agregar producto"}
        </h2>
        <p className={styles.subtitle}>
          Completa el formulario y guarda los cambios.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>SKU</span>
            <input
              className={styles.input}
              name="sku"
              value={values.sku}
              onChange={handleChange}
              placeholder="Ej: TECH-KEY-001"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Categoría</span>
            <select
              className={styles.input}
              name="categoryId"
              value={values.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Nombre</span>
          <input
            className={styles.input}
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Ej: Teclado gamer"
            required
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Precio</span>
            <input
              className={styles.input}
              name="price"
              type="number"
              min="1"
              value={values.price}
              onChange={handleChange}
              placeholder="Ej: 199990"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Stock</span>
            <input
              className={styles.input}
              name="stock"
              type="number"
              min="0"
              value={values.stock}
              onChange={handleChange}
              placeholder="Ej: 10"
              required
            />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Imagen (URL)</span>
          <input
            className={styles.input}
            name="image"
            value={values.image}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Descripción</span>
          <textarea
            className={styles.textarea}
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Describe el producto..."
            rows={3}
          />
        </label>

        <div className={styles.actions}>
          {onCancel ? (
            <button
              className={styles.btnSecondary}
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </button>
          ) : null}

          <button className={styles.btnPrimary} type="submit">
            {isEditing ? "Guardar cambios" : "Agregar producto"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;