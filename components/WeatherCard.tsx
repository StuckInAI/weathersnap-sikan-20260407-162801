import type { WeatherData } from './WeatherDashboard';
import styles from './WeatherCard.module.css';

type Props = { data: WeatherData };

function getBackground(code: number, isDay: boolean): string {
  if (!isDay) return 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)';
  if (code === 0 || code === 1) return 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)';
  if (code <= 3) return 'linear-gradient(135deg, #334155 0%, #64748b 100%)';
  if (code <= 55) return 'linear-gradient(135deg, #1e3a5f 0%, #475569 100%)';
  if (code <= 82) return 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)';
  return 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)';
}

function windDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export default function WeatherCard({ data }: Props) {
  const bg = getBackground(data.weatherCode, data.isDay);

  return (
    <div className={styles.card} style={{ background: bg }}>
      <div className={styles.top}>
        <div className={styles.location}>
          <h2 className={styles.city}>{data.city}</h2>
          <p className={styles.country}>{data.country}</p>
          <p className={styles.coords}>
            {data.lat.toFixed(2)}°N, {data.lon.toFixed(2)}°E
          </p>
        </div>
        <div className={styles.iconBlock}>
          <span className={styles.weatherIcon}>{data.icon}</span>
          <span className={styles.dayNight}>{data.isDay ? 'Day' : 'Night'}</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.tempBlock}>
          <span className={styles.temp}>{data.temperature}°</span>
          <span className={styles.unit}>C</span>
        </div>
        <div className={styles.descBlock}>
          <p className={styles.description}>{data.description}</p>
          <p className={styles.feelsLike}>Feels like {data.feelsLike}°C</p>
          <p className={styles.wind}>
            💨 {data.windSpeed} km/h {windDirection(data.windDirection)}
          </p>
        </div>
      </div>
    </div>
  );
}
