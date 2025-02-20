import { I_Transaction } from "src/sqlite3/transactions"
import { category_type } from "src/UI/const/categroy"

export interface tableHeaderI {
    name: string
    date: string
    account_type: number
    fileName: string
    titleCostLabel: string
    titleCost: string
    titleIncome: string
    titleIncomeLabel: string
}

export interface tableDataI {
    id: string
    amount: string
    description: string
}
// 支付宝手机端
export function formateToTableAlipayMobileHeader(arr: any): tableHeaderI {
//   1. ["------------------------------------------------------------------------------------"],
//   2. ["导出信息："],
//   3. ["姓名：文素能"],
//   4. ["支付宝账户：79071077@qq.com"],
//   5. ["起始时间：[2024-11-12 00:00:00]    终止时间：[2025-02-12 23:59:59]"],
//   6. ["导出交易类型：[全部]"],
//   7. ["导出时间：[2025-02-12 17:23:13]"],
//   8. ["共252笔记录"],
//   9. ["收入：0笔 0.00元"],
//   10. ["支出：224笔 7292.83元"],
//   11. ["不计收支：28笔 644.22元"],
//   12. ["特别提示："],
//   13. [ "1.本回单内容可表明支付宝受理了相应支付交易申请，因系统原因或通讯故障等偶发因素导致本回单与实际交易结果不符时，以实际交易情况为准；"],
//   14. [
//     "2.请勿将本回单作为收款方发货的凭据使用，请查证账户实际到账情况后再进行发货操作；"
//   ],
//   15. [
//     "3.支付宝快捷支付等非余额支付方式可能既产生支付宝交易也同步产生银行交易，因此请勿使用本回单进行重复记账；"
//   ],
//   16. [
//     "4.本回单如经任何涂改、编造，均立即失去效力；"
//   ],
//   17. [
//     "5.部分账单如：充值提现、账户转存或者个人设置收支等不计入为收入或者支出，记为不计收支类；"
//   ],
//   18. [
//     "6.因统计逻辑不同，明细金额直接累加后，可能会和下方统计金额不一致，请以实际交易金额为准；"
//   ],
//   19. [
//     "7.禁止将本回单用于非法用途；"
//   ],
//   20. [
//     "8.本明细仅展示当前账单中的交易，不包括已删除的记录；"
//   ],
//   21. [
//     "9.本明细仅供个人对账使用。"
//   ],
//   22["------------------------支付宝（中国）网络技术有限公司  电子客户回单------------------------"]

console.log(arr,'mobile----arr');

return {
    fileName:'支付宝app导入账单',
    // 姓名
    name: arr[2][0],
    // 账户类型
    account_type: arr[2][0].includes('文素能') ? 1 : 2,
    // 日期
    date: arr[4][0],
    // 支出
    titleCostLabel: arr[9][0].split(' ')[0],
    // 支出金额
    titleCost: arr[9][0].split(' ')[1],
    titleIncome: arr[8][0].split(' ')[1],
    titleIncomeLabel: arr[8][0].split(' ')[0],
}
}
// 支付宝手机端
export function formateToTableDataAlipayMobile(
  arr: string[][],
  account_type: number,
  payment_type: number
) : any{
    let costArr = arr.filter((subArr: string[]) => !/不计收支/.test(subArr[5]))
  costArr = costArr.filter((subArr: string[]) => /支付成功/.test(subArr[8]) || /交易成功/.test(subArr[8]))
    // 0: (12) ['交易时间', '交易分类', '交易对方', '对方账号', '商品说明', '收/支', '金额', '收/付款方式', '交易状态', '交易订单号', '商家订单号', '备注']
  console.log(arr,'====aaaa');
  
  return costArr.map((subArr) => {
      // 0: "交易时间"
      // 1: "交易分类" 
      // 2: "交易对方"
      // 3: "对方账号"
      // 4: "商品说明"
      // 5: "收/支"
      // 6: "金额"
      // 7: "收/付款方式"
      // 8: "交易状态"
      // 9: "交易订单号"
      // 10: "商家订单号"
      // 11: "备注"

    return {
      id: subArr[9].replace(/[^0-9]/g, ''),
      amount: subArr[6].trim(),
      description: `${subArr[4]};${subArr[11]}`,
      account_type: account_type,
      payment_type: payment_type,
      flow_type: /支出/.test(subArr[5]) ? 1 : 2,
      category: undefined,
      payee: subArr[2],
      consumer: account_type,
      tag: 2,
      cost_type: 3,
      abc_type: 2,
      creation_time: undefined,
      trans_time: (subArr[0] || '').trim().replace(/\n/g, ''),
      modification_time: undefined,
      categoryLabel: subArr[1],
    }
  })    
    

}
// 微信
export function formateToTableDataWechat(
  arr: string[][],
  account_type: number,
  payment_type: number
) :any{
  const costArr = arr.filter((subArr: string[]) => !/零钱通/.test(subArr[11]))
  return costArr.map((subArr) => {
    // 0: "交易时间"
    // 1: "交易类型"
    // 2: "交易对方"
    // 3: "商品"
    // 4: "收/支"
    // 5: "金额(元)"
    // 6: "支付方式"
    // 7: "当前状态"
    // 8: "交易单号"
    // 9: "商户单号"
    // 10: "备注"
    const amount = subArr[5] || ''
    const description = `${subArr[3]}`
    let payeeName = `${subArr[1]};${subArr[2]}`.replace('[^\u0000-\uFFFF]', '')
    payeeName = payeeName.replace(/商户消费;/g, '')
    payeeName = payeeName.replace(/扫二维码付款;/g, '')
    return {
      id: subArr[8],
      amount: amount.replace('¥', ''),
      payee: payeeName,
      description: description.replace('[^\u0000-\uFFFF]', ''),
      account_type: account_type,
      payment_type: payment_type,
      flow_type: subArr[4] === '支出' ? 1 : 2,
      category: undefined,
      consumer: account_type,
      tag: 2,
      cost_type: 3,
      abc_type: 2,
      creation_time: undefined,
      trans_time: subArr[0],
      modification_time: undefined,
    }
  })
}
// 微信
export function formateToTableWechatHeader(arr: any): tableHeaderI {
  // 0: (9) ['微信支付账单明细', '', '', '', '', '', '', '', '']
  // 1: (9) ['微信昵称：[Jack Frank]', '', '', '', '', '', '', '', '']
  // 2: (9) ['起始时间：[2023-02-16 00:00:00] 终止时间：[2023-03-16 10:51:23]', '', '', '', '', '', '', '', '']
  // 3: (9) ['导出类型：[全部]', '', '', '', '', '', '', '', '']
  // 4: (9) ['导出时间：[2023-03-16 10:51:39]', '', '', '', '', '', '', '', '']
  // 5: (9) ['', '', '', '', '', '', '', '', '']
  // 6: (9) ['共91笔记录', '', '', '', '', '', '', '', '']
  // 7: (9) ['收入：1笔 1666.00元', '', '', '', '', '', '', '', '']
  // 8: (9) ['支出：90笔 1221.01元', '', '', '', '', '', '', '', '']
  // 9: (9) ['中性交易：0笔 0.00元', '', '', '', '', '', '', '', '']
  // 10: (9) ['注：', '', '', '', '', '', '', '', '']
  // 11: (9) ['1. 充值/提现/理财通购买/零钱通存取/信用卡还款等交易，将计入中性交易', '', '', '', '', '', '', '', '']
  // 12: (9) ['2. 本明细仅展示当前账单中的交易，不包括已删除的记录', '', '', '', '', '', '', '', '']
  // 13: (9) ['3. 本明细仅供个人对账使用', '', '', '', '', '', '', '', '']
  // 14: (9) ['', '', '', '', '', '', '', '', '']
  // 15: (9) ['----------------------微信支付账单明细列表--------------------', '', '', '', '', '', '', '', '']
  // 16: (11) ['交易时间', '交易类
  const regex = /\[(.*?)\]/ // a regular expression to match the text inside square brackets
  const cost = arr[8][0].split(' ', 2)
  const income = arr[7][0].split(' ', 2)
  const matchName = arr[1][0].match(regex)[1]
  return {
    fileName: arr[0][0],
    name: matchName,
    account_type: /Jack/.test(matchName) ? 1 : 2,
    date: arr[2],
    titleCostLabel: cost[0],
    titleCost: cost[1],
    titleIncomeLabel: income[0],
    titleIncome: income[1],
  }
}
export function trimString(str: unknown) {
  if (typeof str !== 'string') {
    return str // If the input is not a string, return it as is
  }
  return str.trim() // If the input is a string, trim it and return the result
}
// 支付宝电脑端
export function formateToTableAlipay(
  arr: string[][],
  account_type: number,
  payment_type: number
) : any[] {
  let costArr = arr.filter((subArr: string[]) => /交易成功/.test(subArr[11]))
  costArr = costArr.filter((subArr: string[]) => !/不计收支/.test(subArr[10]))
  costArr = costArr.filter((subArr: string[]) => !/资金转移/.test(subArr[15]))
  return costArr.map((subArr) => {
    // 0: "交易号"
    // 1: "商家订单号"
    // 2: "交易创建时间"
    // 3: "付款时间"
    // 4: "最近修改时间"
    // 5: "交易来源地"
    // 6: "类型"
    // 7: "交易对方"
    // 8: "商品名称"
    // 9: "金额（元）"
    // 10: "收/支"
    // 11: "交易状态 "
    // 12: "服务费（元）"
    // 13: "成功退款（元）"
    // 14: "备注                  "
    // 15: "资金状态 "
    const amount = subArr[9] || ''
    const description = `${trimString(subArr[14])};${trimString(
      subArr[8]
    )};${trimString(subArr[14])}`
    return {
      id: subArr[0],
      amount: amount.trim(),
      description: description,
      account_type: account_type,
      payment_type: payment_type,
      flow_type: /支出/.test(subArr[10]) ? 1 : 2,
      category: undefined,
      payee: subArr[7],
      consumer: account_type,
      tag: 2,
      cost_type: 3,
      abc_type: 2,
      creation_time: undefined,
      trans_time: (subArr[2] || '').trim(),
      modification_time: undefined,
    }
  })
}
// 支付宝电脑端
export function formateToTableAlipayHeader(arr: any): tableHeaderI {
  // 0: ['支付宝交易记录明细查询']
  // 1: ['账号:[79071077@qq.com]']
  // 2: ['起始日期:[2023-01-01 00:00:00]    终止日期:[2023-03-19 21:14:30]']
  // 3: ['---------------------------------交易记录明细列表------------------------------------']
  // 4: (17) ['交易号                  ', '商家订单号               ', '交易创建时间              ', '付款时间                ', '最近修改时间              ', '交易来源地     ', '类型              ', '交易对方            ', '商品名称                ', '金额（元）   ', '收/支     ', '交易状态    ', '服务费（元）   ', '成功退款（元）  ', '备注                  ', '资金状态     ', '']
  // 5: ['------------------------------------------------------------------------------------']
  // 6: ['共201笔记录']
  // 7: (2) ['已收入:2笔', '13.67元']
  // 8: (2) ['待收入:0笔', '0.00元']
  // 9: (2) ['已支出:55笔', '1999.92元']
  // 10: (2) ['待支出:0笔', '0.00元']
  // 11: ['导出时间:[2023-03-19 21:14:30]    用户:文素能'
  const regex = /用户:(.*)/
  // a regular expression to match the text inside square brackets
  console.log(arr[11], 'arr[11s')
  const matchName = arr?.[11]?.[0].match(regex)[1]
  return {
    fileName: arr[0][0],
    name: matchName,
    account_type: /文素能/.test(matchName) ? 1 : 2,

    date: arr?.[2],
    titleCostLabel: arr[9][0],
    titleCost: arr[9][1],
    titleIncome: arr[7][1],
    titleIncomeLabel: arr[7][0],
  }
}
type JdData = {
  id: string
  amount: string
  description: string
  trans_time: string
}
export function formateToTableJd(arr: string[][], type: 'jd' | 'pdd'): JdData[] {
      // 0: "订单号",
      // 1: "下单时间", 
      // 2: "订单总价",
      // 3: "订单状态",
      // 4: "商品名称"
      console.log(arr,'arr');
  
  let newArr = []
  if (type === 'jd') {
    newArr = arr.filter((subArr) => subArr[3] === '已完成')
  } else if (type === 'pdd') {
    newArr = arr.filter((subArr) => subArr[3] === '交易成功')
  }
  return newArr.map((subArr) => {
    
    return {
      id: subArr[0],
      amount: subArr[2].replace(/[^0-9.]/g, ''),
      description: subArr[4],
      trans_time: subArr[1],
    }
  })
}