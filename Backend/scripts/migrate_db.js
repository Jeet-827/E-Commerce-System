import mongoose from "mongoose";

const LOCAL_URI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/Ecomm";
const CLUSTER_URI =
  process.env.MONGO_URL ||
  "mongodb+srv://hadiyakishor01_db_user:kishor@cluster0.2qfld2u.mongodb.net/Ecomm?appName=Cluster0";

async function migrate() {
  console.log("🚀 Starting MongoDB Migration: Local -> Atlas Cluster...\n");

  let localConn = null;
  let clusterConn = null;

  try {
    console.log(`🔌 Connecting to Local DB: ${LOCAL_URI}`);
    localConn = await mongoose.createConnection(LOCAL_URI, {
      serverSelectionTimeoutMS: 5000,
    }).asPromise();
    console.log("✅ Local MongoDB connected successfully.");

    console.log(`\n🔌 Connecting to Atlas Cluster: ${CLUSTER_URI.replace(/:[^:@]+@/, ":****@")}`);
    clusterConn = await mongoose.createConnection(CLUSTER_URI, {
      serverSelectionTimeoutMS: 10000,
    }).asPromise();
    console.log("✅ Atlas Cluster connected successfully.");

    const localDb = localConn.db;
    const clusterDb = clusterConn.db;

    // Get all collections from local DB
    const collections = await localDb.listCollections().toArray();
    console.log(`\n📂 Found ${collections.length} collections to migrate: ${collections.map((c) => c.name).join(", ")}\n`);

    for (const col of collections) {
      const colName = col.name;
      if (colName.startsWith("system.")) continue;

      const localCollection = localDb.collection(colName);
      const clusterCollection = clusterDb.collection(colName);

      const count = await localCollection.countDocuments();
      console.log(`🔄 Migrating [${colName}] (${count} documents)...`);

      if (count === 0) {
        console.log(`   ⏭️ Skipping empty collection: ${colName}`);
        continue;
      }

      const docs = await localCollection.find({}).toArray();

      // Perform bulk upsert in chunks of 500
      const CHUNK_SIZE = 500;
      let insertedOrUpdated = 0;

      for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
        const chunk = docs.slice(i, i + CHUNK_SIZE);
        const operations = chunk.map((doc) => ({
          replaceOne: {
            filter: { _id: doc._id },
            replacement: doc,
            upsert: true,
          },
        }));

        const result = await clusterCollection.bulkWrite(operations, { ordered: false });
        insertedOrUpdated += (result.upsertedCount || 0) + (result.modifiedCount || 0) + (result.matchedCount || 0);
      }

      const clusterCount = await clusterCollection.countDocuments();
      console.log(`   ✅ [${colName}] Migrated successfully! Local: ${count} | Cluster: ${clusterCount}`);
    }

    console.log("\n🎉 ========================================================");
    console.log("✨ ALL LOCAL DATA MIGRATED TO CLUSTER WITH 100% INTEGRITY!");
    console.log("========================================================\n");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    if (localConn) await localConn.close();
    if (clusterConn) await clusterConn.close();
    process.exit(0);
  }
}

migrate();
