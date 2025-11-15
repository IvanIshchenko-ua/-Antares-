import React from 'react';
import { MapPin, Phone, Mail, Clock, UserRound } from 'lucide-react'; // красиві іконки
import './Contacts.css';

const Contacts = () => {
  return (
    <section className="contacts-section">
      <div className="contacts-container">
        <p className="contacts-subtitle">
          Ми завжди відкриті для спілкування та нових знайомств.  
          Зв'яжіться з нами будь-яким зручним способом 👇
        </p>

        <div className="contacts-grid">
          {/* Ліва колонка */}
          <div className="contact-info">
            <div className="info-item">
              <MapPin className="icon" />
              <div>
                <h3>Наша адреса</h3>
                <p>м. Умань, вул. Садова, 18</p>
              </div>
            </div>

            <div className="info-item">
              <Phone className="icon" />
              <div>
                <h3>Телефони</h3>
                <p>+38 (04744) 5-67-89</p>
                <p>+38 (068) 106-06-03 </p>
              </div>
            </div>

            <div className="info-item">
              <Mail className="icon" />
              <div>
                <h3>Email</h3>
                <p>antares.school@ukr.net</p>
              </div>
            </div>

            <div className="info-item">
              <Clock className="icon" />
              <div>
                <h3>Години роботи</h3>
                <p>Пн-Пт: 8:00 – 20:00</p>
                <p>Сб: 9:00 – 18:00</p>
                <p>Нд: вихідний</p>
              </div>
            </div>

            <div className="info-item">
              <UserRound className="icon" />
              <div>
                <h3>Директор</h3>
                <p>Юрійчук Ганна Іванівна</p>
              </div>
            </div>
          </div>
     

          {/* Права колонка */}
  <div className="contact-form">
  <h3>Зв'яжіться з нами 💬</h3>
  <p>
    Ми завжди відкриті до спілкування.  
    Ви можете залишити запит або повідомлення через нашу Google-форму 👇
  </p>

  <a
    href="https://forms.gle/ТВОЄ_ПОСИЛАННЯ"  // 🔗 встав сюди справжнє посилання на Google Form
    target="_blank"
    rel="noopener noreferrer"
    className="google-form-btn"
  >
    Відкрити Google Форму
  </a>
</div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
