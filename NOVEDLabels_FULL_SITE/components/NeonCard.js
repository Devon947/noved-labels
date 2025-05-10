import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NeonCard = ({ 
  children, 
  className = '',
  hover = true,
  onClick,
  variant = 'default'
}) => {
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const variants = {
    default: {
      background: 'rgba(17, 24, 39, 0.7)',
      border: `1px solid ${neonTheme.glow}`,
      boxShadow: `0 0 10px ${neonTheme.glow}`
    },
    elevated: {
      background: 'rgba(17, 24, 39, 0.8)',
      border: `2px solid ${neonTheme.primary}`,
      boxShadow: `0 0 20px ${neonTheme.glow}`
    },
    glass: {
      background: 'rgba(17, 24, 39, 0.5)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${neonTheme.glow}`,
      boxShadow: `0 0 15px ${neonTheme.glow}`
    }
  };

  const cardVariants = {
    initial: { 
      scale: 1,
      ...variants[variant]
    },
    hover: hover ? {
      scale: 1.02,
      boxShadow: `0 0 30px ${neonTheme.glow}`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    } : {},
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden backdrop-blur-sm ${className}`}
      variants={cardVariants}
      initial="initial"
      whileHover={hover ? "hover" : undefined}
      whileTap={onClick ? "tap" : undefined}
      onClick={onClick}
      style={variants[variant]}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-shine opacity-0"
        animate={{
          opacity: [0, 0.1, 0],
          backgroundPosition: ['0% 0%', '200% 0%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-gray-700 ${className}`}>
    {children}
  </div>
);

export default NeonCard; 