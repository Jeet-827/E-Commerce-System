import NodeCache from "node-cache";

// Initialize in-memory cache with standard TTL of 300 seconds (5 minutes) and periodic check period of 60 seconds
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false, // Disabling cloning increases read speed significantly
});

/**
 * Get item from cache
 */
export const getCache = (key) => {
  return cache.get(key);
};

/**
 * Set item in cache with custom TTL (in seconds)
 */
export const setCache = (key, data, ttl = 300) => {
  return cache.set(key, data, ttl);
};

/**
 * Invalidate/Delete specific cache key or keys matching pattern/prefix
 */
export const clearCachePattern = (pattern) => {
  try {
    const keys = cache.keys();
    const matchedKeys = keys.filter((key) => key.includes(pattern));
    if (matchedKeys.length > 0) {
      cache.del(matchedKeys);
      console.log(`🧹 Cache cleared for pattern "${pattern}" (${matchedKeys.length} keys removed)`);
    }
  } catch (error) {
    console.error("Error clearing cache pattern:", error);
  }
};

/**
 * Flush all cache entries
 */
export const flushAllCache = () => {
  cache.flushAll();
  console.log("🧹 All backend cache flushed.");
};

/**
 * Cache statistics
 */
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;
