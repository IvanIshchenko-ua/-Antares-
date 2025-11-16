
import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

const Home = () => {
  // Прості налаштування для тесту
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Спочатку 3 для тесту
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // Прості тестові зображення
  const testImages = [
    { id: 1, src: "../img/gallery1.jpg", alt: "Фото 1" },
    { id: 2, src: "../img/gallery2.jpg", alt: "Фото 2" },
    { id: 3, src: "../img/gallery3.jpg", alt: "Фото 3" },
    { id: 4, src: "../img/gallery4.jpg", alt: "Фото 4" },
    { id: 5, src: "../img/gallery5.jpg", alt: "Фото 5" },
    { id: 6, src: "../img/gallery6.jpg", alt: "Фото 6" },
    { id: 7, src: "../img/gallery7.jpg", alt: "Фото 7" },
    { id: 8, src: "../img/gallery8.webp", alt: "Фото 8" },
    { id: 9, src: "../img/gallery9.webp", alt: "Фото 9" }
  ];

  //console.log('Тестові зображення:', testImages); // Додамо лог для перевірки

  return (
    <div className="home-page">
      <section className="about">
        <div className="container">
          <div className="about-content">
            <img src="/img/about.jpg" alt="Про школу" />
            <div className="about-text">
              <h2>Ласкаво просимо до школи мистецтв «Антарес»</h2>
              <p>
                Наша школа - це сучасний освітній простір, де діти розкривають 
                свої творчі здібності та опановують різні види мистецтва.
              </p>
              <p>
                Ми пропонуємо навчання за різними напрямами: музика, образотворче 
                мистецтво, хореографія та театральне мистецтво.
              </p>
              <a href="/site/about" className="learn-more">Дізнатися більше</a>
            </div>
          </div>
        </div>
      </section>

      <section className="activities">
        <div className="container">
          <h2>Наші напрямки навчання</h2>
          <div className="activity-list">
            <div className="activity">
              <img src="/img/music.jpg" alt="Клавішні та фортепіанні відділи" />
              <h3>Музичний відділ</h3>
              <a href="/site/departments">Детальніше</a>
            </div>
            <div className="activity">
              <img src="/img/art.jpg" alt="Музичні інструменти та вокал" />
              <h3>Художній відділ</h3>
              <a href="/site/departments">Детальніше</a>
            </div>
            <div className="activity">
              <img src="/img/dance.jpg" alt="Художній відділ" />
              <h3>Хореографія</h3>
              <a href="/site/departments">Детальніше</a>
            </div>
          </div>
        </div>
      </section>

<section className="gallery">
  <div className="gallery-container">
    <h2>Галерея</h2>

    <Slider {...settings}>
      {testImages.map((image) => (
        <div key={image.id} style={{ padding: '0 15px' }}>
          <img 
            src={image.src} 
            alt={image.alt}
style={{ 
  width: '240px',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '12px'
}}
          />
        </div>
      ))}
    </Slider>

  </div>
</section>

    </div>
  );
};

export default Home;