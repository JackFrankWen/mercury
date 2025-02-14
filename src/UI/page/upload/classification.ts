import { I_Transaction } from 'src/sqlite3/transactions'
import { 
    formateToTableAlipay, 
    formateToTableAlipayHeader, 
    formateToTableWechatHeader, tableHeaderI,
    formateToTableDataWechat,
} from './upload-util'

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

export function handleToTable(csvData: any): {
    tableHeader: tableHeaderI,
    tableData: I_Transaction[]
} {
    let tableData: I_Transaction[] = []
    let tableHeader: tableHeaderI | undefined = undefined
    let csvHeader: string[][] = []
    let csvContent: string[][] = []
    const ALIPAY = 1
    const WECHAT = 2
    try {
        const type = getClassification(csvData)
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
                    tableData: tableData as I_Transaction[]
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
                    tableData: tableData
                }
            // case ClassificationEnum.ALIPAY_MOBILE:
            //     return 
            default:
                return {}
        }
    } catch (error) {
        console.error(error)
        return {
            tableHeader: undefined,
            tableData: []
        }
    }
}
