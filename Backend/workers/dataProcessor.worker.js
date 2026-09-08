import { parentPort, workerData } from "node:worker_threads";

/**
 * Worker Thread Processor
 * Handles CPU-heavy calculations in a separate thread
 */
try {
  const { action, payload } = workerData || {};

  let result = null;

  switch (action) {
    case "CALCULATE_ORDER_ANALYTICS": {
      const orders = Array.isArray(payload) ? payload : [];
      let totalRevenue = 0;
      let completedOrders = 0;
      let pendingOrders = 0;
      let cancelledOrders = 0;
      const categoryMap = {};

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const price = Number(order.productid?.price) || 0;
        const status = (order.status || "").toLowerCase();

        if (status === "delivered" || status === "completed" || order.payment === "paid") {
          totalRevenue += price;
        }

        if (status === "delivered" || status === "completed") {
          completedOrders++;
        } else if (status === "cancelled") {
          cancelledOrders++;
        } else {
          pendingOrders++;
        }

        const category = order.productid?.category || "Uncategorized";
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      }

      const totalCount = orders.length;
      const avgOrderValue = totalCount > 0 ? (totalRevenue / totalCount).toFixed(2) : 0;

      result = {
        totalOrders: totalCount,
        totalRevenue,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        avgOrderValue: Number(avgOrderValue),
        categoryBreakdown: categoryMap,
        calculatedAt: new Date().toISOString(),
        threadId: process.pid,
      };
      break;
    }

    case "HEAVY_COMPUTATION": {
      // Benchmark prime calculation or cryptographic data transformation
      const iterations = Number(payload?.iterations) || 1000000;
      let count = 0;
      for (let i = 2; i <= iterations; i++) {
        let isPrime = true;
        for (let j = 2; j * j <= i; j++) {
          if (i % j === 0) {
            isPrime = false;
            break;
          }
        }
        if (isPrime) count++;
      }
      result = {
        primeCount: count,
        iterations,
        computedAt: new Date().toISOString(),
      };
      break;
    }

    default:
      result = { message: "Task executed successfully", data: payload };
  }

  parentPort?.postMessage({ success: true, result });
} catch (error) {
  parentPort?.postMessage({ success: false, error: error.message });
}
