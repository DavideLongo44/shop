const { MongoClient } = require('mongodb');

// Verbindungs-URL zur MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/';

// Funktion zum Abrufen des Preises von Bananen
async function fetchPrice() {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Verbindung zur Datenbank herstellen
    await client.connect();
    console.log('Connected to MongoDB');

    // Datenbank und Sammlung auswählen
    const db = client.db();
    const collection = db.collection('shopwise.artikel');

    // Preis von Bananen abfragen
    const priceCursor = await collection.find({ name: 'Bananen' }, { projection: { _id: 0, price: 2 } });

    // Die erste Preisinformation extrahieren (angenommen, es gibt nur ein Dokument für Bananen)
    const PriceData = await priceCursor.next();

    // Preis der Bananen ausgeben
    const price = PriceData ? PriceData.price : 'Nicht verfügbar';
    console.log('Price of Bananen:', price);
  } catch (error) {
    console.error('Error fetching banana price:', error);
  } finally {
    // Verbindung schließen
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Funktion aufrufen, um den Preis von Bananen abzurufen
fetchPrice();
