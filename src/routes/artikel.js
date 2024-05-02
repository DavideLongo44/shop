const express = require('express');
const { ObjectID } = require('mongodb');
const router = express.Router();

module.exports = function(db) {
    router.get('/:id/preis', (req, res) => {
        const artikelId = ObjectID(req.params.id);

        db.collection('artikel').findOne({ _id: artikelId }, (err, artikel) => {
            if (err) {
                return res.status(500).json({ error: 'Fehler beim Abrufen des Artikels' });
            }
            if (!artikel) {
                return res.status(404).json({ error: 'Artikel nicht gefunden' });
            }
            res.json({ preis: artikel['Preis (€)'] });
        });
    });

    return router;
};
