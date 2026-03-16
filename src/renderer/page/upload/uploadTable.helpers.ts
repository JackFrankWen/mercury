// 使用宽松类型，避免与不同阶段的交易数据类型冲突
export interface NeedTransferItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  dataIndex: number;
}

export interface NeedTransferDataResult {
  hasJingdong: boolean;
  hasPdd: boolean;
  jingdongData: NeedTransferItem[];
  pddData: NeedTransferItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkNeedTransferData(data: any[]): NeedTransferDataResult {
  const jingdongData = data
    .map((obj, dataIndex) =>
      obj.payee?.includes('京东') && obj.description?.includes('京东-订单编号')
        ? { ...obj, dataIndex }
        : null
    )
    .filter(Boolean) as NeedTransferItem[];

  const pddData = data
    .map((obj, dataIndex) =>
      obj.payee?.includes('拼多多') && obj.description?.includes('商户单号')
        ? { ...obj, dataIndex }
        : null
    )
    .filter(Boolean) as NeedTransferItem[];

  const hasJingdong = jingdongData.length > 0;
  const hasPdd = pddData.length > 0;

  return {
    hasJingdong,
    hasPdd,
    jingdongData,
    pddData,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateTotals(data: any[]) {
  const totalCost = data.reduce((acc, obj) => {
    if (obj.flow_type === 1) {
      return acc + Number(obj.amount);
    }
    return acc;
  }, 0);

  const totalIncome = data.reduce((acc, obj) => {
    if (obj.flow_type === 2) {
      return acc + Number(obj.amount);
    }
    return acc;
  }, 0);

  const totalNoCost = data.reduce((acc, obj) => {
    if (obj.flow_type === 3) {
      return acc + Number(obj.amount);
    }
    return acc;
  }, 0);

  return {
    totalCost,
    totalIncome,
    totalNoCost,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateCounts(data: any[]) {
  const totalNoCostCount = data.reduce((acc, obj) => {
    if (obj.flow_type === 3) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const totalIncomeCount = data.reduce((acc, obj) => {
    if (obj.flow_type === 2) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const totalCostCount = data.reduce((acc, obj) => {
    if (obj.flow_type === 1) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return {
    totalNoCostCount,
    totalIncomeCount,
    totalCostCount,
  };
}

