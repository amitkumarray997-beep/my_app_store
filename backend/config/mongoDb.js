const { MongoClient, ServerApiVersion } = require('mongodb');

// ── Connection Logic (Ultra-Robust) ──────────────────────────
const rawUri = process.env.MONGO_URI || "mongodb://amitkumarray997_db_user:Amit%408002@ac-ifq6xbb-shard-00-00.wwbixly.mongodb.net:27017,ac-ifq6xbb-shard-00-01.wwbixly.mongodb.net:27017,ac-ifq6xbb-shard-00-02.wwbixly.mongodb.net:27017/?ssl=true&replicaSet=atlas-iqz7dk-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const maskUri = (uri) => {
  try {
    const url = new URL(uri);
    url.password = "****";
    return url.toString();
  } catch (e) {
    // If it's invalid, mask manually
    return uri.replace(/\/\/.*:.*@/, "//USER:****@").substring(0, 100) + "...";
  }
};

const client = new MongoClient(rawUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Increased timeouts for slow cold-starts
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

let dbInstance = null;

const connectDb = async () => {
  try {
    console.log(`🔌 Attempting link to: ${maskUri(rawUri)}`);
    
    // Explicit handle for the SRV DNS issue reported in logs
    if (rawUri.includes("8002") && !rawUri.includes("%40")) {
      console.warn("⚠️ ERROR DETECTED: Your password contains '@8002' but the '@' is NOT URL-encoded.");
      console.warn("⚠️ Please change '@' to '%40' in your Railway Environment Variable 'MONGO_URI'.");
    }

    await client.connect();
    dbInstance = client.db("appstore");
    console.log("✅ Successfully connected to MongoDB Atlas (appstore db)");
    return dbInstance;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    if (error.message.includes("ENOTFOUND")) {
      console.error("💡 PRO-TIP: This looks like a URL-encoding error (check your password for @, #, etc.)");
    }
    throw error;
  }
};

const getDb = () => {
  if (!dbInstance) {
    throw new Error("❌ Database not initialized. Call connectDb first.");
  }
  return dbInstance;
};

module.exports = { connectDb, getDb };
