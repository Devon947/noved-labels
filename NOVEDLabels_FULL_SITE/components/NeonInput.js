import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NeonInput = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const inputVariants = {
    initial: {
      boxShadow: `0 0 0 1px ${neonTheme.glow}`,
    },
    focus: {
      boxShadow: `0 0 0 2px ${neonTheme.primary}, 0 0 10px ${neonTheme.glow}`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    error: {
      boxShadow: `0 0 0 2px rgb(239, 68, 68), 0 0 10px rgba(239, 68, 68, 0.5)`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <motion.div
        className="relative"
        variants={inputVariants}
        initial="initial"
        animate={error ? "error" : isFocused ? "focus" : "initial"}
      >
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-lg
            bg-gray-800/50 backdrop-blur-sm
            text-white placeholder-gray-400
            border-0 focus:ring-0
            transition-colors duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'text-red-400' : ''}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${neonTheme.primary}, ${neonTheme.glow})`,
            opacity: 0.1
          }}
          animate={{
            opacity: isFocused ? [0.1, 0.2, 0.1] : 0.1
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

NeonInput.displayName = 'NeonInput';

export default NeonInput; 