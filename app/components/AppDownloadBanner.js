'use client';

import { useState, useEffect } from 'react';
import { X, Download, ChevronRight, Apple, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if this is a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };
    
    // Check if banner has been dismissed before
    const checkDismissed = () => {
      const dismissed = localStorage.getItem('app_banner_dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const now = Date.now();
      
      // Show the banner if not dismissed or if it was dismissed more than 7 days ago
      if (!dismissed || (now - dismissedTime > 7 * 24 * 60 * 60 * 1000)) {
        setIsVisible(true);
      }
    };
    
    checkMobile();
    checkDismissed();
    
    // Show banner after a slight delay for better UX
    const timer = setTimeout(() => {
      checkDismissed();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem('app_banner_dismissed', Date.now().toString());
  };
  
  const getAppLink = () => {
    // In a real app, you'd detect the device and return the appropriate app store link
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
      return 'https://play.google.com/store'; // Replace with your actual Play Store link
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      return 'https://apps.apple.com/'; // Replace with your actual App Store link
    }
    return '#'; // Fallback
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mt-8 p-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold gradient-text mb-2">
            Get the Noved Labels App
          </h3>
          <p className="text-white/80">
            Download our mobile app to create and manage shipping labels on the go.
            Available for iOS and Android devices.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="button-primary flex items-center justify-center px-6 py-3"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.07 2.7.61 3.44 1.57-3.14 1.88-2.29 5.13.22 6.41-.65 1.29-1.43 2.58-2.25 4.05zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            App Store
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="button-secondary flex items-center justify-center px-6 py-3"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.5 3.59L20.5 12L3.5 20.41V3.59ZM3.5 1C2.67 1 2 1.67 2 2.5V21.5C2 22.33 2.67 23 3.5 23L22.5 14L3.5 1Z"/>
            </svg>
            Google Play
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
} 