import { makeAutoObservable, action } from 'mobx';

interface User {
  email: string;
  role: string;
}

export class AuthStore {
  user: User | null = null;
  token: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async register(email: string, password: string): Promise<boolean> {
    action(() => {
      this.isLoading = true;
      this.error = null;
    })();

    try {
      // Имитируем задержку сервера
      await new Promise(r => setTimeout(r, 500));

      if (!email || !password || password.length < 6) {
        throw new Error('Заполните все поля (пароль мин. 6 символов)');
      }

      action(() => {
        this.user = { email, role: 'editor' };
      })();

      return true;
    } catch (e: any) {
      action(() => {
        this.error = e.message ?? 'Не удалось зарегистрироваться';
      })();
      return false;
    } finally {
      action(() => {
        this.isLoading = false;
      })();
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    action(() => {
      this.isLoading = true;
      this.error = null;
    })();

    try {
      await new Promise(r => setTimeout(r, 500));

      if (!email || !password) {
        throw new Error('Введите email и пароль');
      }

      action(() => {
        this.user = { email, role: 'editor' };
      })();

      return true;
    } catch (e: any) {
      action(() => {
        this.error = e.message ?? 'Неверный email или пароль';
      })();
      return false;
    } finally {
      action(() => {
        this.isLoading = false;
      })();
    }
  }

  logout() {
    action(() => {
      this.user = null;
      this.token = null;
      this.error = null;
    })();
  }

  get isLoggedIn() {
    return this.user !== null;
  }
}
