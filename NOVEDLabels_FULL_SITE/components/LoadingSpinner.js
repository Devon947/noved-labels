import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const LoadingSpinner = ({ size = 40 }) => {
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={spinTransition}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `3px solid ${neonTheme.glow}`,
          borderTopColor: neonTheme.primary,
          boxShadow: `0 0 15px ${neonTheme.glow}`,
          position: 'absolute'
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }}
        style={{
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          backgroundColor: neonTheme.primary,
          position: 'absolute',
          top: '35%',
          left: '35%',
          boxShadow: `0 0 20px ${neonTheme.primary}`
        }}
      />
    </div>
  );
};

export const LoadingOverlay = ({ children, loading }) => {
  if (!loading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default LoadingSpinner; 