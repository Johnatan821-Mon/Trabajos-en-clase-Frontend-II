import { useState } from 'react';

function PracticaRegistro() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setCargando(true);
    setError(null);

    fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRespuesta(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  };

  const estiloInput = {
    padding: '0.6rem 0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
  };

  const estiloBoton = {
    padding: '0.7rem',
    fontSize: '1rem',
    backgroundColor: cargando ? '#aaa' : '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: cargando ? 'not-allowed' : 'pointer',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '2rem auto' }}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          padding: '2rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Registro — prueba POST</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <label
            style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}
          >
            Nombre
            <input
              name="name"
              placeholder="Ej: Ana Gómez"
              value={form.name}
              onChange={handleChange}
              style={estiloInput}
            />
          </label>

          <label
            style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}
          >
            Email
            <input
              name="email"
              placeholder="Ej: ana@test.com"
              value={form.email}
              onChange={handleChange}
              type="email"
              style={estiloInput}
            />
          </label>

          <label
            style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}
          >
            Password
            <input
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              type="password"
              style={estiloInput}
            />
          </label>

          <button type="submit" disabled={cargando} style={estiloBoton}>
            {cargando ? 'Enviando...' : 'Registrar'}
          </button>
        </form>

        {error && (
          <p
            style={{
              marginTop: '1rem',
              color: '#c0392b',
              backgroundColor: '#fdecea',
              padding: '0.6rem 1rem',
              borderRadius: '6px',
            }}
          >
            Error: {error}
          </p>
        )}

        {respuesta && (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Respuesta del servidor:</p>
            <pre
              style={{
                backgroundColor: '#f4f4f4',
                padding: '1rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(respuesta, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default PracticaRegistro;