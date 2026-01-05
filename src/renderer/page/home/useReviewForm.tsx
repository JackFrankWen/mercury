/**
 * @deprecated 请使用 hooks/useFormData 替代
 * 保留此文件仅用于向后兼容
 */
import { useFormData, FormData } from './hooks/useFormData';

export { FormData };

/**
 * @deprecated 请直接使用 useFormData hook 和 DateSelector 组件
 * 此 hook 保留仅用于向后兼容
 */
const useReviewForm = (): [FormData, null] => {
  const [formData] = useFormData();

  console.warn(
    'useReviewForm is deprecated. Please use useFormData hook and DateSelector component instead.'
  );

  return [formData, null];
};

export default useReviewForm;
