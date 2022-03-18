import copy from 'copy-text-to-clipboard';
import { useCallback, useState } from 'react';

/**
 * use to copy text into clipboard
 */
export default (): [(text: string) => void, 'ready' | 'copied'] => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [status, setStatus] = useState<'ready' | 'copied'>('ready');
  const handler = useCallback((text: string) => {
    copy(text);
    setStatus('copied');

    // reset status after 2000ms
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        setStatus('ready');
      }, 2000),
    );
  }, []);

  return [handler, status];
};
