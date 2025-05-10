/**
 * Simple caching utility for improved performance
 */

// In-memory cache store
const cache = new Map();

/**
 * Time-to-live cache implementation
 */
const ttlCache = {
  /**
   * Get an item from cache
   * @param {string} key The cache key
   * @returns {any|null} The cached value or null if not found/expired
   */
  get(key) {
    if (!cache.has(key)) return null;
    
    const item = cache.get(key);
    const now = Date.now();
    
    // Check if item has expired
    if (item.expiry && item.expiry < now) {
      cache.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  /**
   * Store an item in cache
   * @param {string} key The cache key
   * @param {any} value The value to cache
   * @param {number} ttl Time to live in seconds (optional)
   */
  set(key, value, ttl = null) {
    const item = {
      value,
      expiry: ttl ? Date.now() + (ttl * 1000) : null
    };
    
    cache.set(key, item);
    return value;
  },
  
  /**
   * Remove an item from cache
   * @param {string} key The cache key
   */
  delete(key) {
    cache.delete(key);
  },
  
  /**
   * Clear all cached items
   */
  clear() {
    cache.clear();
  },
  
  /**
   * Get stats about the cache
   */
  stats() {
    const now = Date.now();
    let activeItems = 0;
    let expiredItems = 0;
    
    cache.forEach(item => {
      if (!item.expiry || item.expiry > now) {
        activeItems++;
      } else {
        expiredItems++;
      }
    });
    
    return {
      total: cache.size,
      active: activeItems,
      expired: expiredItems
    };
  }
};

/**
 * Memoize a function with optional TTL
 * @param {Function} fn The function to memoize
 * @param {number} ttl Time to live in seconds (optional)
 * @returns {Function} The memoized function
 */
function memoize(fn, ttl = null) {
  return function(...args) {
    const key = `${fn.name}:${JSON.stringify(args)}`;
    const cached = ttlCache.get(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = fn.apply(this, args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then(value => {
        ttlCache.set(key, value, ttl);
        return value;
      });
    }
    
    ttlCache.set(key, result, ttl);
    return result;
  };
}

export { ttlCache, memoize }; 