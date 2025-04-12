import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import styles from './error-banner.module.css';

type ErrorBannerProps = {
  error?: string;
  onClose: () => void;
};

export const ErrorBannerUI = ({ error, onClose }: ErrorBannerProps) => (
  <>
    <div className={styles.container}>
      <div className={styles.buttonClose}>
        <CloseIcon type='primary' onClick={onClose} />
      </div>
      <p>{error}</p>
    </div>
  </>
);
