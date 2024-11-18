import { useCallback, useState } from 'react';
import { Href, useRouter } from 'expo-router';

type NavigationMethod = 'push' | 'replace' | 'back';

export function usePreventDoubleNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateSafely = useCallback(
    (path: Href, method: NavigationMethod = 'push') => {
      if (isNavigating) return;

      setIsNavigating(true);

      try {
        switch (method) {
          case 'push':
            router.push(path);
            break;
          case 'replace':
            router.replace(path);
            break;
          case 'back':
            router.back();
            break;
        }
      } catch (error) {
        console.error('Navigation error:', error);
        setIsNavigating(false);
      }

      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 500);

      return () => clearTimeout(timer);
    },
    [isNavigating, router]
  );

  return {
    navigateSafely,
    isNavigating,
  };
}
