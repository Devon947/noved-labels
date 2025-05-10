'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { shippingHistoryService } from '../services/ShippingHistoryService';

export default function ShippingHistory() {
  const { animations } = useTheme();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await shippingHistoryService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Failed to load shipping history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      loadHistory();
      return;
    }
    try {
      const results = await shippingHistoryService.searchHistory(query);
      setHistory(results);
    } catch (error) {
      console.error('Error searching history:', error);
      setError('Failed to search shipping history');
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await shippingHistoryService.deleteFromHistory(id);
      if (result.success) {
        loadHistory();
      } else {
        setError(result.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
      setError('Failed to delete history item');
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all shipping history?')) {
      try {
        const result = await shippingHistoryService.clearHistory();
        if (result.success) {
          loadHistory();
        } else {
          setError(result.error || 'Failed to clear history');
        }
      } catch (error) {
        console.error('Error clearing history:', error);
        setError('Failed to clear history');
      }
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial="initial"
        animate="animate"
        variants={animations.pageTransition}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Shipping History</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            />
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded p-3 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-xl mb-2">No shipping history found</p>
            <p className="text-sm">Create a shipping label to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animations.listItem}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-700"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="px-2 py-1 bg-blue-500/20 rounded text-blue-400 text-xs">
                        {item.provider_name || item.provider || 'Unknown'}
                      </div>
                      <div className="px-2 py-1 bg-green-500/20 rounded text-green-400 text-xs">
                        ${item.rate?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      To: {item.toName}
                    </h3>
                    <p className="text-gray-400">{item.toAddress}</p>
                    <p className="text-gray-400">
                      {item.toCity}, {item.toState} {item.toZip}
                    </p>
                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      <p>From: {item.fromName}</p>
                      <p>Tracking: {item.tracking_number || 'N/A'}</p>
                      <p>Created: {formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 md:w-auto w-full">
                    {item.label_url && (
                      <button
                        onClick={() => window.open(item.label_url, '_blank')}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        View Label
                      </button>
                    )}
                    {item.tracking_url && (
                      <button
                        onClick={() => window.open(item.tracking_url, '_blank')}
                        className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                      >
                        Track Package
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 