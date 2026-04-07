import type { WeatherData } from './WeatherDashboard';
import styles from './WeatherDetails.module.css';

type Props = { data: WeatherData };

type DetailItem = {
  icon: string;
  label: string;
  value: string;
  sub?: string;
};

function getUvLabel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

export default function WeatherDetails({ data }: Props) {
  const details: DetailItem[] = [
    { icon: '💧', label: 'Humidity',    value: `${data.humidity}%`,          sub: data.humidity > 70 ? 'High' : data.humidity > 40 ? 'Moderate' : 'Low' },
    { icon: '💨', label: 'Wind Speed',  value: `${data.windSpeed} km/h`,     sub: `Direction: ${data.windDirection}°` },
    { icon: '🌡', label: 'Feels Like',  value: `${data.feelsLike}°C`,        sub: data.feelsLike < data.temperature ? 'Colder than actual' : 'Warmer than actual' },
    { icon: '☀️', label: 'UV Index',    value: `${data.uvIndex}`,            sub: getUvLabel(data.uvIndex) },
    { icon: '👁', label: 'Visibility',  value: `${data.visibility} km`,      sub: data.visibility >= 10 ? 'Excellent' : data.visibility >= 5 ? 'Good' : 'Poor' },
    { icon: '🔵', label: 'Pressure',    value: `${data.pressure} hPa`,       sub: data.pressure > 1013 ? 'High' : 'Low' },
  ];

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Weather Details</h3>
      <div className={styles.grid}>
        {details.map((item) => (
          <div key={item.label} className={styles.item}>
            <span className={styles.icon}>{item.icon}</span>
            <div className={styles.info}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{item.value}</span>
              {item.sub && <span className={styles.sub}>{item.sub}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
