import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './TransparencySection.css';

const TransparencySection = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);

useEffect(() => {
  loadTransparencySections();
}, []);

const loadTransparencySections = async () => {
  try {
    const response = await api.get('/transparency');
    const data = response.data;
    console.log('✅ Transparency data:', data);
    const sectionsList = Array.isArray(data) ? data : (data?.items || data?.sections || []);
    setSections(sectionsList);
  } catch (error) {
    console.error('❌ Помилка завантаження розділів прозорості:', error);
    setSections([]);
  }
};

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSection(null);
  };

  return (
    <section id="transparency" className="transparency-section">
      <div className="container">
        <h2 className="section-title">Прозорість і інформаційна відкритість</h2>
        <div className="transparency-grid">
          {sections.map(section => (
            <div key={section.id} className="transparency-card">
              <div className="card-body">
                <h3 className="card-title">{section.title}</h3>
                <div className="card-actions">
                  <button 
                    className="btn-transparency"
                    onClick={() => handleSectionClick(section)}
                  >
                    Читати
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальне вікно */}
      {showModal && selectedSection && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedSection.title}</h3>
            </div>
            <div className="modal-body">
              {selectedSection.content ? (
                <div 
                  className="transparency-content"
                  dangerouslySetInnerHTML={{ __html: selectedSection.content }}
                />
              ) : (
                <p className="no-content">Інформація буде додана найближчим часом.</p>
              )}
              
              {selectedSection.documents && selectedSection.documents.length > 0 && (
                <div className="documents-section">
                  <h4>Документи:</h4>
                  <div className="documents-list">
                    {selectedSection.documents.map((doc, index) => (
                      <div key={index} className="document-item">
                        <span className="document-icon">📄</span>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          {doc.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={closeModal}>
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TransparencySection;