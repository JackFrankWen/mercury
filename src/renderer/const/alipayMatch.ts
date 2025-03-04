type AlipayMatchType = {
    matchName: string;
    matchCategory: number[];
    matchConsumer?: 'husband' | 'wife' | 'family' | 'son' | 'grandPa' | undefined;

    matchTag?: 'general_cost' | 'variable_cost' | 'fix_cost';
};
// ["母婴亲子","餐饮美食","亲友代付","日用百货","爱车养车","家居家装","酒店旅游","转账红包","教育培训","服饰装扮","数码电器","美容美发","宠物","充值缴费","交通出行","生活服务","公共服务","文化休闲","住房物业","收入","商业服务","保险","医疗健康","其他","运动户外"]

export const alipayMatch: AlipayMatchType[] = [{
    matchName: '餐饮美食',
    matchCategory: [10000,10006],
}, 
{
    matchName: '母婴亲子',
    matchCategory: [50000,50007],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
}, 
{
    matchName: '亲友代付',
    matchCategory: [10000,10001],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
}, 
{
    matchName: '日用百货',
    matchCategory: [10000,10004],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
}, 
{
    matchName: '爱车养车',
    matchCategory: [30000,30007],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
}, 
{
    matchName: '家居家装',
    matchCategory: [50000,50008],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '酒店旅游',
    matchCategory: [110000,110002],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '亲友代付',
    matchCategory: [10000,10001],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '教育培训',
    matchCategory: [90000,90004],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '服饰装扮',
    matchCategory: [50000,50001],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '数码电器',
    matchCategory: [50000,50003],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '美容美发',
    matchCategory: [20000,20006],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '宠物',
    matchCategory: [50000,50006],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '充值缴费',
    matchCategory: [20000,20011],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},
{
    matchName: '交通出行',
    matchCategory: [30000,30004],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},  
{
    matchName: '生活服务',
    matchCategory: [20000,20001],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},  
{
    matchName: '公共服务',
    matchCategory: [90000,90003],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},  
{
    matchName: '文化休闲',
    matchCategory: [90000,90002],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},      
{
    matchName: '住房物业',
    matchCategory: [20000,20004],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},    
{
    matchName: '收入',
    matchCategory: [91000,91001],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},    
{
    matchName: '商业服务',
    matchCategory: [10000,10004],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},        
{
    matchName: '保险',
    matchCategory: [80000,80001],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},      
{
    matchName: '医疗健康',
    matchCategory: [80000,80002],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},      
{
    matchName: '其他',
    matchCategory: [100000,100003],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},          
{
    matchName: '运动户外',
    matchCategory: [10000,10004],
    // matchConsumer: 'family',
    // matchTag: 'variable_cost',
},        



]
// matchName matchCategory
export const getMatchCategory = (category: string) => {
    
    const matchCategory = alipayMatch.find((item) => item.matchName===category)?.matchCategory
    return matchCategory ? JSON.stringify(matchCategory) : ''
}

