// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopwise', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Verbindungsfehler:'));
db.once('open', function() {
  console.log('Verbunden mit der Datenbank!');
});

module.exports = db;

