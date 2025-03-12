import { I_Transaction } from 'src/main/sqlite3/transactions'
import { 
    formateToTableAlipay, 
    formateToTableAlipayHeader, 
    formateToTableWechatHeader,
     tableHeaderI,
    formateToTableDataWechat,
    formateToTableAlipayMobileHeader,
    formateToTableDataAlipayMobile,
} from './csvUtil'
export enum ClassificationEnum {
    WECHAT = 'wechat',// 手机导入
    ALIPAY = 'alipay',// 电脑导入
    ALIPAY_MOBILE = 'alipayMobile',// 手机导入
    UNKNOWN = 'unknown'
}
export function getClassification(data: any): ClassificationEnum {
    if(/微信/.test(data[0][0] || '')) {
        return ClassificationEnum.WECHAT
    } else if(/支付宝/.test(data[0][0] || '')) {
        return ClassificationEnum.ALIPAY
    } else if(/支付宝/.test(data[3][0] || '')) {
        return ClassificationEnum.ALIPAY_MOBILE
    }
    return ClassificationEnum.UNKNOWN
}

// 将一维数组转为二维数组，每12个元素为一组，跳过前12个元素
export function transformArrayTo2D(data: string[]): string[][] {
    // 将一维数组转为二维数组，每12个元素为一组，跳过前12个元素
   
    
    // const headers = data.slice(0, 12); // 获取表头
    const result: string[][] = [];
    
    // 从第13个元素开始，每12个元素分为一组
    for(let i = 12; i < data.length; i += 12) {
        const row = data.slice(i, i + 12);
        if(row.length === 12) { // 确保是完整的一行数据
            result.push(row);
        }
    }
    
    return result;
}

export function handleToTable(csvData: any): {
    tableHeader: tableHeaderI,
    tableData: I_Transaction[],
    success: boolean
} {
    let tableData: I_Transaction[] = []
    let tableHeader: tableHeaderI | undefined = undefined
    let csvHeader: string[][] = []
    let csvContent: string[][] = []
    const ALIPAY = 1
    const WECHAT = 2
    try {
        const type = getClassification(csvData)
        if (type === ClassificationEnum.UNKNOWN) {
            return {
                tableHeader: undefined,
                tableData: [],
                success: false
            }
        }
        switch (type) {
            case ClassificationEnum.WECHAT:
                 csvHeader = csvData.slice(0, 17)
                 csvContent = csvData.slice(17)
                tableHeader = formateToTableWechatHeader(csvHeader)
                tableData = formateToTableDataWechat(
                  csvContent,
                  tableHeader.account_type,
                  WECHAT
                )
                
                return {
                    tableHeader: tableHeader,
                    tableData: tableData as I_Transaction[],
                    success: true
                }
            case ClassificationEnum.ALIPAY:
                csvHeader = [...csvData.slice(0, 5), ...csvData.slice(-7)]
                csvContent = csvData.slice(5, csvData.length - 7)
                tableHeader = formateToTableAlipayHeader(csvHeader)
                tableData = formateToTableAlipay(
                    csvContent,
                    tableHeader.account_type,
                    ALIPAY
                )
                return {
                    tableHeader:tableHeader,
                    tableData: tableData as I_Transaction[],
                    success: true
                }
            case ClassificationEnum.ALIPAY_MOBILE:
                csvHeader = csvData.slice(0, 22)
                csvContent = transformArrayTo2D(csvData.slice(22)[0] )
                console.log(csvHeader, 'csvHeader')
                console.log(csvContent, 'csvContent')
                    // 交易时间	交易分类	交易对方	对方账号	商品说明	收/支	金额	收/付款方式	交易状态	交易订单号	商家订单号	备注
                // 0: (12) ['交易时间', '交易分类', '交易对方', '对方账号', '商品说明', '收/支', '金额', '收/付款方式', '交易状态', '交易订单号', '商家订单号', '备注']
                tableHeader = formateToTableAlipayMobileHeader(csvHeader)
                tableData = formateToTableDataAlipayMobile(
                    csvContent,
                    tableHeader.account_type,
                    ALIPAY
                )  
                // 获取statusLIst 所有status
                let statusList = tableData.map((item) => {
                    return item.status
                })
                // 去重复   
                let statusSet = new Set(statusList)
                console.log(statusSet, 'statusSet')
                
                console.log(tableData, 'tableDatamobile');
                
                // 
                // const categoryLabelS = tableData.map((item) => {
                //     return item.categoryLabel
                // })
                // // 去重
                // const categoryLabelSet = new Set(categoryLabelS)
                // // 转换为数组
                // const categoryLabelArray = Array.from(categoryLabelSet)
                // // 
                // console.log(JSON.stringify(categoryLabelArray), 'categoryLabelArray')

                 
                return {
                    tableHeader: tableHeader,
                    tableData: tableData as I_Transaction[],
                    success: true
                }
            default:
                return {
                    tableHeader: undefined,
                    tableData: [],
                    success: false
                }
        }
    } catch (error) {
        console.error(error)
        return {
            tableHeader: undefined,
            tableData: [],
            success: false
        }
    }
}
