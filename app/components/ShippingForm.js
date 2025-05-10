'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ShippingForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
  validationErrors = {},
  submitLabel = 'Submit'
}) {
  const { animations } = useTheme();
  const [touched, setTouched] = useState({});

  // Ensure formData has dimensions property
  useEffect(() => {
    if (!formData.dimensions) {
      onChange('dimensions', { length: '', width: '', height: '' });
    }
  }, [formData]);

  const handleChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Handle nested properties for dimensions
    if (field.includes('dimensions.')) {
      const dimensionField = field.split('.')[1];
      const dimensions = { ...(formData.dimensions || {}), [dimensionField]: value };
      onChange('dimensions', dimensions);
    } else {
      onChange(field, value);
    }
  };

  const getFieldError = (field) => {
    return touched[field] ? validationErrors[field] : null;
  };

  const renderInput = (field, label, type = 'text', placeholder = '') => {
    // Handle nested properties for dimensions
    let fieldValue = '';
    if (field.includes('dimensions.')) {
      const dimensionField = field.split('.')[1];
      fieldValue = formData.dimensions?.[dimensionField] || '';
    } else {
      fieldValue = formData[field] || '';
    }
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        <motion.div
          animate={getFieldError(field) ? 'error' : touched[field] ? 'success' : undefined}
          variants={animations}
        >
          <input
            type={type}
            value={fieldValue}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, [field]: true }))}
            placeholder={placeholder}
            className={`
              w-full px-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${getFieldError(field)
                ? 'border-red-500'
                : touched[field]
                  ? 'border-green-500'
                  : 'border-gray-600'
              }
            `}
          />
          {getFieldError(field) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-400"
            >
              {getFieldError(field)}
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* From Address Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={animations.pageTransition}
      >
        <h2 className="text-xl font-semibold mb-4 text-blue-400">From Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('fromName', 'Name', 'text', 'Full Name')}
          {renderInput('fromAddress', 'Address', 'text', 'Street Address')}
          {renderInput('fromCity', 'City', 'text', 'City')}
          <div className="grid grid-cols-2 gap-4">
            {renderInput('fromState', 'State', 'text', 'State')}
            {renderInput('fromZip', 'ZIP', 'text', 'ZIP Code')}
          </div>
        </div>
      </motion.div>

      {/* To Address Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={animations.pageTransition}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-purple-400">To Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('toName', 'Name', 'text', 'Full Name')}
          {renderInput('toAddress', 'Address', 'text', 'Street Address')}
          {renderInput('toCity', 'City', 'text', 'City')}
          <div className="grid grid-cols-2 gap-4">
            {renderInput('toState', 'State', 'text', 'State')}
            {renderInput('toZip', 'ZIP', 'text', 'ZIP Code')}
          </div>
        </div>
      </motion.div>

      {/* Package Details */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={animations.pageTransition}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-green-400">Package Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('weight', 'Weight (lbs)', 'number', 'Package Weight')}
          <div className="grid grid-cols-3 gap-4">
            {renderInput('dimensions.length', 'L', 'number', 'Length')}
            {renderInput('dimensions.width', 'W', 'number', 'Width')}
            {renderInput('dimensions.height', 'H', 'number', 'Height')}
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        whileHover="hover"
        whileTap="tap"
        variants={animations}
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        ) : submitLabel}
      </motion.button>
    </form>
  );
} 