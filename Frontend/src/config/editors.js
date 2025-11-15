// Конфігурація для редакторів
export const editorConfig = {
  // TinyMCE конфігурація
  tinymce: {
    apiKey: "acivwjlz6u1shv6ew3ca4scht6551mciaqq7me0i5qmlqp4v", // Замініть на ваш ключ
    init: {
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
          const formData = new FormData();
          formData.append('image', blobInfo.blob(), blobInfo.filename());
          
          const currentHost = window.location.hostname;
          const uploadURL = currentHost === '192.168.0.224' 
            ? 'http://192.168.0.224:5000/api/upload'
            : 'http://localhost:5000/api/upload';
          
          fetch(uploadURL, {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => resolve(data.url))
          .catch(() => reject('Upload failed'));
        });
      }
    }
  }
};

export const ACTIVE_EDITOR = 'tinymce';