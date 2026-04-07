'use client';

import { useState, useCallback } from 'react';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import ForecastStrip from './ForecastStrip';
import WeatherDetails from './WeatherDetails';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import styles from './WeatherDashboard.module.css';

export type WeatherData = {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  description: string;
  icon: string;
  isDay: boolean;
  uvIndex: number;
  visibility: number;
  pressure: number;
  forecast: ForecastDay[];
};

export type ForecastDay = {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  icon: string;
  description: string;
  precipitationSum: number;
};

type GeoResult = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

const WMO_CODES: Record<number, { description: string; icon: string; iconNight?: string }> = {
  0:  { description: 'Clear sky',           icon: '☀️', iconNight: '🌙' },
  1:  { description: 'Mainly clear',         icon: '🌤', iconNight: '🌤' },
  2:  { description: 'Partly cloudy',        icon: '⛅', iconNight: '⛅' },
  3:  { description: 'Overcast',             icon: '☁️', iconNight: '☁️' },
  45: { description: 'Foggy',                icon: '🌫', iconNight: '🌫' },
  48: { description: 'Icy fog',              icon: '🌫', iconNight: '🌫' },
  51: { description: 'Light drizzle',        icon: '🌦', iconNight: '🌦' },
  53: { description: 'Drizzle',              icon: '🌦', iconNight: '🌦' },
  55: { description: 'Heavy drizzle',        icon: '🌧', iconNight: '🌧' },
  61: { description: 'Slight rain',          icon: '🌧', iconNight: '🌧' },
  63: { description: 'Rain',                 icon: '🌧', iconNight: '🌧' },
  65: { description: 'Heavy rain',           icon: '🌧', iconNight: '🌧' },
  71: { description: 'Slight snow',          icon: '🌨', iconNight: '🌨' },
  73: { description: 'Snow',                 icon: '❄️', iconNight: '❄️' },
  75: { description: 'Heavy snow',           icon: '❄️', iconNight: '❄️' },
  80: { description: 'Slight showers',       icon: '🌦', iconNight: '🌦' },
  81: { description: 'Showers',              icon: '🌧', iconNight: '🌧' },
  82: { description: 'Violent showers',      icon: '🌩', iconNight: '🌩' },
  95: { description: 'Thunderstorm',         icon: '⛈', iconNight: '⛈' },
  96: { description: 'Thunderstorm w/ hail', icon: '⛈', iconNight: '⛈' },
  99: { description: 'Heavy thunderstorm',   icon: '⛈', iconNight: '⛈' },
};

function getWeatherInfo(code: number, isDay: boolean): { description: string; icon: string } {
  const entry = WMO_CODES[code] ?? { description: 'Unknown', icon: '🌡' };
  const icon = (!isDay && entry.iconNight) ? entry.iconNight : entry.icon;
  return { description: entry.description, icon };
}

export default function WeatherDashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      if (!geoRes.ok) throw new Error('Geocoding request failed');
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`City "${city}" not found. Please try another name.`);
      }
      const loc: GeoResult = geoData.results[0];

      const meteoRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day,surface_pressure,visibility` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max` +
        `&timezone=auto&forecast_days=7`
      );
      if (!meteoRes.ok) throw new Error('Weather data request failed');
      const meteoData = await meteoRes.json();

      const current = meteoData.current;
      const daily = meteoData.daily;
      const isDay: boolean = current.is_day === 1;
      const weatherCode: number = current.weather_code;
      const { description, icon } = getWeatherInfo(weatherCode, isDay);

      const forecast: ForecastDay[] = (daily.time as string[]).map((date: string, i: number) => {
        const fc = daily.weather_code[i] as number;
        const fcInfo = getWeatherInfo(fc, true);
        return {
          date,
          maxTemp: Math.round(daily.temperature_2m_max[i] as number),
          minTemp: Math.round(daily.temperature_2m_min[i] as number),
          weatherCode: fc,
          icon: fcInfo.icon,
          description: fcInfo.description,
          precipitationSum: (daily.precipitation_sum[i] as number) ?? 0,
        };
      });

      const uvIndex = (daily.uv_index_max?.[0] as number) ?? 0;

      setWeather({
        city: loc.name,
        country: loc.country,
        lat: loc.latitude,
        lon: loc.longitude,
        temperature: Math.round(current.temperature_2m as number),
        feelsLike: Math.round(current.apparent_temperature as number),
        humidity: current.relative_humidity_2m as number,
        windSpeed: Math.round(current.wind_speed_10m as number),
        windDirection: current.wind_direction_10m as number,
        weatherCode,
        description,
        icon,
        isDay,
        uvIndex: Math.round(uvIndex),
        visibility: Math.round((current.visibility as number) / 1000),
        pressure: Math.round(current.surface_pressure as number),
        forecast,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.hero}>
        <h1 className={styles.headline}>Your Weather, Instantly</h1>
        <p className={styles.subheadline}>Search any city to get real-time weather data and a 7-day forecast.</p>
      </div>
      <SearchBar onSearch={fetchWeather} loading={loading} />
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {weather && !loading && (
        <div className={styles.results}>
          <WeatherCard data={weather} />
          <WeatherDetails data={weather} />
          <ForecastStrip forecast={weather.forecast} />
        </div>
      )}
      {!weather && !loading && !error && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>🌍</div>
          <p>Enter a city name to see the weather</p>
          <div className={styles.suggestions}>
            {['London', 'New York', 'Tokyo', 'Sydney', 'Paris'].map((city) => (
              <button
                key={city}
                className={styles.suggestionBtn}
                onClick={() => fetchWeather(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
