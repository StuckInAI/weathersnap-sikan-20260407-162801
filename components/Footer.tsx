import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>© {new Date().getFullYear()} WeatherSnap — Built with Next.js 14</span>
        <span className={styles.note}>Data provided by Open-Meteo</span>
      </div>
    </footer>
  );
}
