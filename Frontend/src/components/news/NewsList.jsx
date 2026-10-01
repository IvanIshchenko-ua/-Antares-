import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Eye, Newspaper } from 'lucide-react';
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
      const items = Array.isArray(response.data)
        ? response.data
        : (response.data?.news || response.data?.items || []);
      setNews(items);
    } catch (error) {
      console.error('Помилка завантаження новин:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата уточнюється';

    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getImage = (item) => item.image || item.imageUrl || item.coverImage;

  if (loading) {
    return (
      <div className="news-list-page">
        <div className="news-list-inner">
          <div className="news-skeleton-grid" aria-label="Завантаження новин">
            {[1, 2, 3].map((item) => (
              <div className="news-skeleton-card" key={item}>
                <div className="news-skeleton-img" />
                <div className="news-skeleton-body">
                  <div className="news-skeleton-line title" />
                  <div className="news-skeleton-line" />
                  <div className="news-skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-list-page">
      <div className="news-list-inner">
        <div className="news-grid">
          {news.map((item, index) => (
            <div key={item.id} className="news-card">
              {getImage(item) ? (
                <div className="news-card-img-wrap">
                  <img src={getImage(item)} alt={item.title} />
                  <div className="news-card-img-overlay" />
                  <span className="news-card-date-badge"><CalendarDays size={13} /> {formatDate(item.publishDate || item.date)}</span>
                  {item.views !== undefined && <span className="news-card-views"><Eye size={13} /> {item.views}</span>}
                </div>
              ) : (
                <div className="news-card-no-img">
                  <Newspaper size={48} className="news-card-no-img-icon" />
                  <span className="news-card-date-badge"><CalendarDays size={13} /> {formatDate(item.publishDate || item.date)}</span>
                </div>
              )}

              <div className="news-card-body">
                <span className="news-card-kicker">{index === 0 ? 'Остання новина' : 'Життя школи'}</span>
                <h2 className="news-card-title">{item.title}</h2>
                <p className="news-card-desc">{item.shortDescription || item.description || 'Дізнайтеся більше про подію на сторінці новини.'}</p>

                <div className="news-card-footer">
                  <span className="news-card-author">{item.author || 'Школа «Антарес»'}</span>
                  <Link to={`/site/news/${item.id}`} className="news-card-read-btn">
                    Читати <ArrowRight size={16} />
                  </Link>
              </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="news-empty-state">
            <div className="news-empty-icon"><Newspaper size={28} /></div>
            <p>Поки що немає новин. Завітайте пізніше!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsList;