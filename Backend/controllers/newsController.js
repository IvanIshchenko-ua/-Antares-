exports.getAllNews = async (req, res) => {
  try {
    console.log('GET /api/news called');
    // Тимчасово повертаємо тестові дані
    res.json([
      {
        id: 1,
        title: 'Тестова новина',
        shortDescription: 'Опис тестової новини',
        fullContent: '<p>Контент тестової новини</p>',
        author: 'Тест',
        publishDate: new Date().toISOString(),
        views: 0
      }
    ]);
  } catch (error) {
    console.error('Помилка отримання новин:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

// Решта методів можна також тимчасово заповнити тестовими даними