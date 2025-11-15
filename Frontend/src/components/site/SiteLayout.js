import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SiteLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/site/home';

  useEffect(() => {
    const initializeScripts = () => {
      // Dropdown функціонал
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
          dropdown.querySelector('.dropdown-content').style.display = 'block';
        });
        dropdown.addEventListener('mouseleave', () => {
          dropdown.querySelector('.dropdown-content').style.display = 'none';
        });
      });

      // Модальні вікна
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.style.display = 'none';
          }
        });
      });

      const closeButtons = document.querySelectorAll('.modal .close');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          button.closest('.modal').style.display = 'none';
        });
      });
    };

    initializeScripts();

    return () => {
      // Cleanup
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.removeEventListener('mouseenter', () => {});
        dropdown.removeEventListener('mouseleave', () => {});
      });
    };
  }, [location]);

  return (
    <div className="antares-site">
      <header>
        {isHomePage ? (
          // Повний хедер з банером для головної сторінки
          <div className="header-image">
            <img src="/img/baner.jpg" alt="Школа мистецтв Антарес" />
            <nav className="main-nav">
              <div className="nav-left">
                <Link to="/site/departments">Відділи</Link>
                <Link to="/site/about">Про нас</Link>
                <Link to="/site/gallery">Фото/Відео</Link>
                <Link to="/site/news">Новини</Link>
              </div>
              
              <div className="nav-center">
                <Link to="/site/home">
                  <img src="/img/logo_nav.png" alt="Лого Антарес" className="logo" />
                </Link>
              </div>
              
              <div className="nav-right">
                <Link to="/site/transparency">Прозорість</Link>
                {/* Прибрано "Події" */}
                <Link to="/site/contacts">Контакти</Link>
              </div>
            </nav>
            
            <h1>Уманська дитяча школа мистецтв «Антарес»</h1>
            
            <div className="promo-banner">
              <span className="promo-text">Ознайомчий безкоштовний урок</span>
              <a 
                href="https://forms.gle/ВАШ_ЛІНК" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="promo-button"
              >
                Записатись
              </a>
            </div>
          </div>
        ) : (
          // Простий хедер без банера для всіх інших сторінок
          <div className="simple-header">
            <nav className="main-nav">
              <div className="nav-left">
                <Link to="/site/departments">Відділи</Link>
                <Link to="/site/about">Про нас</Link>
                <Link to="/site/gallery">Фото/Відео</Link>
                <Link to="/site/news">Новини</Link>
              </div>
              
              <div className="nav-center">
                <Link to="/site/home">
                  <img src="/img/logo_nav.png" alt="Лого Антарес" className="logo" />
                </Link>
              </div>
              
              <div className="nav-right">
                <Link to="/site/transparency">Прозорість</Link>
                {/* Прибрано "Події" */}
                <Link to="/site/contacts">Контакти</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className={isHomePage ? '' : 'simple-main'}>
        {children}
      </main>

      <footer>
        <div className="container">
          © {new Date().getFullYear()} Уманська дитяча школа мистецтв «Антарес». Всі права захищені.
        </div>
      </footer>

      {/* Модальні вікна */}
      <div id="signupModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <h2>Записатись на урок</h2>
          <form>
            <input type="text" placeholder="Ваше ім'я" required />
            <input type="tel" placeholder="Телефон" required />
            <input type="email" placeholder="Email" required />
            <button type="submit">Відправити</button>
          </form>
        </div>
      </div>

      <div id="tuitionModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <h2>Плата за навчання</h2>
          <p>Інформація про оплату навчання...</p>
        </div>
      </div>

      <div id="statuteModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <h2>Статут школи</h2>
          <p>Статут школи мистецтв "Антарес"...</p>
        </div>
      </div>

      <div id="attestationModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <h2>Атестація педагогічних працівників</h2>
          <p>Інформація про атестацію...</p>
        </div>
      </div>
    </div>
  );
};

export default SiteLayout;