import React from 'react';

const Tabs = ({ className = '', children, ...props }) => {
  return (
    <div className={`overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

const TabsList = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ 
  className = '', 
  active = false,
  children, 
  ...props 
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        active 
          ? 'bg-background text-foreground shadow-sm' 
          : 'hover:bg-background/50 hover:text-foreground'
      } ${className}`}
      data-active={active}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  className = '', 
  active = false,
  children, 
  ...props 
}) => {
  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        active ? 'block' : 'hidden'
      } ${className}`}
      data-active={active}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 