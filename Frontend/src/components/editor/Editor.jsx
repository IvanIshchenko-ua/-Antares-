import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '../../services/contentService';
import RichTextEditor from './RichTextEditor';

const PageEditor = () => {
  const { pageName } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => {
    loadContent();
  }, [pageName]);

  const loadContent = async () => {
    try {
      const response = await contentService.getContent(pageName);
      setContent(response.data.content || '');
      setSaved(true);
    } catch (error) {
      console.error('Помилка завантаження контенту:', error);
      // Якщо сторінки немає, створюємо порожній контент
      setContent('');
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    setSaved(false);
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      await contentService.updateContent(pageName, content);
      setSaved(true);
      alert('Контент збережено успішно!');
    } catch (error) {
      console.error('Помилка збереження:', error);
      alert('Помилка збереження контенту');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Редагування: {pageName}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-2 py-1 rounded text-sm ${
              saved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {saved ? '✓ Збережено' : '● Не збережено'}
            </span>
          </div>
        </div>
        
        <div className="space-x-2">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Назад
          </button>
          <button
            onClick={saveContent}
            disabled={loading || saved}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>
      
      <RichTextEditor
        value={content}
        onChange={handleContentChange}
        onInit={handleEditorInit}
      />
      
      {/* Кнопки швидкого доступу */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => setContent(content + '<p>Новий абзац</p>')}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Додати абзац
        </button>
        <button
          onClick={() => setContent(content + '<h2>Новий заголовок</h2>')}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
        >
          Додати заголовок
        </button>
      </div>
    </div>
  );
};

export default PageEditor;