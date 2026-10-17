// Uvoz potrebnih modula
const db = require('./db'); // U istom folderu
const PrimalacUslugaModel = {};

// Funkcija za vraćanje svih primalaca usluga
PrimalacUslugaModel.dbTextPrimUsl = (callback) => {
  db.query('SELECT * FROM primalacusluga', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju primalaca usluga:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za skidanje bonova
PrimalacUslugaModel.dbSkiniBonove = (puid, brojBonova, callback) => {
  db.query(
    'UPDATE primalacusluga SET BrojBonova = BrojBonova - ? WHERE PUID = ?',
    [brojBonova, puid],
    (err, results) => {
      if (err) {
        console.error('Greška pri skidanju bonova:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
  );
};

// Funkcija za dodavanje novog primaoca usluga
PrimalacUslugaModel.dbDodajPrimUsl = (primalacData, callback) => {
  const { Ime, Prezime, Podrucje, BrojBonova, KID } = primalacData;
  db.query(
    'INSERT INTO primalacusluga (Ime, Prezime, Podrucje, BrojBonova, KID) VALUES (?, ?, ?, ?, ?)',
    [Ime, Prezime, Podrucje, BrojBonova, KID],
    (err, results) => {
      if (err) {
        console.error('Greška pri dodavanju primaoca usluga:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
  );
};

// Funkcija za brisanje primaoca usluga
PrimalacUslugaModel.dbObrisiPrimUsl = (puid, callback) => {
  db.query(
    'DELETE FROM primalacusluga WHERE PUID = ?',
    [puid],
    (err, results) => {
      if (err) {
        console.error('Greška pri brisanju primaoca usluga:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
  );
};


PrimalacUslugaModel.updateBonoviNa90 = (callback) => {
  db.query(
    'UPDATE primalacusluga SET BrojBonova = 90',
    (err, results) => {
      if (err) {
        console.error('Greška pri ažuriranju broja bonova:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
  );
};

// Izvoz modela
module.exports = PrimalacUslugaModel;