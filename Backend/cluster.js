import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";

// Set libuv threadpool size for heavy asynchronous operations (bcrypt, DNS, FS)
const numCPUs = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
process.env.UV_THREADPOOL_SIZE = String(Math.max(4, numCPUs * 2));

if (cluster.isPrimary || cluster.isMaster) {
  console.log(`\n🚀 ==========================================`);
  console.log(`⚡ Cluster Master Process Started [PID: ${process.pid}]`);
  console.log(`💻 Detected ${numCPUs} CPU Cores | Threadpool Size: ${process.env.UV_THREADPOOL_SIZE}`);
  console.log(`🚀 Forking ${numCPUs} Worker Processes for Maximum Performance...`);
  console.log(`==========================================\n`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker lifecycle & auto-restart on exit
  cluster.on("online", (worker) => {
    console.log(`✅ Worker Process [PID: ${worker.process.pid}] is online and ready.`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.warn(`⚠️ Worker [PID: ${worker.process.pid}] died (code: ${code}, signal: ${signal}). Spawning replacement...`);
    cluster.fork();
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("\n🛑 Master received shutdown signal. Terminating workers gracefully...");
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill("SIGTERM");
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} else {
  // Worker process runs the Express server
  import("./server.js").catch((err) => {
    console.error(`❌ Worker [PID: ${process.pid}] startup failed:`, err);
  });
}
