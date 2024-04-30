const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  value: String,
  quantity: Number,
  unit: String,
  id: mongoose.Schema.Types.ObjectId,
  category: String,
  price: String, // Nutze String oder Number basierend auf deiner Preisstruktur
  onSaleAt: String,
});

module.exports = mongoose.model('Item', itemSchema);

