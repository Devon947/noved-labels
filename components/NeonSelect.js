import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';

const NeonSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCurrentNeonTheme } = useTheme();
  const neonTheme = getCurrentNeonTheme();

  const selectVariants = {
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
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <motion.div
            variants={selectVariants}
            initial="initial"
            animate={error ? "error" : isOpen ? "focus" : "initial"}
          >
            <Listbox.Button
              className={`
                w-full px-4 py-2 rounded-lg
                bg-gray-800/50 backdrop-blur-sm
                text-white placeholder-gray-400
                border-0 focus:ring-0
                transition-colors duration-200
                flex items-center justify-between
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${error ? 'text-red-400' : ''}
              `}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="block truncate">
                {options.find(option => option.value === value)?.label || 'Select an option'}
              </span>
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </Listbox.Button>
          </motion.div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`
                absolute z-10 w-full mt-1
                bg-gray-800/90 backdrop-blur-sm
                rounded-lg shadow-lg
                border border-gray-700
                overflow-hidden
                focus:outline-none
              `}
              style={{
                boxShadow: `0 0 20px ${neonTheme.glow}`
              }}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) => `
                    relative cursor-pointer select-none
                    py-2 pl-10 pr-4
                    ${active ? 'bg-gray-700/50' : 'text-gray-300'}
                  `}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon className="h-5 w-5 text-blue-400" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
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
};

export default NeonSelect; 