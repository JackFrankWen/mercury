import { useState } from 'react';

/**
 * 管理分类模态框显示状态的 Hook
 */
export function useCategoryModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const showModal = (category: string) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return {
    modalVisible,
    selectedCategory,
    showModal,
    closeModal,
  };
}

