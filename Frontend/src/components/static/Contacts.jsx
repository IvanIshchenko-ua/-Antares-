import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, UserRound, Send, CheckCircle2, Sparkles } from 'lucide-react';
import signupService from '../../services/signupService';
import './Contacts.css';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Консультація щодо вступу',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupService.send({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        source: 'Форма контактів',
      });
      setSent(true);
    } catch (error) {
      console.error('Помилка надсилання заявки:', error);
      window.alert('Не вдалося надіслати повідомлення. Спробуйте ще раз.');
    }
    setTimeout(() => {
      setSent(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Консультація щодо вступу',
        message: ''
      });
    }, 4000);
  };

  return (
    <section className="contacts-section">
      <div className="contacts-container">
        <p className="contacts-subtitle">
          Ми завжди відкриті для спілкування, знайомства та консультацій.
          Завітайте до нашої школи або зв'яжіться з нами зручним способом:
        </p>

        <div className="contacts-grid">
          {/* Ліва колонка: Контактна інформація */}
          <div className="contact-info">
            <div className="info-item">
              <MapPin className="icon" />
              <div>
                <h3>Наша адреса</h3>
                <p>м. Умань, вул. Садова, 18, Черкаська обл.</p>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Центральна частина міста</span>
              </div>
            </div>

            <div className="info-item">
              <Phone className="icon" />
              <div>
                <h3>Телефони для довідок</h3>
                <p><strong>+38 (068) 106-06-03</strong></p>
                <p>+38 (04744) 5-67-89</p>
              </div>
            </div>

            <div className="info-item">
              <Mail className="icon" />
              <div>
                <h3>Електронна пошта</h3>
                <p>antares.school@ukr.net</p>
              </div>
            </div>

            <div className="info-item">
              <Clock className="icon" />
              <div>
                <h3>Графік роботи школи</h3>
                <p>Понеділок – П'ятниця: <strong>8:00 – 20:00</strong></p>
                <p>Субота: <strong>9:00 – 18:00</strong></p>
                <p>Неділя: вихідний</p>
              </div>
            </div>

            <div className="info-item">
              <UserRound className="icon" />
              <div>
                <h3>Директор школи</h3>
                <p><strong>Юрійчук Ганна Іванівна</strong></p>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Прийомні дні: щовівторка та щочетверга</p>
              </div>
            </div>
          </div>

          {/* Права колонка: Форма зворотного зв'язку */}
          <div className="contact-form-card" style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 10px 30px rgba(11, 47, 74, 0.06)',
            border: '1px solid #e2e8f0',
            textAlign: 'left'
          }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                  Повідомлення надіслано!
                </h3>
                <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
                  Дякуємо за звернення. Адміністрація школи «Антарес» відповість вам найближчим часом.
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0284c7' }}>
                  <Sparkles size={18} />
                  <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Швидкий зв'язок
                  </span>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', fontFamily: "'Montserrat Alternates', sans-serif" }}>
                  Надішліть нам запит
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
                  Маєте запитання щодо навчання чи вступу? Заповніть коротку форму, і ми надамо детальну консультацію.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Ваше ім'я *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Оксана Шевченко"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '15px',
                        background: '#f8fafc',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Номер телефону *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+38 (068) 000-00-00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '15px',
                        background: '#f8fafc',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Електронна пошта
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '15px',
                        background: '#f8fafc',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Тема звернення
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '15px',
                        background: '#f8fafc',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="Консультація щодо вступу">Консультація щодо вступу дитини</option>
                      <option value="Музичний відділ">Запитання про музичний відділ</option>
                      <option value="Художній відділ">Запитання про художній відділ</option>
                      <option value="Хореографічний відділ">Запитання про хореографію</option>
                      <option value="Інше питання">Інше запитання</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Ваше повідомлення
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Опишіть ваше запитання..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '15px',
                        background: '#f8fafc',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '16px',
                      padding: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '8px',
                      boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Send size={18} />
                    <span>Надіслати повідомлення</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
