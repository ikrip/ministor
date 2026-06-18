import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './App.module.css';
import { AppCard } from './AppCard';
import { useStores } from './stores';
import type { AppItem } from './stores/AppsStore';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

interface Category {
  id: 'tools' | 'weather' | 'productivity' | 'photo';
  label: string;
}

type PriceMode = 'all' | 'free' | 'paid';
type AdminView = 'login' | 'register' | 'admin';

const categories: Category[] = [
  { id: 'tools', label: '🛠️ Tools' },
  { id: 'weather', label: '🌤️ Weather' },
  { id: 'productivity', label: '📝 Productivity' },
  { id: 'photo', label: '📸 Photo' },
];

const App = observer(() => {
  const { appsStore, authStore } = useStores();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category['id'] | 'all'>('all');
  const [priceMode, setPriceMode] = useState<PriceMode>('all');
  const [mode, setMode] = useState<'storefront' | 'admin'>('storefront');
  const [adminView, setAdminView] = useState<AdminView>('login');

  useEffect(() => {
    appsStore.loadApps();
  }, []);

  const handleLogout = () => {
    authStore.logout();
    setAdminView('login');
    setMode('storefront');
  };

  if (mode === 'admin') {
    if (authStore.isLoggedIn) {
      return <AdminPage onLogout={handleLogout} />;
    }
    if (adminView === 'register') {
      return (
        <RegisterPage
          onGoToLogin={() => setAdminView('login')}
          onSuccess={() => setAdminView('login')}
        />
      );
    }
    return (
      <LoginPage
        onGoToRegister={() => setAdminView('register')}
        onSuccess={() => {}}
      />
    );
  }

  const filteredApps = appsStore.apps.filter((app: AppItem) => {
    const matchSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const matchPrice =
      priceMode === 'all' ||
      (priceMode === 'free' && app.price === 'Free') ||
      (priceMode === 'paid' && app.price !== 'Free');
    return matchSearch && matchCategory && matchPrice;
  });

  const renderContent = () => {
    if (appsStore.isLoading) return <div className={styles.emptyState}><p>🔄 Loading apps from server...</p></div>;
    if (appsStore.error) return <div className={styles.emptyState}><p>❌ {appsStore.error}</p></div>;
    if (appsStore.apps.length === 0) return <div className={styles.emptyState}><p>📭 No apps available</p><span>The catalog is empty</span></div>;
    if (filteredApps.length === 0) return <div className={styles.emptyState}><p>😢 Nothing found</p><span>Try changing your search or filter</span></div>;
    return filteredApps.map(app => (
      <AppCard key={app.id} title={app.title} text={app.text} date={app.date} price={app.price} image={app.image} searchTerm={searchTerm} />
    ));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px', background: '#f7f8fa', borderBottom: '1px solid #eee' }}>
        <button
          onClick={() => setMode('admin')}
          style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13 }}
        >
          ⚙️ Admin
        </button>
      </div>

      <h1 className={styles.header}>🛍️ MiniStore</h1>

      <div className={styles.searchContainer}>
        <input type="text" placeholder="🔍 Search apps..." value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className={styles.searchInput} />
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.priceToggle}>
          <button onClick={() => setPriceMode('all')} className={`${styles.toggleBtn} ${priceMode === 'all' ? styles.activeToggle : ''}`}>All</button>
          <button onClick={() => setPriceMode('free')} className={`${styles.toggleBtn} ${priceMode === 'free' ? styles.activeToggle : ''}`}>🎁 Free</button>
          <button onClick={() => setPriceMode('paid')} className={`${styles.toggleBtn} ${priceMode === 'paid' ? styles.activeToggle : ''}`}>💰 Paid</button>
        </div>
        <div className={styles.divider}></div>
        {categories.map(cat => (
          <button key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
            className={`${styles.filterButton} ${selectedCategory === cat.id ? styles.activeFilter : ''}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <main className={styles.main}>{renderContent()}</main>
    </>
  );
});

export default App;
