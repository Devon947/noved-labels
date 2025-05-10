'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { shippingHistoryService } from '../services/ShippingHistoryService';

export default function ShippingHistory() {
  const { animations } = useTheme();
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      setLoading(true);
      const data = await shippingHistoryService.getLabels();
      setLabels(data);
      setError(null);
    } catch (err) {
      setError('Failed to load shipping history');
      console.error('Error loading labels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (labelId) => {
    try {
      await shippingHistoryService.downloadLabel(labelId);
    } catch (err) {
      console.error('Error downloading label:', err);
    }
  };

  const handleDelete = async (labelId) => {
    try {
      await shippingHistoryService.deleteLabel(labelId);
      setLabels(labels.filter(label => label.id !== labelId));
    } catch (err) {
      console.error('Error deleting label:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Error Loading History</h3>
        <p className="text-white/80 mb-4">{error}</p>
        <button
          onClick={loadLabels}
          className="button-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (labels.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-white/40 mb-6">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">No Shipping Labels</h3>
        <p className="text-white/80">Your shipping history will appear here once you create your first label.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gradient-text">Shipping History</h2>
        <button
          onClick={loadLabels}
          className="button-secondary"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {labels.map((label) => (
            <motion.div
              key={label.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {label.fromName} → {label.toName}
                  </h3>
                  <p className="text-white/60 text-sm">
                    Created on {new Date(label.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(label.id)}
                    className="button-secondary px-3 py-1"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(label.id)}
                    className="button-danger px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/60">From</p>
                  <p className="text-white/90">{label.fromAddress}</p>
                  <p className="text-white/90">{label.fromCity}, {label.fromState} {label.fromZip}</p>
                </div>
                <div>
                  <p className="text-white/60">To</p>
                  <p className="text-white/90">{label.toAddress}</p>
                  <p className="text-white/90">{label.toCity}, {label.toState} {label.toZip}</p>
                </div>
                <div>
                  <p className="text-white/60">Package</p>
                  <p className="text-white/90">{label.weight} lbs</p>
                  <p className="text-white/90">{label.length}" × {label.width}" × {label.height}"</p>
                </div>
                <div>
                  <p className="text-white/60">Status</p>
                  <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    label.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                    label.status === 'in_transit' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {label.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 