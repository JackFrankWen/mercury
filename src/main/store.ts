import Store from 'electron-store';

// 定义存储的类型
interface StoreSchema {
  environment: 'production' | 'test';
}

// 创建并导出 store 实例
const store = new Store<StoreSchema>({
  defaults: {
    environment: 'production'
  }
});

export default store;
