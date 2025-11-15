import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import './NewsManagement.css';

const NewsManagement = () => {
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

  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю новину?')) {
      try {
        await newsService.deleteNews(id);
        setNews(news.filter(item => item.id !== id));
        alert('Новину видалено успішно!');
      } catch (error) {
        console.error('Помилка видалення:', error);
        alert('Помилка видалення новини');
      }
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
      <div className="news-management">
        <div className="loading">Завантаження новин...</div>
      </div>
    );
  }

  return (
    <div className="news-management">
      <div className="management-header">
        <div>
          <p>Створюйте та редагуйте новини школи</p>
        </div>
        <Link to="/admin/news/create" className="btn-create">
          + Додати новину
        </Link>
      </div>

      <div className="news-list-admin">
        {news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="news-item-admin">
              <div className="news-item-main">
                {item.image && (
                  <div className="news-image-admin">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
                <div className="news-content-admin">
                  <h3>{item.title}</h3>
                  <p className="news-description">{item.shortDescription}</p>
                  <div className="news-meta-admin">
                    <span className="news-date">📅 {formatDate(item.publishDate)}</span>
                    <span className="news-views">👁️ {item.views} переглядів</span>
                    <span className={`news-status ${item.isPublished ? 'published' : 'draft'}`}>
                      {item.isPublished ? '✅ Опубліковано' : '📝 Чернетка'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="news-actions">
                <Link 
                  to={`/admin/news/edit/${item.id}`}
                  className="btn-edit"
                >
                  ✏️ Редагувати
                </Link>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="btn-delete"
                >
                  🗑️ Видалити
                </button>
                <a 
                  href={`/site/news/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-preview"
                >
                  👁️ Перегляд
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-news">
            <div className="no-news-content">
              <h3>📰 Немає новин</h3>
              <p>Створіть першу новину для вашого сайту</p>
              <Link to="/admin/news/create" className="btn-create-large">
                + Створити першу новину
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;