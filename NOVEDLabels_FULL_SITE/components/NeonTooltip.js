import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NeonTooltip = ({
  content,
  children,
  position = 'top',
  delay = 0.2,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const positions = {
    top: {
      top: 'auto',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)',
      marginBottom: '8px'
    },
    bottom: {
      top: '100%',
      bottom: 'auto',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      marginTop: '8px'
    },
    left: {
      top: '50%',
      bottom: 'auto',
      left: 'auto',
      right: '100%',
      transform: 'translateY(-50%) translateX(-8px)',
      marginRight: '8px'
    },
    right: {
      top: '50%',
      bottom: 'auto',
      left: '100%',
      right: 'auto',
      transform: 'translateY(-50%) translateX(8px)',
      marginLeft: '8px'
    }
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute z-50 px-3 py-2 text-sm text-white rounded-lg whitespace-nowrap"
            style={{
              ...positions[position],
              background: 'rgba(17, 24, 39, 0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${neonTheme.glow}`,
              boxShadow: `0 0 15px ${neonTheme.glow}`
            }}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ delay }}
          >
            {content}
            <div
              className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
              style={{
                ...(position === 'top' && {
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderRight: `1px solid ${neonTheme.glow}`,
                  borderBottom: `1px solid ${neonTheme.glow}`
                }),
                ...(position === 'bottom' && {
                  top: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  borderLeft: `1px solid ${neonTheme.glow}`,
                  borderTop: `1px solid ${neonTheme.glow}`
                }),
                ...(position === 'left' && {
                  right: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  borderTop: `1px solid ${neonTheme.glow}`,
                  borderRight: `1px solid ${neonTheme.glow}`
                }),
                ...(position === 'right' && {
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%) rotate(45deg)',
                  borderBottom: `1px solid ${neonTheme.glow}`,
                  borderLeft: `1px solid ${neonTheme.glow}`
                })
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeonTooltip; 