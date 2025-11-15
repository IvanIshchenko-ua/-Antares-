import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import './NewsList.css';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await newsService.getAllNews();
      setNews(response.data);
    } catch (error) {
      console.error('Помилка завантаження новин:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="news-list-page">
        <div className="news-loading">Завантаження новин...</div>
      </div>
    );
  }

  return (
    <div className="news-list-page">
      {/* НАВІГАЦІЯ ВИДАЛЕНА - вона вже є в SiteLayout */}
      
      <div className="container">
        
        <div className="news-grid">
          {news.map((item) => (
            <div key={item.id} className="news-card">
              {item.image && (
                <div className="news-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}
              
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-description">{item.shortDescription}</p>
                
                <div className="news-meta">
                  <span className="news-date">{formatDate(item.publishDate)}</span>
                  <span className="news-views">👁️ {item.views}</span>
                </div>
                
                <Link to={`/site/news/${item.id}`} className="read-more-btn">
                  Читати повністю →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="no-news">
            <p>Поки що немає новин. Завітайте пізніше!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;