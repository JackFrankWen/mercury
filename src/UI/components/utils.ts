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
 * @returns 格式化后的金额字符串，保留2位小数，使用千分位分隔符
 * @example
 * formatMoney(1234.56) // "1,234.56"
 * formatMoney("1234.56") // "1,234.56"
 */
export function formatMoney(amount: number | string): string {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
