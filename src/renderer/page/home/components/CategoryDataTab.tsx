import React from 'react';
import CategoryTable from '../categoryTable';
import DonutChart from 'src/renderer/components/donutChart';
import TransactionModal from './TransactionModal';
import { useCategoryModal } from '../hooks/useCategoryModal';
import { convertCategoryReturnTypeToPieChartData } from '../utils/categoryDataConverter';
import { CategoryReturnType } from 'src/preload/type';

interface CategoryDataTabProps {
  category: CategoryReturnType;
  formValue: any;
  refreshTable: () => void;
}

/**
 * 分类数据标签页内容
 * 显示甜甜圈图和数据表格
 */
function CategoryDataTab({ category, formValue, refreshTable }: CategoryDataTabProps) {
  const { modalVisible, selectedCategory, showModal, closeModal } = useCategoryModal();

  return (
    <>
      <DonutChart data={convertCategoryReturnTypeToPieChartData(category)} />
      <CategoryTable
        refreshTable={refreshTable}
        data={category}
        formValue={formValue}
        showModal={showModal}
        useSharedModal={true}
      />
      {modalVisible && (
        <TransactionModal
          visible={modalVisible}
          category={selectedCategory}
          formValue={formValue}
          onClose={closeModal}
          refreshTable={refreshTable}
        />
      )}
    </>
  );
}

export default CategoryDataTab;

