import { Params_Transaction } from "src/preload/type"

// Helper function to generate WHERE clause from Params_Transaction
export function generateWhereClause(params: Params_Transaction): { 
  whereClause: string, 
  conditions: string[] 
} {
  const conditions: string[] = []
  if (params?.flow_type) {
    conditions.push(`flow_type = '${params.flow_type}'`)
  } else {
    conditions.push(`flow_type = '1'`)
  }

  if (params?.is_unclassified) {
    conditions.push('(category IS NULL OR category = "" OR category = "[100000,100003]")')
  }

  if (params?.description) {
    conditions.push(`description LIKE '%${params.description}%' OR payee LIKE '%${params.description}%'`)
  }

  if (params?.consumer) {
    conditions.push(`consumer LIKE '%${params.consumer}%'`)
  }

  if (params?.min_money !== undefined || params?.max_money !== undefined) {
    if (params?.min_money !== undefined && params?.max_money !== undefined) {
      conditions.push(`amount BETWEEN ${params.min_money} AND ${params.max_money}`)
    } else if (params?.min_money !== undefined) {
      conditions.push(`amount >= ${params.min_money}`)
    } else if (params?.max_money !== undefined) {
      conditions.push(`amount <= ${params.max_money}`)
    }
  }

  if (params?.trans_time && params?.trans_time[0] && params?.trans_time[1]) {
    conditions.push(`trans_time BETWEEN '${params.trans_time[0]}' AND '${params.trans_time[1]}'`)
  }

  if (params?.creation_time && params?.creation_time[0] && params?.creation_time[1]) {
    conditions.push(`creation_time BETWEEN '${params.creation_time[0]}' AND '${params.creation_time[1]}'`)
  }

  if (params?.modification_time && params?.modification_time[0] && params?.modification_time[1]) {
    conditions.push(`modification_time BETWEEN '${params.modification_time[0]}' AND '${params.modification_time[1]}'`)
  }

  if (params?.account_type) {
    conditions.push(`account_type = '${params.account_type}'`)
  }

  if (params?.payment_type) {
    conditions.push(`payment_type = '${params.payment_type}'`)
  }

  if (params?.tag) {
    conditions.push(`tag = '${params.tag}'`)
  }

  if (params?.abc_type) {
    conditions.push(`abc_type = '${params.abc_type}'`)
  }

  if (params?.cost_type) {
    conditions.push(`cost_type = '${params.cost_type}'`)
  }

  if (params?.category) {
    conditions.push(`category = '${params.category}'`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  return { whereClause, conditions }
}