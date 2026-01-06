import { CategoryReturnType } from 'src/preload/type';

/**
 * 将分类数据转换为饼图数据格式
 */
export function convertCategoryReturnTypeToPieChartData(category: CategoryReturnType) {
  return category.reduce((acc: any, item: any) => {
    item.child.forEach((child: any) => {
      acc.push({
        value: Number(child.value),
        name: child.name,
        type: item.name,
        category: child.category,
      });
    });
    return acc;
  }, []);
}

