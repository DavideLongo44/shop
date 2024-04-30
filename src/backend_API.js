// Annahme: Sie verwenden Express.js für Ihr Backend

// Importieren Sie erforderliche Module
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Verbindung zur MongoDB-Datenbank herstellen
mongoose.connect('mongodb://localhost:27017/shopwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Product = require('./App.js'); // Annahme: Sie haben ein Product-Modell definiert

// Route zum Abrufen des Preises für ein Produkt
router.get('/products/:productName/price', async (req, res) => {
  try {
    const { productName } = req.params;
    const product = await Product.findOne({ Produktname: productName });
    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }
    res.json({ price: product['Preis (€)'] }); // Senden Sie den Preis als JSON-Antwort
  } catch (error) {
    console.error('Fehler beim Abrufen des Preises:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});


module.exports = router;
