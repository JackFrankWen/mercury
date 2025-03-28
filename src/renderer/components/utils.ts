export function getDateTostring(obj: any): { start: string; end: string } {
  const returnV = {
    ...obj,
    start: obj.date[0].format("YYYY-MM-DD HH:mm:ss"),
    end: obj.date[1].format("YYYY-MM-DD HH:mm:ss"),
  };
  delete returnV.date;
  return returnV;
}

export function roundToTwoDecimalPlaces(number: any): string {
  // 判断参数是否为数字类型或可转化为数字类型
  if (number === null || number === undefined) {
    return "NaN";
  }

  const num = Number(number);
  if (isNaN(num)) {
    return "NaN";
  }

  // 处理特殊值
  if (!isFinite(num)) {
    return "NaN";
  }

  // 使用Math.round确保四舍五入的准确性
  return (Math.round(num * 100) / 100).toFixed(2);
}
export function toNumberOrUndefiend(number: any): number | undefined {
  if (!number) {
    return undefined;
  }
  // 判断参数是否为数字类型或可转化为数字类型
  if (isNaN(Number(number))) {
    return undefined;
  }

  return Number(number);
}
export function formatMoney(amount: number | string, unit?: "万" | "千" | "亿", autoUnit?: boolean, decimalPlaces?: number): string {
  return formatMoneyObj({ amount, unit, autoUnit, decimalPlaces });
}

/**
 * 格式化金额为中文货币格式字符串
 * @param amount - 要格式化的金额，可以是数字或字符串
 * @param unit -  手动选的单位，支持 "万" "千" "亿"
 * @param autoUnit - 是否自动显示单位 根据金额自动显示单位 4千 5.2万
 * @returns 格式化后的金额字符串
 * @example
 * formatMoney(1234.56) // "1,234.56"
 * formatMoney("1234") // "1,234"
 * formatMoney(12345, "万") // "1.2万"
 * formatMoney(12345, "千") // "12.3千"
 * formatMoney(123456789, "亿") // "1.23亿"
 * formatMoney(10000, "万") // "1万"
 * formatMoney(5000, undefined, true) // "5千"
 * formatMoney(20000, undefined, true) // "2万"
 * formatMoney(300000000, undefined, true) // "3亿"
 */
export function formatMoneyObj({
  amount,
  unit,
  autoUnit,
  // 保留几位小数
  decimalPlaces = 2,
}: {
  amount: number | string,
  unit?: "万" | "千" | "亿",
  autoUnit?: boolean,
  decimalPlaces?: number,
}): string {
  console.log(amount, unit, autoUnit, decimalPlaces, "formatMoneyObj");
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  if (isNaN(amount)) {
    return "NaN";
  }
  if (amount === null) {
    return "NaN";
  }
  if (amount === undefined) {
    return "NaN";
  }
  if (amount === 0) {
    return "0";
  }

  // Handle auto unit selection
  if (autoUnit) {
    if (amount >= 100000000) {
      unit = "亿";
    } else if (amount >= 10000) {
      unit = "万";
    } else if (amount >= 1000) {
      unit = "千";
    }
  }

  let result: number;
  if (unit === "亿") {
    result = amount / 100000000;
  } else if (unit === "千") {
    result = amount / 1000;
  } else if (unit === "万") {
    result = amount / 10000;
  } else {
    // No unit case
    return amount.toLocaleString("zh-CN", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  }

  // For units (万/千/亿), format with one decimal place
  const formatted = result.toLocaleString("zh-CN", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Remove .0 if present
  const finalAmount = formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;

  return `${finalAmount}${unit}`;
}
type OS = "Mac" | "Windows" | "Other";

/**
 * 检测操作系统
 * @returns 操作系统类型
 */
export function detectOS(): OS {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (userAgent.indexOf("mac") !== -1 || platform.indexOf("mac") !== -1) {
    return "Mac";
  } else if (userAgent.indexOf("win") !== -1 || platform.indexOf("win") !== -1) {
    return "Windows";
  } else {
    return "Other";
  }
}
