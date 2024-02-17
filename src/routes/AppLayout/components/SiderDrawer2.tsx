import { createElement, ElementType, useState } from 'react';

import { BootstrapBreakpoints } from '../../../util';

export default function SiderDrawer2({
  children,
  responsiveBreakPoint,
  as = 'div',
  className = '',
  placement = 'start',
}: {
  children: JSX.Element;
  responsiveBreakPoint: BootstrapBreakpoints;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: ElementType<any>;
  className?: string;
  placement?: 'start' | 'end';
}): JSX.Element {
  const [isShowBackdrop, setIsShowBackdrop] = useState(false);

  const handleShow = (): void => setIsShowBackdrop(true);
  const handleHide = (): void => setIsShowBackdrop(false);

  return (
    <div className={`bg-success SiderDrawer2 h-100 position-relative${isShowBackdrop ? ' z-3' : ' z-0'}`}>
      <div
        className={`SiderDrawer2__reveal h-100 d-${responsiveBreakPoint}-none bg-primary`}
        role='button'
        tabIndex={0}
        onClick={handleShow}
        onKeyDown={handleShow}
        style={{ color: 'transparent' }}
      >
        +
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={`SiderDrawer2__backdrop ${
          placement === 'end' ? 'SiderDrawer2__backdrop--end d-flex justify-content-end ' : ''
        }position-fixed position-${responsiveBreakPoint}-static w-100 w-${responsiveBreakPoint}-auto${isShowBackdrop ? ' show' : ''}`}
        // role='button'
        // tabIndex={0}
        onClick={handleHide}
        onKeyDown={handleHide}
      >
        {createElement(
          as,
          {
            className: `SiderDrawer2__body vh-100 overflow-auto${className ? ' ' + className : ''}`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick: (evt: any): void => evt.stopPropagation(),
            style: { background: 'white' },
          },
          [children],
        )}
      </div>
    </div>
  );
}
