import React from 'react';
import {
  Award,
  Users,
  Sparkles,
  GraduationCap,
  Music,
  Palette,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page-container">
      {/* HERO CARD */}
      <div className="about-hero-card">
        <div className="about-hero-img-wrap">
          <img
            src="/img/orchestra.jpg"
            alt="Школа мистецтв Антарес"
            className="about-hero-img"
          />
        </div>
        <div className="about-hero-text">
          <p className="about-hero-lead">Ми — одна із найкращих шкіл мистецтв області!</p>
          <h2>Уманська дитяча школа мистецтв «Антарес»</h2>
          <p className="about-hero-desc">
            Унікальним надбанням Умані мистецької є навчальний заклад <strong>«Антарес»</strong> —
            один із найбільших початкових спеціалізованих мистецьких навчальних закладів Черкащини
            з контингентом понад <strong>750 учнів</strong>.
          </p>
          <p className="about-hero-desc" style={{ marginTop: '12px' }}>
            Ми досягаємо визначних успіхів, об'єднавши надзвичайно творчих, висококваліфікованих викладачів
            та талановитих учнів у єдину велику мистецьку родину.
          </p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="about-stats-row">
        <div className="about-stat-box">
          <div className="about-stat-icon">
            <Users size={28} />
          </div>
          <div className="about-stat-value">750+</div>
          <div className="about-stat-label">Учнів щорічно відкривають свій талант</div>
        </div>

        <div className="about-stat-box">
          <div className="about-stat-icon">
            <Music size={28} />
          </div>
          <div className="about-stat-value">35+</div>
          <div className="about-stat-label">Вокальних та інструментальних колективів</div>
        </div>

        <div className="about-stat-box">
          <div className="about-stat-icon">
            <Award size={28} />
          </div>
          <div className="about-stat-value">150+</div>
          <div className="about-stat-label">Лауреатів та переможців конкурсів щороку</div>
        </div>

        <div className="about-stat-box">
          <div className="about-stat-icon">
            <GraduationCap size={28} />
          </div>
          <div className="about-stat-value">100%</div>
          <div className="about-stat-label">Державне свідоцтво про освіту</div>
        </div>
      </div>

      {/* STORIES / DETAILS */}
      <div className="about-story-section">
        <div className="story-card">
          <h3>
            <Music size={22} color="#0284c7" />
            <span>Музичні та хореографічні традиції</span>
          </h3>
          <p>
            У школі працюють музичні відділення (сольно–хорове мистецтво та гра на різноманітних музичних інструментах:
            фортепіано, скрипка, віолончель, гітара, баян, акордеон, духові та ударні).
          </p>
          <p>
            Гордістю закладу є колективи: оркестр народних інструментів, ансамбль скрипалів, віолончелістів, хори
            старших та молодших класів, а також відомі вокальні ансамблі: «Перлина», «Оксамит», «Жарптиця», «Глорія»,
            «Камелія», «Дивограй», «Смайл», «Веселкограй», «Мальви», «Краплинки», «Промінь», «Соколики».
          </p>
        </div>

        <div className="story-card">
          <h3>
            <Palette size={22} color="#0284c7" />
            <span>Художня виставкова діяльність</span>
          </h3>
          <p>
            Щорічні масштабні звітні виставки учнів художнього відділу в міському Художньому музеї
            налічують понад <strong>150 картин</strong>, скульптур та декоративних виробів.
          </p>
          <p>
            Найкращі учні школи мають змогу навчатися безкоштовно за визначні успіхи та здобутки.
            Випускники отримують свідоцтво державного зразка, яке стає міцним фундаментом для вступу
            до фахових мистецьких коледжів та вишів України і зарубіжжя.
          </p>
        </div>
      </div>

      {/* QUOTE BANNER */}
      <div className="about-quote-box">
        <p className="about-quote-text">
          «Ми бажаємо майбутнім учням та їх батькам відкрити для себе неповторний, яскравий та захоплюючий
          світ мистецтва в Уманській дитячій школі мистецтв «Антарес»!»
        </p>
        <span className="about-quote-author">Колектив викладачів та адміністрація школи «Антарес»</span>
      </div>
    </div>
  );
};

export default About;
