const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3022; // Portnummer

// Verbindung zur MongoDB-Datenbank herstellen
mongoose.connect('mongodb://localhost:27017/shopwise');

// Definieren Sie ein Mongoose-Schema für Ihre Daten
const productSchema = new mongoose.Schema({
  _id: String,
  Produktname: String,
  price: Number
});

// Definieren Sie ein Mongoose-Modell für Ihre Daten
const Product = mongoose.model('Produktname', productSchema);

// Middleware für das Parsen von JSON-Anfragen
app.use(express.json());

// Route zum Hinzufügen eines Produkts
app.post('/api/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = new Product({ name, price });
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Serverfehler');
  }
});

// Starten Sie den Server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
