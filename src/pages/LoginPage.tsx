import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores';

interface Props {
  onGoToRegister: () => void;
  onSuccess: () => void;
}

const LoginPage = observer(({ onGoToRegister, onSuccess }: Props) => {
  const { authStore } = useStores();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const ok = await authStore.login(email, password);
    if (ok) onSuccess();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Вход</h2>
        <p style={styles.subtitle}>Войдите в панель редактора</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {authStore.error && <p style={styles.error}>{authStore.error}</p>}

        <button
          style={styles.btn}
          onClick={handleSubmit}
          disabled={authStore.isLoading}
        >
          {authStore.isLoading ? 'Загрузка...' : 'Войти'}
        </button>

        <p style={styles.link}>
          Нет аккаунта?{' '}
          <span style={styles.linkBtn} onClick={onGoToRegister}>
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5',
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '40px 32px',
    width: 360,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  title: { margin: 0, fontSize: 22, color: '#1a1a1a' },
  subtitle: { margin: 0, fontSize: 14, color: '#888' },
  input: {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 14,
    outline: 'none',
  },
  btn: {
    padding: '12px',
    borderRadius: 8,
    border: 'none',
    background: '#0077ff',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
  error: { color: '#e53935', fontSize: 13, margin: 0 },
  link: { textAlign: 'center', fontSize: 13, color: '#666', margin: 0 },
  linkBtn: { color: '#0077ff', cursor: 'pointer', fontWeight: 600 },
};

export default LoginPage;
