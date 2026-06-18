import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores';

interface AdminApp {
  id: number;
  title: string;
  category: string;
  price: string;
  date: string;
  text?: string;
  image?: string;
}

type Category = 'tools' | 'weather' | 'productivity' | 'photo';

const CATEGORIES: Category[] = ['tools', 'weather', 'productivity', 'photo'];

interface Props {
  onLogout: () => void;
}

const AdminPage = observer(({ onLogout }: Props) => {
  // Подключаем как authStore для токена, так и appsStore для работы с данными
  const { authStore, appsStore } = useStores();

  // Режим редактирования: храним id приложения, если мы его редактируем
  const [editingId, setEditingId] = useState<number | null>(null);

  // Состояния формы
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('tools');
  const [price, setPrice] = useState('Free');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Загружаем данные при монтировании через стор
  useEffect(() => {
    appsStore.loadApps();
  }, [appsStore]);

  // Функция очистки/сброса формы
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('tools');
    setPrice('Free');
    setImageUrl('');
    setFormError(null);
    setEditingId(null);
    setShowForm(false);
  };

  // Вход в режим редактирования
  const handleEditClick = (app: any) => {
    setEditingId(app.id);
    setTitle(app.title);
    setDescription(app.text || '');
    setCategory(app.category);
    setPrice(app.price);
    setImageUrl(app.image || '');
    setFormError(null);
    setShowForm(true); // открываем форму
  };

  // Отправка формы (Создание ИЛИ Редактирование)
  const handleSubmit = async () => {
    if (!title.trim()) {
      setFormError('Заполните название');
      return;
    }

    const payload = {
      title,
      text: description,
      category,
      price,
      image: imageUrl || 'https://via.placeholder.com/150',
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    };

    let success = false;

    if (editingId !== null) {
      // Если есть id — обновляем существующее
      success = await appsStore.updateApp(editingId, payload);
    } else {
      // Иначе — создаем новое
      success = await appsStore.createApp(payload);
    }

    if (success) {
      resetForm();
    } else {
      setFormError(appsStore.error || 'Произошла ошибка при сохранении');
    }
  };

  // Удаление приложения
  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это приложение?')) {
      await appsStore.deleteApp(id);
    }
  };

  return (
    <div style={s.wrapper}>
      {/* Шапка */}
      <header style={s.header}>
        <h1 style={s.headerTitle}>⚙️ Admin Panel</h1>
        <div style={s.headerRight}>
          <span style={s.userEmail}>{authStore.user?.email}</span>
          <button style={s.logoutBtn} onClick={onLogout}>Выйти</button>
        </div>
      </header>

      <div style={s.content}>
        {/* Заголовок секции */}
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Приложения</h2>
          <button 
            style={s.addBtn} 
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
          >
            {showForm ? '✕ Закрыть' : '+ Добавить'}
          </button>
        </div>

        {/* Форма создания / редактирования */}
        {showForm && (
          <div style={s.form}>
            <h3 style={s.formTitle}>
              {editingId !== null ? `Редактирование приложения (ID: ${editingId})` : 'Новое приложение'}
            </h3>

            <label style={s.label}>Название *</label>
            <input
              style={s.input}
              placeholder="Calculator"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <label style={s.label}>Описание</label>
            <input
              style={s.input}
              placeholder="Simple calculator app"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <label style={s.label}>Категория</label>
            <select
              style={s.input}
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label style={s.label}>Цена</label>
            <input
              style={s.input}
              placeholder="Free или $1.99"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />

            <label style={s.label}>Ссылка на картинку</label>
            <input
              style={s.input}
              placeholder="https://..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />

            {formError && <p style={s.error}>{formError}</p>}
            {appsStore.error && !formError && <p style={s.error}>{appsStore.error}</p>}

            <button
              style={{ ...s.submitBtn, background: editingId !== null ? '#0077ff' : '#00b341' }}
              onClick={handleSubmit}
              disabled={appsStore.isLoading}
            >
              {appsStore.isLoading 
                ? 'Сохранение...' 
                : editingId !== null ? 'Сохранить изменения' : 'Создать приложение'
              }
            </button>
            
            {editingId !== null && (
              <button style={s.cancelBtn} onClick={resetForm}>Отмена</button>
            )}
          </div>
        )}

        {/* Список (Берем данные прямо из стора) */}
        {appsStore.isLoading && appsStore.apps.length === 0 ? (
          <p style={s.msg}>🔄 Загрузка...</p>
        ) : appsStore.error && appsStore.apps.length === 0 ? (
          <p style={s.error}>{appsStore.error}</p>
        ) : appsStore.apps.length === 0 ? (
          <p style={s.msg}>📭 Нет приложений</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Название</th>
                <th style={s.th}>Категория</th>
                <th style={s.th}>Цена</th>
                <th style={s.th}>Дата</th>
                <th style={{ ...s.th, textAlign: 'center' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {appsStore.apps.map(app => (
                <tr key={app.id} style={s.tr}>
                  <td style={s.td}>{app.id}</td>
                  <td style={s.td}>{app.title}</td>
                  <td style={s.td}>{app.category}</td>
                  <td style={s.td}>{app.price}</td>
                  <td style={s.td}>{app.date}</td>
                  <td style={{ ...s.td, display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button 
                      style={s.editBtn} 
                      onClick={() => handleEditClick(app)}
                    >
                      ✏️
                    </button>
                    <button 
                      style={s.deleteBtn} 
                      onClick={() => handleDelete(app.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

const s: Record<string, React.CSSProperties> = {
  wrapper: { minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  header: {
    background: '#fff',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  headerTitle: { margin: 0, fontSize: 20 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  userEmail: { fontSize: 14, color: '#666' },
  logoutBtn: {
    padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd',
    background: '#fff', cursor: 'pointer', fontSize: 13,
  },
  content: { maxWidth: 900, margin: '32px auto', padding: '0 16px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { margin: 0, fontSize: 18 },
  addBtn: {
    padding: '8px 18px', borderRadius: 8, border: 'none',
    background: '#0077ff', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  form: {
    background: '#fff', borderRadius: 12, padding: 24,
    marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  formTitle: { margin: '0 0 8px', fontSize: 16 },
  label: { fontSize: 13, color: '#555', fontWeight: 600 },
  input: {
    padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd',
    fontSize: 14, outline: 'none',
  },
  submitBtn: {
    marginTop: 8, padding: '12px', borderRadius: 8, border: 'none',
    background: '#00b341', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    padding: '8px', borderRadius: 8, border: '1px solid #ddd',
    background: '#fff', color: '#333', fontSize: 14, cursor: 'pointer', textAlign: 'center'
  },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' },
  th: { padding: '12px 16px', background: '#f7f8fa', textAlign: 'left', fontSize: 13, color: '#888', fontWeight: 600 },
  tr: { borderTop: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', fontSize: 14 },
  msg: { textAlign: 'center', color: '#888', padding: 32 },
  error: { color: '#e53935', fontSize: 13 },
  
  // Новые стили для кнопок управления
  editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 },
};

export default AdminPage;