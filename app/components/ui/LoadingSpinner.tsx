import type { FC } from "react";

interface LoadingSpinnerProps {
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  className = "", 
  fullScreen = false 
}) => {
  const spinner = (
    <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 ${className}`} role="status">
      <span className="sr-only">読み込み中...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      {spinner}
    </div>
  );
};
