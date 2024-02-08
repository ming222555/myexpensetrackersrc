import React, { useState } from 'react';

export default function SiderDrawer2({
  children,
  responsiveBreakPoint = 'sm',
  as = 'div',
  className = '',
}: {
  children: JSX.Element;
  responsiveBreakPoint?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ElementType<any>;
  className?: string;
}): JSX.Element {
  const [isShowBackdrop, setIsShowBackdrop] = useState(false);

  const handleShow = (): void => setIsShowBackdrop(true);
  const handleHide = (): void => setIsShowBackdrop(false);

  return (
    <div className='SiderDrawer2 h-100'>
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
        className={`SiderDrawer2__backdrop position-fixed position-${responsiveBreakPoint}-static w-100 w-${responsiveBreakPoint}-auto${
          isShowBackdrop ? ' show' : ''
        }`}
        // role='button'
        // tabIndex={0}
        onClick={handleHide}
        onKeyDown={handleHide}
      >
        {React.createElement(
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
