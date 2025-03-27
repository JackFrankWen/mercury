import { useEffect } from 'react';
import emitter from 'src/renderer/events';

export const useFresh = (callback: () => void, deps: React.DependencyList) => {
  useEffect(() => {
    emitter.on('refresh', callback);
    return () => {
      emitter.off('refresh', callback);
    };
  }, [callback]);
  useEffect(() => {
    if (deps.length > 0) {
      callback();
    }
  }, deps);
};
