import React, { useState, useEffect } from 'react';
import { Camera, Film, Image as ImageIcon, Play, Sparkles } from 'lucide-react';
import galleryService from '../../../services/galleryService';
import './GalleryPage.css';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos');

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const response = await galleryService.getGalleryImages();
      setImages(response.images || []);
    } catch (error) {
      console.error('Помилка завантаження зображень:', error);
      // Резервні дані для тестування
      setImages([
        { id: 1, image_url: '/img/gallery1.jpg', alt: 'Заняття музикою', title: 'Урок гри на фортепіано' },
        { id: 2, image_url: '/img/gallery2.jpg', alt: 'Художній гурток', title: 'Малювання аквареллю' },
        { id: 3, image_url: '/img/gallery3.jpg', alt: 'Концерт учнів', title: 'Шкільний концерт' },
        { id: 4, image_url: '/img/gallery4.jpg', alt: 'Танцювальна студія', title: 'Урок хореографії' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (item) => Boolean(
    item.video_url || item.videoUrl || item.media_type === 'video' || item.type === 'video'
  );

  const getMediaUrl = (item) => item.image_url || item.src || item.image || item.url;
  const photos = images.filter((item) => !isVideo(item));
  const videos = images.filter(isVideo);
  const activeItems = activeTab === 'photos' ? photos : videos;

  const getVideoUrl = (item) => item.video_url || item.videoUrl || item.url;
  const getYoutubeEmbedUrl = (url) => {
    const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-inner">
          <div className="gallery-skeleton-grid" aria-label="Завантаження галереї">
            {[1, 2, 3, 4, 5, 6].map((item) => <div className="gallery-skeleton" key={item} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-inner">
        <div className="gallery-toolbar">
          <div className="gallery-toolbar-copy">
            <span className="gallery-kicker"><Sparkles size={14} /> Творче життя</span>
            <h2>Моменти, які хочеться зберегти</h2>
            <p>Концерти, виставки, репетиції та щоденні кроки наших учнів.</p>
          </div>
          <div className="gallery-tabs" role="tablist" aria-label="Тип медіа">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'photos'}
              className={activeTab === 'photos' ? 'active' : ''}
              onClick={() => setActiveTab('photos')}
            >
              <ImageIcon size={17} /> Фото <span>{photos.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'videos'}
              className={activeTab === 'videos' ? 'active' : ''}
              onClick={() => setActiveTab('videos')}
            >
              <Film size={17} /> Відео <span>{videos.length}</span>
            </button>
          </div>
        </div>

        {activeItems.length > 0 && activeTab === 'photos' && (
          <div className="gallery-grid">
            {activeItems.map((image) => (
              <article key={image.id} className="gallery-item">
                <img
                  src={getMediaUrl(image)}
                  alt={image.title || image.alt || 'Фото зі шкільного життя'}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/img/placeholder.jpg'; }}
                />
                <div className="image-overlay">
                  <span className="image-title">{image.title || image.alt || 'Шкільне життя'}</span>
                  <Camera size={18} />
                </div>
              </article>
            ))}
          </div>
        )}

        {activeItems.length > 0 && activeTab === 'videos' && (
          <div className="video-grid">
            {activeItems.map((video) => {
              const videoUrl = getVideoUrl(video);
              const embedUrl = getYoutubeEmbedUrl(videoUrl);
              return (
                <article key={video.id} className="video-card">
                  <div className="video-frame">
                    {embedUrl ? (
                      <iframe src={embedUrl} title={video.title || 'Відео зі школи'} allowFullScreen />
                    ) : (
                      <video controls preload="metadata" poster={getMediaUrl(video)}>
                        <source src={videoUrl} />
                        Ваш браузер не підтримує відтворення відео.
                      </video>
                    )}
                    <span className="video-play-mark"><Play size={16} fill="currentColor" /></span>
                  </div>
                  <div className="video-card-copy">
                    <span>Відео</span>
                    <h3>{video.title || 'Момент зі шкільного життя'}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {activeItems.length === 0 && (
          <div className="empty-gallery">
            <div className="empty-gallery-icon">{activeTab === 'photos' ? <ImageIcon size={28} /> : <Film size={28} />}</div>
            <h3>{activeTab === 'photos' ? 'Фотографій поки немає' : 'Відео поки немає'}</h3>
            <p>Матеріали з’являться тут після публікації.</p>
              </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;