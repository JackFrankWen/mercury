import { getCategoryObj, getCategoryName } from "../../renderer/const/categroy";
import { CategoryReturnType } from "../../preload"
import { roundToTwoDecimalPlaces } from "../../renderer/components/utils";


export function transferCategory(list: any): CategoryReturnType {
  
  // Reduce instead of forEach for better performance and readability
  return list.reduce((newList: CategoryReturnType, element: { 
    total: string; 
    category: string; 
    avg: string
    percent: string
  }) => {
    const [parent_id, child_id] = element.category ? JSON.parse(element.category) : []
    
    const childItem = {
      value: roundToTwoDecimalPlaces(element.total),
      category: element.category,
      avg: roundToTwoDecimalPlaces(element.avg),
      id: child_id,
      name: getCategoryName(child_id),
      percent: roundToTwoDecimalPlaces(element.percent)
    }

    const existingParent = newList.find(item => item.id === parent_id)
    
    if (existingParent) {
      // Update existing parent
      return newList.map(item => {
        if (item.id === parent_id) {
          return {
            ...item,
            value: roundToTwoDecimalPlaces(
              Number(item.value) + Number(element.total)
            ),
            avg: roundToTwoDecimalPlaces(
              Number(item.avg) + Number(element.avg)
            ),
            percent: roundToTwoDecimalPlaces(
              Number(item.percent) + Number(element.percent)
            ),
            child: [...item.child, childItem]
          }
        }
        return item
      })
    }

    // Create new parent with child
    const newParent = {
      value: roundToTwoDecimalPlaces(element.total),
      id: parent_id,
      avg: roundToTwoDecimalPlaces(element.avg), 
      name: getCategoryName(parent_id),
      percent: roundToTwoDecimalPlaces(element.percent),
      child: [childItem]
    }

    return [...newList, newParent]
  }, [])
}
  
  export function sortByValue(arr: CategoryReturnType) {
    return arr.sort((a, b) => Number(b.value) - Number(a.value))
  }
  
