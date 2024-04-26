/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('shopwise');
//produkt preis anzeigen lassen
db.artikel.findOne({ "Produktname": "Bodenreiniger" }, { "Preis (€)": 1 })
//Einzelnen Artikel nach SKU abrufen
db.artikel.findOne({ "SKU": "SKU1311" })
//Artikel unter einem bestimmten Preis abrufen
db.artikel.find({ "Preis (€)": { $lt: 2.00 } })
//Verfügbare Artikel abrufen
db.artikel.find({ "Verfügbarkeit": "Ja" })
//Artikel nach Namen sortieren
db.artikel.find().sort({ "produktname": 1 })
//Artikeldetails aktualisieren
db.artikel.updateOne(
    { "SKU": "SKU1311" },
    { $set: { "preis (€)": 2.29 } }
 )
 //Ein neues Artikel hinzufügen
 db.artikel.insertOne({
    "produktname": "Neues Artikel",
    "SKU": "SKU9999",
    "preis (€)": 5.99,
    "verfügbarkeit": "Ja"
 })
 