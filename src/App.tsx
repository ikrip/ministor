import { useState } from 'react';
import styles from './App.module.css';
import { AppCard } from './AppCard';

interface AppItem {
  id: number;
  title: string;
  text: string;
  date: string;
  price: string;
  category: 'tools' | 'weather' | 'productivity' | 'photo';
}

interface Category {
  id: AppItem['category'];
  label: string;
}

type PriceMode = 'all' | 'free' | 'paid';

const initialApps: AppItem[] = [
  { id: 1, title: 'Calculator', text: 'Simple calculator app', date: '27.04', price: 'Free', category: 'tools' },
  { id: 2, title: 'Weather Pro', text: 'Accurate weather forecast', date: '28.04', price: '$2.99', category: 'weather' },
  { id: 3, title: 'Note Taker', text: 'Quick notes and todos', date: '29.04', price: 'Free', category: 'productivity' },
  { id: 4, title: 'Photo Editor', text: 'Edit photos like a pro', date: '30.04', price: '$4.99', category: 'photo' },
  { id: 5, title: 'Map Navigator', text: 'GPS navigation system', date: '01.05', price: 'Free', category: 'tools' },
  { id: 6, title: 'Weather Lite', text: 'Minimal weather app', date: '02.05', price: 'Free', category: 'weather' },
  { id: 7, title: 'Task Manager', text: 'Manage your daily tasks', date: '03.05', price: '$1.99', category: 'productivity' },
];

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

  const filteredApps = initialApps.filter(app => {
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
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search apps..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

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

        {/* Разделитель */}
        <div className={styles.divider}></div>

        {/* Кнопки категорий */}
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`${styles.filterButton} ${selectedCategory === cat.id ? styles.activeFilter : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <main className={styles.main}>
        {filteredApps.length === 0 ? (
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
              searchTerm={searchTerm}
            />
          ))
        )}
      </main>
    </>
  );
}