import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick
}) => {
  const Component = hoverable ? motion.div : 'div';
  
  return (
    <Component
      whileHover={hoverable ? { scale: 1.02, boxShadow: 'var(--shadow-lg)' } : undefined}
      className={`
        bg-white border border-gray-200 rounded-xl shadow-sm
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};