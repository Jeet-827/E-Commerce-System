import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../index.js";

describe("Admin Backend Unit & Integration Tests", () => {
  it("GET / should return server running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("server running");
  });

  it("POST /api/v1/admin/adminsignin should reject missing email and password", async () => {
    const res = await request(app).post("/api/v1/admin/adminsignin").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email and password are required");
  });

  it("GET /api/v1/admin/adminlogout should successfully clear session", async () => {
    const res = await request(app).get("/api/v1/admin/adminlogout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Admin Logout Successfully");
  });
});
