import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NeonButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon
}) => {
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    relative overflow-hidden rounded-lg font-medium
    transition-all duration-300 ease-in-out
    ${sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const variants = {
    primary: {
      background: `linear-gradient(45deg, ${neonTheme.primary}, ${neonTheme.glow})`,
      boxShadow: `0 0 10px ${neonTheme.glow}`,
      color: 'white'
    },
    secondary: {
      background: 'transparent',
      border: `2px solid ${neonTheme.primary}`,
      boxShadow: `0 0 10px ${neonTheme.glow}`,
      color: neonTheme.primary
    },
    ghost: {
      background: 'transparent',
      color: neonTheme.primary
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: `0 0 20px ${neonTheme.glow}`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 },
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      style={variants[variant]}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      animate={loading ? "loading" : "initial"}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-shine"
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <div className="relative flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {Icon && <Icon className="w-5 h-5" />}
        <span>{children}</span>
      </div>
    </motion.button>
  );
};

export default NeonButton; 