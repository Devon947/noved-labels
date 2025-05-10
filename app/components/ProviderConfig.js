'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { configService } from '../services/ConfigService';

export default function ProviderConfig() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    isActive: true,
    priority: 1
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await configService.getProviders();
      setProviders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load shipping providers');
      console.error('Error loading providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProvider) {
        await configService.updateProvider(selectedProvider.id, formData);
      } else {
        await configService.addProvider(formData);
      }
      await loadProviders();
      resetForm();
    } catch (err) {
      setError('Failed to save provider configuration');
      console.error('Error saving provider:', err);
    }
  };

  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setFormData({
      name: provider.name,
      apiKey: provider.apiKey,
      isActive: provider.isActive,
      priority: provider.priority
    });
  };

  const handleDelete = async (providerId) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await configService.deleteProvider(providerId);
        await loadProviders();
      } catch (err) {
        setError('Failed to delete provider');
        console.error('Error deleting provider:', err);
      }
    }
  };

  const resetForm = () => {
    setSelectedProvider(null);
    setFormData({
      name: '',
      apiKey: '',
      isActive: true,
      priority: 1
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gradient-text">Shipping Providers</h2>
        <button
          onClick={resetForm}
          className="button-secondary"
        >
          Add New Provider
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/20">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Provider Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-white/50"
              placeholder="Enter provider name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-white/50"
              placeholder="Enter API key"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Priority
            </label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder-white/50"
              min="1"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-white/80">Active</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {selectedProvider && (
            <button
              type="button"
              onClick={resetForm}
              className="button-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="button-primary"
          >
            {selectedProvider ? 'Update Provider' : 'Add Provider'}
          </button>
        </div>
      </motion.form>

      <div className="grid gap-6">
        {providers.map((provider) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-1">{provider.name}</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    provider.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {provider.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-white/60">
                    Priority: {provider.priority}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(provider)}
                  className="button-secondary px-3 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(provider.id)}
                  className="button-danger px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 