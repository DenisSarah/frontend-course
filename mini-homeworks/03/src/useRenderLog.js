import { useEffect } from 'react';

export function useRenderLog(name) {
  useEffect(() => {
    if (import.meta.env.DEV) console.count(`[${import.meta.env.MODE}] ${name}`);
  });
}
