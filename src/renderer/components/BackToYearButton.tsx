import React from 'react';
import { Flex } from 'antd';
import { renderIcon } from './FontIcon';

interface BackToYearButtonProps {
  year: string;
  onClick: () => void;
}

function BackToYearButton({ year, onClick }: BackToYearButtonProps) {
  if (!year) return null;

  const handleClick = () => {
    onClick();
  };

  return (
    <Flex justify="center">
      <span className="back-to-year-btn" onClick={handleClick}>
        {renderIcon('fas fa-arrow-rotate-left', '#888888')}
        返回年度
      </span>
    </Flex>
  );
}

export default BackToYearButton;
