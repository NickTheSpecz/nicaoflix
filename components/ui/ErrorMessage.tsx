import React from 'react';
import { XCircle, AlertTriangle, Info } from 'lucide-react';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const typeConfig = {
  error: {
    icon: XCircle,
    bgColor: 'bg-error/10',
    borderColor: 'border-error',
    textColor: 'text-error',
    iconColor: 'text-error',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning',
    textColor: 'text-warning',
    iconColor: 'text-warning',
  },
  info: {
    icon: Info,
    bgColor: 'bg-info/10',
    borderColor: 'border-info',
    textColor: 'text-info',
    iconColor: 'text-info',
  },
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'error',
  onRetry,
  onDismiss,
  className = '',
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  const ariaLabel = type === 'error' ? 'Erro' : type === 'warning' ? 'Aviso' : 'Informação';

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-3">
        <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} aria-hidden="true" />
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${config.textColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className="text-text-secondary text-sm">{message}</p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-3 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`text-sm font-medium ${config.textColor} hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded`}
                  aria-label="Tentar novamente"
                >
                  Tentar Novamente
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm font-medium text-text-muted hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
                  aria-label="Dispensar mensagem"
                >
                  Dispensar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
