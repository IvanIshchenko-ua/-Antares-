import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const EditableElement = ({ 
  elementId, 
  content, 
  isEditing, 
  onEditStart, 
  onSave, 
  tag = 'div',
  className = ''
}) => {
  const [currentContent, setCurrentContent] = useState(content);

  const handleSave = () => {
    onSave(currentContent);
  };

  const handleCancel = () => {
    setCurrentContent(content);
    onEditStart(null);
  };

  // Рендеринг контенту для перегляду
  const renderContent = () => {
    const Tag = tag;
    return (
      <Tag 
        className={`editable-element ${className} ${isEditing ? 'editing' : ''}`}
        onClick={onEditStart}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Рендеринг редактора
  const renderEditor = () => {
    return (
      <div className={`editable-element-editor ${className}`}>
        <div className="editor-toolbar">
          <button onClick={handleSave} className="btn-save">💾 Зберегти</button>
          <button onClick={handleCancel} className="btn-cancel">❌ Скасувати</button>
        </div>
        
        <Editor
          apiKey="your-tinyMCE-api-key" // Отримайте безкоштовний ключ
          value={currentContent}
          onEditorChange={setCurrentContent}
          init={{
            height: 400,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | bold italic underline | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | link image | ' +
              'forecolor backcolor | table | code | fullscreen | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; } h1, h2, h3 { margin: 20px 0 10px 0; } p { margin: 10px 0; }'
          }}
        />
      </div>
    );
  };

  return isEditing ? renderEditor() : renderContent();
};

export default EditableElement;