import type { ForecastDay } from './WeatherDashboard';
import styles from './ForecastStrip.module.css';

type Props = { forecast: ForecastDay[] };

function formatDate(dateStr: string): { day: string; date: string } {
  const d = new Date(dateStr + 'T12:00:00');
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
}

export default function ForecastStrip({ forecast }: Props) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>7-Day Forecast</h3>
      <div className={styles.strip}>
        {forecast.map((day, index) => {
          const { day: dayName, date } = formatDate(day.date);
          const isToday = index === 0;
          return (
            <div key={day.date} className={`${styles.card} ${isToday ? styles.today : ''}`}>
              <span className={styles.dayName}>{isToday ? 'Today' : dayName}</span>
              <span className={styles.dateStr}>{date}</span>
              <span className={styles.icon}>{day.icon}</span>
              <span className={styles.desc}>{day.description}</span>
              <div className={styles.temps}>
                <span className={styles.maxTemp}>{day.maxTemp}°</span>
                <span className={styles.minTemp}>{day.minTemp}°</span>
              </div>
              {day.precipitationSum > 0 && (
                <span className={styles.precip}>💧 {day.precipitationSum.toFixed(1)}mm</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
