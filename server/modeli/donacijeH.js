// Uvoz potrebnih modula
const db = require('./db'); // Relativni put za konekciju s bazom

// Model za donacije hrane
const DonacijeHraneModel = {};

// Funkcija za vraćanje svih donacija hrane koje su izvrsene
DonacijeHraneModel.dbTextDonacijeH = (callback) => {
  db.query('SELECT * FROM donacijahrane WHERE Izvrsena = "Yes"', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju donacija hrane:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

//koje nisu izvrsene
DonacijeHraneModel.dbTextDonacijeHNeizvrsene = (callback) => {
  db.query('SELECT * FROM donacijahrane WHERE Izvrsena = "No"', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju donacija hrane:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za dodavanje nove donacije hrane
DonacijeHraneModel.dbDodajDonacijuH = (donacijaHraneData, callback) => {
  const { Izvrsena, Datum, Opis, Podrucje, AdresaPreuzeca, DNTRID, SID, PID, KID } = donacijaHraneData;
  const insertQuery = 'INSERT INTO donacijahrane (Izvrsena, Datum, Opis, Podrucje, AdresaPreuzeca, DNTRID, SID, PID, KID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(insertQuery, [Izvrsena, Datum, Opis, Podrucje, AdresaPreuzeca, DNTRID, SID, PID, KID], (err, results) => {
    if (err) {
      console.error('Greška pri dodavanju donacije hrane:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};



DonacijeHraneModel.dbDoniraj = (donacijaHraneData, callback) => {
  const { Izvrsena, Datum, Opis, Podrucje, AdresaPreuzeca, DNTRID} = donacijaHraneData;
  const insertQuery = 'INSERT INTO donacijahrane (Izvrsena, Datum, Opis, Podrucje, AdresaPreuzeca, DNTRID) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertQuery, [Izvrsena, Datum, Opis, Podrucje, AdresaPreuzeca, DNTRID], (err, results) => {
    if (err) {
      console.error('Greška pri dodavanju donacije hrane:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};




// Funkcija za brisanje donacije hrane na osnovu ID-a
DonacijeHraneModel.dbObrisDonacijuH = (id, callback) => {
  db.query('DELETE FROM donacijahrane WHERE ID = ?', [id], (err, results) => {
    if (err) {
      console.error('Greška pri brisanju donacije hrane:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Izvoz modela
module.exports = DonacijeHraneModel;