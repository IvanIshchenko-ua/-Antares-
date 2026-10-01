import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserCreate = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await api.post('/auth/register', { username, email, password });
      if (resp.data && resp.data.success) {
        alert('Користувача створено');
        navigate('/admin/users');
      } else {
        alert(resp.data?.message || 'Не вдалося створити користувача');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Помилка при створенні');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h3>Додати користувача</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
          <label>
            Ім'я користувача
            <input value={username} onChange={e => setUsername(e.target.value)} required />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>

          <label>
            Пароль
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="quick-action-btn primary" disabled={loading}>{loading ? 'Створення...' : 'Створити'}</button>
            <button type="button" className="quick-action-btn secondary" onClick={() => navigate('/admin/users')}>Скасувати</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;
