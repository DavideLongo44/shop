// backend/routes/products.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // MongoDB-Modell für Produkte

// Route zum Abrufen des Preises eines Produkts
router.get('/artikel/:Productname/Preis', async (req, res) => {
  try {
    const Produktname = req.params.productName;
    const product = await Product.findOne({ name: Produktname });
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    res.json({ price: product.price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

module.exports = router;
