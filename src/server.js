const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const ItemModel = require('./models/Item');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mongoose Verbindung
mongoose.connect('mongodb://localhost:27017/shopwise', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Verbunden mit der Datenbank!'));

// POST: Neues Item hinzufügen
app.post('/items', async (req, res) => {
  const newItem = new ItemModel({
    value: req.body.name,
    quantity: req.body.quantity,
    unit: req.body.unit,
    id: req.body.id || new mongoose.Types.ObjectId(), // Verwende ObjectId, wenn keine ID übergeben wird
    category: req.body.category,
    price: req.body.price, // Preis und Angebot müssten hinzugefügt werden falls notwendig
    onSaleAt: req.body.onSaleAt,
  });

  try {
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Alle Items abrufen
app.get('/items', async (req, res) => {
  try {
    const items = await ItemModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Weitere Routen für UPDATE und DELETE hier hinzufügen

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

