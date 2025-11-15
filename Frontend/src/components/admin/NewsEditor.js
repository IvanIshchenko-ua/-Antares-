import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import RichTextEditor from '../editor/RichTextEditor';
import './NewsEditor.css';

const NewsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullContent: '',
    image: '',
    author: 'Адміністрація',
    isPublished: true
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      loadNewsItem();
    }
  }, [id]);

  const loadNewsItem = async () => {
    try {
      const response = await newsService.getNewsById(id);
      const newsData = response.data;
      setFormData({
        title: newsData.title,
        shortDescription: newsData.shortDescription,
        fullContent: newsData.fullContent,
        image: newsData.image || '',
        author: newsData.author,
        isPublished: newsData.isPublished
      });
    } catch (error) {
      console.error('Помилка завантаження новини:', error);
      alert('Помилка завантаження новини');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      fullContent: content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Валідація на клієнті
      if (!formData.title || !formData.shortDescription || !formData.fullContent) {
        alert('Будь ласка, заповніть всі обов\'язкові поля: заголовок, короткий опис та повний текст');
        return;
      }

      if (isEditMode) {
        await newsService.updateNews(id, formData);
        alert('Новину оновлено успішно!');
      } else {
        await newsService.createNews(formData);
        alert('Новину створено успішно!');
      }
      navigate('/admin/news');
    } catch (error) {
      console.error('Помилка збереження:', error);
      alert('Помилка збереження новини: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="news-editor">
      <div className="editor-header">
        <h1>{isEditMode ? 'Редагування новини' : 'Створення новини'}</h1>
        <button 
          onClick={() => navigate('/admin/news')}
          className="btn-back"
        >
          ← Назад до списку
        </button>
      </div>

      <form onSubmit={handleSubmit} className="news-form">
        <div className="form-group">
          <label>Заголовок новини *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Введіть заголовок новини"
          />
        </div>

        <div className="form-group">
          <label>Короткий опис *</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Короткий опис для відображення в списку новин"
          />
        </div>

        {/* ДОДАНО ПОЛЕ ДЛЯ ПОВНОГО ТЕКСТУ */}
        <div className="form-group">
          <label>Повний текст новини *</label>
          <RichTextEditor
            value={formData.fullContent}
            onChange={handleContentChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>URL зображення</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Автор</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Автор новини"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
            />
            Опубліковано
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
            className="btn-cancel"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-save"
          >
            {saving ? 'Збереження...' : (isEditMode ? 'Оновити' : 'Створити')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsEditor;