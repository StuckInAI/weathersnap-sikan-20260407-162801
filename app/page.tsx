import Header from '@/components/Header';
import WeatherDashboard from '@/components/WeatherDashboard';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.content}>
        <WeatherDashboard />
      </div>
      <Footer />
    </main>
  );
}
