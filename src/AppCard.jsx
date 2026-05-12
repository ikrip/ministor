import styles from './AppCard.module.css'

// Функция для подсветки найденного текста
function highlightText(text, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    return text;
  }
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? 
      <mark key={index} style={{ background: '#fff3bf', color: '#333', padding: '0 2px', borderRadius: '3px' }}>
        {part}
      </mark> : 
      part
  );
}

export function AppCard({title, text, date, price, searchTerm}){
    const isFree = price === 'Free';
    
    return (
        <section className={styles.card}>
            <h2>{highlightText(title, searchTerm)}</h2>
            <p>{highlightText(text, searchTerm)}</p>
            <div className={styles.cardFooter}>
                <span className={styles.date}>{date}</span>
                <span className={styles.price} data-free={isFree}>
                    {price === 'Free' ? '🎁 ' + price : price}
                </span>
            </div>
        </section>
    )
}