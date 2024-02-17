import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import Alert, { AlertProps } from 'react-bootstrap/Alert';

import styles from './ModalAlert.module.scss';

export default function ModalAlert({ message, variant = 'success' }: { message: string; variant?: AlertProps['variant'] }): JSX.Element {
  const mountDivRef = useRef(document.createElement('div'));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById('modal-root')!.appendChild(mountDivRef.current);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, react-hooks/exhaustive-deps
      document.getElementById('modal-root')!.removeChild(mountDivRef.current);
    };
  }, []);

  return ReactDOM.createPortal(
    <div className={styles.ModalAlert}>
      <div className={styles.ModalAlert__body}>
        <Alert variant={variant}>{message}</Alert>
      </div>
    </div>,
    mountDivRef.current,
  );
}
