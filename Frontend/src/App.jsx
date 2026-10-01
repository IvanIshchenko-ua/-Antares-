import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import {
  ExternalLink,
  FolderOpen,
  Images,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Users,
} from 'lucide-react';
import SitePage, { NewsPage } from './components/site/SitePage';
import { authService } from './services/authService';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';
import './components/admin/admin.css';

const Login = lazy(() => import('./components/auth/Login'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Editor = lazy(() => import('./components/editor/Editor'));
const VisualEditor = lazy(() => import('./components/visual-editor/VisualEditor'));
const NewsManagement = lazy(() => import('./components/admin/NewsManagement'));
const NewsEditor = lazy(() => import('./components/admin/NewsEditor'));
const GalleryManagement = lazy(() => import('./components/admin/GalleryManagement'));
const TransparencyManagement = lazy(() => import('./components/admin/TransparencyManagement'));
const UsersManagement = lazy(() => import('./components/admin/UsersManagement'));
const UserCreate = lazy(() => import('./components/admin/UserCreate'));

const AppFallback = () => <div className="site-loading">Завантаження...</div>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

useEffect(() => {
  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
  };

  checkAuth(); // первинна перевірка
  window.addEventListener('authChange', checkAuth); // ✅ слухає оновлення

  return () => {
    window.removeEventListener('authChange', checkAuth);
  };
}, []);

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Suspense fallback={<AppFallback />}>
            <Routes>
          {/* Публічні маршрути */}
          <Route path="/site/:pageName" element={<SitePage />} />
          <Route path="/site" element={<Navigate to="/site/home" replace />} />

          {/* Окремий маршрут для новин з ID */}
          <Route path="/site/news/:id" element={<NewsPage />} />

          {/* Адмін-маршрути */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/*"
            element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" replace />}
          />

          <Route path="/" element={<Navigate to="/site/home" replace />} />
          <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </LanguageProvider>
  );
}

const AdminLayout = () => {
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    const onAuth = () => setUser(authService.getUser());
    window.addEventListener('authChange', onAuth);
    return () => window.removeEventListener('authChange', onAuth);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div>
      <div className="admin-root">
        <aside className="admin-sidebar">
          <div className="sidebar-user">
            <div className="user-avatar" aria-hidden="true">
              {(user?.username || 'Г').slice(0, 1).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.username || 'Гість'}</div>
              <div className="user-email">{user?.email || ''}</div>
              <button className="sidebar-logout" onClick={handleLogout}>
                <LogOut size={14} />
                Вийти
              </button>
            </div>
          </div>
          <div className="admin-brand">
            <span className="admin-brand-mark">A</span>
            <span>
              <strong>Antares</strong>
              <small>панель керування</small>
            </span>
          </div>
          <nav className="admin-nav">
            <NavLink to="/admin/dashboard" className={({isActive}) => 'nav-item' + (isActive? ' active' : '')}>
              <LayoutDashboard className="nav-icon" size={18} /><span className="nav-label">Огляд</span>
            </NavLink>
            <NavLink to="/admin/news" className={({isActive}) => 'nav-item' + (isActive? ' active' : '')}>
              <Newspaper className="nav-icon" size={18} /><span className="nav-label">Новини</span>
            </NavLink>
            <NavLink to="/admin/gallery-management" className={({isActive}) => 'nav-item' + (isActive? ' active' : '')}>
              <Images className="nav-icon" size={18} /><span className="nav-label">Галерея</span>
            </NavLink>
            <NavLink to="/admin/transparency" className={({isActive}) => 'nav-item' + (isActive? ' active' : '')}>
              <FolderOpen className="nav-icon" size={18} /><span className="nav-label">Прозорість</span>
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => 'nav-item' + (isActive? ' active' : '')}>
              <Users className="nav-icon" size={18} /><span className="nav-label">Користувачі</span>
            </NavLink>
            <a href="/site/home" target="_blank" rel="noreferrer" className="nav-item external">
              <ExternalLink className="nav-icon" size={18} /><span className="nav-label">Перегляд сайту</span>
            </a>
          </nav>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <span className="admin-eyebrow">Адміністративна панель</span>
              <h2>Керування контентом</h2>
            </div>
          </div>

          <div style={{ maxWidth: 1200 }}>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="editor/:pageName" element={<Editor />} />
              <Route path="visual-editor/:pageName" element={<VisualEditor />} />

              {/* Маршрути для управління новинами */}
              <Route path="news" element={<NewsManagement />} />
              <Route path="news/create" element={<NewsEditor />} />
              <Route path="news/edit/:id" element={<NewsEditor />} />

              {/* Маршрут для управління галереєю */}
              <Route path="gallery-management" element={<GalleryManagement />} />

              {/* Користувачі */}
              <Route path="users" element={<UsersManagement />} />
              <Route path="users/create" element={<UserCreate />} />

              {/* Маршрут для управління прозорістю */}
              <Route path="transparency" element={<TransparencyManagement />} />

              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#2c3e50', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ color: '#7f8c8d', marginBottom: '2rem' }}>Сторінку не знайдено</h2>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a
          href="/site/home"
          style={{
            backgroundColor: '#4AAFF7',
            color: 'white',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          На головну
        </a>
        <a
          href="/admin/dashboard"
          style={{
            backgroundColor: '#9b59b6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          В адмінку
        </a>
      </div>
    </div>
  );
};

export default App;