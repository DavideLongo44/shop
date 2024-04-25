const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    // Führe hier Datenbankoperationen durch...
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

main();
