import styles from './ErrorMessage.module.css';

type Props = { message: string };

export default function ErrorMessage({ message }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>⚠️</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
