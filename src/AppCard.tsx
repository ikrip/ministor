import * as React from 'react';
import styles from './AppCard.module.css';

interface AppCardProps {
  title: string;
  text: string;
  date: string;
  price: string;
  image: string; // Зарегистрировали картинку в пропсах карточки
  searchTerm: string;
}

function highlightText(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm || searchTerm.trim() === '') {
    return text;
  }
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark 
        key={index} 
        style={{ background: '#fff3bf', color: '#333', padding: '0 2px', borderRadius: '3px' }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function AppCard({ title, text, date, price, image, searchTerm }: AppCardProps) {
  const isFree = price === 'Free';
  
  return (
    <section className={styles.card}>
      {/* Блок для отображения иконки приложения */}
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.appImage} />
      </div>
      
      <h2>{highlightText(title, searchTerm)}</h2>
      <p>{highlightText(text, searchTerm)}</p>
      <div className={styles.footer}>
        <span className={styles.date}>{date}</span>
        <span className={`${styles.price} ${isFree ? styles.free : styles.paid}`}>
          {price}
        </span>
      </div>
    </section>
  );
}