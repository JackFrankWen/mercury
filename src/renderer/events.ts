import mitt from 'mitt';

type Events = {
  environmentChange: 'production' | 'test';
  // Add other event types here
};

const emitter = mitt<Events>();

export default emitter; 