import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Cart.module.css';
import { loadCartItems } from '../utils/cartStorage';
import { formatCOP } from '../utils/formatCOP';

const SHIPPING_COST = 12000;

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const navigate = useNavigate();
  const items = Array.isArray(cartItems) ? cartItems : loadCartItems();

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + (Number(item.unitPrice ?? item.price) || 0) * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const shipping = items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  const updateQuantity = (id, delta) => {
    const item = items.find((current) => current.id === id);
    if (!item || typeof onUpdateQuantity !== 'function') {
      return;
    }

    onUpdateQuantity(id, item.quantity + delta);
  };

  const clearCart = () => {
    if (typeof onClearCart === 'function') {
      onClearCart();
    }
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Carrito</h1>
        <p className={styles.subtitle}>Revisa tu pedido antes de confirmar la compra</p>
        <button type="button" className={styles.clearBtn} onClick={() => navigate('/')}>
          Seguir comprando
        </button>
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
                  <p className={styles.itemPrice}>{formatCOP(item.unitPrice ?? item.price)}</p>
                </div>

                <div className={styles.qtyBox}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    aria-label={`Quitar una unidad de ${item.name}`}
                  >
                    -
                  </button>

                  <span className={styles.qtyValue}>{item.quantity}</span>

                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label={`Agregar una unidad de ${item.name}`}
                  >
                    +
                  </button>
                </div>

                {typeof onRemoveItem === 'function' ? (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Eliminar
                  </button>
                ) : null}
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
            <span>{formatCOP(subtotal)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Envio</span>
            <span>{formatCOP(shipping)}</span>
          </div>

          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>{formatCOP(total)}</span>
          </div>

          <button
            type="button"
            className={styles.checkoutBtn}
            disabled={items.length === 0}
            onClick={() => navigate('/checkout')}
          >
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

export default Cart;