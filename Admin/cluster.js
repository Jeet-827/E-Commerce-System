import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";

const numCPUs = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
process.env.UV_THREADPOOL_SIZE = String(Math.max(4, numCPUs * 2));

if (cluster.isPrimary || cluster.isMaster) {
  console.log(`\n🚀 ==========================================`);
  console.log(`⚡ Admin Cluster Master Process Started [PID: ${process.pid}]`);
  console.log(`💻 Detected ${numCPUs} CPU Cores | Threadpool Size: ${process.env.UV_THREADPOOL_SIZE}`);
  console.log(`🚀 Forking ${numCPUs} Admin Worker Processes...`);
  console.log(`==========================================\n`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`✅ Admin Worker [PID: ${worker.process.pid}] is online.`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.warn(`⚠️ Admin Worker [PID: ${worker.process.pid}] died (${code}/${signal}). Respawning...`);
    cluster.fork();
  });

  const shutdown = () => {
    console.log("\n🛑 Terminating admin workers gracefully...");
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill("SIGTERM");
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} else {
  import("./index.js").catch((err) => {
    console.error(`❌ Admin Worker [PID: ${process.pid}] startup failed:`, err);
  });
}
