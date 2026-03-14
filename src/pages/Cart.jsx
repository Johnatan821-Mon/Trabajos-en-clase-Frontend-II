import { useMemo, useState } from 'react';

import styles from '../styles/Cart.module.css';
import { loadProducts } from '../utils/productsStorage';

const SHIPPING_COST = 12;

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function Car() {
  const [items, setItems] = useState(() =>
    loadProducts()
      .slice(0, 3)
      .map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        price: Number(product.price) || 0,
        quantity: 1,
      }))
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Carrito</h1>
        <p className={styles.subtitle}>Revisa tu pedido antes de confirmar la compra</p>
      </header>

      <div className={styles.layout}>
        <div className={styles.listBlock}>
          {items.length === 0 ? (
            <p className={styles.empty}>Tu carrito esta vacio. Agrega productos desde la vista Productos.</p>
          ) : (
            items.map((item) => (
              <article key={item.id} className={styles.itemCard}>
                <img className={styles.itemImage} src={item.image} alt={item.name} />

                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>{item.category}</p>
                  <h2 className={styles.itemName}>{item.name}</h2>
                  <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                </div>

                <div className={styles.qtyBox}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, -1)}
                    aria-label={`Quitar una unidad de ${item.name}`}
                  >
                    -
                  </button>

                  <span className={styles.qtyValue}>{item.quantity}</span>

                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, 1)}
                    aria-label={`Agregar una unidad de ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className={styles.summaryBlock}>
          <h3 className={styles.summaryTitle}>Resumen</h3>

          <div className={styles.summaryRow}>
            <span>Productos</span>
            <span>{totalItems}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Envio</span>
            <span>{formatPrice(shipping)}</span>
          </div>

          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button type="button" className={styles.checkoutBtn} disabled={items.length === 0}>
            Confirmar compra
          </button>

          <button type="button" className={styles.clearBtn} onClick={clearCart} disabled={items.length === 0}>
            Vaciar carrito
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Car;
