import React, { useState, useEffect } from 'react';
import galleryService from '../../../services/galleryService';
import './GalleryPage.css';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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
        { id: 1, src: '/img/gallery1.jpg', alt: 'Заняття музикою', title: 'Урок гри на фортепіано' },
        { id: 2, src: '/img/gallery2.jpg', alt: 'Художній гурток', title: 'Малювання аквареллю' },
        { id: 3, src: '/img/gallery3.jpg', alt: 'Концерт учнів', title: 'Шкільний концерт' },
        { id: 4, src: '/img/gallery4.jpg', alt: 'Танцювальна студія', title: 'Урок хореографії' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="container">
          <div className="loading">Завантаження галереї...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <p>Наші найкращі моменти та досягнення</p>
        
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-item">
              <img 
  src={image.image_url} 
  alt={image.title || image.alt || 'Фото'} 
  loading="lazy"
  onError={(e) => (e.target.src = '/img/placeholder.jpg')}
/>
              <div className="image-overlay">
                <span className="image-title">{image.title || image.alt}</span>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="empty-gallery">
            <p>Поки що немає доданих фотографій. Будь ласка, завітайте пізніше.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;