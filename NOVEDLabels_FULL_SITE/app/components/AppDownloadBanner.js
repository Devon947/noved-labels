'use client';

import { useState, useEffect } from 'react';
import { X, Download, ChevronRight, Apple, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-purple-900 p-3 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/10 p-2 rounded-full mr-3">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Get the NOVED Labels App</h3>
            <p className="text-blue-100 text-xs">Ship faster, track better, save more</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            className="bg-white text-blue-900 hover:bg-blue-100"
            onClick={() => window.open(getAppLink(), '_blank')}
          >
            <Download className="h-4 w-4 mr-1" />
            {isMobile ? 'Download' : 'Get App'}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-white p-1"
            onClick={dismiss}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 