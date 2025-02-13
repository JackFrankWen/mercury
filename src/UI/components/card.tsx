import React from 'react';
import './card.css';

interface CustomCardProps  {
  children?: React.ReactNode;
  className?: string;
}       

const Card: React.FC<CustomCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`mercury-card ${className}`}>
      {children}
    </div>
  );
};

export default Card;
