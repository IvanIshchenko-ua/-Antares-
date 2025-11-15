import React from 'react';
import { editorConfig, ACTIVE_EDITOR } from '../../config/editors';

// Компонент TinyMCE
const TinyMCEditor = ({ value, onChange, onInit }) => {
  const { Editor } = require('@tinymce/tinymce-react');
  
  return (
    <Editor
      apiKey={editorConfig.tinymce.apiKey}
      value={value}
      onEditorChange={onChange}
      onInit={onInit}
      init={editorConfig.tinymce.init}
    />
  );
};

// Заготівка для CKEditor
const CKEditorComponent = ({ value, onChange }) => {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '20px', 
      textAlign: 'center',
      background: '#f9f9f9'
    }}>
      <h3>CKEditor 5</h3>
      <p>Редактор не налаштований. Для активації встановіть:</p>
      <code>npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic</code>
      <br /><br />
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

// Основний компонент, який вибирає редактор
const RichTextEditor = ({ value, onChange, onInit }) => {
  const renderEditor = () => {
    switch (ACTIVE_EDITOR) {
      case 'tinymce':
        return (
          <TinyMCEditor 
            value={value} 
            onChange={onChange} 
            onInit={onInit}
          />
        );
      case 'ckeditor':
        return (
          <CKEditorComponent 
            value={value} 
            onChange={onChange} 
          />
        );
      default:
        return <TinyMCEditor value={value} onChange={onChange} />;
    }
  };

  return (
    <div className="rich-text-editor">
      {renderEditor()}
      
      {/* Інформація про поточний редактор */}
      <div className="editor-info" style={{ 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#666',
        textAlign: 'center'
      }}>
        Поточний редактор: <strong>{ACTIVE_EDITOR.toUpperCase()}</strong>
        {ACTIVE_EDITOR === 'tinymce' && editorConfig.tinymce.apiKey === "no-api-key" && (
          <div style={{ color: 'orange' }}>
            ⚠️ Використовується без ключа API (з водяним знаком)
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;