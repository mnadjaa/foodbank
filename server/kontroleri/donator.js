const path = require('path');
const db = require('../modeli/db');
const DonatoriModel = require('../modeli/donatori');

// Izvrsene donacije
function getDonacijeByUsername(username, callback) {
    DonatoriModel.dbDonatorID(username, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        const dntrid = results[0] ? results[0].DNTRID : null;
        if (!dntrid) {
            return callback(new Error('DNTRID not found'), null);
        }

        db.query('SELECT * FROM donacijahrane WHERE DNTRID = ?  AND Izvrsena = "Yes"  ', [dntrid], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            const formattedResults = results.map(row => {
                let formatiranDatum = '';
                if (row.Datum != null) {
                    const datum = new Date(row.Datum);
                    formatiranDatum = `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;
                }
                return {
                    Datum: formatiranDatum,
                    Opis: row.Opis,
                    Podrucje: row.Podrucje,
                    ID: row.ID
                };
            });

            callback(null, formattedResults);
        });
    });
}

// Donacije u toku
function getDonUTokuByUsername(username, callback) {
    DonatoriModel.dbDonatorID(username, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        const dntrid = results[0] ? results[0].DNTRID : null;
        if (!dntrid) {
            return callback(new Error('DNTRID not found'), null);
        }

        db.query('SELECT * FROM donacijahrane WHERE DNTRID = ?  AND Izvrsena = "No" AND Odbijena="No"  ', [dntrid], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            const formattedResults = results.map(row => {
                let formatiranDatum = '';
                if (row.Datum != null) {
                    const datum = new Date(row.Datum);
                    formatiranDatum = `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;
                }
                return {
                    Datum: formatiranDatum,
                    Opis: row.Opis,
                    Podrucje: row.Podrucje,
                    ID: row.ID
                };
            });

            callback(null, formattedResults);
        });
    });
}

function getOdbDonByUsername(username, callback) {
    DonatoriModel.dbDonatorID(username, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        const dntrid = results[0] ? results[0].DNTRID : null;
        if (!dntrid) {
            return callback(new Error('DNTRID not found'), null);
        }

        db.query('SELECT * FROM donacijahrane WHERE DNTRID = ?  AND Izvrsena = "No" AND Odbijena="Yes"  ', [dntrid], (err, results) => {
            if (err) {
                return callback(err, null);
            }

            const formattedResults = results.map(row => {
                let formatiranDatum = '';
                if (row.Datum != null) {
                    const datum = new Date(row.Datum);
                    formatiranDatum = `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;
                }
                return {
                    Datum: formatiranDatum,
                    Opis: row.Opis,
                    Podrucje: row.Podrucje,
                    ID: row.ID
                };
            });

            callback(null, formattedResults);
        });
    });
}

module.exports = { getDonUTokuByUsername, getDonacijeByUsername,getOdbDonByUsername };
