import styles from "../styles/Navbar.module.css";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/react.svg";

function Navbar({ user, onSignIn, onSignOut }) {
  const userLabel = user?.name ?? "Invitado";
  const isLoggedIn = Boolean(user);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = location.pathname === '/' || location.pathname.startsWith('/category');
  const isProductsActive = location.pathname === '/products'
  const isCartActive = location.pathname === '/cart'

  return (
    <nav className={styles.navbar}>
      <button
        type="button"
        className={styles.brandButton}
        onClick={() => navigate('/')}
        aria-label="Ir al inicio"
      >
        <div className={styles.brand}>
          <img className={styles.logo} src={logo} alt="Logo" />
          <div className={styles.brandText}>
            <span className={styles.brandKicker}>Plataforma</span>
            <span className={styles.brandName}>Sistema de Ventas</span>
          </div>
        </div>
      </button>

      <div className={styles.links}>
        <button
          type="button"
          className={`${styles.link} ${isHomeActive ? styles.active : ""}`}
          onClick={() => navigate('/')}
        >
          Inicio
        </button>
        <button
          type="button"
          className={`${styles.link} ${ isProductsActive ? styles.active : ""}`}
          onClick={() => navigate('/products')}
        >
          Productos
        </button>
        <button
          type="button"
          className={`${styles.link} ${isCartActive ? styles.active : ""}`}
          onClick={() => navigate('/cart')}
        >
          Carrito
        </button>
      </div>

      <div className={styles.auth}>
        <span className={styles.userName}>{userLabel}</span>

        {isLoggedIn ? (
          <button type="button" className={styles.authBtn} onClick={onSignOut}>
            Salir
          </button>
        ) : (
          <button type="button" className={styles.authBtn} onClick={onSignIn}>
            Ingresar
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;