import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Editor from './components/editor/Editor';
import VisualEditor from './components/visual-editor/VisualEditor';
import SitePage, { NewsPage } from './components/site/SitePage';
import NewsManagement from './components/admin/NewsManagement';
import NewsEditor from './components/admin/NewsEditor';
import GalleryManagement from './components/admin/GalleryManagement';
import TransparencyManagement from './components/admin/TransparencyManagement'; // Додано
import { authService } from './services/authService';
import './App.css';

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
    <Router>
      <div className="App">
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
      </div>
    </Router>
  );
}

const AdminLayout = () => {
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div>
      <header style={{
        backgroundColor: '#20324cff',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Адмін-панель школи</h1>
        <div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Вийти
          </button>
        </div>
      </header>
      
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
        
        {/* Маршрут для управління прозорістю */}
        <Route path="transparency" element={<TransparencyManagement />} />
        
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Routes>
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