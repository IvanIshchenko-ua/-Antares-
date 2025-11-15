import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login: Form submitted');
    setLoading(true);

    try {
      // Відправляємо навіть порожні значення
      await authService.login(email || '', password || '');

      // 🔥 Оновлюємо статус авторизації у всьому застосунку
      window.dispatchEvent(new Event('authChange'));

      console.log('Login: Success, redirecting...');
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  console.log('Login: Rendering form');

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="Введіть email"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Пароль:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="Введіть пароль"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#ccc' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Вхід...' : 'Увійти'}
        </button>
      </form>
    </div>
  );
};

export default Login;
