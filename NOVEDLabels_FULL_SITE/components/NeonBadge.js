import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NeonBadge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  pulse = false,
  icon: Icon
}) => {
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const variants = {
    default: {
      background: 'rgba(17, 24, 39, 0.9)',
      border: `1px solid ${neonTheme.glow}`,
      boxShadow: `0 0 10px ${neonTheme.glow}`
    },
    success: {
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid #10B981',
      boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.1)',
      border: '1px solid #F59E0B',
      boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid #EF4444',
      boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
    },
    info: {
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid #3B82F6',
      boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
    }
  };

  const pulseVariants = {
    initial: {
      boxShadow: variants[variant].boxShadow
    },
    animate: {
      boxShadow: [
        variants[variant].boxShadow,
        '0 0 20px rgba(255, 255, 255, 0.5)',
        variants[variant].boxShadow
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        backdrop-blur-sm
        ${sizeClasses[size]}
        ${className}
      `}
      style={variants[variant]}
      variants={pulse ? pulseVariants : undefined}
      initial="initial"
      animate={pulse ? "animate" : undefined}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.span>
  );
};

export default NeonBadge; 