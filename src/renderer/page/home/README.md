# Home 页面代码结构

## 目录结构

```
src/renderer/page/home/
├── components/                    # 组件目录
│   ├── AdvancedSearchModal.tsx   # 高级搜索模态框
│   ├── CategoryChartTab.tsx      # 分类图表标签页（新）
│   ├── CategoryDataTab.tsx       # 分类数据标签页（新）
│   ├── DateSelector.tsx          # 日期选择器
│   ├── LeftSection.tsx           # 左侧内容区域
│   ├── RightSection.tsx          # 右侧内容区域
│   └── TransactionModal.tsx      # 交易详情模态框（新）
│
├── hooks/                        # 自定义 Hooks
│   ├── useCategoryModal.ts       # 分类模态框状态管理（新）
│   ├── useFormData.ts            # 表单数据管理
│   ├── useLeftSectionData.ts     # 左侧区域数据管理（新）
│   ├── useRightSectionData.ts    # 右侧区域数据管理（新）
│   └── useTransactionModal.ts    # 交易模态框数据管理（新）
│
├── types/                        # 类型定义（新）
│   └── index.ts                  # 统一类型定义
│
├── utils/                        # 工具函数（新）
│   └── categoryDataConverter.ts  # 分类数据转换工具
│
├── accountInfo.tsx               # 账户信息组件
├── companySummarize.tsx          # 公司汇总组件
├── consumerChart.tsx             # 消费者图表组件
├── index.tsx                     # 主入口
├── review-sum.tsx                # 汇总组件
├── reviewTable.tsx               # 表格区域
├── yearBarChart.tsx              # 年度柱状图
└── ...其他文件
```

## 架构设计

### 数据流向

```
index.tsx (主入口)
  ├─> useFormData()              # 表单数据
  ├─> useExtraControls()         # 筛选控件状态
  ├─> useLeftSectionData()       # 左侧数据管理
  │     ├─> summarizeData
  │     ├─> companySummarizeData
  │     ├─> yearBarChartData
  │     ├─> categoryData
  │     └─> refreshLeftSectionData()
  │
  └─> useRightSectionData()      # 右侧数据管理
        ├─> accountData
        ├─> consumerData
        └─> refreshRightSectionData()
```

### 组件层级

```
Index
├── LeftSection
│   ├── Summarize                 # 汇总统计
│   ├── CompanySummarize          # 公司账户汇总
│   ├── YearBarChart              # 年度图表
│   └── TableSection              # 数据表格区域
│       ├── CategoryChartTab      # 图表标签页
│       │   ├── CategoryCollaspe
│       │   └── TransactionModal
│       └── CategoryDataTab       # 数据标签页
│           ├── DonutChart
│           ├── CategoryTable
│           └── TransactionModal
│
└── RightSection
    ├── DateSelector              # 日期选择器
    ├── AccountInfo               # 账户信息
    └── ConsumerChart             # 消费者图表
```

## 设计原则

### 1. 关注点分离
- **数据管理**: 所有数据请求和状态管理集中在自定义 hooks 中
- **UI 展示**: 组件只负责接收 props 和渲染 UI
- **业务逻辑**: 工具函数处理数据转换等业务逻辑

### 2. 单一职责
- 每个组件只负责一个特定的功能
- 复杂组件拆分成多个小组件
- hooks 按功能领域划分

### 3. 可复用性
- 类型定义统一管理在 `types/index.ts`
- 工具函数独立提取到 `utils/` 目录
- 通用 hooks 可以在不同组件间复用

### 4. 类型安全
- 所有组件都有明确的 TypeScript 类型定义
- Props 接口清晰明确
- 避免使用 any 类型

## 重构要点

### 数据管理抽离
**之前**: 每个组件内部维护自己的状态和数据请求
```tsx
// accountInfo.tsx (旧)
const [data, setData] = useState([]);
useFresh(() => {
  getSumrize(formValue);
}, [formValue], 'transaction');
```

**之后**: 数据统一在顶层 hooks 管理
```tsx
// index.tsx (新)
const { accountData, consumerData, refreshRightSectionData } = 
  useRightSectionData(formValue);
```

### 组件拆分
**之前**: 大组件包含多个内联子组件
```tsx
// reviewTable.tsx (旧)
const TransactionModal = () => { ... }  // 内联组件
const Tab1Content = () => { ... }       // 内联组件
const Tab2Content = () => { ... }       // 内联组件
```

**之后**: 独立的组件文件
```
components/
├── TransactionModal.tsx
├── CategoryChartTab.tsx
└── CategoryDataTab.tsx
```

### Hooks 抽离
**之前**: 逻辑散落在组件内部
```tsx
const [modalVisible, setModalVisible] = useState(false);
const [selectedCategory, setSelectedCategory] = useState('');
const showModal = (category) => { ... }
const closeModal = () => { ... }
```

**之后**: 逻辑封装在自定义 hook
```tsx
// hooks/useCategoryModal.ts
export function useCategoryModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  // ...
  return { modalVisible, selectedCategory, showModal, closeModal };
}
```

### 类型统一
**之前**: 类型定义分散在各个文件
```tsx
// 多个文件中重复定义
interface ConsumerData { item: string; total: number; }
```

**之后**: 统一的类型定义文件
```tsx
// types/index.ts
export type ConsumerData = { item: string; total: number; };
```

## 优势

✅ **维护性提升**: 代码结构清晰，易于定位和修改  
✅ **可测试性**: 组件纯粹化，hooks 独立，便于单元测试  
✅ **复用性**: 通用组件和 hooks 可以在其他页面复用  
✅ **类型安全**: TypeScript 类型完整，减少运行时错误  
✅ **团队协作**: 清晰的目录结构和职责划分，便于多人协作  

