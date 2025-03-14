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
    icon: 'fa-solid fa-utensils',
    color: '#FF6B6B', // 红色调
    children: [
      {
        value: 10001,
        label: '买菜',
        icon: 'fa-solid fa-carrot',
        color: '#FF8E6B',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
        budget: 1800, // 2000 2500
      },
      {
        value: 10002,
        label: '超市',
        icon: 'fa-solid fa-cart-shopping',
        color: '#FFA76B',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
        budget: 500, // 589
      },
      {
        value: 10003,
        label: '水果',
        icon: 'fa-solid fa-apple-whole',
        color: '#FFBD6B',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
        budget: 300, // 589
      },
      {
        value: 10004,
        label: '零食',
        icon: 'fa-solid fa-cookie-bite',
        color: '#FFD06B',
        tag: variable_cost,
        consumer: undefined,
        cost_type: chill,
        abc_type: b,
        budget: 400, // 589
      },
      {
        value: 10005,
        label: '工作餐',
        icon: 'fa-solid fa-bowl-food',
        color: '#FFE36B',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
        budget: 800, // 589
      },
      {
        value: 10006,
        label: '下馆子',
        icon: 'fa-solid fa-bowl-rice',
        color: '#FFF56B',
        tag: variable_cost,
        consumer: family,
        cost_type: chill,
        abc_type: b, // 489.39166666666665
        budget: 500, // 589
      },
      {
        value: 10007,
        label: '奶茶',
        icon: 'fa-solid fa-mug-hot',
        color: '#F5FF6B',
        tag: variable_cost,
        consumer: family,
        cost_type: chill,
        abc_type: b, // 489.39166666666665
        budget: 500, // 5
      }
      
    ],
  },
  {
    value: 50000,
    label: '购物消费',
    icon: 'fa-solid fa-shopping-bag',
    color: '#4ECDC4', // 绿松石色调
    children: [
      {
        value: 50001,
        label: '衣裤鞋帽',
        icon: 'fa-solid fa-shirt',
        color: '#4ECDAA',
        tag: variable_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50002,
        label: '日常用品', // 卫生纸牙膏牙刷，
        icon: 'fa-solid fa-toilet-paper',
        color: '#4ECD90',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50003,
        label: '电子数码',
        icon: 'fa-solid fa-mobile-screen',
        color: '#4ECD76',
        tag: variable_cost,
        cost_type: basic,
        abc_type: b,
      },
      {
        value: 50004,
        label: '厨房用品',
        icon: 'fa-solid fa-kitchen-set',
        color: '#4ECD5C',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50005,
        label: '化妆护肤', // 护肤品 金额太大
        icon: 'fa-solid fa-spray-can-sparkles',
        color: '#4ECD42',
        tag: variable_cost,
        cost_type: basic,
        abc_type: a,
        consumer: wife,
      },
      {
        value: 50006,
        label: '宠物支出',
        icon: 'fa-solid fa-paw',
        color: '#42CD4E',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 50007,
        label: '母婴用品',
        icon: 'fa-solid fa-baby',
        color: '#28CD4E',
        tag: variable_cost,
        cost_type: fix_cost,
        abc_type: a,
        consumer: family,
      },
      {
        value: 50008,
        label: '家装家电',
        icon: 'fa-solid fa-home',
        color: '#0ECD4E',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
        consumer: family,
      },
      {
        value: 50009,
        label: '乐器',
        icon: 'fa-solid fa-music',
        color: '#0ECDC4',
        tag: variable_cost,
        abc_type: b,
        cost_type: develop,
      },
    ],
  },
  {
    value: 20000,
    label: '家庭杂费',
    icon: 'fa-solid fa-house',
    color: '#5D8BF4', // 蓝色调
    children: [
      {
        value: 20001,
        label: '水费',
        icon: 'fa-solid fa-water',
        color: '#6E97F5',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20002,
        label: '电费',
        icon: 'fa-solid fa-bolt',
        color: '#7FA4F6',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20003,
        label: '燃气费',
        icon: 'fa-solid fa-fire',
        color: '#90B0F7',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20004,
        label: '物业费',
        icon: 'fa-solid fa-building',
        color: '#A1BDF8',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20005,
        label: '快递费',
        icon: 'fa-solid fa-truck',
        color: '#B2C9F9',
        tag: general_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20006,
        label: '理发费',
        icon: 'fa-solid fa-scissors',
        color: '#C3D6FA',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20007,
        label: '手机话费',
        icon: 'fa-solid fa-phone',
        color: '#D4E2FB',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20008,
        label: 'VPN',
        icon: 'fa-solid fa-wifi',
        color: '#E5EEFC',
        tag: fix_cost,
        consumer: family,
        cost_type: develop,
        abc_type: a,
      },
      {
        value: 20009,
        label: '家政',
        icon: 'fa-solid fa-hands-helping',
        color: '#F6FBFD',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20010,
        label: '宽带',
        icon: 'fa-solid fa-wifi',
        color: '#E5EEFC',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 20011,
        label: '其他杂费',
        icon: 'fa-solid fa-question',
        color: '#F6FBFD',
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
    icon: 'fa-solid fa-car',
    color: '#FFB347', // 橙色调
    children: [
      {
        value: 30001,
        label: '违章罚款',
        icon: 'fa-solid fa-exclamation-triangle',
        color: '#FFBC5C',
      },
      {
        value: 30002,
        label: '地铁公交',
        icon: 'fa-solid fa-train',
        color: '#FFC571',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30003,
        label: '打车',
        icon: 'fa-solid fa-taxi',
        color: '#FFCE86',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30004,
        label: '交通通行',
        icon: 'fa-solid fa-bicycle',
        color: '#FFD79B',
        tag: variable_cost,
        cost_type: basic,
        abc_type: b,
      },
      {
        value: 30005,
        label: '停车费',
        icon: 'fa-solid fa-parking',
        color: '#FFE0B0',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30006,
        label: '油费',
        icon: 'fa-solid fa-gas-pump',
        color: '#FFE9C5',
        tag: general_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 30007,
        label: '汽车消费',
        icon: 'fa-solid fa-car',
        color: '#FFF2DA',
        tag: variable_cost,
        cost_type: basic,
        abc_type: b,
      },
    ],
  },
  {
    value: 60000,
    label: '人情费用',
    icon: 'fa-solid fa-gift',
    color: '#E57A77', // 粉红色调
    children: [
      {
        value: 60001,
        label: '请客',
        icon: 'fa-solid fa-glass-cheers',
        color: '#E9908D',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 60002,
        label: '回礼',
        icon: 'fa-solid fa-gift',
        color: '#EDA6A3',
        tag: variable_cost,
        consumer: family,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 60003,
        label: '孝敬长辈',
        icon: 'fa-solid fa-heart',
        color: '#F1BCB9',
        tag: fix_cost,
        cost_type: basic,
        abc_type: a,
      },
    ],
  },
  {
    value: 70000,
    label: '休闲娱乐',
    icon: 'fa-solid fa-gamepad',
    color: '#9D65C9', // 紫色调
    children: [
      {
        value: 70001,
        label: '聚会(用其他娱乐)',
        disabled: true,
        icon: 'fa-solid fa-users',
        color: '#AB7CD2',
        tag: variable_cost,
        abc_type: b,
      },
      {
        value: 70002,
        label: '游戏（用其他娱乐）',
        icon: 'fa-solid fa-gamepad',
        color: '#B993DB',
        tag: variable_cost,
        disabled: true,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 70003,
        label: '休闲娱乐',
        icon: 'fa-solid fa-umbrella-beach',
        color: '#C7AAE4',
        tag: variable_cost,
        cost_type: chill,
        abc_type: c,
      },
    ],
  },
  {
    value: 80000,
    label: '保险医疗',
    icon: 'fa-solid fa-hospital',
    color: '#6A8EAA', // 蓝灰色调
    children: [
      {
        value: 80001,
        label: '个人保险',
        icon: 'fa-solid fa-heart-circle-check',
        color: '#7C9DB6',
        tag: fix_cost,
        consumer: family,
        cost_type: basic,
        abc_type: b,
      },
      {
        value: 80002,
        label: '医疗费用',
        icon: 'fa-solid fa-stethoscope',
        color: '#8EACC2',
        tag: variable_cost,
        cost_type: basic,
        abc_type: a,
      },
      {
        value: 80003,
        label: '医疗杂物',
        icon: 'fa-solid fa-band-aid',
        color: '#A0BBCE',
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
    icon: 'fa-solid fa-book',
    color: '#5DBB63', // 绿色调
    children: [
      {
        value: 90001,
        label: '摄影',
        icon: 'fa-solid fa-camera',
        color: '#71C375',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90002,
        label: '书包杂志',
        icon: 'fa-solid fa-book',
        color: '#86CB87',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90004,
        label: '教育培训',
        icon: 'fa-solid fa-graduation-cap',
        color: '#9BD39A',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90003,
        label: '个人投资',
        icon: 'fa-solid fa-hand-holding-dollar',
        color: '#B0DBAC',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 90005,
        label: '仪式文化',
        icon: 'fa-solid fa-trophy',
        color: '#C5E3BF',
        tag: variable_cost,
        cost_type: develop,
        abc_type: b,
      },
    ],
  },
  {
    value: 91000,
    label: '主动收入',
    icon: 'fa-solid fa-sack-dollar',
    color: '#67C7A5', // 薄荷绿色调
    children: [
      {
        value: 91001,
        label: '工资',
        icon: 'fa-solid fa-money-bill-wave',
        color: '#7DCFB0',
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
    icon: 'fa-solid fa-chart-line',
    color: '#F9D56E', // 黄色调
    children: [
      {
        value: 92001,
        label: '股票',
        icon: 'fa-solid fa-chart-simple',
        color: '#FADB82',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 92002,
        label: '基金',
        icon: 'fa-solid fa-piggy-bank',
        color: '#FBE196',
        tag: variable_cost,
        consumer: wife,
        cost_type: develop,
        abc_type: b,
      },
      {
        value: 92003,
        label: '理财',
        icon: 'fa-solid fa-wallet',
        color: '#FCE7AA',
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
    icon: 'fa-solid fa-plane',
    color: '#D291BC', // 淡紫色调
    children: [
      {
        value: 110001,
        label: '交通费用（旅）',
        icon: 'fa-solid fa-bus',
        color: '#D9A1C5',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110002,
        label: '住宿费（旅）',
        icon: 'fa-solid fa-hotel',
        color: '#E0B1CE',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110003,
        label: '餐饮费（旅）',
        icon: 'fa-solid fa-utensils',
        color: '#E7C1D7',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110004,
        label: '娱乐费（旅）',
        icon: 'fa-solid fa-ticket',
        color: '#EED1E0',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
      {
        value: 110005,
        label: '其他费用（旅）',
        icon: 'fa-solid fa-suitcase',
        color: '#F5E1E9',
        tag: variable_cost,
        cost_type: chill,
        abc_type: b,
      },
    ],
  },
  {
    value: 100000,
    label: '未归类',
    icon: 'fa-solid fa-question',
    color: '#BCBCBC', // 灰色
    children: [
      {
        value: 100001,
        label: '烂账',
        icon: 'fa-solid fa-trash-can',
        color: '#D4D4D4',
      },
      {
        value: 100002,
        label: '意外丢失',
        icon: 'fa-solid fa-triangle-exclamation',
        color: '#E8E8E8',
      },
      {
        value: 100003,
        label: '未分类',
        icon: 'fa-solid fa-question-circle',
        color: '#F5F5F5',
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

// Helper function to find category and icon by id
export const findCategoryById = (id: string | number): { label: string, icon: string, color: string } | undefined => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // Search through all categories and their children
  for (const category of category_type) {
    if (category.value === numId) {
      return { 
        label: category.label, 
        icon: category.icon,
        color: category.color || '#1677ff' // 默认颜色
      };
    }
    
    for (const child of category.children) {
      if (child.value === numId) {
        return { 
          label: child.label, 
          icon: child.icon,
          color: child.color || category.color || '#1677ff' // 尝试使用父类颜色作为备选
        };
      }
    }
  }
  
  return undefined;
}