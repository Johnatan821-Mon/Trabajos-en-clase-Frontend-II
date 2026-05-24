import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import authService from '../services/authService';
import styles from '../styles/AdminUsers.module.css';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'CUSTOMER',
  status: 'ACTIVE',
};

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const data = await authService.getAdminUsersAsync();

        if (!isMounted) return;

        setUsers(data);
      } catch (error) {
        if (!isMounted) return;

        setLoadError(
          error instanceof Error ? error.message : 'No fue posible cargar los usuarios.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        (user.fullName ?? user.name ?? '').toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.role.toLowerCase().includes(normalizedSearch) ||
        user.status.toLowerCase().includes(normalizedSearch);

      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setSubmitError('');
    setShowForm(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      password: '',
      role: user.role ?? 'CUSTOMER',
      status: user.status ?? 'ACTIVE',
    });
    setSubmitError('');
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setSubmitError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      if (editingUser) {
        const updatedUser = await authService.updateAdminUserAsync(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? updatedUser : u))
        );
      } else {
        const newUser = await authService.createAdminUserAsync(formData);
        setUsers((prev) => [...prev, newUser]);
      }

      handleCloseForm();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No fue posible guardar el usuario.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (user) => {
    try {
      const nextUsers = await authService.deleteAdminUserAsync(user.id);
      setUsers(nextUsers);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'No fue posible desactivar el usuario.'
      );
    }
  };

  if (isLoading) {
    return <p className={styles.loadingText}>Cargando usuarios...</p>;
  }

  if (loadError && users.length === 0) {
    return <p className={styles.errorText}>{loadError}</p>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de usuarios</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/admin')}
          >
            Volver al panel
          </button>
          {!showForm && (
            <button type="button" className={styles.primaryButton} onClick={handleOpenCreate}>
              Crear usuario
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {editingUser ? 'Editar usuario' : 'Crear usuario'}
          </h2>
          {submitError && <p className={styles.errorMessage}>{submitError}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre</label>
                <input
                  className={styles.formInput}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Apellido</label>
                <input
                  className={styles.formInput}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Correo electrónico</label>
                <input
                  className={styles.formInput}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Teléfono</label>
                <input
                  className={styles.formInput}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {!editingUser && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Contraseña</label>
                  <input
                    className={styles.formInput}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Rol</label>
                <select
                  className={styles.formSelect}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="CUSTOMER">Cliente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Estado</label>
                <select
                  className={styles.formSelect}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : editingUser ? 'Guardar cambios' : 'Crear usuario'}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleCloseForm}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Buscar por nombre, correo o rol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Todos los roles</option>
          <option value="ADMIN">Administrador</option>
          <option value="CUSTOMER">Cliente</option>
        </select>
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <p className={styles.emptyText}>No hay usuarios que coincidan con la búsqueda.</p>
      ) : (
        <div className={styles.userGrid}>
          {filteredUsers.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userCardHeader}>
                <div>
                  <p className={styles.userName}>{user.fullName ?? user.name}</p>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${
                      user.role === 'ADMIN' ? styles.badgeAdmin : styles.badgeCustomer
                    }`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`${styles.badge} ${
                      user.status === 'ACTIVE' ? styles.badgeActive : styles.badgeInactive
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
              {user.phone && <p className={styles.userMeta}>Tel: {user.phone}</p>}
              {user.createdAt && (
                <p className={styles.userMeta}>
                  Registrado: {new Date(user.createdAt).toLocaleDateString('es-CO')}
                </p>
              )}
              <div className={styles.userCardActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => handleOpenEdit(user)}
                >
                  Editar
                </button>
                {user.status === 'ACTIVE' && (
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => handleDeactivate(user)}
                  >
                    Desactivar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminUsers;
