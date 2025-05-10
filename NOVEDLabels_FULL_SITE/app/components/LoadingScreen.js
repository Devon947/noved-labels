'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, CubeIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
          {/* Enhanced gooey trail effect */}
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

          {/* Enhanced airplane with more dynamic effects */}
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
            <PaperAirplaneIcon 
              className="w-20 h-20 transform rotate-90"
              style={{
                color: '#818CF8',
                filter: 'drop-shadow(0 0 20px rgba(129, 140, 248, 0.8))'
              }}
            />
          </motion.div>

          {/* Enhanced floating package with more dynamic effects */}
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
            <CubeIcon 
              className="w-14 h-14"
              style={{
                color: '#A78BFA',
                filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.8))'
              }}
            />
          </motion.div>

          {/* Added sparkles effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-8 right-0"
          >
            <SparklesIcon 
              className="w-8 h-8"
              style={{
                color: '#FCD34D',
                filter: 'drop-shadow(0 0 10px rgba(252, 211, 77, 0.8))'
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced loading text with more dynamic animation */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          y: [0, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/3 text-xl font-medium"
        style={{
          color: '#A78BFA',
          textShadow: '0 0 15px rgba(167, 139, 250, 0.6)'
        }}
      >
        Preparing your shipping experience...
      </motion.p>

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
    </motion.div>
  );
} 