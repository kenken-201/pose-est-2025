import React from 'react'

interface TestButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export const TestButton: React.FC<TestButtonProps> = ({
  onClick,
  children,
  variant = 'primary'
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors'
  const variantClasses = variant === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  )
}
