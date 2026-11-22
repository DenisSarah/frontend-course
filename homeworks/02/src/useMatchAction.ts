import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorMessage } from './api';

export default function useMatchAction() {
  const navigate = useNavigate();
  const active = useRef<AbortController | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => active.current?.abort(), []);

  async function run(action: (signal: AbortSignal) => Promise<string>) {
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setError('');
    setPending(true);
    try {
      const destination = await action(controller.signal);
      if (!controller.signal.aborted) navigate(destination, { replace: true });
    } catch (cause) {
      if (!controller.signal.aborted) setError(errorMessage(cause));
    } finally {
      active.current = null;
      if (!controller.signal.aborted) setPending(false);
    }
  }
  return { run, pending, error };
}
