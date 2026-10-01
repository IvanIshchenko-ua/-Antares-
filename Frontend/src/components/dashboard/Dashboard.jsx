import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Додамо CSS файл для стилів
import { newsService } from '../../services/newsService';
import galleryService from '../../services/galleryService';
import { transparencyService } from '../../services/transparencyService';

const Dashboard = () => {
  // Динамічні сторінки, які можна редагувати
  const dynamicPages = [
    { 
      name: 'Галерея', 
      path: 'gallery', 
      description: 'Редагування галереї фото та відео', 
      icon: '🖼️', 
      color: '#e74c3c' 
    }
  ];

  // data states
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const [galleryPreview, setGalleryPreview] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryCount, setGalleryCount] = useState(0);
  const [galleryLastUpdated, setGalleryLastUpdated] = useState('');

  const [transparencyItems, setTransparencyItems] = useState([]);
  const [transLoading, setTransLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      setNewsLoading(true);
      try {
        const resp = await newsService.getAllNews();
        const list = resp.data || resp.data?.news || resp.data?.items || resp.data;
        // normalize to array
        const arr = Array.isArray(list) ? list : (resp.data?.news || []);
        if (mounted) setNewsItems(arr.slice(0,3));
      } catch (err) {
        console.error('Failed load news', err);
      } finally { if (mounted) setNewsLoading(false); }
    };

    const loadGallery = async () => {
      setGalleryLoading(true);
      try {
        const resp = await galleryService.getGalleryImages();
        const images = resp.images || resp || [];
        const list = Array.isArray(images) ? images : (images.items || []);
        if (mounted) {
          setGalleryPreview(list.slice(0,4));
          setGalleryCount(list.length || 0);
          // compute last updated timestamp from known fields
          const lastTs = list.reduce((acc, img) => {
            const dateStr = img.updated_at || img.updatedAt || img.modified_at || img.modifiedAt || img.created_at || img.createdAt;
            const t = dateStr ? new Date(dateStr).getTime() : 0;
            return Math.max(acc, t);
          }, 0);
          if (lastTs > 0) setGalleryLastUpdated(new Date(lastTs).toLocaleString('uk-UA', { year: 'numeric', month: 'short', day: 'numeric' }));
          else setGalleryLastUpdated('—');
        }
      } catch (err) {
        console.error('Failed load gallery', err);
      } finally { if (mounted) setGalleryLoading(false); }
    };

    const loadTrans = async () => {
      setTransLoading(true);
      try {
        const resp = await transparencyService.getAll();
        const raw = resp || [];
        // normalize and compute upToDate: true if content exists or documents array non-empty
        const items = (Array.isArray(raw) ? raw : (raw.items || [])).map((it) => {
          const hasContent = typeof it.content === 'string' && it.content.trim().length > 0;
          const hasDocs = Array.isArray(it.documents) && it.documents.length > 0;
          return { ...it, upToDate: hasContent || hasDocs };
        });
        if (mounted) setTransparencyItems(items.slice(0,6));
      } catch (err) {
        console.error('Failed load transparency', err);
      } finally { if (mounted) setTransLoading(false); }
    };

    loadNews(); loadGallery(); loadTrans();
    return () => { mounted = false; };
  }, []);

  // Картки керування контентом
  const contentManagementCards = [
    {
      name: 'Керування новинами',
      path: '/admin/news',
      description: 'Створення, редагування та публікація новин школи',
      icon: '📰',
      color: '#9b59b6',
      badge: '⚙️ Повне управління',
      badgeColor: '#f4ecf7',
      textColor: '#8e44ad'
    },
    {
      name: 'Керування галереєю',
      path: '/admin/gallery-management',
      description: 'Додавання, редагування та видалення фото у галереї',
      icon: '🖼️',
      color: '#e74c3c',
      badge: '📸 Управління фото',
      badgeColor: '#fdedec',
      textColor: '#c0392b'
    },
    {
      name: 'Прозорість та документи',
      path: '/admin/transparency',
      description: 'Управління документами прозорості, статутом та звітністю',
      icon: '📊',
      color: '#3498db',
      badge: '📄 Документи',
      badgeColor: '#e7f3ff',
      textColor: '#004085'
    }
  ];

  return (
    <div className="dashboard-container">

      {/* Секція керування контентом */}
      <div className="dashboard-section">
        <div className="cards-grid">
          {/* News Card */}
          <div className="content-management-card news-card">
            <div className="card-head">
              <h3 className="card-title">Новини</h3>
              <Link to="/admin/news/create" className="action-small">+ Додати</Link>
            </div>
            <div className="news-list">
              {newsLoading ? (
                <p>Завантаження...</p>
              ) : (
                newsItems.length ? (
                  newsItems.map(n => (
                    <div key={n.id} className="news-row">
                      <div className="news-meta">
                        <div className="news-title">{n.title}</div>
                        <div className="news-date">{new Date(n.created_at).toLocaleDateString('uk-UA')}</div>
                      </div>
                      <div className="news-tag">Опубліковано</div>
                    </div>
                  ))
                ) : (
                  <p>Новин не знайдено</p>
                )
              )}
            </div>
          </div>

          {/* Gallery Card */}
          <div className="content-management-card gallery-card">
            <div className="card-head">
              <h3 className="card-title">Галерея</h3>
              <Link to="/admin/gallery-management" className="action-small">Управління</Link>
            </div>
            <div className="gallery-preview">
              {galleryLoading ? (
                <p>Завантаження...</p>
              ) : (
                <div className="preview-grid">
                  {galleryPreview.map((img, i) => (
                    <div key={i} className="preview-item">
                      <img src={img.image_url || img.url} alt={img.title || 'img'} />
                    </div>
                  ))}
                </div>
              )}
              <div className="storage-info">82% available</div>
              <div className="gallery-meta">{galleryCount} фото • Останнє: {galleryLastUpdated || '—'}</div>
            </div>
          </div>

          {/* Transparency Card */}
          <div className="content-management-card transparency-card">
            <div className="card-head">
              <h3 className="card-title">Прозорість</h3>
              <Link to="/admin/transparency" className="action-small">Документи</Link>
            </div>
            <div className="transparency-list">
              {transLoading ? (
                <p>Завантаження...</p>
              ) : (
                transparencyItems.map((t, idx) => (
                  <div key={idx} className="trans-row">
                    <span className={`check ${t.upToDate ? 'ok' : 'missing'}`}>
                      {t.upToDate ? '✓' : '✖'}
                    </span>
                    <span className="trans-label">{t.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Статистика та швидкі дії */}
      <div className="dashboard-stats">
        <div className="stats-card">
          <h3 className="stats-title">Швидкі дії</h3>
          <div className="quick-actions">
            <Link to="/admin/news/create" className="quick-action-btn primary">
              Додати новину
            </Link>
            <Link to="/admin/transparency" className="quick-action-btn secondary">
              Редагувати прозорість
            </Link>
            <Link to="/admin/gallery-management" className="quick-action-btn secondary">
              Керувати галереєю
            </Link>
          </div>
        </div>
        
        <div className="info-card">
          <h3 className="info-title">ℹ️ Інформація</h3>
          <p className="info-text">
            <strong>Статичні сторінки</strong> (Головна, Про нас, Відділи, Контакти) не редагуються через адмін-панель 
            та мають фіксований вміст. Для їх зміни потрібно редагувати код напряму.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
