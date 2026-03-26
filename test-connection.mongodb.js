// MongoDB Connection Test Playground
// Right-click on this file and select "Run Playground" to test the connection

// This will connect to your MongoDB Atlas cluster
// Make sure you've added your IP to the whitelist first!

const client = new MongoClient("mongodb+srv://rashiyaom_db_user:Romashiya%40123@omkar.jfxlozw.mongodb.net/?appName=omkar");
// Note: The @ in password "Romashiya@123" is URL-encoded as %40

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas successfully!");
    
    // List all databases
    const adminDb = client.db("admin");
    const result = await adminDb.admin().listDatabases();
    console.log("📊 Available databases:", result.databases.map(db => db.name));
    
    // Connect to 'omkar' database
    const db = client.db("omkar");
    const collections = await db.listCollections().toArray();
    console.log("📁 Collections in 'omkar' database:", collections.map(c => c.name));
    
    // Check User collection
    const userCount = await db.collection("users").countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    await client.close();
    console.log("✅ Connection closed");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

testConnection();
