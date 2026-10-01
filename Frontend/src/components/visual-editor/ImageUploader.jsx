import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ImageUploader.css';

const ImageUploader = ({ onInsert, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadExistingImages();
  }, []);

  const loadExistingImages = async () => {
    try {
      const response = await api.get('/upload');
      const data = response.data;
      if (Array.isArray(data)) {
        setUploadedImages(data);
      }
    } catch (error) {
      console.error('Помилка завантаження існуючих зображень:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Будь ласка, виберіть файл зображення');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('Файл занадто великий. Максимальний розмір: 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Будь ласка, виберіть файл');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedImages(prev => [response.data, ...prev]);
      setSelectedFile(null);
      setSuccess('Зображення успішно завантажено!');

      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Помилка завантаження:', error);
      setError('Помилка завантаження зображення. Перевірте підключення до сервера.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    // Вставляємо простий HTML img тег
    const imgHtml = `<img src="${imageUrl}" alt="Зображення" style="max-width: 100%; height: auto;">`;
    onInsert(imgHtml);
  };

  return (
    <div className="image-uploader-overlay">
      <div className="image-uploader-modal">
        <div className="uploader-header">
          <h3>🖼️ Додати зображення</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="upload-section">
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          {uploading ? (
            <div className="uploading-indicator">
              <div className="uploading-spinner"></div>
              Завантаження...
            </div>
          ) : (
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="upload-btn"
            >
              📤 Завантажити
            </button>
          )}
        </div>

        {selectedFile && !uploading && (
          <div className="file-info">
            📎 Вибрано: <strong>{selectedFile.name}</strong> 
            ({Math.round(selectedFile.size / 1024)} KB)
          </div>
        )}

        <div className="images-grid">
          {uploadedImages.length > 0 ? (
            uploadedImages.map((image, index) => (
              <div
                key={index}
                className="image-item"
                onClick={() => handleImageClick(image.url)}
                title="Натисніть для вставки в контент"
              >
                <img src={image.url} alt={`Завантажене ${index + 1}`} />
                <div className="image-overlay">Вставити</div>
              </div>
            ))
          ) : (
            <div className="no-images">
              🖼️ Немає завантажених зображень
            </div>
          )}
        </div>

        <div className="uploader-footer">
          <button onClick={onClose} className="cancel-btn">
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;