import mitt from 'mitt';
import { FormData } from './page/home/useReviewForm';

type Events = {
  environmentChange: 'production' | 'test';
  updateDate: FormData;
  refresh: 'transaction' | 'advancedRule' | 'fileList' | undefined;
  changeYear: {
    year: string;
  };
  // Add other event types here
};

const emitter = mitt<Events>();

export default emitter; 