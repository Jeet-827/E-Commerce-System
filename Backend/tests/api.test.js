import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../server.js";
import { getCache, setCache, clearCachePattern, flushAllCache, getCacheStats } from "../utils/cache.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

describe("Backend API & Utility Unit Tests", () => {
  beforeEach(() => {
    flushAllCache();
  });

  describe("In-Memory Cache Utility", () => {
    it("should set and retrieve values from cache", () => {
      setCache("test_key", { name: "E-System Product" }, 60);
      const cached = getCache("test_key");
      expect(cached).toEqual({ name: "E-System Product" });
    });

    it("should clear cache matching specific pattern", () => {
      setCache("/product/123", { id: "123" });
      setCache("/product/456", { id: "456" });
      setCache("/user/789", { id: "789" });

      clearCachePattern("/product");

      expect(getCache("/product/123")).toBeUndefined();
      expect(getCache("/product/456")).toBeUndefined();
      expect(getCache("/user/789")).toEqual({ id: "789" });
    });

    it("should flush all cache items", () => {
      setCache("key1", "val1");
      setCache("key2", "val2");
      flushAllCache();

      expect(getCache("key1")).toBeUndefined();
      expect(getCache("key2")).toBeUndefined();
    });

    it("should return valid cache statistics", () => {
      const stats = getCacheStats();
      expect(stats).toBeDefined();
      expect(typeof stats.keys).toBe("number");
    });
  });

  describe("Express Server Endpoints", () => {
    it("GET / should return server running status", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("server is running");
    });

    it("GET /api/v1/cache/stats should return cache statistics", async () => {
      const res = await request(app).get("/api/v1/cache/stats");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Cache statistics");
      expect(res.body.stats).toBeDefined();
    });

    it("POST /api/v1/cache/flush should flush backend cache", async () => {
      setCache("sample_key", "sample_val");
      const res = await request(app).post("/api/v1/cache/flush");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Cache flushed successfully");
      expect(getCache("sample_key")).toBeUndefined();
    });
  });

  describe("Auth Middleware Verification", () => {
    it("should reject request without Authorization header", () => {
      const req = { headers: {} };
      let statusCode = null;
      let jsonBody = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (body) => {
              jsonBody = body;
            },
          };
        },
      };

      AuthMiddleware(req, res, () => {});

      expect(statusCode).toBe(401);
      expect(jsonBody.message).toBe("Authorization header missing");
    });

    it("should reject request with invalid JWT token", () => {
      const req = { headers: { authorization: "Bearer invalid_token_xyz" } };
      let statusCode = null;
      let jsonBody = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (body) => {
              jsonBody = body;
            },
          };
        },
      };

      AuthMiddleware(req, res, () => {});

      expect(statusCode).toBe(401);
      expect(jsonBody.message).toBe("Invalid or expired token");
    });
  });
});
