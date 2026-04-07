'use client';

import { useState, FormEvent } from 'react';
import styles from './SearchBar.module.css';

type Props = {
  onSearch: (city: string) => void;
  loading: boolean;
};

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search city (e.g. London, Tokyo, New York...)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          aria-label="City search"
        />
        {value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => setValue('')}
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || !value.trim()}
      >
        {loading ? <span className={styles.spinner} /> : 'Search'}
      </button>
    </form>
  );
}
