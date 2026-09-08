import { getCache, setCache } from "../utils/cache.js";

/**
 * Express Middleware for In-Memory API Caching
 * @param {number} durationSeconds - Cache time-to-live in seconds (default 300s = 5m)
 */
export const cacheMiddleware = (durationSeconds = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Generate unique cache key based on URL & query parameters
    const cacheKey = req.originalUrl || req.url;
    const cachedResponse = getCache(cacheKey);

    if (cachedResponse) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Cache-Control", `public, max-age=${durationSeconds}`);
      return res.status(200).json(cachedResponse);
    }

    // Intercept res.json to store fresh data in cache
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful 200 responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCache(cacheKey, body, durationSeconds);
      }
      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", `public, max-age=${durationSeconds}`);
      return originalJson(body);
    };

    next();
  };
};

export default cacheMiddleware;
