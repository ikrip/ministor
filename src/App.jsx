import styles from './App.module.css'
import {AppCard} from './AppCard'


export default function App() {
  return (
    <>
      <h1 className={styles.header}>MiniStore</h1>
      <main>
        {[
          {title: 'Product1', text: 'Text1', date: '27.04', price: '500h'}, 
          {title: 'Product2', text: 'Text2', date: '28.04'}, 
          {title: 'Product3', text: 'Text3', date: '29.04'}
        ].map(({title, text, date}) => (
          <AppCard 
            title={title}
            text={text}
            date={date}
          />
        ))}
      </main>
    </>
  );
}
