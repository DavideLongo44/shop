const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3001;

app.use(express.json());

async function connectToDatabase() {
  const uri = 'mongodb://localhost:27017/shopwise';
  const client = new MongoClient(uri);
  await client.connect();
  return client.db('shopwise').collection('artikel');
}

app.post('/api/getProductDetails', async (req, res) => {
  const { itemName } = req.body;

  try {
    const dbCollection = await connectToDatabase();
    const result = await dbCollection.findOne({ itemName: itemName });
    if (!result) {
      return res.status(404).json({ price: 'Nicht verfügbar', onSaleAt: 'Nicht im Angebot' });
    }
    res.json({
      price: result.price || 'Nicht verfügbar',
      onSaleAt: result.onSaleAt || 'Nicht im Angebot'
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Produktinformationen aus der MongoDB-Datenbank:', error);
    res.status(500).json({ price: 'Unbekannt', onSaleAt: 'Unbekannt' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

