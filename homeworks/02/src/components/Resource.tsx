import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { errorMessage, load } from '../api';

type Props<T> = { url: string; children: (data: T) => ReactNode };
type Reply<T> = { data: T } | { error: string };

export default function Resource<T>({ url, children }: Props<T>) {
  const [reply, setReply] = useState<Reply<T> | null>(null);
  const loading = reply === null;

  useEffect(() => {
    if (!loading) return;
    const controller = new AbortController();
    async function fetchData() {
      let result: Reply<T>;
      try {
        result = { data: await load<T>(url, controller.signal) };
      } catch (error) {
        result = { error: errorMessage(error) };
      }
      if (!controller.signal.aborted) setReply(result);
    }
    void fetchData();
    return () => controller.abort();
  }, [url, loading]);

  if (loading) return <p className="state" role="status">Загрузка…</p>;
  if ('error' in reply) return (
    <div className="state" role="alert">
      <p>{reply.error}</p>
      <button className="button" onClick={() => setReply(null)}>Повторить</button>
    </div>
  );
  return children(reply.data);
}
