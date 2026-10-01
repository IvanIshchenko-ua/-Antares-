import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, Users, BookOpen, Clock, GraduationCap } from 'lucide-react';
import './Departments.css';

/* ─── Helpers ─────────────────────────────────────── */
const pluralYears = (n) => {
  const v = Math.abs(n) % 100;
  const v1 = v % 10;
  if (v > 10 && v < 20) return `${n} років`;
  if (v1 > 1 && v1 < 5) return `${n} роки`;
  if (v1 === 1) return `${n} рік`;
  return `${n} років`;
};

/* ─── Department data ─────────────────────────────── */
const departments = [
  {
    id: 1,
    tag: 'Музика',
    name: 'Фортепіано І',
    shortName: 'Фортепіано',
    description: 'Початкове та середнє навчання гри на фортепіано. Індивідуальний підхід до кожного учня.',
    programs: ['Індивідуальні уроки', 'Ансамбль', 'Сольні виступи', 'Концертна практика'],
    image: '/img/piano1.jpg',
    students: 80,
    longText:
      "Фортепіано — дивовижний інструмент, який дозволяє розслабитися та заспокоїтися, незалежно від того, слухаєте ви музику чи граєте самі. Дітям у ранньому віці вчитися грати на фортепіано дуже корисно: учні розвивають різноманітні навички, уроки дають багато переваг з точки зору поведінки та здоров'я на майбутнє. На відділі фортепіано-1 працює 8 викладачів та навчається 80 учнів.",
    teachersCount: 8,
    teachers: [
      { name: 'Ковальчук Людмила Петрівна', title: 'Завідуюча відділом, викладач І категорії, старший викладач, концертмейстер', experience: 40, photo: '/img/t1.jpg' },
      { name: 'Ільюшина Тетяна Олександрівна', title: 'Концертмейстер', experience: 24, photo: '/img/t2.jpg' },
      { name: 'Коваль Лілія Володимирівна', title: 'Концертмейстер', experience: 22, photo: '/img/t3.jpg' },
      { name: 'Ларжевська Ірина Іванівна', title: 'Викладач', experience: 35, photo: '/img/t4.jpg' },
      { name: 'Павленко Ніна Петрівна', title: 'Викладач I категорії', experience: 40, photo: '/img/t5.jpg' },
    ],
  },
  {
    id: 2,
    tag: 'Музика',
    name: 'Фортепіано ІІ',
    shortName: 'Фортепіано',
    description: 'Поглиблена підготовка та конкурсні програми. Майстер-класи від провідних піаністів.',
    programs: ['Майстер-класи', 'Конкурсні програми', 'Ансамблева гра', 'Концертмейстерство'],
    image: '/img/piano2.jpg',
    students: 74,
    longText:
      "Одна із переваг уроків фортепіано для маленьких дітей — розвиток мозку та психічного здоров'я. Вираження емоцій через інструмент допомагає дітям зняти стрес в душі та тілі. Гра на музичному інструменті дає змогу підвищити почуття впевненості, задоволення, що піднімає самооцінку. На відділі фортепіано-2 працює вісім викладачів та навчається 74 учня.",
    teachersCount: 8,
    teachers: [
      { name: 'Хмелевська Анна Вікторівна', title: 'Завідуюча відділом, викладач І категорії', experience: 10, photo: '/img/t6.jpg' },
      { name: 'Шапар Світлана Юріївна', title: 'Викладач ІІ категорії', experience: 35, photo: '/img/t7.jpg' },
    ],
  },
  {
    id: 3,
    tag: 'Оркестр',
    name: 'Відділ оркестрових інструментів',
    shortName: 'Оркестрові',
    description: 'Струнні, духові та ударні інструменти. Скрипка, флейта, гітара, баян, бандура та інші.',
    programs: ['Скрипка', 'Віолончель', 'Флейта', 'Кларнет', 'Труба', 'Ударні', 'Гітара', 'Бандура'],
    image: '/img/orchestra.jpg',
    students: 102,
    longText:
      "Різноманітний за своїм складом відділ оркестрових інструментів налічує 14 викладачів, які професійно, з натхненням та любов'ю навчають дітей грі на ударних, духових інструментах, бандурі, скрипці, віолончелі, домрі та гітарі, баяні та акордеоні. На відділі навчається 102 учня.",
    teachersCount: 14,
    teachers: [
      { name: 'Кулічов Павло Михайлович', title: 'Завідуючий відділом, викладач вищої категорії, методист', experience: 27, photo: '/img/t8.jpg' },
      { name: 'Козій Інна В\'ячеславівна', title: 'Викладач по класу віолончелі', experience: 28, photo: '/img/t9.jpg' },
      { name: 'Лапинюк Володимир Володимирович', title: 'Викладач по класу баяна', experience: 40, photo: '/img/t10.jpg' },
    ],
  },
  {
    id: 4,
    tag: 'Вокал',
    name: 'Відділ сольного співу',
    shortName: 'Вокал',
    description: 'Академічний та естрадний вокал, вокальні ансамблі. Участь у міжнародних конкурсах.',
    programs: ['Академічний вокал', 'Естрадний спів', 'Вокальні ансамблі', 'Сценічна майстерність'],
    image: '/img/vocal.jpg',
    students: 88,
    longText:
      "На даний момент у закладі існує відділ сольно-хорового співу, на якому працює 5 викладачів та два концертмейстери. На відділі навчається 88 учнів, які беруть участь у загальноміських, обласних та міжнародних конкурсах. Діти отримують перемоги на цих заходах, що говорить про гарну підготовку учнів та високий професіоналізм викладачів.",
    teachersCount: 7,
    teachers: [
      { name: 'Опаріна Тамара Олексіївна', title: 'Викладач вищої категорії, старший викладач', experience: 31, photo: '/img/t11.jpg' },
    ],
  },
  {
    id: 5,
    tag: 'Теорія',
    name: 'Музично-теоретичні дисципліни',
    shortName: 'Теорія',
    description: 'Сольфеджіо, гармонія, музична література. Підготовка до олімпіад та конкурсів.',
    programs: ['Сольфеджіо', 'Гармонія', 'Музична література', 'Олімпіади'],
    image: '/img/theory.jpg',
    students: 60,
    longText:
      "Відділ музично-теоретичних дисциплін є невід'ємною складовою в музичній освіті. Багато років під керівництвом Кулієвої Т.М. викладачі відділу шукають цікаві та доступні форми роботи та викладання матеріалу для учнів. Результат праці — щорічні перемоги шкільної команди на обласних олімпіадах.",
    teachersCount: 5,
    teachers: [
      { name: 'Кулієва Тетяна Миколаївна', title: 'Завідуюча відділом, старший викладач', experience: 39, photo: '/img/t12.jpg' },
      { name: 'Любич Інна Дмитрівна', title: 'Викладач І категорії', experience: 28, photo: '/img/t13.jpg' },
    ],
  },
  {
    id: 6,
    tag: 'Мистецтво',
    name: 'Мистецький відділ',
    shortName: 'Образотворче мистецтво',
    description: 'Живопис, графіка, ліпка та декоративне мистецтво. Участь у виставках і конкурсах.',
    programs: ['Живопис', 'Графіка', 'Ліпка', 'Декоративне мистецтво', 'Хореографія'],
    image: '/img/arts.jpg',
    students: 111,
    longText:
      "Мистецький відділ налічує 111 учнів, які навчаються відчути музику навколишнього світу, бачити прекрасне, опановують різні види техніки образотворчого мистецтва. За бажанням, можуть навчитися грати на музичному інструменті, танцювати. А в цьому їм допоможуть креативні, талановиті та досвідчені викладачі.",
    teachersCount: 6,
    teachers: [
      { name: 'Шишковська Зоя Григорівна', title: 'Завідуюча відділом, викладач вищої категорії', experience: 24, photo: '/img/t14.jpg' },
      { name: 'Довгань Марина Григорівна', title: 'Викладач по класу хореографії', experience: 10, photo: '/img/t15.jpg' },
      { name: 'Чернишенко Людмила Олексіївна', title: 'Викладач вищої категорії, старший викладач', experience: 27, photo: '/img/t16.jpg' },
      { name: 'Юрійчук Ганна Іванівна', title: 'Викладач вищої категорії, методист', experience: 20, photo: '/img/t17.jpg' },
    ],
  },
];

/* ─── Modal ───────────────────────────────────────── */
const DeptModal = ({ dept, onClose }) => {
  const bodyRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!dept) return null;

  const totalExp = dept.teachers.length > 0
    ? Math.round(dept.teachers.reduce((s, t) => s + t.experience, 0) / dept.teachers.length)
    : 0;

  return (
    <div
      className="dept-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dept-modal-title"
    >
      <div className="dept-modal-card">
        {/* Hero image */}
        <div className="dept-modal-hero">
          <img
            src={dept.image}
            alt={dept.name}
            onError={(e) => { e.target.src = '/img/baner.jpg'; }}
          />
          <div className="dept-modal-hero-overlay" />
          <div className="dept-modal-hero-content">
            <span className="dept-modal-hero-tag">{dept.tag}</span>
            <h2 id="dept-modal-title" className="dept-modal-hero-title">{dept.name}</h2>
          </div>
          <button className="dept-modal-close" onClick={onClose} aria-label="Закрити">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="dept-modal-body" ref={bodyRef}>
          {/* Stats */}
          <div className="dept-modal-stats">
            <div className="dept-modal-stat">
              <div className="dept-modal-stat-value">{dept.students}+</div>
              <div className="dept-modal-stat-label">учнів навчається</div>
            </div>
            <div className="dept-modal-stat">
              <div className="dept-modal-stat-value">{dept.teachersCount}</div>
              <div className="dept-modal-stat-label">викладачів</div>
            </div>
            <div className="dept-modal-stat">
              <div className="dept-modal-stat-value">{totalExp}р</div>
              <div className="dept-modal-stat-label">середній стаж</div>
            </div>
          </div>

          {/* Programs */}
          <div className="dept-modal-programs-row">
            {dept.programs.map((p, i) => (
              <span key={i} className="dept-modal-program-chip">
                <BookOpen size={12} />
                {p}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="dept-modal-desc">{dept.longText}</p>

          {/* Teachers */}
          <h3 className="dept-modal-teachers-heading">Викладачі відділу</h3>
          <div className="dept-modal-teachers-grid">
            {dept.teachers.map((t, i) => (
              <div key={i} className="dept-teacher-card">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="dept-teacher-avatar"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23e0f2fe'/%3E%3Ccircle cx='30' cy='24' r='10' fill='%2338bdf8'/%3E%3Cellipse cx='30' cy='50' rx='16' ry='10' fill='%2338bdf8'/%3E%3C/svg%3E";
                  }}
                />
                <div className="dept-teacher-info">
                  <div className="dept-teacher-name">{t.name}</div>
                  <div className="dept-teacher-title">{t.title}</div>
                  <span className="dept-teacher-experience">
                    <Clock size={10} />
                    Стаж: {pluralYears(t.experience)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main component ──────────────────────────────── */
const Departments = () => {
  const [openDept, setOpenDept] = useState(null);

  return (
    <div className="departments-page">
      <div className="departments-inner">
        {/* Intro */}
        <div className="departments-intro">
          <p>
            Шість творчих відділів — понад 500 учнів, більше ніж 40 викладачів.
            Оберіть напрям, що запалить у вашої дитини справжній творчий вогонь.
          </p>
        </div>

        {/* Cards grid */}
        <div className="departments-grid">
          {departments.map((dept) => (
            <article
              key={dept.id}
              className="dept-card"
              onClick={() => setOpenDept(dept)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpenDept(dept)}
              aria-label={`Відкрити деталі: ${dept.name}`}
            >
              {/* Image */}
              <div className="dept-card-img-wrap">
                <img
                  src={dept.image}
                  alt={dept.name}
                  loading="lazy"
                  onError={(e) => { e.target.src = '/img/baner.jpg'; }}
                />
                <div className="dept-card-img-overlay" />
                <span className="dept-card-tag">{dept.tag}</span>
                <span className="dept-card-teachers-count">
                  <Users size={12} />
                  {dept.teachersCount} викладачів
                </span>
              </div>

              {/* Body */}
              <div className="dept-card-body">
                <h2 className="dept-card-title">{dept.name}</h2>
                <p className="dept-card-desc">{dept.description}</p>

                {/* Program pills */}
                <div className="dept-card-programs">
                  {dept.programs.slice(0, 4).map((p, i) => (
                    <span key={i} className="dept-program-pill">{p}</span>
                  ))}
                  {dept.programs.length > 4 && (
                    <span className="dept-program-pill">+{dept.programs.length - 4}</span>
                  )}
                </div>

                {/* Footer */}
                <div className="dept-card-footer">
                  <button className="dept-card-learn-btn" tabIndex={-1}>
                    Дізнатися більше
                    <ArrowRight size={16} />
                  </button>
                  <span className="dept-card-students">
                    <GraduationCap size={14} />
                    {dept.students} учнів
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openDept && (
        <DeptModal dept={openDept} onClose={() => setOpenDept(null)} />
      )}
    </div>
  );
};

export default Departments;
