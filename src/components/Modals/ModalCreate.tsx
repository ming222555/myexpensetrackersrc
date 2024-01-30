import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './ModalCreate.module.scss';

export default function ModalCreate(props: { children: JSX.Element; onClose?: () => void }): JSX.Element {
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={styles.ModalCreate}
      onClick={(e): void => {
        e.stopPropagation();
        props.onClose ? props.onClose() : '';
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={(e): void => e.stopPropagation()} className={styles.ModalCreate__body}>
        {props.children}
      </div>
    </div>,
    mountDivRef.current,
  );
}
