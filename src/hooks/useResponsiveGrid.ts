import { useEffect, useState } from 'react';

export interface ResponsiveGridStyles {
  mainLayoutStyle: React.CSSProperties;
  cardsGridStyle: React.CSSProperties;
}

export const useResponsiveGrid = (showCompleted: boolean): ResponsiveGridStyles => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1400);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMainLayoutStyle = (): React.CSSProperties => {
    if (showCompleted) {
      if (windowWidth < 480) {
        return { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' } as React.CSSProperties;
      } else if (windowWidth < 768) {
        return { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' } as React.CSSProperties;
      } else {
        return { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } as React.CSSProperties;
      }
    } else {
      return { display: 'grid', gridTemplateColumns: '1fr' } as React.CSSProperties;
    }
  };

  const getCardsGridStyle = (): React.CSSProperties => {
    let columns = 'repeat(4, 1fr)';

    if (showCompleted) {
      if (windowWidth < 768) {
        columns = '1fr';
      } else {
        columns = 'repeat(2, 1fr)';
      }
    } else {
      if (windowWidth < 480) {
        columns = '1fr';
      } else if (windowWidth < 768) {
        columns = 'repeat(2, 1fr)';
      } else if (windowWidth < 1400) {
        columns = 'repeat(3, 1fr)';
      }
    }

    return { '--cards-grid-columns': columns } as React.CSSProperties;
  };

  return {
    mainLayoutStyle: getMainLayoutStyle(),
    cardsGridStyle: getCardsGridStyle(),
  };
};
