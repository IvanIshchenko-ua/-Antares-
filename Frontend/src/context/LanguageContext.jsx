import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  'Відділи': 'Departments',
  'Про нас': 'About us',
  'Фото/Відео': 'Photos/Videos',
  'Новини': 'News',
  'Прозорість': 'Transparency',
  'Контакти': 'Contacts',
  'Головна': 'Home',
  'Записатися': 'Apply now',
  'Записатися на урок': 'Book a lesson',
  'Школа мистецтв • Умань': 'School of arts • Uman',
  'Школа мистецтв': 'School of arts',
  'Офіційний сайт • Умань • Школа мистецтв': 'Official website • Uman • School of arts',
  'Уманська дитяча школа мистецтв': 'Uman Children’s School of Arts',
  '«Антарес»': '“Antares”',
  'Наші відділи': 'Our departments',
  'років творчої історії та досвіду': 'years of creative history and experience',
  'талановитих учнів навчаються щороку': 'talented students learn every year',
  'провідні творчі відділи школи': 'leading creative departments',
  'ансамблів та творчих колективів': 'ensembles and creative groups',
  'Про наш заклад': 'About our school',
  'Ласкаво просимо до школи мистецтв «Антарес»': 'Welcome to Antares School of Arts',
  'Дізнатися більше про школу': 'Learn more about the school',
  'Індивідуальний підхід до кожної дитини з урахуванням її природних задатків': 'An individual approach to every child and their natural abilities',
  'Сучасні освітні програми та комфортні класи в центрі Умані': 'Modern programs and comfortable classrooms in the heart of Uman',
  'Підготовка до вступу у провідні творчі коледжі та академії': 'Preparation for admission to leading creative colleges and academies',
  'Освітні напрямки': 'Creative directions',
  'Оберіть творчий напрямок для вашої дитини': 'Choose a creative direction for your child',
  'У школі діють 4 основні відділення, де кожен знайде свій улюблений вид мистецтва під керівництвом досвідчених педагогів.': 'Our four main departments help every child find a favorite art form with experienced teachers.',
  'Музичне мистецтво': 'Music',
  'Образотворче мистецтво': 'Visual arts',
  'Хореографічне мистецтво': 'Choreography',
  'Театральне та хорове': 'Theatre and choir',
  'Дізнатися більше про відділ': 'Learn more about the department',
  'НАШІ ПЕРЕВАГИ': 'OUR ADVANTAGES',
  'Чому батьки та учні обирають «Антарес»': 'Why parents and students choose “Antares”',
  'Державне свідоцтво': 'State certificate',
  'Зіркові викладачі': 'Outstanding teachers',
  '35+ творчих колективів': '35+ creative groups',
  'Сцена з перших кроків': 'The stage from day one',
  'ЖИТТЯ ШКОЛИ': 'SCHOOL LIFE',
  'Останні новини та події': 'Latest news and events',
  'Слідкуйте за виступами, досягненнями учнів, оголошеннями та творчими святами нашої школи.': 'Follow our performances, student achievements, announcements and creative celebrations.',
  'Читати новину': 'Read the news',
  'Переглянути всі новини': 'View all news',
  'Фотомиті': 'Photo moments',
  'Галерея творчих досягнень': 'Gallery of creative achievements',
  'Емоції, концерти, виставки та натхнення на кожному уроці.': 'Emotions, concerts, exhibitions and inspiration in every lesson.',
  'Подаруйте дитині радість творчості та впевненість у собі': 'Give your child the joy of creativity and confidence',
  'Записатися на консультацію': 'Book a consultation',
  'Контакти та адреса': 'Contacts and address',
  'Шкільні новини': 'School news',
  'Новини та оголошення': 'News and announcements',
  'Творче життя': 'Creative life',
  'Фото та Відео галерея': 'Photo and video gallery',
  'Моменти, які хочеться зберегти': 'Moments worth keeping',
  'Фото': 'Photos',
  'Відео': 'Videos',
  'Читати': 'Read',
  'Остання новина': 'Latest news',
  'Життя школи': 'School life',
  'Поки що немає новин. Завітайте пізніше!': 'There are no news yet. Please visit us later!',
  'Фотографій поки немає': 'No photos yet',
  'Відео поки немає': 'No videos yet',
  'Матеріали з’являться тут після публікації.': 'New materials will appear here after publication.',
  'Прозорість та відкритість': 'Transparency and openness',
  'Прозорість і інформаційна відкритість': 'Transparency and access to information',
  'Закрити': 'Close',
  'Документи:': 'Documents:',
  'Інформація буде додана найближчим часом.': 'Information will be added soon.',
  'Наша адреса': 'Our address',
  'Телефони для довідок': 'Phone numbers',
  'Електронна пошта': 'Email',
  'Графік роботи школи': 'School hours',
  'Директор школи': 'School principal',
  'Швидкий зв’язок': 'Quick contact',
  'Надішліть нам запит': 'Send us a message',
  'Ваше ім’я *': 'Your name *',
  'Номер телефону *': 'Phone number *',
  'Тема звернення': 'Subject',
  'Ваше повідомлення': 'Your message',
  'Понеділок – П’ятниця:': 'Monday – Friday:',
  'Субота:': 'Saturday:',
  'Неділя: вихідний': 'Sunday: closed',
  'Всі права захищено.': 'All rights reserved.',
};

const reverseTranslations = Object.fromEntries(
  Object.entries(translations).map(([ukrainian, english]) => [english, ukrainian])
);

const LanguageContext = createContext(null);

const translateTextNodes = (root, language) => {
  const dictionary = language === 'en' ? translations : reverseTranslations;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    if (node.parentElement && !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(node.parentElement.tagName)) {
      nodes.push(node);
    }
    node = walker.nextNode();
  }

  nodes.forEach((textNode) => {
    const value = textNode.nodeValue;
    const trimmed = value.trim();
    if (!trimmed || !dictionary[trimmed]) return;
    textNode.nodeValue = value.replace(trimmed, dictionary[trimmed]);
  });
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('antares-language') || 'uk');

  useEffect(() => {
    localStorage.setItem('antares-language', language);
    document.documentElement.lang = language;
    translateTextNodes(document.body, language);

    const observer = new MutationObserver(() => translateTextNodes(document.body, language));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === 'uk' ? 'en' : 'uk'),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
