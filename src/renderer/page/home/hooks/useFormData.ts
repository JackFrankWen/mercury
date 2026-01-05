import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import emitter from 'src/renderer/events';

export interface FormData {
  date: string;
  trans_time: string[];
  type: 'year' | 'month';
}

/**
 * 管理表单数据的 Hook
 * 支持年度和月度视图切换
 */
export function useFormData() {
  const now = dayjs();
  // 如果当前是一月，则取去年，否则取今年
  const lastYear = now.month() === 0 ? now.subtract(1, 'year').format('YYYY') : now.format('YYYY');

  const [formData, setFormData] = useState<FormData>({
    date: lastYear,
    trans_time: [`${lastYear}-01-01 00:00:00`, `${lastYear}-12-31 23:59:59`],
    type: 'year',
  });

  useEffect(() => {
    const handleUpdateDate = (val: FormData) => {
      setFormData(val);
    };

    emitter.on('updateDate', handleUpdateDate);

    return () => {
      emitter.off('updateDate', handleUpdateDate);
    };
  }, []);

  return [formData, setFormData] as const;
}

