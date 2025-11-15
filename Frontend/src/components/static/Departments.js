import React, { useState, useRef, useEffect } from 'react';

const pluralYears = (n) => {
  const v = Math.abs(n) % 100;
  const v1 = v % 10;
  if (v > 10 && v < 20) return `${n} років`;
  if (v1 > 1 && v1 < 5) return `${n} роки`;
  if (v1 === 1) return `${n} рік`;
  return `${n} років`;
};

const Modal = ({ dept, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!dept) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'grid', placeItems: 'center', zIndex: 1000
      }}
      role="dialog" aria-modal="true" aria-labelledby="dept-title" ref={dialogRef}
    >
      <div style={{
        width: 'min(900px, 92vw)', maxHeight: '85vh', overflow: 'auto',
        background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,.25)',
        padding: '24px 28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          <h2 id="dept-title" style={{ margin: 0, color: '#1f2937' }}>{dept.name}</h2>
          <button
            onClick={onClose}
            style={{ border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: 8, background: '#f9fafb', cursor: 'pointer' }}
          >
            Закрити
          </button>
        </div>

        <p style={{ marginTop: 0, color: '#374151', lineHeight: 1.6 }}>{dept.longText}</p>

        <h3 style={{ marginTop: 24, marginBottom: 12 }}>Викладачі</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {dept.teachers.map((t, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              border: '1px solid #eee', borderRadius: 12
            }}>
              <img
                src={t.photo || '/img/teacher-placeholder.jpg'}
                alt={t.name}
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>{t.title}</div>
                <div style={{
                  marginTop: 6, fontSize: 12, padding: '4px 8px', borderRadius: 999,
                  border: '1px solid #e5e7eb', background: '#fafafa', display: 'inline-block'
                }}>
                  Стаж: {pluralYears(t.experience)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Departments = () => {
  const [openDept, setOpenDept] = useState(null);

  const departments = [
    {
      name: 'Фортепіано 1',
      description: 'Початкове та середнє навчання гри на фортепіано.',
      programs: ['Індивідуальні уроки', 'Ансамбль', 'Сольні виступи'],
      image: '../img/piano1.jpg',
      longText:
        'Фортепіано - дивовижний інструмент, який дозволяє розслабитися та заспокоїтися, незалежно від того, слухаєте ви музику чи граєте самі. Дітям в ранньому віці вчитися грати на фортепіано - дуже корисно. Учні розвивають різноманітні навички. Уроки дітям дають багато переваг з точки зору поведінки і здоров`я на майбутнє. На відділі фортепіано-1 працює 8 викладачів та навчається 80 учнів.',
      teachers: [
        { name: 'Ковальчук Людмила Петрівна', title: 'завідуюча відділом фортепіано-1, викладач І категорії, старший викладач, концертмейстер', experience: 40, photo: '../img/t1.jpg' },
        { name: 'Ільюшина Тетяна Олександрівна', title: 'концертмейстер', experience: 24, photo: '../img/t2.jpg' },
        { name: 'Коваль Лілія Володимирівна', title: 'концертмейстер', experience: 22, photo: '../img/t3.jpg' },
        { name: 'Ларжевська Ірина Іванівна', title: 'викладач', experience: 35, photo: '../img/t4.jpg' },
        { name: 'Павленко Ніна Петрівна ', title: 'викладач I категорії', experience: 40, photo: '../img/t5.jpg' }
        
      ]
    },
    {
      name: 'Фортепіано 2',
      description: 'Поглиблена підготовка та конкурсні програми.',
      programs: ['Майстер-класи', 'Підготовка до конкурсів', 'Ансамблеве музикування'],
      image: '../img/piano2.jpg',
      longText:
        '«Одна із переваг уроків фортепіано для маленьких дітей є розвиток мозку та психічного здоров`я. Вираження емоцій через інструмент допомагає дітям зняти стрес в душі та тілі. Гра на музичному інструменті дає змогу підвищити почуття впевненості, задоволення, що піднімає самооцінку. На відділі фортепіано-2 працює вісім викладачів та навчається 74 учня.',
      teachers: [
       { name: 'Хмелевська Анна Вікторівна', title: 'завідуюча відділом, викладач І категорії', experience: 10, photo: '../img/t6.jpg' },
        { name: 'Шапар Світлана Юріївна', title: 'викладач ІІ категорії', experience: 35, photo: '../img/t7.jpg' }
      ]
    },
    {
      name: 'Відділ оркестрових інструментів',
      description: 'Струнні, духові та ударні інструменти.',
      programs: ['Скрипка', 'Віолончель', 'Флейта', 'Кларнет', 'Труба', 'Ударні'],
      image: '../img/orchestra.jpg',
      longText:
        'Різноманітний за своїм складом відділ оркестрових інструментів наліковує 14 викладачів, які професійно з натхненям та любов`ю навчають дітей грі на ударних, духових інструментах, бандурі, скрипці, віолончелі, домрі та гітарі, баяні та акордеоні. На відділі навчається 102 учня.',
      teachers: [
        { name: 'Кулічов Павло Михайлович', title: 'завідуючий відділом оркестрових інструментів, викладач по класу ударних інструментів, викладач вищої категорії, методист.', experience: 27, photo: '../img/t8.jpg' },
        { name: 'Козій Інна В`ячеславівна', title: 'викладач по класу віолончелі', experience: 28, photo: '../img/t9.jpg' },
        { name: 'Лапинюк Володимир Володимирович', title: 'викладач по класу баяна', experience: 40, photo: '../img/t10.jpg' }
      ]
    },
    {
      name: 'Відділ сольного співу',
      description: 'Академічний та естрадний вокал.',
      programs: ['Академічний вокал', 'Естрадний спів', 'Вокальні ансамблі'],
      image: '../img/vocal.jpg',
      longText:
        'Перші кроки свого існування Уманська дитяча школа мистецтв розпочала в далекому 1901 році. За цей час школа неодноразово була реорганізована, розширювалася різноманітними відділами. В закладі завжди працювали викладачі співу та теорії музики. З архівних документів відомо, що в 1911 році клас співу очолював А.П.Лех. В 1923 році відкрито додатково клас хорового співу. А.О.Покрасов – директор ДМШ з 1974 по 1989 рік був керівником шкільного дитячого хору та хору викладачів. На даний момент в закладі існує відділ сольно-хорового співу, на якому працює 5 викладачів та два концертмейстери під керівництвом Опаріної Т.О. На відділі навчається 88 учнів, які беруть участь у загальноміських, обласних та міжнародних конкурсах. Діти отримують перемоги на цих заходах, що говорить про гарну підготовку учнів та високий професіоналізм викладачів.',
      teachers: [
        { name: 'Опаріна Тамара Олексіївна', title: 'викладач вищої категорії, старший викладач', experience: 31, photo: '../img/t11.jpg' },
      ]
    },
    {
      name: 'Відділ музично-теоретичних дисциплін',
      description: 'Сольфеджіо, гармонія, музична література.',
      programs: ['Сольфеджіо', 'Гармонія', 'Музична література'],
      image: '/img/theory.jpg',
      longText:
        'Відділ музично-теоретичних дисциплін є невід`ємною складовою в музичній освіті. Одним із перших, хто надавав знання з елементарної теорії в закладі - був А.А.Дубінський. В.Г.Добринський - директор школи з 1947 по 1974 рік, на теоретичному відділі викладав сольфеджіо. З.В.Вояковська - директор школи з 1989 по 2002 рік, впродовж 25 років очолювала теоретичний відділ. Багато років під керівництвом Кулієвої Т.М. викладачі відділу музично-теоретичних дисциплін шукають цікаві та доступні форми роботи викладання матеріалу для учнів. Результат праці - щорічні перемоги шкільної команди на обласних олімпіадах.',
      teachers: [
        { name: 'Кулієва Тетяна Миколаївна', title: 'завідуюча музично-теоретичним відділом, старший викладач', experience: 39, photo: '../img/t12.jpg' },
        { name: 'Любич Інна Дмитрівна', title: 'викладач І категорії', experience: 28, photo: '../img/t13.jpg' }
      ]
    },
    {
      name: 'Мистецький відділ',
      description: 'Живопис, графіка та декоративне мистецтво.',
      programs: ['Живопис', 'Графіка', 'Декоративне мистецтво'],
      image: '../img/arts.jpg',
      longText:
        'Мистецький відділ наліковує 111 учнів, які навчаються відчути музику навколишнього світу, бачити прекрасне, опановують різні види техніки образотворчого мистецтва. За бажанням, можуть навчитися грати на музичному інструменті, танцювати. А в цьому їм допоможуть креативні, талановиті, багаті на знання викладачі.',
      teachers: [
        { name: 'Шишковська Зоя Григорівна', title: 'завідуюча мистецьким відділом, викладач вищої категорії', experience: 24, photo: '../img/t14.jpg' },
        { name: 'Довгань Марина Григорівна', title: 'викладач по класу хореографії', experience: 10, photo: '../img/t15.jpg' },
        { name: 'Чернишенко Людмила Олексіївна', title: 'викладач вищої категорії, старший викладач', experience: 27, photo: '../img/t16.jpg' },
        { name: 'Юрійчук Ганна Іванівна', title: 'викладач вищої категорії, методист', experience: 20, photo: '../img/t17.jpg' }
      ]
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
        Ознайомтеся з напрямами навчання у нашій школі
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {departments.map((dept, index) => (
          <div key={index} style={{
            position: 'relative',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <img
              src={dept.image}
              alt={dept.name}
              style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>{dept.name}</h2>
              <p style={{ marginBottom: '0.75rem', fontSize: '1.05rem', color: '#374151' }}>{dept.description}</p>
              <h3 style={{ marginBottom: '0.25rem' }}>Програми:</h3>
              <ul style={{ columns: 2, gap: '2rem', marginBottom: 0 }}>
                {dept.programs.map((program, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{program}</li>
                ))}
              </ul>
            </div>

            <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setOpenDept(dept)}
                style={{
                  whiteSpace: 'nowrap', border: '1px solid #e5e7eb', background: '#fafafa',
                  padding: '10px 14px', borderRadius: 12, cursor: 'pointer'
                }}
                aria-label={`Читати далі: ${dept.name}`}
              >
                читати далі →
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal dept={openDept} onClose={() => setOpenDept(null)} />
    </div>
  );
};

export default Departments;
