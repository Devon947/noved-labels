import React, { useState, useEffect, createContext, useContext } from 'react';

const TabsContext = createContext(null);

const Tabs = ({ className = '', defaultValue, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
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
  value,
  children, 
  ...props 
}) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive 
          ? 'bg-background text-foreground shadow-sm' 
          : 'hover:bg-background/50 hover:text-foreground'
      } ${className}`}
      data-active={isActive}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  className = '', 
  value,
  children, 
  ...props 
}) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      data-active={isActive}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 