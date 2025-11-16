import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SiteLayout from './SiteLayout';
import { contentService } from '../../services/contentService';
import './SitePage.css';

// Імпортуємо статичні компоненти
import Home from '../static/Home';
import About from '../static/About';
import Departments from '../static/Departments';
import Contacts from '../static/Contacts';
import NewsList from '../news/NewsList';
import NewsItem from '../news/NewsItem';
import GalleryPage from './gallery/GalleryPage';

// 🟦 Додаємо компонент прозорості
import TransparencySection from './TransparencySection';

const SitePage = () => {
  const { pageName } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Як і раніше, список сторінок, що завантажуються з бази через contentService
  const dynamicPages = ['transparency']; // залишаємо логіку, але transparency зробимо особливим випадком?

  useEffect(() => {
    // Якщо це НЕ transparency — вантажимо контент через contentService
    if (pageName && pageName !== 'transparency') {
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
      {renderContent()}
    </SiteLayout>
  );
};

// Окремий компонент для сторінки новини
export const NewsPage = () => {
  const { id } = useParams();

  if (id) {
    return (
      <SiteLayout>
        <NewsItem />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <NewsList />
    </SiteLayout>
  );
};

export default SitePage;
