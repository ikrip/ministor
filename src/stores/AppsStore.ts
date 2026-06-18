import { makeAutoObservable, action } from 'mobx';

export interface AppItem {
  id: number;
  title: string;
  text: string;
  date: string;
  price: string;
  category: 'tools' | 'weather' | 'productivity' | 'photo';
  image: string;
  screenshots?: string[]; // Понадобится для работы со скриншотами в будущем
}

export class AppsStore {
  apps: AppItem[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 1. Загрузка всех приложений
  async loadApps() {
    action(() => {
      this.isLoading = true;
      this.error = null;
    })();

    try {
      const res = await fetch('http://localhost:5000/apps');
      if (!res.ok) throw new Error('Ошибка при ответе сервера');
      const data: AppItem[] = await res.json();

      action(() => {
        this.apps = data;
      })();
    } catch (e: any) {
      action(() => {
        this.error = 'Не удалось загрузить приложения. Проверь, запущен ли сервер.';
      })();
      console.error(e);
    } finally {
      action(() => {
        this.isLoading = false;
      })();
    }
  }

  // 2. Создание нового приложения (POST)
  async createApp(appData: Omit<AppItem, 'id'>) {
    action(() => {
      this.isLoading = true;
      this.error = null;
    })();

    try {
      const res = await fetch('http://localhost:5000/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appData),
      });

      if (!res.ok) throw new Error('Не удалось создать приложение');
      const newApp: AppItem = await res.json();

      action(() => {
        this.apps.push(newApp);
      })();
      return true;
    } catch (e: any) {
      action(() => {
        this.error = e.message ?? 'Ошибка при создании приложения';
      })();
      return false;
    } finally {
      action(() => {
        this.isLoading = false;
      })();
    }
  }

  // 3. Редактирование приложения (PATCH)
  async updateApp(id: number, appData: Partial<AppItem>) {
    action(() => {
      this.isLoading = true;
      this.error = null;
    })();

    try {
      const res = await fetch(`http://localhost:5000/apps/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appData),
      });

      if (!res.ok) throw new Error('Не удалось обновить приложение');
      const updatedApp: AppItem = await res.json();

      action(() => {
        const index = this.apps.findIndex(app => app.id === id);
        if (index !== -1) {
          this.apps[index] = updatedApp;
        }
      })();
      return true;
    } catch (e: any) {
      action(() => {
        this.error = e.message ?? 'Ошибка при обновлении приложения';
      })();
      return false;
    } finally {
      action(() => {
        this.isLoading = false;
      })();
    }
  }

  // 4. Удаление приложения (DELETE)
  async deleteApp(id: number) {
    action(() => {
      this.isLoading = true;
      this.error = null;
    })();

    try {
      const res = await fetch(`http://localhost:5000/apps/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Не удалось удалить приложение');

      action(() => {
        this.apps = this.apps.filter(app => app.id !== id);
      })();
      return true;
    } catch (e: any) {
      action(() => {
        this.error = e.message ?? 'Ошибка при удалении приложения';
      })();
      return false;
    } finally {
      action(() => {
        this.isLoading = false;
      })();
    }
  }
}