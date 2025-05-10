import { useEffect } from 'react';

export const useAnimations = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const neonPulse = {
    initial: { boxShadow: "0 0 10px rgba(59, 130, 246, 0.2)" },
    pulse: {
      boxShadow: [
        "0 0 10px rgba(59, 130, 246, 0.2)",
        "0 0 20px rgba(59, 130, 246, 0.4)",
        "0 0 30px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.4)",
        "0 0 10px rgba(59, 130, 246, 0.2)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return {
    cardVariants,
    containerVariants,
    neonPulse,
    pageTransition
  };
}; 