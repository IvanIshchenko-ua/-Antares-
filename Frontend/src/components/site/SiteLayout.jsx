import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Music,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import signupService from '../../services/signupService';
import './SiteLayout.css';

const SiteLayout = ({ children }) => {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const isHomePage = location.pathname === '/site/home' || location.pathname === '/site';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    phone: '',
    department: 'Музичне мистецтво',
    message: ''
  });

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openSignupModal', handleOpenModal);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('openSignupModal', handleOpenModal);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navLinks = [
    { to: '/site/departments', label: 'Відділи' },
    { to: '/site/about', label: 'Про нас' },
    { to: '/site/gallery', label: 'Фото/Відео' },
    { to: '/site/news', label: 'Новини' },
    { to: '/site/transparency', label: 'Прозорість' },
    { to: '/site/contacts', label: 'Контакти' },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupService.send({
        name: formData.parentName,
        phone: formData.phone,
        childName: formData.childName,
        department: formData.department,
        message: formData.message,
        source: 'Модальне вікно запису',
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Помилка надсилання заявки:', error);
      window.alert('Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.');
    }
    // Auto reset after 4s
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setFormData({
        parentName: '',
        childName: '',
        phone: '',
        department: 'Музичне мистецтво',
        message: ''
      });
    }, 3500);
  };

  // Get current subpage meta
  const getSubpageMeta = () => {
    const path = location.pathname;
    if (path.includes('departments')) return { title: 'Відділи та програми', desc: 'Напрямки творчого навчання та наші викладачі', badge: 'Освітні програми' };
    if (path.includes('about')) return { title: 'Про школу «Антарес»', desc: 'Історія, традиції та педагогічний колектив школи', badge: 'Про заклад' };
    if (path.includes('gallery')) return { title: 'Фото та Відео галерея', desc: 'Найяскравіші моменти концертів, виставок та шкільного життя', badge: 'Творче життя' };
    if (path.includes('news')) return { title: 'Новини та оголошення', desc: 'Актуальні події, досягнення учнів та розклад заходів', badge: 'Шкільні новини' };
    if (path.includes('transparency')) return { title: 'Прозорість та відкритість', desc: 'Офіційні установчі документи, статут, звіти та структура', badge: 'Публічна інформація' };
    if (path.includes('contacts')) return { title: 'Контакти та зв’язок', desc: 'Адреса, телефони, графік роботи та форма для консультацій', badge: 'Зворотний зв’язок' };
    return { title: 'Уманська дитяча школа мистецтв «Антарес»', desc: '', badge: 'Школа мистецтв' };
  };

  const meta = getSubpageMeta();

  return (
    <div className="antares-site-wrapper">
      {/* HEADER / NAVIGATION */}
      <header className={`antares-header ${isScrolled ? 'scrolled' : (isHomePage ? 'transparent' : 'scrolled')}`}>
        <div className="header-inner">
          {/* Logo & Brand */}
          <Link to="/site/home" className="brand-link" title="На головну">
            <div className="brand-info">
              <span className="brand-wordmark">Antares</span>
              <span className="brand-tagline">school of mysticism</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link-item ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="header-actions">
            <button
              onClick={toggleLanguage}
              className="language-toggle"
              aria-label={language === 'uk' ? 'Switch to English' : 'Перемкнути на українську'}
            >
              <span className={language === 'uk' ? 'active' : ''}>UA</span>
              <span className="language-divider">/</span>
              <span className={language === 'en' ? 'active' : ''}>EN</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-cta-nav"
              aria-label="Записатися на урок"
            >
              <Sparkles size={16} />
              <span>Записатися</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-mobile-toggle"
              aria-label="Відкрити меню"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="brand-info">
            <span className="brand-wordmark">Antares</span>
            <span className="brand-tagline">school of mysticism</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="btn-mobile-toggle"
            aria-label="Закрити меню"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav-links">
          <Link to="/site/home" className={`mobile-nav-link ${location.pathname === '/site/home' ? 'active' : ''}`}>
            <span>Головна</span>
            <ChevronRight size={18} />
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              <span>{link.label}</span>
              <ChevronRight size={18} />
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setIsModalOpen(true);
          }}
          className="btn-hero-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Sparkles size={18} />
          <span>Записатися на урок</span>
        </button>
      </div>

      {/* HERO SECTION (ON HOME PAGE) OR SUBPAGE BANNER */}
      {isHomePage ? (
        <section className="hero-wrapper">
              <img src="/img/baner.jpg" alt="Школа мистецтв Антарес" className="hero-bg-media" fetchpriority="high" />
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={14} />
              <span>Офіційний сайт • Умань • Школа мистецтв</span>
            </div>

            <h1 className="hero-title">
              Уманська дитяча школа мистецтв <span className="hero-title-block">«Антарес»</span>
            </h1>

            <p className="hero-subtitle">
              Простір, де народжується натхнення, розкривається талант і звучить музика дитячих сердець.
              Професійне навчання музиці, хореографії, живопису та сценічному мистецтву.
            </p>

            <div className="hero-actions">
              <button onClick={() => setIsModalOpen(true)} className="btn-hero-primary">
                <Sparkles size={18} />
                <span>Записатися на урок</span>
              </button>

              <Link to="/site/departments" className="btn-hero-secondary">
                <Music size={18} />
                <span>Наші відділи</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick Stats Ribbon */}
            <div className="hero-stats-grid">
              <div className="hero-stat-card">
                <div className="stat-number">25+</div>
                <div className="stat-label">років творчої історії та досвіду</div>
              </div>
              <div className="hero-stat-card">
                <div className="stat-number">750+</div>
                <div className="stat-label">талановитих учнів навчаються щороку</div>
              </div>
              <div className="hero-stat-card">
                <div className="stat-number">4</div>
                <div className="stat-label">провідні творчі відділи школи</div>
              </div>
              <div className="hero-stat-card">
                <div className="stat-number">35+</div>
                <div className="stat-label">ансамблів та творчих колективів</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="subpage-banner">
          <div className="subpage-banner-inner">
            <span className="subpage-badge">{meta.badge}</span>
            <h1 className="subpage-title">{meta.title}</h1>
            {meta.desc && <p className="subpage-desc">{meta.desc}</p>}
          </div>
        </div>
      )}

      {/* MAIN BODY CONTENT */}
      <main className="site-main-content">
        {children}
      </main>

      {/* RICH MODERN FOOTER */}
      <footer className="antares-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Col 1: Brand & Mission */}
            <div className="footer-col-brand">
              <div className="footer-logo-wrap">
                <div className="footer-wordmark">
                  <span>Antares</span>
                  <small>school of mysticism</small>
                </div>
              </div>
              <p className="footer-about-text">
                Початковий спеціалізований мистецький навчальний заклад вищої категорії в м. Умань.
                Навчаємо дітей любити та творити мистецтво з 1999 року.
              </p>
              <div className="footer-social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Facebook">
                  f
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Instagram">
                  ig
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="YouTube">
                  yt
                </a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h3 className="footer-heading">Навігація</h3>
              <ul className="footer-links-list">
                <li><Link to="/site/home">Головна</Link></li>
                <li><Link to="/site/about">Про школу</Link></li>
                <li><Link to="/site/departments">Відділи та класи</Link></li>
                <li><Link to="/site/news">Новини та афіша</Link></li>
                <li><Link to="/site/gallery">Фото/Відео галерея</Link></li>
                <li><Link to="/site/transparency">Прозорість (документи)</Link></li>
              </ul>
            </div>

            {/* Col 3: Departments */}
            <div>
              <h3 className="footer-heading">Відділи</h3>
              <ul className="footer-links-list">
                <li><Link to="/site/departments">Музичне мистецтво</Link></li>
                <li><Link to="/site/departments">Фортепіанний відділ</Link></li>
                <li><Link to="/site/departments">Струнно-смичкові інструменти</Link></li>
                <li><Link to="/site/departments">Образотворче мистецтво</Link></li>
                <li><Link to="/site/departments">Хореографічне відділення</Link></li>
                <li><Link to="/site/departments">Театральне та хорове</Link></li>
              </ul>
            </div>

            {/* Col 4: Contacts */}
            <div>
              <h3 className="footer-heading">Контакти</h3>
              <ul className="footer-contacts-list">
                <li className="footer-contact-item">
                  <MapPin size={18} />
                  <span>м. Умань, вул. Садова, 18, Черкаська обл.</span>
                </li>
                <li className="footer-contact-item">
                  <Phone size={18} />
                  <span>+38 (068) 106-06-03<br />+38 (04744) 5-67-89</span>
                </li>
                <li className="footer-contact-item">
                  <Mail size={18} />
                  <span>antares.school@ukr.net</span>
                </li>
                <li className="footer-contact-item">
                  <Clock size={18} />
                  <span>Пн-Пт: 8:00 – 20:00<br />Сб: 9:00 – 18:00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div>
              © {new Date().getFullYear()} Уманська дитяча школа мистецтв «Антарес». Всі права захищено.
            </div>
            <div>
              <Link to="/login" style={{ opacity: 0.5, fontSize: '12px' }}>Панель адміністратора</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* APPLICATION / CONSULTATION MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} aria-label="Закрити">
              <X size={20} />
            </button>

            {submitted ? (
              <div className="modal-success-box">
                <div className="modal-success-icon">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="modal-title">Заявку прийнято!</h3>
                <p className="modal-desc">
                  Дякуємо за інтерес до школи мистецтв «Антарес». Наш адміністратор зв'яжеться з вами найближчим часом для узгодження зручного часу знайомства.
                </p>
                <button
                  className="btn-modal-submit"
                  onClick={() => {
                    setSubmitted(false);
                    setIsModalOpen(false);
                  }}
                >
                  Зрозуміло
                </button>
              </div>
            ) : (
              <div>
                <div className="modal-header-icon">
                  <Sparkles size={24} />
                </div>
                <h3 className="modal-title">Запис на знайомство з школою</h3>
                <p className="modal-desc">
                  Залиште свої контакти, і ми запросимо вас та вашу дитину на пробне творче прослуховування або екскурсію.
                </p>

                <form onSubmit={handleFormSubmit}>
                  <div className="modal-form-group">
                    <label className="modal-label">Ваше ім'я (одного з батьків) *</label>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="Олена Іванівна"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Ім'я та вік дитини</label>
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="Максим, 8 років"
                      value={formData.childName}
                      onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Контактний номер телефону *</label>
                    <input
                      type="tel"
                      className="modal-input"
                      placeholder="+38 (068) 000-00-00"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="modal-label">Напрямок, що цікавить</label>
                    <select
                      className="modal-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Музичне мистецтво">Музичне мистецтво (фортепіано, струнні, духові, вокал)</option>
                      <option value="Образотворче мистецтво">Образотворче мистецтво (живопис, ліпка, малюнок)</option>
                      <option value="Хореографічне мистецтво">Хореографія (сучасний, народний, класичний танець)</option>
                      <option value="Театральне мистецтво">Театральне та хорове мистецтво</option>
                      <option value="Не визначились">Ще не визначилися (потрібна консультація)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-modal-submit">
                    Надіслати заявку
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteLayout;