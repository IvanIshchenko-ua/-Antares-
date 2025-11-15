import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const EditableElement = ({ 
  elementId, 
  content, 
  isEditing, 
  onEditStart, 
  onSave, 
  onCancel,
  tag = 'div',
  className = ''
}) => {
  const [currentContent, setCurrentContent] = useState(content);

  const handleSave = () => {
    onSave(currentContent);
  };

  const handleCancel = () => {
    setCurrentContent(content);
    onCancel();
  };

  // Простий перегляд контенту
  const renderContent = () => {
    const Tag = tag;
    return (
      <Tag 
        className={`editable-element ${className}`}
        onClick={onEditStart}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Редактор з TinyMCE
  const renderEditor = () => {
    return (
      <div className={`editable-element-editor ${className}`}>
        <div className="editor-toolbar">
          <button onClick={handleSave} className="btn-save">💾 Зберегти</button>
          <button onClick={handleCancel} className="btn-cancel">❌ Скасувати</button>
        </div>
        
        <Editor
          apiKey="no-api-key" // Без ключа для тестування
          value={currentContent}
          onEditorChange={setCurrentContent}
          init={{
            height: 500,
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
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; } h1, h2, h3 { margin: 20px 0 10px 0; } p { margin: 10px 0; }',
            images_upload_handler: async (blobInfo) => {
              return new Promise((resolve, reject) => {
                // Простий обробник для завантаження через нашу систему
                const formData = new FormData();
                formData.append('image', blobInfo.blob(), blobInfo.filename());
                
                fetch('http://localhost:5000/api/upload', {
                  method: 'POST',
                  body: formData
                })
                .then(response => response.json())
                .then(data => resolve(data.url))
                .catch(() => reject('Upload failed'));
              });
            }
          }}
        />
      </div>
    );
  };

  return isEditing ? renderEditor() : renderContent();
};

export default EditableElement;