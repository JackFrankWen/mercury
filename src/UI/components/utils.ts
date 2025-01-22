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
  if (isNaN(Number(number))) {
    return 'NaN'
  }

  return Number(number).toFixed(2)
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
