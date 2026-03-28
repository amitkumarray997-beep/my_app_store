const { MongoClient, ServerApiVersion } = require('mongodb');

// The standard 'mongodb://' connection string bypasses the DNS SRV lookup (querySrv ECONNREFUSED)
// that was failing on your local network's DNS resolver.
const uri = process.env.MONGO_URI || "mongodb://amitkumarray997_db_user:Amit%408002@ac-ifq6xbb-shard-00-00.wwbixly.mongodb.net:27017,ac-ifq6xbb-shard-00-01.wwbixly.mongodb.net:27017,ac-ifq6xbb-shard-00-02.wwbixly.mongodb.net:27017/?ssl=true&replicaSet=atlas-iqz7dk-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbInstance = null;

const connectDb = async () => {
  try {
    console.log("⏳ Connecting to MongoDB Atlas (Legacy URI to bypass DNS blocks)...");
    await client.connect();
    // Use the explicitly named 'appstore' database
    dbInstance = client.db("appstore");
    console.log("✅ Successfully connected to MongoDB Atlas (appstore db)");
    return dbInstance;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

const getDb = () => {
  if (!dbInstance) {
    throw new Error("❌ Database not initialized. Call connectDb first.");
  }
  return dbInstance;
};

module.exports = { connectDb, getDb };
