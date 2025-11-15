import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditableElement from './EditableElement';
import EditorToolbar from './EditorToolbar';
import ImageUploader from './ImageUploader';
import { contentService } from '../../services/contentService';
import './VisualEditor.css';

const VisualEditor = () => {
  const { pageName } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [editingElement, setEditingElement] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  useEffect(() => {
    loadPageData();
  }, [pageName]);

  const loadPageData = async () => {
    try {
      const response = await contentService.getContent(pageName);
      if (response.data) {
        // Якщо дані вже є
        if (typeof response.data.content === 'string') {
          setPageData({
            title: pageName,
            content: response.data.content
          });
        } else {
          setPageData(response.data);
        }
      } else {
        // Створюємо шаблон
        setPageData({
          title: pageName,
          content: `<h1>Сторінка ${pageName}</h1><p>Початок редагування...</p>`
        });
      }
    } catch (error) {
      console.error('Помилка завантаження:', error);
      setPageData({
        title: pageName,
        content: `<h1>Сторінка ${pageName}</h1><p>Помилка завантаження. Створюємо нову сторінку...</p>`
      });
    }
  };

  const handleElementClick = (elementId) => {
    if (isEditMode) {
      setEditingElement(elementId);
    }
  };

  const handleContentUpdate = (elementId, newContent) => {
    setPageData(prev => ({
      ...prev,
      content: newContent
    }));
    setEditingElement(null);
  };

  const handleImageInsert = (imageHtml) => {
    // Додаємо HTML зображення до контенту
    setPageData(prev => ({
      ...prev,
      content: prev.content + imageHtml
    }));
    setShowImageUploader(false);
  };

  const savePage = async () => {
    if (!pageData) return;
    
    setLoading(true);
    try {
      await contentService.updateContent(pageName, pageData);
      alert('Сторінку збережено!');
    } catch (error) {
      console.error('Помилка збереження:', error);
      alert('Помилка збереження сторінки');
    } finally {
      setLoading(false);
    }
  };

  if (!pageData) {
    return <div className="loading">Завантаження...</div>;
  }

  return (
    <div className={`visual-editor ${isEditMode ? 'edit-mode' : 'preview-mode'}`}>
      <EditorToolbar
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onSave={savePage}
        onExit={() => navigate('/admin/dashboard')}
        onAddImage={() => setShowImageUploader(true)}
        loading={loading}
      />

      {showImageUploader && (
        <ImageUploader
          onInsert={handleImageInsert}
          onClose={() => setShowImageUploader(false)}
        />
      )}

      <div className="editor-container">
        <EditableElement
          elementId="page-content"
          content={pageData.content}
          isEditing={editingElement === 'page-content'}
          onEditStart={() => handleElementClick('page-content')}
          onSave={(content) => handleContentUpdate('page-content', content)}
          onCancel={() => setEditingElement(null)}
          tag="div"
          className="page-content-editor"
        />
      </div>
    </div>
  );
};

export default VisualEditor;