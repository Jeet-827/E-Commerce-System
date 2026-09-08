import { Worker } from "node:worker_threads";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerPath = path.resolve(__dirname, "../workers/dataProcessor.worker.js");

/**
 * Execute a task inside a Worker Thread
 * @param {string} action - Name of the action (e.g. 'CALCULATE_ORDER_ANALYTICS')
 * @param {any} payload - Data payload to pass to the worker
 * @returns {Promise<any>}
 */
export const executeInWorkerThread = (action, payload) => {
  return new Promise((resolve, reject) => {
    // In Serverless / Vercel functions where threads might be restricted, provide fallback
    if (process.env.VERCEL) {
      if (action === "CALCULATE_ORDER_ANALYTICS") {
        const orders = Array.isArray(payload) ? payload : [];
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.productid?.price) || 0), 0);
        return resolve({
          totalOrders: orders.length,
          totalRevenue,
          fallback: true,
        });
      }
      return resolve({ message: "Processed synchronously", data: payload });
    }

    try {
      const worker = new Worker(workerPath, {
        workerData: { action, payload },
      });

      worker.on("message", (response) => {
        if (response.success) {
          resolve(response.result);
        } else {
          reject(new Error(response.error || "Worker execution failed"));
        }
        worker.terminate();
      });

      worker.on("error", (err) => {
        reject(err);
        worker.terminate();
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default executeInWorkerThread;
