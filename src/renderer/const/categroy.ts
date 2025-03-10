const general_cost = 1, // 日常
  variable_cost = 2, // 变动
  fix_cost = 3 // 固定
const husband = 1,
  wife = 2,
  family = 3,
  son = 4,
  grandPa = 5
// 1: '生存开销',
// 2: '发展开销',
// 3: '享受开销',
const basic = 1,
  develop = 2,
  chill = 3
// 1: '必要开支',
// 2: '可有可无',
// 3: '过度开支',// 买了重复不必要的东西
const a = 1,
  b = 2,
  c = 3

export const category_type = [
  {
    value: 10000,
    label: '餐饮',
    children: [
      {
        value: 10001,
        label: '买菜',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
        budget: 1800, // 2000 2500
      },
      {
        value: 10002,
        label: '超市',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
        budget: 500, // 589
      },
      {
        value: 10003,
        label: '水果',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
        budget: 300, // 589
      },
      {
        value: 10004,
        label: '零食',
        tag: variable_cost,
        consumer: undefined,
        cost_type: chill,
        abc_type: b,
        budget: 400, // 589
      },
      {
        value: 10005,
        label: '工作餐',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
        budget: 800, // 589
      },
      {
        value: 10006,
        label: '下馆子',
        tag: variable_cost,
        consumer: family,
        cost_type: chill,
        abc_type: b, // 489.39166666666665
        budget: 500, // 589
      },
      
    ],
  },
  {
    value: 50000,
    label: '购物消费',
    children: [
      {
        value: 50001,
        label: '衣裤鞋帽',
        tag: variable_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50002,
        label: '日常用品', // 卫生纸牙膏牙刷，
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50003,
        label: '电子数码',
        tag: variable_cost,
        cost_type: basic,
        abc_type: b,
      },
      {
        value: 50004,
        label: '厨房用品(废)',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50005,
        label: '化妆护肤', // 护肤品 金额太大
        tag: variable_cost,
        cost_type: basic,
        abc_type: a,
        consumer: wife,
      },
      {
        value: 50006,
        label: '宠物支出',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50007,
        label: '母婴用品',
        tag: variable_cost,
        cost_type: fix_cost,
        abc_type: a,
        consumer: family,
      },
      {
        value: 50008,
        label: '家装家电',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
        consumer: family,
      },
      {
        value: 50009,
        label: '乐器',
        tag: variable_cost,
        abc_type: b,
        cost_type: develop,
      },
    ],
  },
  {
    value: 20000,
    label: '家庭杂费及服务费',
    children: [
      {
        value: 20001,
        label: '水费',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20002,
        label: '电费',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20003,
        label: '燃气费',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20004,
        label: '物业费',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20005,
        label: '快递费',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20006,
        label: '理发费',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20007,
        label: '手机话费',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20008,
        label: 'VPN',
        tag: fix_cost,
        consumer: family,
        cost_type: develop,
        abc_type: a,
      },
      {
        value: 20009,
        label: '家政',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20010,
        label: '宽带',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20011,
        label: '其他杂费',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
    ],
  },
  {
    value: 30000,
    label: '行车交通',
    children: [
      {
        value: 30001,
        label: '违章罚款',
      },
      {
        value: 30002,
        label: '地铁公交（废）',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30003,
        label: '打车(废)',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30004,
        label: '交通通行',
        tag: variable_cost,
        cost_type: basic,
        abc_type: b,
      },
      {
        value: 30005,
        label: '停车费',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30006,
        label: '油费',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30007,
        label: '汽车用品及服务',
        tag: variable_cost,
        cost_type: basic,
        abc_type: b,
      },
    ],
  },
  {
    value: 60000,
    label: '人情费用',
    children: [
      {
        value: 60001,
        label: '请客',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 60002,
        label: '回礼',
        tag: variable_cost,
        consumer: family,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 60003,
        label: '孝敬长辈',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
      },
    ],
  },
  {
    value: 70000,
    label: '休闲娱乐',
    children: [
      {
        value: 70001,
        label: '聚会(用其他娱乐)',
        disabled: true,
        tag: variable_cost,
        abc_type: b,
      },
      {
        value: 70002,
        label: '游戏（用其他娱乐）',
        tag: variable_cost,
        disabled: true,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 70003,
        label: '休闲娱乐',
        tag: variable_cost,
        cost_type: chill,
        abc_type: c,
      },
    ],
  },
  {
    value: 80000,
    label: '保险医疗',
    children: [
      {
        value: 80001,
        label: '个人保险',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: b,
      },
      {
        value: 80002,
        label: '医疗费用',
        tag: variable_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 80003,
        label: '医疗杂物',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
    ],
  },
  {
    value: 90000,
    label: '教育文化',
    children: [
      {
        value: 90001,
        label: '摄影',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90002,
        label: '书包杂志',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90004,
        label: '教育培训',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90003,
        label: '个人投资',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90005,
        label: '仪式文化',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
    ],
  },
  {
    value: 91000,
    label: '主动收入',
    children: [
      {
        value: 91001,
        label: '工资',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
    ],
  },
  {
    value: 92000,
    label: '被动收入',
    children: [
      {
        value: 92001,
        label: '股票',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 92002,
        label: '基金',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 92003,
        label: '理财',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
    ],
  },
  {
    value: 110000,
    label: '出差旅游',
    children: [
      {
        value: 110001,
        label: '交通费用（旅）',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110002,
        label: '住宿费（旅）',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110003,
        label: '餐饮费（旅）',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110004,
        label: '娱乐费（旅）',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110005,
        label: '其他费用（旅）',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
    ],
  },
  {
    value: 100000,
    label: '未归类',
    children: [
      {
        value: 100001,
        label: '烂账',
      },
      {
        value: 100002,
        label: '意外丢失',
      },
      {
        value: 100003,
        label: '未分类',
      },
    ],
  },
]
// 获取分类对象
type CategoryObjType = {
  [key: number]: string
}
export const getCategoryObj = (): CategoryObjType => {
  const obj: CategoryObjType = {}
  category_type.forEach((item) => {
    obj[item.value] = item.label
    item.children.forEach((item) => {
      obj[item.value] = item.label
    })
  })
  return obj
}
// 获取分类名字
export const getCategoryName = (id: number): string => {
  const obj = getCategoryObj()
  return obj[id]
}
// type默认是1 
export const getCategoryString = (str: string | undefined, type: number = 1): string => {
  try {
    if (!str) {
      return ''
    }
    const obj = getCategoryObj()
    const arr = JSON.parse(str)
    if (type === 1) {
      return `${obj[arr[1]]}`
    }
    return `${obj[arr[0]]}\\${obj[arr[1]]}`
    

  } catch (error) {
    console.log(error, 'error');
    
    return ''
  }
}
