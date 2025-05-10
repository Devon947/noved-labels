'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';

const NotificationItem = ({ notification, onRemove }) => {
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  useEffect(() => {
    if (notification.duration !== Infinity) {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex items-center justify-between bg-gray-800 rounded-lg p-4 mb-2 shadow-lg"
      style={{
        boxShadow: `0 0 10px ${neonTheme.glow}`,
        borderLeft: `4px solid ${neonTheme.primary}`
      }}
    >
      <div className="flex items-center space-x-3">
        {notification.icon && (
          <notification.icon className="h-5 w-5 text-white" />
        )}
        <div>
          {notification.title && (
            <h4 className="font-semibold text-white">{notification.title}</h4>
          )}
          <p className="text-gray-300">{notification.message}</p>
        </div>
      </div>
      <button
        onClick={() => onRemove(notification.id)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-2">
      <AnimatePresence mode="popLayout">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const useNotifications = () => {
  const [notificationSystem, setNotificationSystem] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const system = {
        success: (message, options = {}) => {
          const notification = {
            type: 'success',
            message,
            duration: 5000,
            ...options
          };
          window.dispatchEvent(new CustomEvent('add-notification', { detail: notification }));
        },
        error: (message, options = {}) => {
          const notification = {
            type: 'error',
            message,
            duration: 5000,
            ...options
          };
          window.dispatchEvent(new CustomEvent('add-notification', { detail: notification }));
        },
        info: (message, options = {}) => {
          const notification = {
            type: 'info',
            message,
            duration: 5000,
            ...options
          };
          window.dispatchEvent(new CustomEvent('add-notification', { detail: notification }));
        }
      };
      setNotificationSystem(system);
    }
  }, []);

  return notificationSystem;
}; 