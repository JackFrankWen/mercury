/**
 * 消费者类型映射
 */
export const CONSUMER_TYPE_MAP = {
  1: { label: '老公', color: 'cyan' },
  2: { label: '老婆', color: 'magenta' },
  3: { label: '家庭', color: 'geekblue' },
  4: { label: '牧牧', color: 'purple' },
  5: { label: '爷爷奶奶', color: 'lime' },
  6: { label: '溪溪', color: 'orange' },
  7: { label: '姥爷', color: 'gold' },
  8: { label: '公司', color: 'green' },
} as const;

export type ConsumerType = keyof typeof CONSUMER_TYPE_MAP;

