import React from 'react';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-surface-light via-surface to-surface-light bg-[length:1000px_100%]',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`bg-surface-light ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Carregando conteúdo"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

// Convenience component for content card skeletons
export const ContentCardSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Carregando cartão de conteúdo">
      <LoadingSkeleton variant="rectangular" height="300px" />
      <LoadingSkeleton variant="text" height="20px" width="80%" />
      <LoadingSkeleton variant="text" height="16px" width="60%" />
      <span className="sr-only">Carregando informações do conteúdo...</span>
    </div>
  );
};
