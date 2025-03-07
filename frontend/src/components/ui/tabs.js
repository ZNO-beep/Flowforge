import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

// Create a context for the tabs
const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {}
});

/**
 * Tabs container component
 * @param {Object} props - Component props
 * @param {string} props.defaultValue - Default active tab value
 * @param {React.ReactNode} props.children - Tab content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const Tabs = ({ defaultValue, children, className = '', ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Tabs list component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tab triggers
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const TabsList = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`flex border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Tab trigger component
 * @param {Object} props - Component props
 * @param {string} props.value - Tab value
 * @param {React.ReactNode} props.children - Tab label
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Component JSX
 */
export const TabsTrigger = ({ value, children, className = '', ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium ${
        isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

TabsTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Tab content component
 * @param {Object} props - Component props
 * @param {string} props.value - Tab value
 * @param {React.ReactNode} props.children - Tab content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null} Component JSX or null if not active
 */
export const TabsContent = ({ value, children, className = '', ...props }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }

  return (
    <div 
      role="tabpanel"
      className={`mt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

TabsContent.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}; 