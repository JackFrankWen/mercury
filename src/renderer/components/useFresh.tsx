import { useEffect } from 'react';
import emitter from 'src/renderer/events';

export const useFresh = (
  callback: (key?: 'transaction' | 'advancedRule' | 'fileList') => void,
  deps: React.DependencyList,
  type?: 'transaction' | 'advancedRule' | 'fileList',
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
    callback();
  }, deps);
};
