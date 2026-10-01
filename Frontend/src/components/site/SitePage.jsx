import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SiteLayout from './SiteLayout';
import { contentService } from '../../services/contentService';
import './SitePage.css';

const Home = lazy(() => import('../static/Home'));
const About = lazy(() => import('../static/About'));
const Departments = lazy(() => import('../static/Departments'));
const Contacts = lazy(() => import('../static/Contacts'));
const NewsList = lazy(() => import('../news/NewsList'));
const NewsItem = lazy(() => import('../news/NewsItem'));
const GalleryPage = lazy(() => import('./gallery/GalleryPage'));
const TransparencySection = lazy(() => import('./TransparencySection'));

const PageFallback = () => <div className="site-loading">Завантаження...</div>;

const SitePage = () => {
  const { pageName } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const staticPages = ['home', 'about', 'departments', 'contacts', 'news', 'gallery', 'transparency'];

  // Як і раніше, список сторінок, що завантажуються з бази через contentService
  const dynamicPages = ['transparency']; // залишаємо логіку, але transparency зробимо особливим випадком?

  useEffect(() => {
    // Завантажуємо CMS-контент лише для невідомих динамічних сторінок.
    if (pageName && !staticPages.includes(pageName)) {
      loadContent();
    }
  }, [pageName]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await contentService.getContent(pageName);
      setContent(response.data.content || '');
    } catch (error) {
      console.error('❌ Помилка завантаження контенту:', error);
      setContent('<p>Контент не знайдено</p>');
    } finally {
      setLoading(false);
    }
  };

  // Рендер контенту
  const renderContent = () => {
    // 🟩 Прозорість тепер має свій компонент
    if (pageName === 'transparency') {
      return <TransparencySection />;
    }

    // Інші сторінки — без змін
    if (loading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Завантаження...</div>;
    }

    switch (pageName) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'departments':
        return <Departments />;
      case 'contacts':
        return <Contacts />;
      case 'news':
        return <NewsList />;
      case 'gallery':
        return <GalleryPage />;
      default:
        return (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        );
    }
  };

  return (
    <SiteLayout>
      <Suspense fallback={<PageFallback />}>
        {renderContent()}
      </Suspense>
    </SiteLayout>
  );
};

// Окремий компонент для сторінки новини
export const NewsPage = () => {
  const { id } = useParams();

  if (id) {
    return (
      <SiteLayout>
        <Suspense fallback={<PageFallback />}>
          <NewsItem />
        </Suspense>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Suspense fallback={<PageFallback />}>
        <NewsList />
      </Suspense>
    </SiteLayout>
  );
};

export default SitePage;
