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
  submitLabel = 'Generate Label'
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

  const inputClasses = "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-white/50";
  const labelClasses = "block text-sm font-medium text-white/80 mb-2";
  const errorClasses = "text-red-400 text-sm mt-1";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Address */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold gradient-text mb-6">From Address</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="fromName" className={labelClasses}>Name</label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                value={formData.fromName}
                onChange={onChange}
                className={inputClasses}
                placeholder="John Doe"
              />
              {getFieldError('fromName') && (
                <p className={errorClasses}>{getFieldError('fromName')}</p>
              )}
            </div>

            <div>
              <label htmlFor="fromAddress" className={labelClasses}>Street Address</label>
              <input
                type="text"
                id="fromAddress"
                name="fromAddress"
                value={formData.fromAddress}
                onChange={onChange}
                className={inputClasses}
                placeholder="123 Main St"
              />
              {getFieldError('fromAddress') && (
                <p className={errorClasses}>{getFieldError('fromAddress')}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromCity" className={labelClasses}>City</label>
                <input
                  type="text"
                  id="fromCity"
                  name="fromCity"
                  value={formData.fromCity}
                  onChange={onChange}
                  className={inputClasses}
                  placeholder="New York"
                />
                {getFieldError('fromCity') && (
                  <p className={errorClasses}>{getFieldError('fromCity')}</p>
                )}
              </div>

              <div>
                <label htmlFor="fromState" className={labelClasses}>State</label>
                <input
                  type="text"
                  id="fromState"
                  name="fromState"
                  value={formData.fromState}
                  onChange={onChange}
                  className={inputClasses}
                  placeholder="NY"
                />
                {getFieldError('fromState') && (
                  <p className={errorClasses}>{getFieldError('fromState')}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="fromZip" className={labelClasses}>ZIP Code</label>
              <input
                type="text"
                id="fromZip"
                name="fromZip"
                value={formData.fromZip}
                onChange={onChange}
                className={inputClasses}
                placeholder="10001"
              />
              {getFieldError('fromZip') && (
                <p className={errorClasses}>{getFieldError('fromZip')}</p>
              )}
            </div>
          </div>
        </div>

        {/* To Address */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold gradient-text mb-6">To Address</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="toName" className={labelClasses}>Name</label>
              <input
                type="text"
                id="toName"
                name="toName"
                value={formData.toName}
                onChange={onChange}
                className={inputClasses}
                placeholder="Jane Smith"
              />
              {getFieldError('toName') && (
                <p className={errorClasses}>{getFieldError('toName')}</p>
              )}
            </div>

            <div>
              <label htmlFor="toAddress" className={labelClasses}>Street Address</label>
              <input
                type="text"
                id="toAddress"
                name="toAddress"
                value={formData.toAddress}
                onChange={onChange}
                className={inputClasses}
                placeholder="456 Oak Ave"
              />
              {getFieldError('toAddress') && (
                <p className={errorClasses}>{getFieldError('toAddress')}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="toCity" className={labelClasses}>City</label>
                <input
                  type="text"
                  id="toCity"
                  name="toCity"
                  value={formData.toCity}
                  onChange={onChange}
                  className={inputClasses}
                  placeholder="Los Angeles"
                />
                {getFieldError('toCity') && (
                  <p className={errorClasses}>{getFieldError('toCity')}</p>
                )}
              </div>

              <div>
                <label htmlFor="toState" className={labelClasses}>State</label>
                <input
                  type="text"
                  id="toState"
                  name="toState"
                  value={formData.toState}
                  onChange={onChange}
                  className={inputClasses}
                  placeholder="CA"
                />
                {getFieldError('toState') && (
                  <p className={errorClasses}>{getFieldError('toState')}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="toZip" className={labelClasses}>ZIP Code</label>
              <input
                type="text"
                id="toZip"
                name="toZip"
                value={formData.toZip}
                onChange={onChange}
                className={inputClasses}
                placeholder="90001"
              />
              {getFieldError('toZip') && (
                <p className={errorClasses}>{getFieldError('toZip')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold gradient-text mb-6">Package Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="weight" className={labelClasses}>Weight (lbs)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={onChange}
              className={inputClasses}
              placeholder="1.5"
              step="0.1"
            />
            {getFieldError('weight') && (
              <p className={errorClasses}>{getFieldError('weight')}</p>
            )}
          </div>

          <div>
            <label htmlFor="length" className={labelClasses}>Length (in)</label>
            <input
              type="number"
              id="length"
              name="length"
              value={formData.length}
              onChange={onChange}
              className={inputClasses}
              placeholder="12"
            />
            {getFieldError('length') && (
              <p className={errorClasses}>{getFieldError('length')}</p>
            )}
          </div>

          <div>
            <label htmlFor="width" className={labelClasses}>Width (in)</label>
            <input
              type="number"
              id="width"
              name="width"
              value={formData.width}
              onChange={onChange}
              className={inputClasses}
              placeholder="8"
            />
            {getFieldError('width') && (
              <p className={errorClasses}>{getFieldError('width')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`button-primary px-8 py-3 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="loading-spinner mr-2"></div>
              Processing...
            </div>
          ) : (
            submitLabel
          )}
        </motion.button>
      </div>
    </motion.form>
  );
} 