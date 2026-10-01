import api from './api';
// Видаляємо імпорт bcrypt - фронтенд не повинен хешувати пароль

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(identifier, password) {
    try {
      const response = await api.post('/auth/login', {
        email: identifier,
        password,
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success && response.data.token) {
        this.token = response.data.token;
        this.user = response.data.user;
        
        // Зберігаємо в localStorage
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        window.dispatchEvent(new Event('authChange'));
        
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Помилка автентифікації');
      }
    } catch (error) {
      console.error('❌ Auth service login error:', error);
      
      // Більш інформативна обробка помилок
      if (error.response) {
        // Сервер повернув помилку
        const message = error.response.data.message || 'Помилка сервера';
        throw new Error(message);
      } else if (error.request) {
        // Запит був зроблений, але відповіді не отримано
        throw new Error('Немає зв\'язку з сервером');
      } else {
        // Щось сталося під час налаштування запиту
        throw new Error('Помилка налаштування запиту');
      }
    }
  }

  // Видаляємо метод comparePasswords, оскільки він більше не потрібен

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    console.log('✅ User logged out');
    window.dispatchEvent(new Event('authChange'));
  }

  isAuthenticated() {
    const hasToken = !!this.token;
    const hasUser = !!this.user;
    console.log('🔐 Auth check:', { hasToken, hasUser, user: this.user });
    return hasToken && hasUser;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  // Перевірка чи токен дійсний
  async verifyToken() {
    try {
      if (!this.token) {
        return false;
      }
      
      const response = await api.get('/auth/verify');
      return response.data.success;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;