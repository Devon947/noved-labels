import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NeonProgress = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  animated = true,
  className = ''
}) => {
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const variants = {
    default: {
      background: neonTheme.glow,
      boxShadow: `0 0 10px ${neonTheme.glow}`
    },
    success: {
      background: '#10B981',
      boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
    },
    warning: {
      background: '#F59E0B',
      boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
    },
    error: {
      background: '#EF4444',
      boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
    },
    info: {
      background: '#3B82F6',
      boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${(value / max) * 100}%`,
      transition: {
        duration: animated ? 1 : 0,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    initial: {
      opacity: 0.5
    },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          w-full rounded-full
          bg-gray-800/50
          backdrop-blur-sm
          ${sizeClasses[size]}
        `}
      >
        <motion.div
          className="rounded-full"
          style={variants[variant]}
          variants={progressVariants}
          initial="initial"
          animate="animate"
        >
          {animated && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)`,
                backgroundSize: '200% 100%'
              }}
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            />
          )}
        </motion.div>
      </div>
      {showValue && (
        <div className="mt-1 text-sm text-gray-400">
          {Math.round((value / max) * 100)}%
        </div>
      )}
    </div>
  );
};

export default NeonProgress; 