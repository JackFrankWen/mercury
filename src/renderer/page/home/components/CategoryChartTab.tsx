import React from 'react';
import CategoryCollaspe from '../categoryCollaspe';
import TransactionModal from './TransactionModal';
import { useCategoryModal } from '../hooks/useCategoryModal';
import { CategoryReturnType } from 'src/preload/type';

interface CategoryChartTabProps {
  category: CategoryReturnType;
  formValue: any;
  refreshTable: () => void;
}

/**
 * 分类图表标签页内容
 * 显示分类折叠面板
 */
function CategoryChartTab({ category, formValue, refreshTable }: CategoryChartTabProps) {
  const { modalVisible, selectedCategory, showModal, closeModal } = useCategoryModal();

  return (
    <div style={{ minHeight: '400px' }}>
      <CategoryCollaspe
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
    </div>
  );
}

export default CategoryChartTab;

