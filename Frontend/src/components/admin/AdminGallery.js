import React, { useState, useEffect } from 'react';
import galleryService from '../../services/galleryService';
import './AdminGallery.css';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await galleryService.getGalleryImages();
      setImages(response.images || []);
    } catch (error) {
      console.error('Помилка завантаження зображень:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Автоматично генеруємо назву з імені файлу
      if (!imageTitle) {
        setImageTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Будь ласка, виберіть файл');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', imageTitle);
      formData.append('description', imageDescription);

      await galleryService.uploadGalleryImage(formData);
      
      // Очищаємо форму
      setSelectedFile(null);
      setImageTitle('');
      setImageDescription('');
      document.getElementById('file-input').value = '';
      
      // Оновлюємо список
      await loadImages();
      
      alert('Фото успішно завантажено!');
    } catch (error) {
      console.error('Помилка завантаження:', error);
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це фото?')) {
      return;
    }

    try {
      await galleryService.deleteGalleryImage(imageId);
      setImages(images.filter(img => img.id !== imageId));
      alert('Фото успішно видалено!');
    } catch (error) {
      console.error('Помилка видалення:', error);
      alert('Помилка видалення фото');
    }
  };

  return (
    <div className="admin-gallery">
      <div className="admin-header">
        <h1>Керування галереєю</h1>
        <p>Додавайте, редагуйте та видаляйте фото галереї</p>
      </div>

      {/* Секція завантаження */}
      <div className="upload-section">
        <h2>Додати нове фото</h2>
        <div className="upload-form">
          <div className="form-group">
            <label>Виберіть фото:</label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
          </div>
          
          <div className="form-group">
            <label>Назва фото:</label>
            <input
              type="text"
              value={imageTitle}
              onChange={(e) => setImageTitle(e.target.value)}
              placeholder="Введіть назву фото"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label>Опис фото (необов'язково):</label>
            <textarea
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Введіть опис фото"
              className="text-input"
              rows="3"
            />
          </div>

          {selectedFile && (
            <div className="preview-section">
              <p>Попередній перегляд:</p>
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                />
                <p>{selectedFile.name}</p>
              </div>
            </div>
          )}

          <button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            className="upload-button"
          >
            {uploading ? 'Завантаження...' : 'Завантажити фото'}
          </button>
        </div>
      </div>

      {/* Список фото */}
      <div className="images-list">
        <h2>Фото в галереї ({images.length})</h2>
        
        {loading ? (
          <div className="loading">Завантаження...</div>
        ) : (
          <div className="images-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <div className="image-container">
                  <img src={image.image_url} alt={image.title} />
                </div>
                <div className="image-info">
                  <h4>{image.title}</h4>
                  <p>{image.description}</p>
                  <small>Категорія: {image.category}</small>
                </div>
                <div className="image-actions">
                  <button 
                    onClick={() => handleDelete(image.id)}
                    className="delete-button"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !loading && (
          <div className="empty-state">
            <p>Ще немає доданих фото. Додайте перше фото!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;