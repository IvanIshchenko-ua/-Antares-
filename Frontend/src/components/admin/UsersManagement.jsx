import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/auth/users');
        if (mounted) setUsers(resp.data.users || []);
      } catch (err) {
        console.error('Failed to load users', err);
        alert('Не вдалося завантажити користувачів');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Користувачі</h3>
          <Link to="/admin/users/create" className="quick-action-btn primary">Додати користувача</Link>
        </div>

        {loading ? (
          <p>Завантаження...</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e6eef6' }}>
                  <th style={{ padding: '8px 6px' }}>ID</th>
                  <th style={{ padding: '8px 6px' }}>Ім'я</th>
                  <th style={{ padding: '8px 6px' }}>Email</th>
                  <th style={{ padding: '8px 6px' }}>Створено</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 6px' }}>{u.id}</td>
                    <td style={{ padding: '10px 6px' }}>{u.username}</td>
                    <td style={{ padding: '10px 6px' }}>{u.email}</td>
                    <td style={{ padding: '10px 6px' }}>{u.created_at}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 12 }}>Користувачів не знайдено</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
