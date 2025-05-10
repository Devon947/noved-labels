'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, CubeIcon } from '@heroicons/react/24/outline';

const LoadingScreen = ({ isLoading, onLoadingComplete }) => {
  if (!isLoading) return null;

  const letters = "NOVEDLabels".split("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onLoadingComplete}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #0a0a1a 100%)'
      }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated title */}
      <div className="absolute top-1/3 flex items-center justify-center">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ 
              opacity: 0,
              y: 50,
              rotateX: -90
            }}
            animate={{ 
              opacity: 1,
              y: 0,
              rotateX: 0
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            className="text-5xl font-bold inline-block"
            style={{
              color: letter === 'N' || letter === 'L' ? '#4F46E5' : '#7C3AED',
              textShadow: `
                0 0 20px ${letter === 'N' || letter === 'L' ? 'rgba(79, 70, 229, 0.7)' : 'rgba(124, 58, 237, 0.7)'},
                0 0 40px ${letter === 'N' || letter === 'L' ? 'rgba(79, 70, 229, 0.4)' : 'rgba(124, 58, 237, 0.4)'},
                0 0 80px ${letter === 'N' || letter === 'L' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(124, 58, 237, 0.2)'}
              `,
              filter: 'url(#gooey)'
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Flying elements container */}
      <div className="relative">
        <motion.div
          animate={{
            x: [-100, 100],
            y: [-10, 10],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="relative"
        >
          {/* Gooey trail effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
              filter: 'blur(20px)',
              width: '100px',
              height: '40px'
            }}
          />

          {/* Airplane with lean effect */}
          <motion.div
            animate={{
              rotate: [-2, 2],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <PaperAirplaneIcon 
              className="w-16 h-16 transform rotate-90"
              style={{
                color: '#818CF8',
                filter: 'drop-shadow(0 0 15px rgba(129, 140, 248, 0.6))'
              }}
            />
          </motion.div>

          {/* Floating package with gooey effect */}
          <motion.div
            animate={{
              y: [-5, 5],
              rotate: [-5, 5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <CubeIcon 
              className="w-10 h-10"
              style={{
                color: '#A78BFA',
                filter: 'drop-shadow(0 0 12px rgba(167, 139, 250, 0.6))'
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Loading text with chill fade */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/3 text-lg"
        style={{
          color: '#A78BFA',
          textShadow: '0 0 10px rgba(167, 139, 250, 0.4)'
        }}
      >
        Preparing your shipping experience...
      </motion.p>

      {/* SVG filter for gooey effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
};

export default LoadingScreen; 