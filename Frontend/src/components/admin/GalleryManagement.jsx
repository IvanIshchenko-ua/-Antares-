import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import './GalleryManagement.css';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('r2');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    image_url: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      alert('Помилка завантаження зображень');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.title) {
        const fileName = file.name.split('.')[0];
        setFormData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadMethod === 'r2' && !selectedFile) {
      alert('Будь ласка, виберіть файл');
      return;
    }

    if (uploadMethod === 'link' && !formData.image_url.trim()) {
      alert('Будь ласка, введіть посилання на фото');
      return;
    }

    if (!formData.title.trim()) {
      alert('Будь ласка, введіть заголовок');
      return;
    }

    setUploading(true);
    try {
      let result;

      if (uploadMethod === 'r2') {
        const submitFormData = new FormData();
        submitFormData.append('file', selectedFile);
        submitFormData.append('title', formData.title);
        submitFormData.append('description', formData.description);
        submitFormData.append('category', formData.category);

        result = await galleryService.uploadGalleryImage(submitFormData);
      } else {
        const imageData = {
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          category: formData.category
        };

        result = await galleryService.createGalleryImage(imageData);
      }
      
      setFormData({
        title: '',
        description: '',
        category: 'general',
        image_url: ''
      });
      setSelectedFile(null);
      setShowForm(false);
      
      await loadImages();
      
      alert('Фото успішно додано до галереї!');
    } catch (error) {
      console.error('Помилка завантаження:', error);
      alert('Помилка завантаження фото: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId, filename = null) => {
    if (!window.confirm('Ви впевнені, що хочете видалити це фото?')) {
      return;
    }

    try {
      await galleryService.deleteGalleryImage(imageId, filename);
      setImages(images.filter(img => img.id !== imageId));
      alert('Фото успішно видалено!');
    } catch (error) {
      console.error('Помилка видалення:', error);
      alert('Помилка видалення фото');
    }
  };

  // ДОДАЙТЕ ЦЮ ФУНКЦІЮ - ВОНА БУЛА ВІДСУТНЯ
  const cancelForm = () => {
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      image_url: ''
    });
    setSelectedFile(null);
  };

  return (
    <div className="gallery-management">
      

      {showForm && (
        <div className="photo-form-overlay">
          <div className="photo-form">
            <div className="form-header">
              <h2>Додати нове фото</h2>
              <button onClick={cancelForm} className="close-btn">×</button>
            </div>
            
            <div className="upload-method-selector">
              <label>Спосіб завантаження:</label>
              <div className="method-buttons">
                <button
                  type="button"
                  className={`method-btn ${uploadMethod === 'r2' ? 'active' : ''}`}
                  onClick={() => setUploadMethod('r2')}
                >
                  ☁️ Cloudflare R2
                </button>
                <button
                  type="button"
                  className={`method-btn ${uploadMethod === 'link' ? 'active' : ''}`}
                  onClick={() => setUploadMethod('link')}
                >
                  📎 Посилання
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {uploadMethod === 'r2' && (
                <div className="form-group">
                  <label>Фото *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input"
                    required={uploadMethod === 'r2'}
                  />
                  {selectedFile && (
                    <div className="file-preview">
                      <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
                      <span>{selectedFile.name}</span>
                    </div>
                  )}
                  <div className="help-text">
                    <p><strong>Cloudflare R2 Storage</strong></p>
                    <ul>
                      <li>Фото зберігаються в хмарі</li>
                      <li>Висока швидкість завантаження</li>
                      <li>Надійне зберігання</li>
                    </ul>
                  </div>
                </div>
              )}

              {uploadMethod === 'link' && (
                <div className="form-group">
                  <label>Посилання на фото *</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/photo.jpg"
                    className="text-input"
                    required={uploadMethod === 'link'}
                  />
                  <div className="help-text">
                    <p><strong>Підтримувані джерела:</strong></p>
                    <ul>
                      <li>Google Drive</li>
                      <li>Imgur</li>
                      <li>Будь-яке публічне посилання</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Заголовок *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Введіть заголовок фото"
                  className="text-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Опис (необов'язково)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Введіть опис фото"
                  className="text-input"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Категорія</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select-input"
                >
                  <option value="general">Загальна</option>
                  <option value="classes">Заняття</option>
                  <option value="events">Події</option>
                  <option value="concerts">Концерти</option>
                  <option value="exhibitions">Виставки</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={cancelForm}
                  className="cancel-btn"
                >
                  Скасувати
                </button>
                <button 
                  type="submit" 
                  disabled={
                    (uploadMethod === 'r2' && !selectedFile) ||
                    (uploadMethod === 'link' && !formData.image_url.trim()) ||
                    !formData.title.trim() || 
                    uploading
                  }
                  className="submit-btn"
                >
                  {uploading ? 'Завантаження...' : 'Додати фото'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="images-list">
        <h2>Фото в галереї ({images.length})</h2>
        
        {loading ? (
          <div className="loading">Завантаження...</div>
        ) : (
          <div className="images-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <div className="image-container">
                  <img 
                    src={image.image_url} 
                    alt={image.title}
                    onError={(e) => {
                      console.error('Помилка завантаження зображення:', image.image_url);
                      e.target.src = '/img/placeholder.jpg';
                    }}
                  />
                  <div className="image-overlay">
                    <button 
                      onClick={() => handleDelete(image.id, image.filename)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="image-info">
                  <h4>{image.title}</h4>
                  {image.description && <p>{image.description}</p>}
                  <div className="image-meta">
                    <span className="category">{image.category}</span>
                    <span className="date">
                      {image.created_at ? new Date(image.created_at).toLocaleDateString('uk-UA') : 'Не вказано'}
                    </span>
                  </div>
                  {image.image_url && image.image_url.includes('r2.dev') && (
                    <div className="source-badge r2-badge">☁️ Cloudflare R2</div>
                  )}
                  {image.image_url && !image.image_url.includes('r2.dev') && (
                    <div className="source-badge link-badge">🌐 Посилання</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <h3>Ще немає доданих фото</h3>
            <p>Додайте перше фото до галереї</p>
            <button 
              onClick={() => setShowForm(true)}
              className="add-first-btn"
            >
              Додати перше фото
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;