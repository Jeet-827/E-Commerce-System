import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import os from "node:os";

/**
 * Worker Thread Helper
 * Offloads CPU-intensive operations away from the main event loop
 */
export const runWorkerTask = (taskName, data) => {
  return new Promise((resolve, reject) => {
    // In serverless / limited environments, compute directly
    if (process.env.VERCEL) {
      try {
        if (taskName === "aggregateAnalytics") {
          const result = (data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
          return resolve({ totalAmount: result });
        }
        return resolve(data);
      } catch (err) {
        return reject(err);
      }
    }

    const workerScript = `
      const { parentPort, workerData } = require('node:worker_threads');
      const { taskName, data } = workerData;
      
      try {
        let result = null;
        if (taskName === 'aggregateAnalytics') {
          result = (data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
        } else {
          result = data;
        }
        parentPort.postMessage({ success: true, result });
      } catch (err) {
        parentPort.postMessage({ success: false, error: err.message });
      }
    `;

    const worker = new Worker(workerScript, {
      eval: true,
      workerData: { taskName, data },
    });

    worker.on("message", (msg) => {
      if (msg.success) {
        resolve(msg.result);
      } else {
        reject(new Error(msg.error));
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
  });
};

export default runWorkerTask;
