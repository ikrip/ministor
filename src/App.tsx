import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import { AppCard } from './AppCard';

interface AppItem {
  id: number;
  title: string;
  text: string;
  date: string;
  price: string;
  category: 'tools' | 'weather' | 'productivity' | 'photo';
  image: string; // Ссылка на картинку, которая приходит из API
}

interface Category {
  id: AppItem['category'];
  label: string;
}

type PriceMode = 'all' | 'free' | 'paid';

const categories: Category[] = [
  { id: 'tools', label: '🛠️ Tools' },
  { id: 'weather', label: '🌤️ Weather' },
  { id: 'productivity', label: '📝 Productivity' },
  { id: 'photo', label: '📸 Photo' },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<AppItem['category'] | 'all'>('all');
  const [priceMode, setPriceMode] = useState<PriceMode>('all');

  // Состояние для хранения списка приложений с сервера API
  const [apps, setApps] = useState<AppItem[]>([]);
  // Состояние для экрана загрузки
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Асинхронная функция загрузки данных с локального сервера
  const loadApps = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/apps'); 
      
      if (!res.ok) {
        throw new Error('Ошибка при ответе локального сервера API');
      }

      const data = await res.json();
      setApps(data); // Записываем полученные данные в стейт
    } catch (e) {
      console.error('Не удалось загрузить данные из API:', e);
    } finally {
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };

  // Вызываем загрузку один раз при монтировании компонента
  useEffect(() => {
    loadApps();
  }, []);

  // Фильтрация данных, полученных с сервера
  const filteredApps = apps.filter(app => {
    const matchSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchPrice = priceMode === 'all' || 
      (priceMode === 'free' && app.price === 'Free') ||
      (priceMode === 'paid' && app.price !== 'Free');
    return matchSearch && matchCategory && matchPrice;
  });

  return (
    <>
      <h1 className={styles.header}>🛍️ MiniStore</h1>
      
      {/* Поле поиска */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search apps..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Контейнер фильтров */}
      <div className={styles.filterContainer}>
        {/* Тумблер цен */}
        <div className={styles.priceToggle}>
          <button
            onClick={() => setPriceMode('all')}
            className={`${styles.toggleBtn} ${priceMode === 'all' ? styles.activeToggle : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setPriceMode('free')}
            className={`${styles.toggleBtn} ${priceMode === 'free' ? styles.activeToggle : ''}`}
          >
            🎁 Free
          </button>
          <button
            onClick={() => setPriceMode('paid')}
            className={`${styles.toggleBtn} ${priceMode === 'paid' ? styles.activeToggle : ''}`}
          >
            💰 Paid
          </button>
        </div>

        {/* Вертикальный разделитель */}
        <div className={styles.divider}></div>

        {/* Кнопки категорий с возможностью отмены выбора */}
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              // Если категория уже активна — клик сбрасывает её на 'all', иначе — выбирает её
              setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id);
            }}
            className={`${styles.filterButton} ${selectedCategory === cat.id ? styles.activeFilter : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Сетка вывода карточек */}
      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.emptyState}>
            <p>🔄 Loading apps from server...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className={styles.emptyState}>
            <p>😢 Nothing found</p>
            <span>Try changing your search or filter</span>
          </div>
        ) : (
          filteredApps.map(app => (
            <AppCard
              key={app.id}
              title={app.title}
              text={app.text}
              date={app.date}
              price={app.price}
              image={app.image} // Передаем картинку из API в карточку
              searchTerm={searchTerm}
            />
          ))
        )}
      </main>
    </>
  );
}