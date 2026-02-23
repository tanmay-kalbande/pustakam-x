import { useEffect, useMemo, useState } from 'react';

export type ContentDensity = 'comfortable' | 'compact';

const DENSITY_KEY = 'pustakam-content-density';

const readDensity = (): ContentDensity => {
  if (typeof window === 'undefined') return 'comfortable';
  const saved = window.localStorage.getItem(DENSITY_KEY);
  return saved === 'compact' ? 'compact' : 'comfortable';
};

export const useContentDensity = () => {
  const [density, setDensity] = useState<ContentDensity>(() => readDensity());

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === DENSITY_KEY) {
        setDensity(readDensity());
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return {
    density,
    setDensity: (next: ContentDensity) => {
      setDensity(next);
      window.localStorage.setItem(DENSITY_KEY, next);
    },
    isCompact: useMemo(() => density === 'compact', [density]),
  };
};
