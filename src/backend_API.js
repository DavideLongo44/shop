// server.js (Node.js mit Express)

const express = require('express');
const { MongoClient } = require('mongodb'); // Verwenden Sie den MongoDB-Treiber
const app = express();

// Verbindung zur MongoDB herstellen
const uri = 'mongodb://localhost:27017/shopwise'; // Ihre MongoDB-Verbindungs-URI hier einfügen
const client = new MongoClient(uri );

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
    // Beenden der Anwendung bei Verbindungsfehler
    process.exit(1);
  }
}

connectToMongoDB();

// API-Endpunkt zum Abrufen von Produktdaten
app.get('/api/products', async (req, res) => {
  try {
    const db = client.db();
    const products = await db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
