import React, { useState, useEffect } from 'react';
import { transparencyService } from '../../services/transparencyService';
import RichTextEditor from '../editor/RichTextEditor';
import './TransparencyManagement.css';

const TransparencyManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await transparencyService.getAll();
      setSections(data);
    } catch (error) {
      console.error('Помилка завантаження розділів:', error);
      setError('Не вдалося завантажити розділи прозорості');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection({ 
      ...section,
      documents: section.documents || []
    });
  };

  const handleContentChange = (content) => {
    setEditingSection(prev => ({
      ...prev,
      content: content
    }));
  };

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  try {
    setSaveStatus('⏳ Завантаження файлів...');
    const uploadedDocuments = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file); // той самий ключ, що й у галереї
      formData.append('title', file.name);
      formData.append('category', 'transparency');

      const uploadResponse = await transparencyService.uploadDocument(formData);

      if (uploadResponse && uploadResponse.success) {
        uploadedDocuments.push({
          name: file.name,
          url: uploadResponse.url,
          filename: uploadResponse.filename,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
        });
      }
    }

    setEditingSection(prev => ({
      ...prev,
      documents: [...(prev.documents || []), ...uploadedDocuments],
    }));

    setSaveStatus(`✅ Завантажено ${uploadedDocuments.length} файлів`);
    setTimeout(() => setSaveStatus(''), 3000);
  } catch (error) {
    console.error('❌ Помилка завантаження документів у R2:', error);
    setSaveStatus('❌ Не вдалося завантажити файли');
    setTimeout(() => setSaveStatus(''), 3000);
  } finally {
    event.target.value = '';
  }
};

  const removeDocument = (index) => {
    setEditingSection(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!editingSection) return;

    try {
      setSaveStatus('Збереження...');
      await transparencyService.update(editingSection.section_type, {
        title: editingSection.title,
        content: editingSection.content,
        documents: editingSection.documents || []
      });
      
      setSaveStatus('✅ Збережено успішно!');
      setTimeout(() => setSaveStatus(''), 3000);
      
      // Оновлюємо список
      loadSections();
      setEditingSection(null);
    } catch (error) {
      console.error('Помилка збереження:', error);
      setSaveStatus('❌ Помилка збереження');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setSaveStatus('');
  };

  if (loading) return <div className="loading">Завантаження...</div>;

  return (
    <div className="transparency-management">
      <div className="page-header">
        <p>Редагування контенту для розділів прозорості та інформаційної відкритості</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={loadSections} className="retry-btn">
            Спробувати знову
          </button>
        </div>
      )}

      {saveStatus && (
        <div className={`alert ${saveStatus.includes('✅') ? 'alert-success' : saveStatus.includes('Збереження') ? 'alert-info' : 'alert-danger'}`}>
          {saveStatus}
        </div>
      )}

      {editingSection ? (
        <div className="editor-section">
          <div className="editor-header">
            <h2>Редагування: {editingSection.title}</h2>
            <div className="editor-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Скасувати
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Зберегти зміни
              </button>
            </div>
          </div>
          
          <div className="content-editor">
            <label>Контент:</label>
            <RichTextEditor
              value={editingSection.content || ''}
              onChange={handleContentChange}
              height="400px"
            />
          </div>

          <div className="documents-section">
            <label>Документи:</label>
            <div className="documents-upload">
             <input
              type="file"
               multiple
                onChange={handleFileUpload}
                className="file-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              <small className="upload-hint">
                Файли зберігаються на R2.
              </small>
            </div>

            {editingSection.documents && editingSection.documents.length > 0 && (
              <div className="documents-list">
                <h4>Додані файли:</h4>
                {editingSection.documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="document-info">
                      <span className="document-name">{doc.name}</span>
                      <span className="document-size">{formatFileSize(doc.size)}</span>
                      <span className="document-date">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="document-actions">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeDocument(index)}
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="sections-grid">
          {sections.length === 0 ? (
            <div className="no-sections">
              <p>Розділи прозорості не знайдені.</p>
              <button onClick={loadSections} className="btn btn-primary">
                Оновити
              </button>
            </div>
          ) : (
            sections.map(section => (
              <div key={section.id} className="transparency-card">
                <div className="card-header">
                  <h3>{section.title}</h3>
                  <div className="card-status">
                    <span className={`status ${section.content ? 'active' : 'empty'}`}>
                      {section.content ? 'Наповнений' : 'Порожній'}
                    </span>
                    {section.documents && section.documents.length > 0 && (
                      <span className="documents-count">
                        📎 {section.documents.length}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="card-content">
                  {section.content ? (
                    <div 
                      className="content-preview"
                      dangerouslySetInnerHTML={{ __html: section.content.substring(0, 200) + '...' }}
                    />
                  ) : (
                    <p className="empty-state">Контент ще не додано</p>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleEdit(section)}
                  >
                    Редагувати
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Допоміжна функція для форматування розміру файлу
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default TransparencyManagement;