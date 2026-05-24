import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import adminService from '../services/adminService';
import styles from '../styles/AdminDashboard.module.css';
import { formatCOP } from '../utils/formatCOP';

function AdminDashboard() {
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchSnapshot = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const data = await adminService.getDashboardSnapshotAsync();

        if (!isMounted) return;

        setSnapshot(data);
      } catch (error) {
        if (!isMounted) return;

        setLoadError(
          error instanceof Error ? error.message : 'No fue posible cargar el panel de administración.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSnapshot();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    if (!snapshot) return null;

    const { products, orders, users } = snapshot;
    const lowStock = products.filter((p) => Number(p.stock ?? p.stockQty) <= 5).length;
    const revenue = orders.reduce((sum, o) => sum + (Number(o.totals?.total) || 0), 0);
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;

    return [
      { label: 'Productos activos', value: products.length },
      { label: 'Productos con bajo stock', value: lowStock },
      { label: 'Órdenes registradas', value: orders.length },
      { label: 'Ingresos acumulados', value: formatCOP(revenue) },
      { label: 'Usuarios registrados', value: users.length },
      { label: 'Administradores', value: adminCount },
    ];
  }, [snapshot]);

  const recentOrders = useMemo(() => snapshot?.orders?.slice(0, 5) ?? [], [snapshot]);
  const recentUsers = useMemo(() => snapshot?.users?.slice(0, 5) ?? [], [snapshot]);

  if (isLoading) {
    return <p className={styles.loadingText}>Cargando panel de administración...</p>;
  }

  if (loadError) {
    return <p className={styles.errorText}>{loadError}</p>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de administración</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/')}
          >
            Ver tienda
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate('/admin/users')}
          >
            Gestionar usuarios
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => navigate('/admin/products')}
          >
            Gestionar productos
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats?.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Órdenes recientes</h2>
        {recentOrders.length === 0 ? (
          <p className={styles.emptyText}>No hay órdenes registradas.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer?.fullName ?? order.userId}</td>
                  <td>{formatCOP(order.totals?.total ?? 0)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Usuarios recientes</h2>
        {recentUsers.length === 0 ? (
          <p className={styles.emptyText}>No hay usuarios registrados.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName ?? user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;
