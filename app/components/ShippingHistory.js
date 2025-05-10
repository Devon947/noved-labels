'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { historyService } from '../services/historyService';

export default function ShippingHistory() {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const loadLabels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyService.getLabels();
      setLabels(data);
    } catch (err) {
      setError('Failed to load shipping history. Please try again.');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabels();
  }, []);

  const handleDelete = async (id) => {
    try {
      await historyService.deleteLabel(id);
      setLabels(labels.filter(label => label.id !== id));
    } catch (err) {
      setError('Failed to delete label. Please try again.');
      console.error('Error deleting label:', err);
    }
  };

  const handleDownload = async (id) => {
    try {
      await historyService.downloadLabel(id);
    } catch (err) {
      setError('Failed to download label. Please try again.');
      console.error('Error downloading label:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ArrowPathIcon className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadLabels}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gradient-text">Shipping History</h2>
        <button
          onClick={loadLabels}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {labels.length === 0 ? (
        <div className="glass-card p-6 text-center">
          <p className="text-gray-500">No shipping labels found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {labels.map((label) => (
              <motion.div
                key={label.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold gradient-text">
                        {label.provider} Label
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(label.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(label.id)}
                        className="btn-icon"
                        title="Download"
                      >
                        <DocumentArrowDownIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(label.id)}
                        className="btn-icon text-red-500"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">From:</span>
                      <span>{label.fromAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">To:</span>
                      <span>{label.toAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Package:</span>
                      <span>{label.packageDetails}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        label.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                        label.status === 'in_transit' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {label.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
} 