import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './ModalSpinner.module.scss';

export default function ModalSpinner(): JSX.Element {
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
    <div className={styles.ModalSpinner}>
      <div className={styles.ModalSpinner__body}>
        <span className={styles.ModalSpinner__loader}></span>
      </div>
    </div>,
    mountDivRef.current,
  );
}
