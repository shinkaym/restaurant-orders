import { useEffect } from 'react';

/**
 * Hook to set document title for a page
 * @param title - The page title to display in browser tab
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
