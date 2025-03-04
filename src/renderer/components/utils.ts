export function getDateTostring(obj: any): { start: string; end: string } {
  const returnV = {
    ...obj,
    start: obj.date[0].format('YYYY-MM-DD HH:mm:ss'),
    end: obj.date[1].format('YYYY-MM-DD HH:mm:ss'),
  }
  delete returnV.date
  return returnV
}

export function roundToTwoDecimalPlaces(number: any): string {
  // 判断参数是否为数字类型或可转化为数字类型
  if (number === null || number === undefined) {
    return 'NaN'
  }

  const num = Number(number)
  if (isNaN(num)) {
    return 'NaN'
  }

  // 处理特殊值
  if (!isFinite(num)) {
    return 'NaN'
  }

  // 使用Math.round确保四舍五入的准确性
  return (Math.round(num * 100) / 100).toFixed(2)
}
export function toNumberOrUndefiend(number: any): number | undefined {
  if (!number) {
    return undefined
  }
  // 判断参数是否为数字类型或可转化为数字类型
  if (isNaN(Number(number))) {
    return undefined
  }

  return Number(number)
}

/**
 * 格式化金额为中文货币格式字符串
 * @param amount - 要格式化的金额，可以是数字或字符串
 * @param unit - 可选的单位，支持 "万"
 * @returns 格式化后的金额字符串
 * @example
 * formatMoney(1234.56) // "1,234.56"
 * formatMoney("1234") // "1,234"
 * formatMoney(12345, "万") // "1.2万"
 */
export function formatMoney(amount: number | string, unit?: '万'): string {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  
  if (unit === '万') {
    amount = amount / 10000;
    const formattedAmount = amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
    return `${formattedAmount}${unit}`;
  }

  const hasDecimal = amount % 1 !== 0;
  const formattedAmount = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: 2
  });

  return formattedAmount;
}
