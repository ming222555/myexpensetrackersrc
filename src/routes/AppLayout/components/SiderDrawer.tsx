import { ElementType, useState } from 'react';

import Offcanvas, { OffcanvasPlacement } from 'react-bootstrap/Offcanvas';

function SiderDrawer({
  children,
  responsiveBreakPoint = 'sm',
  as = 'div',
  className = '',
  placement = 'start',
}: {
  children: JSX.Element;
  responsiveBreakPoint?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: ElementType<any>;
  className?: string;
  placement?: OffcanvasPlacement;
}): JSX.Element {
  const [show, setShow] = useState(false);

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);

  return (
    <div className='SiderDrawer h-100'>
      <div
        className={`SiderDrawer__reveal h-100 d-${responsiveBreakPoint}-none`}
        role='button'
        tabIndex={0}
        onClick={handleShow}
        onKeyDown={handleShow}
        style={{ color: 'transparent' }}
      >
        +
      </div>
      <div className='SiderDrawer__children'>
        <Offcanvas
          show={show}
          onHide={handleClose}
          responsive={responsiveBreakPoint}
          style={{ '--bs-offcanvas-width': 'auto' }}
          placement={placement}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body as={as} className={className}>
            {children}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

export default SiderDrawer;
