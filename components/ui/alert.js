import React from 'react';

const Alert = ({ 
  className = '',
  variant = 'default',
  children,
  ...props 
}) => {
  const baseStyles = 'relative w-full rounded-lg border p-4';
  
  const variants = {
    default: 'bg-background text-foreground',
    destructive: 'text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive',
    success: 'border-green-500/30 text-green-500 [&>svg]:text-green-500',
    warning: 'border-yellow-500/30 text-yellow-500 [&>svg]:text-yellow-500',
    info: 'border-blue-500/30 text-blue-500 [&>svg]:text-blue-500',
  };
  
  const variantStyle = variants[variant] || variants.default;
  
  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ 
  className = '',
  children,
  ...props 
}) => {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
};

const AlertDescription = ({ 
  className = '',
  children,
  ...props 
}) => {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription }; 