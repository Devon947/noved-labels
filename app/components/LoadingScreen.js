'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, PackageIcon, MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function LoadingScreen({ isLoading, onLoadingComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Always show loading screen when component is mounted
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
      {/* Particle canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.5 }}
      />

      {/* Enhanced background glow effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated title with enhanced effects */}
      <div className="absolute top-1/3 flex items-center justify-center">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ 
              opacity: 0,
              y: 50,
              rotateX: -90,
              scale: 0.5
            }}
            animate={{ 
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1
            }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="text-6xl font-bold inline-block"
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

      {/* Enhanced flying elements container */}
      <div className="relative">
        {/* Shipping Route Animation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute rounded-full border-2 border-indigo-500/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '200px',
              height: '200px'
            }}
          />
        </motion.div>

        {/* Delivery Truck Animation */}
        <motion.div
          animate={{
            x: [-150, 150],
            y: [-20, 20],
            rotate: [-5, 5]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.9, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
              filter: 'blur(30px)',
              width: '150px',
              height: '60px'
            }}
          />

          <motion.div
            animate={{
              rotate: [-5, 5],
              scale: [1, 1.1, 1],
              y: [-5, 5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <TruckIcon 
              className="w-20 h-20"
              style={{
                color: '#818CF8',
                filter: 'drop-shadow(0 0 20px rgba(129, 140, 248, 0.8))'
              }}
            />
          </motion.div>

          {/* Package Animation */}
          <motion.div
            animate={{
              y: [-10, 10],
              rotate: [-10, 10],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <PackageIcon 
              className="w-14 h-14"
              style={{
                color: '#A78BFA',
                filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.8))'
              }}
            />
          </motion.div>

          {/* Location Pin Animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-8 right-0"
          >
            <MapPinIcon 
              className="w-8 h-8"
              style={{
                color: '#F472B6',
                filter: 'drop-shadow(0 0 10px rgba(244, 114, 182, 0.8))'
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Add loading text with animation */}
      <motion.div
        className="absolute bottom-1/4 text-white/80 text-lg font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.span
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Preparing your shipping labels
        </motion.span>
        <motion.span
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="ml-1"
        >
          ...
        </motion.span>
      </motion.div>

      {/* Enhanced SVG filter for gooey effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="gooey"
            />
          </filter>
        </defs>
      </svg>

      {/* Route Path Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <svg className="w-full h-full">
          <motion.path
            d="M 100,100 Q 300,50 500,100 T 900,100"
            fill="none"
            stroke="rgba(79, 70, 229, 0.2)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
} 