import { useEffect, useMemo, useState } from 'react';

export type MotionPolicy = 'normal' | 'reduced' | 'off';

const MOTION_POLICY_KEY = 'pustakam-motion-policy';

export const readMotionPolicy = (): MotionPolicy => {
  if (typeof window === 'undefined') return 'normal';
  const value = window.localStorage.getItem(MOTION_POLICY_KEY);
  if (value === 'normal' || value === 'reduced' || value === 'off') return value;
  return 'normal';
};

export const saveMotionPolicy = (policy: MotionPolicy) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MOTION_POLICY_KEY, policy);
  document.documentElement.setAttribute('data-motion', policy);
};

export const useMotionPolicy = () => {
  const [policy, setPolicy] = useState<MotionPolicy>(() => readMotionPolicy());

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', policy);
  }, [policy]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === MOTION_POLICY_KEY) {
        setPolicy(readMotionPolicy());
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const shouldReduceMotion = useMemo(() => policy === 'reduced' || policy === 'off', [policy]);

  return {
    motionPolicy: policy,
    setMotionPolicy: (next: MotionPolicy) => {
      setPolicy(next);
      saveMotionPolicy(next);
    },
    shouldReduceMotion,
  };
};
