import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import './NewsItem.css';

const NewsItem = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsItem();
  }, [id]);

  const loadNewsItem = async () => {
    try {
      const response = await newsService.getNewsById(id);
      setNewsItem(response.data);
    } catch (error) {
      console.error('Помилка завантаження новини:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="news-item-page">
        <div className="news-loading">Завантаження новини...</div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="news-item-page">
        <div className="news-not-found">
          <h2>Новину не знайдено</h2>
          <Link to="/site/news" className="back-link">← До всіх новин</Link>
        </div>
      </div>
    );
  }

return (
  <div className="news-item-page">
    {/* НАВІГАЦІЯ ВИДАЛЕНА - вона вже є в SiteLayout */}
    
    <div className="container">
      <nav className="news-breadcrumb">
        <Link to="/site/home">Головна</Link>
        <span> / </span>
        <Link to="/site/news">Новини</Link>
        <span> / </span>
        <span>{newsItem.title}</span>
      </nav>

      <article className="news-article">

        <header className="news-header">
          <h1 className="news-title-full">{newsItem.title}</h1>

          <div className="news-meta-full">
            <span className="news-date">📅 {formatDate(newsItem.publishDate)}</span>
            <span className="news-author">👤 {newsItem.author}</span>
            <span className="news-views">👁️ {newsItem.views} переглядів</span>
          </div>
        </header>

        {newsItem.image && (
          <div className="news-image-full">
            <img src={newsItem.image} alt={newsItem.title} />
          </div>
        )}


          <div 
            className="news-content-full"
            dangerouslySetInnerHTML={{ __html: newsItem.fullContent }}
          />

          <footer className="news-footer">
            <Link to="/site/news" className="back-to-news">
              ← До всіх новин
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default NewsItem;