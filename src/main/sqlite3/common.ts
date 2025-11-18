import { Params_Transaction } from "../../preload/type";

// Helper function to generate WHERE clause from Params_Transaction
export function generateWhereClause(params: Params_Transaction): {
  whereClause: string;
  conditions: string[];
} {
  const conditions: string[] = [];
  if (!params?.all_flow_type) {
    if (params?.flow_type) {
      conditions.push(`flow_type = '${params.flow_type}'`);
    } else {
      conditions.push(`flow_type = '1'`);
    }
  }

  if (params?.is_unclassified && !params?.category) {
    conditions.push(
      '(category IS NULL OR category = "" OR category = "[100000,100003]" OR consumer IS NULL OR consumer = "")'
    );
  }

  if (params?.description) {
    conditions.push(
      `(description LIKE '%${params.description}%' OR payee LIKE '%${params.description}%')`
    );
  }



  if (params?.min_money || params?.max_money) {
    const { min_money, max_money } = params;
    if (min_money && max_money) {
      conditions.push(`amount BETWEEN ${min_money} AND ${max_money}`);
    } else if (min_money && !max_money) {
      conditions.push(`amount >= ${min_money}`);
    } else if (!min_money && max_money) {
      conditions.push(`amount <= ${max_money}`);
    }
  }

  if (params?.trans_time && params?.trans_time[0] && params?.trans_time[1]) {
    conditions.push(`trans_time BETWEEN '${params.trans_time[0]}' AND '${params.trans_time[1]}'`);
  }

  if (params?.creation_time) {
    if (typeof params.creation_time === 'string') {
      conditions.push(`datetime(creation_time) = datetime('${params.creation_time}')`);
    } else if (params.creation_time[0] && params.creation_time[1]) {
      conditions.push(
        `creation_time BETWEEN '${params.creation_time[0]}' AND '${params.creation_time[1]}'`
      );
    }
  }

  if (params?.modification_time) {
    if (typeof params.modification_time === 'string') {
      conditions.push(`datetime(modification_time) = datetime('${params.modification_time}')`);
    } else if (params.modification_time[0] && params.modification_time[1]) {
      conditions.push(
        `modification_time BETWEEN '${params.modification_time[0]}' AND '${params.modification_time[1]}'`
      );
    }
  }
  if (params?.consumer) {
    if (Array.isArray(params.consumer) && params.consumer.length > 0) {
      const consumers = params.consumer.map(consumer => `'${consumer}'`).join(',');
      conditions.push(`consumer IN (${consumers})`);
    } else if (typeof params.consumer === 'string' && params.consumer) {
      conditions.push(`consumer = '${params.consumer}'`);
    }
  }

  if (params?.account_type) {
    console.log('account_type===', params.account_type)
    if (Array.isArray(params.account_type) && params.account_type.length > 0) {
      // 处理数组类型，使用 IN 查询
      const accountTypes = params.account_type.map(type => `'${type}'`).join(',');
      conditions.push(`account_type IN (${accountTypes})`);
    } else if (typeof params.account_type === 'string' && params.account_type) {
      conditions.push(`account_type = '${params.account_type}'`);
    }
  }

  if (params?.payment_type) {

    if (Array.isArray(params.payment_type)) {
      // 处理数组类型，使用 IN 查询
      const paymentTypes = params.payment_type.map(type => `'${type}'`).join(',');
      conditions.push(`payment_type IN (${paymentTypes})`);
    } else if (typeof params.payment_type === 'string' && params.payment_type) {
      // 处理单个值
      conditions.push(`payment_type = '${params.payment_type}'`);
    }
  }

  if (params?.tag) {
    conditions.push(`tag = '${params.tag}'`);
  }

  if (params?.upload_file_name) {
    conditions.push(`upload_file_name = '${params.upload_file_name}'`);
  }

  if (params?.category) {
    if (typeof params.category === 'string') {
      conditions.push(`category = '${params.category}'`);
    } else {
      const categoryConditions = params.category.map(item => {
        if (item.length === 1) {
          // 单个分类的情况，匹配第一个元素
          return `json_extract(category, '$[0]') = ${item}`;
        }
        // 完整分类路径的情况，使用完整匹配
        return `category = '${JSON.stringify(item)}'`;
      });

      // 如果有分类条件，添加到 conditions 中
      if (categoryConditions.length > 0) {
        conditions.push(`(${categoryConditions.join(' OR ')})`);
      }
    }
  }


  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return { whereClause, conditions };
}
