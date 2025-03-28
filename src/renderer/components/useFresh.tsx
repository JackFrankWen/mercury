import { useEffect } from 'react';
import emitter from 'src/renderer/events';

export const useFresh = (
  callback: (key?: 'transaction' | 'advancedRule') => void,
  deps: React.DependencyList,
  type?: 'transaction' | 'advancedRule',
) => {
  useEffect(() => {
    emitter.on('refresh', (key: string) => {
      if (type === key)
      callback();
    });
    return () => {
      emitter.off('refresh', callback);
    };
  }, [callback]);
  useEffect(() => {
    if (deps && deps.length > 0) {
      callback();
    }
  }, deps);
};
