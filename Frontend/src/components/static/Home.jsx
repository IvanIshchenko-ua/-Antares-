import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Music,
  Palette,
  GraduationCap,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Calendar,
  ShieldCheck,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { newsService } from '../../services/newsService';
import './Home.css';

const Home = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const galleryTrackRef = useRef(null);

  // Load 3 latest news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getAllNews();
        const items = Array.isArray(response.data) ? response.data : (response.data?.news || []);
        // Sort descending or take latest 3
        setLatestNews(items.slice(0, 3));
      } catch (err) {
        // Fallback default news if backend empty
        setLatestNews([
          {
            id: 1,
            title: 'Весняний звітний концерт учнів школи «Антарес»',
            shortDescription: 'Запрошуємо батьків та гостей міста на щорічне свято музики, хореографії та дитячої творчості.',
            date: '2026-05-15',
            image: '/img/orchestra.jpg',
          },
          {
            id: 2,
            title: 'Перемога наших юних художників на всеукраїнському конкурсі',
            shortDescription: 'Учні художнього відділення вибороли гран-прі та перші місця на виставці «Барви рідного краю».',
            date: '2026-04-20',
            image: '/img/arts.jpg',
          },
          {
            id: 3,
            title: 'Відкрито набір на новий навчальний рік',
            shortDescription: 'Розпочато прийом заяв на прослуховування та творчі співбесіди до всіх відділень школи.',
            date: '2026-04-01',
            image: '/img/piano2.jpg',
          },
        ]);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const track = galleryTrackRef.current;
    if (!track) return undefined;

    const moveGallery = () => {
      const firstSlide = track.querySelector('.gallery-slide-item');
      if (!firstSlide || track.scrollWidth <= track.clientWidth) return;

      const slideStep = firstSlide.getBoundingClientRect().width + 20;
      const nextPosition = track.scrollLeft + slideStep;
      const maxPosition = track.scrollWidth - track.clientWidth;
      track.scrollTo({
        left: nextPosition >= maxPosition - 2 ? 0 : nextPosition,
        behavior: 'smooth',
      });
    };

    const intervalId = window.setInterval(moveGallery, 4000);
    return () => window.clearInterval(intervalId);
  }, []);

  const openSignup = () => {
    window.dispatchEvent(new CustomEvent('openSignupModal'));
  };

  const galleryItems = [
    { id: 1, src: '/img/orchestra.jpg', title: 'Оркестр народних інструментів' },
    { id: 2, src: '/img/dance.jpg', title: 'Хореографічний ансамбль' },
    { id: 3, src: '/img/piano2.jpg', title: 'Фортепіанний виступ' },
    { id: 4, src: '/img/arts.jpg', title: 'Виставка юних художників' },
    { id: 5, src: '/img/gallery1.jpg', title: 'Урок музики' },
    { id: 6, src: '/img/gallery2.jpg', title: 'Творчий процес' },
    { id: 7, src: '/img/gallery3.jpg', title: 'Шкільний концерт' },
    { id: 8, src: '/img/gallery4.jpg', title: 'Хореографічний клас' },
  ];

  const departments = [
    {
      id: 'music',
      title: 'Музичне мистецтво',
      tag: 'Фортепіано, струнні, вокал',
      image: '/img/piano2.jpg',
      desc: 'Оволодіння музичними інструментами, академічний та естрадний вокал, сольфеджіо та участь у зведених ансамблях.',
    },
    {
      id: 'art',
      title: 'Образотворче мистецтво',
      tag: 'Живопис, графіка, скульптура',
      image: '/img/arts.jpg',
      desc: 'Розвиток образного мислення, робота з різноманітними матеріалами, композиція, історія мистецтв та участь у виставках.',
    },
    {
      id: 'dance',
      title: 'Хореографічне мистецтво',
      tag: 'Класичний та сучасний танець',
      image: '/img/dance.jpg',
      desc: 'Пластика, постава, розвиток ритміки, класичний тренаж, народно-сценічний танець та виступи на великій сцені.',
    },
    {
      id: 'theatre',
      title: 'Театральне та хорове',
      tag: 'Акторська майстерність, хор',
      image: '/img/orchestra.jpg',
      desc: 'Сценічна мова, основи драматичного мистецтва, хоровий спів та розкриття впевненості перед глядачами.',
    },
  ];

  const advantages = [
    {
      icon: <GraduationCap size={28} />,
      title: 'Державне свідоцтво',
      desc: 'Офіційний диплом про позашкільну мистецьку освіту, що надає переваги для вступу у профільні коледжі та виші.',
    },
    {
      icon: <Award size={28} />,
      title: 'Зіркові викладачі',
      desc: 'Понад 50 викладачів вищої категорії, практикуючих митців та закоханих у педагогіку наставників.',
    },
    {
      icon: <Users size={28} />,
      title: '35+ творчих колективів',
      desc: 'Участь у відомих ансамблях, хорах та оркестрах, де діти навчаються дружити та творити разом.',
    },
    {
      icon: <Sparkles size={28} />,
      title: 'Сцена з перших кроків',
      desc: 'Регулярні концерти, виставки у галереях міста, всеукраїнські та міжнародні фестивалі й конкурси.',
    },
  ];

  return (
    <div className="home-page">
      {/* 1. ABOUT SECTION */}
      <section className="home-about-section">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <img
                src="/img/orchestra.jpg"
                alt="Учні та оркестр школи Антарес"
                className="about-main-img"
              />
              <div className="about-float-badge">
                <div className="badge-icon-box">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="badge-title">Вища категорія</div>
                  <div className="badge-desc">Акредитований заклад</div>
                </div>
              </div>
            </div>

            <div className="about-content-col">
              <div className="section-badge">
                <Sparkles size={14} />
                <span>Про наш заклад</span>
              </div>

              <h2>Ласкаво просимо до школи мистецтв «Антарес»</h2>

              <p className="about-lead-text">
                Унікальним надбанням Умані мистецької є <strong>Уманська дитяча школа мистецтв «Антарес»</strong> —
                один із найбільших та найуспішніших позашкільних закладів Черкащини з контингентом понад <strong>750 учнів</strong>.
              </p>

              <p className="about-sub-text">
                Наша місія — не просто навчити техніці гри чи малювання, а запалити у серці дитини любов до прекрасного,
                дати впевненість на сцені та відкрити шлях до гармонійного розвитку особистості.
              </p>

              <div className="about-highlights">
                <div className="highlight-row">
                  <div className="highlight-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="highlight-text">Індивідуальний підхід до кожної дитини з урахуванням її природних задатків</span>
                </div>
                <div className="highlight-row">
                  <div className="highlight-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="highlight-text">Сучасні освітні програми та комфортні класи в центрі Умані</span>
                </div>
                <div className="highlight-row">
                  <div className="highlight-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="highlight-text">Підготовка до вступу у провідні творчі коледжі та академії</span>
                </div>
              </div>

              <Link to="/site/about" className="btn-about-link">
                <span>Дізнатися більше про школу</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEPARTMENTS SECTION */}
      <section className="home-departments-section">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-badge">
              <Palette size={14} />
              <span>Освітні напрямки</span>
            </div>
            <h2 className="section-title">Оберіть творчий напрямок для вашої дитини</h2>
            <p className="section-subtitle">
              У школі діють 4 основні відділення, де кожен знайде свій улюблений вид мистецтва під керівництвом досвідчених педагогів.
            </p>
          </div>

          <div className="departments-cards-grid">
            {departments.map((dept) => (
              <Link to="/site/departments" key={dept.id} className="department-card">
                <div className="dept-img-wrap">
                  <img src={dept.image} alt={dept.title} />
                  <span className="dept-card-tag">{dept.tag}</span>
                </div>
                <div className="dept-card-body">
                  <h3 className="dept-card-title">{dept.title}</h3>
                  <p className="dept-card-desc">{dept.desc}</p>
                  <div className="dept-card-footer">
                    <span>Детальніше про відділ</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ADVANTAGES SECTION */}
      <section className="home-advantages-section">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-badge">
              <Award size={14} />
              <span>Наші переваги</span>
            </div>
            <h2 className="section-title">Чому батьки та учні обирають «Антарес»</h2>
            <p className="section-subtitle">
              Ми створюємо найкращі умови, щоб роки навчання стали для дитини яскравим і незабутнім періодом дитинства.
            </p>
          </div>

          <div className="advantages-grid">
            {advantages.map((adv, idx) => (
              <div key={idx} className="advantage-card">
                <div className="advantage-icon-box">{adv.icon}</div>
                <h3>{adv.title}</h3>
                <p>{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEWS SECTION */}
      <section className="home-news-section">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-badge">
              <Calendar size={14} />
              <span>Життя школи</span>
            </div>
            <h2 className="section-title">Останні новини та події</h2>
            <p className="section-subtitle">
              Слідкуйте за виступами, досягненнями учнів, оголошеннями та творчими святами нашої школи.
            </p>
          </div>

          <div className="news-preview-grid">
            {latestNews.map((item) => (
              <Link to={`/site/news/${item.id}`} key={item.id} className="news-preview-card">
                <div className="news-thumb-wrap">
                  <img
                    src={item.image || item.image_url || '/img/orchestra.jpg'}
                    alt={item.title}
                    onError={(e) => { e.target.src = '/img/orchestra.jpg'; }}
                  />
                  <div className="news-date-badge">
                    <Calendar size={12} />
                    <span>{item.date ? new Date(item.date).toLocaleDateString('uk-UA') : 'Нещодавно'}</span>
                  </div>
                </div>
                <div className="news-card-body">
                  <h3 className="news-card-title">{item.title}</h3>
                  <p className="news-card-excerpt">
                    {item.shortDescription || item.description || 'Творчі новини школи мистецтв Антарес.'}
                  </p>
                  <div className="news-card-more">
                    <span>Читати новину</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="news-center-btn">
            <Link to="/site/news" className="btn-all-news">
              <span>Переглянути всі новини</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. GALLERY SECTION */}
      <section className="home-gallery-section">
        <div className="section-container">
          <div className="section-header-center" style={{ marginBottom: '30px' }}>
            <div className="section-badge">
              <Heart size={14} />
              <span>Фотомиті</span>
            </div>
            <h2 className="section-title">Галерея творчих досягнень</h2>
            <p className="section-subtitle">
              Емоції, концерти, виставки та натхнення на кожному уроці.
            </p>
          </div>

          <div className="gallery-slider-wrap">
            <div className="gallery-slider-track" ref={galleryTrackRef}>
              {galleryItems.map((img) => (
                <div key={img.id} className="gallery-slide-item">
                  <div className="gallery-slide-card">
                    <img src={img.src} alt={img.title} />
                    <div className="gallery-slide-overlay">
                      <span>{img.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="home-cta-section">
        <div className="section-container">
          <div className="cta-banner-box">
            <div className="cta-banner-inner">
              <h2>Подаруйте дитині радість творчості та впевненість у собі</h2>
              <p>
                Завітайте до школи «Антарес» на ознайомчу зустріч або прослуховування.
                Наші викладачі з радістю допоможуть визначити творчі здібності та обрати найкращий напрямок!
              </p>
              <div className="cta-buttons-wrap">
                <button onClick={openSignup} className="btn-hero-primary">
                  <Sparkles size={18} />
                  <span>Записатися на консультацію</span>
                </button>
                <Link to="/site/contacts" className="btn-hero-secondary">
                  <span>Контакти та адреса</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;