'use client';

import { useEffect, useState } from 'react';

export const useOptimizedAnimations = (options = {}) => {
  const {
    prefersReducedMotion = false,
    enableGPU = true,
    optimizeForDevices = true
  } = options;

  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion && mediaQuery.matches) {
      setShouldAnimate(false);
    }

    // Check for low power mode (if available)
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setIsLowPowerMode(battery.level <= 0.2 && !battery.charging);
      });
    }

    // Optimize based on device capabilities
    if (optimizeForDevices) {
      const isLowEnd = 
        !window.matchMedia('(min-resolution: 2dppx)').matches || // Not retina
        navigator.hardwareConcurrency <= 4 || // Low CPU cores
        navigator.deviceMemory <= 4; // Low memory (if available)

      if (isLowEnd) {
        setShouldAnimate(false);
      }
    }
  }, [prefersReducedMotion, optimizeForDevices]);

  const getOptimizedStyles = () => ({
    transform: enableGPU ? 'translateZ(0)' : undefined,
    backfaceVisibility: 'hidden',
    perspective: 1000,
    willChange: shouldAnimate ? 'transform, opacity' : 'auto'
  });

  const getOptimizedTransition = (duration = 0.3) => ({
    type: isLowPowerMode ? 'tween' : 'spring',
    duration: isLowPowerMode ? duration * 1.5 : duration,
    bounce: isLowPowerMode ? 0 : 0.25
  });

  return {
    shouldAnimate,
    isLowPowerMode,
    getOptimizedStyles,
    getOptimizedTransition
  };
}; 