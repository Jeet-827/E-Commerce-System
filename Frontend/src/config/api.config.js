// In development: defaults to localhost:5000 and localhost:8000
// In production: uses VITE_API_URL environment variable set in Vercel / hosting provider
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:5000");

export const ADMIN_API_BASE_URL =
  import.meta.env.VITE_ADMIN_API_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:8000");
