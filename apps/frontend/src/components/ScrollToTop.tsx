import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

function ScrollToTop() {
  const { location } = useRouterState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
