const path = require('path');
const db = require('../modeli/db');
const KuhinjeModel = require('../modeli/kuhinje');

//menja stanje tj br obroka
function promeniStKuh(username, novoStanje, res) {
        KuhinjeModel.dbKID(username, (err, result) => {
          if (err) {
            console.error('Greška pri dobijanju KID:', err);
            res.status(500).json({ error: 'Greška pri dobijanju KID' });
            return;
          }
      
          if (result.length === 0) {
            console.error('Nema KID za datog korisnika');
            res.status(404).json({ error: 'Nema KID za datog korisnika' });
            return;
          }
        
      
          const kid = result[0].KID;
          KuhinjeModel.dbPromeniStanje(kid, novoStanje, (err, results) => {
            if (err) {
                 console.error('Greška pri promeni stanja u kuhinji:', err);
                 res.status(500).json({ error: 'Greška pri promeni stanja u kuhinji' });
            } else {
                 res.json({ success: true, message: 'Stanje kuhinje je uspešno ažurirano.',novoStanje });
                }
            });
          });
        }



        function getKuhinjaInfoByUsername(username, callback) {
          KuhinjeModel.dbTextKuhinjeByUsername(username, (err, results) => {
              if (err) {
                  return callback(err);
              }
      
              if (results.length === 0) {
                  return callback(new Error('Nema podataka za datog korisnika'));
              }
      
              const { KID: kid, Podrucje: grad } = results[0];
              callback(null, { kid, grad });
          });
      }


      function getDonacijeZaKuhinju(username, callback) {
        KuhinjeModel.dbTextKuhinjeByUsername(username, (err, Kresults) => {
            if (err) {
                return callback(err);
            }
    
            if (Kresults.length === 0) {
                return callback(new Error('Nema podataka za datog korisnika'));
            }
            const { KID: kid } = Kresults[0];
            db.query('SELECT * FROM donacijahrane WHERE KID=? AND Izvrsena="No" AND Odbijena="No"', [kid], (err, results) => {
                if (err) {
                    return callback(err, null);
                }
    
                const formattedResults = results.map(row => {
                    let formatiranDatum = '';
                    if (row.Datum != null) {
                        const datum = new Date(row.Datum);
                        const minuti = ("0" + datum.getMinutes()).slice(-2);
                        formatiranDatum = `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()} ${datum.getHours()}:${minuti}`;
                    }
                    
                    return {
                        ID: row.ID,
                        Datum: formatiranDatum,
                        Opis: row.Opis,
                        Donator: row.DNTRID
                    };
                });
    
                callback(null, formattedResults);
            });
        });
    }
    
      
module.exports = { promeniStKuh,getKuhinjaInfoByUsername, getDonacijeZaKuhinju};
