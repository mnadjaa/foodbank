// Uvoz potrebnih modula
const db = require('./db'); // Relativni put za konekciju s bazom

// Model za kuhinje
const KuhinjeModel = {};

// Funkcija za vraćanje svih kuhinja bez KID-a
KuhinjeModel.dbTextKuhinje = (callback) => {
  db.query('SELECT Naziv, Adresa, Podrucje, Stanje FROM kuhinja', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju svih kuhinja:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za vraćanje svih kuhinja s KID-om
KuhinjeModel.dbTextKuhinjeInfo = (callback) => {
    db.query('SELECT * FROM kuhinja', (err, results) => {
      if (err) {
        console.error('Greška pri dobijanju informacija o kuhinjama:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  };

  KuhinjeModel.dbTextKuhinjeByUsername = (username, callback) => {
    db.query('SELECT KID, Naziv, Adresa, Podrucje FROM kuhinja WHERE Username = ?', [username], (err, results) => {
        if (err) {
            console.error('Greška pri dobijanju podataka o kuhinji po korisničkom imenu:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};


KuhinjeModel.dbKID = (username, callback) => {
  db.query('SELECT KID FROM kuhinja WHERE Username = ?', [username], (err, result) => {
    if (err) {
      console.error('Greška pri dobijanju podataka o kuhinji po korisničkom imenu:', err);
      callback(err, null);
    } else {
      console.log('Rezultat upita:', result);
      callback(null, result);
    }
  });
};
  
  // Funkcija za brisanje kuhinje na osnovu KID-a
  KuhinjeModel.dbObrisiKuhinju = (kid, callback) => {
    db.query('DELETE FROM kuhinja WHERE KID = ?', [kid], (err, results) => {
      if (err) {
        console.error('Greška pri brisanju kuhinje:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  };
  
  // Funkcija za dodavanje nove kuhinje
  KuhinjeModel.dbDodajKuhinju = (kuhinjaData, callback) => {
    const { Naziv, Adresa, Podrucje, Username, Password, SID } = kuhinjaData;
    const insertQuery = 'INSERT INTO kuhinja (Naziv, Adresa, Podrucje, Username, Password, SID) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [Naziv, Adresa, Podrucje, Username, Password, SID], (err, results) => {
      if (err) {
        console.error('Greška pri dodavanju nove kuhinje:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  };
  
  // Funkcija za promenu stanja u kuhinji
  KuhinjeModel.dbPromeniStanje = (kid, novoStanje, callback) => {
    db.query(
      'UPDATE kuhinja SET Stanje = ? WHERE KID = ?',
      [novoStanje, kid],
      (err, results) => {
        if (err) {
          console.error('Greška pri promeni stanja u kuhinji:', err);
          callback(err, null);
        } else {
          callback(null, results);
        }
      }
    );
  };
  
  // Izvoz modela
  module.exports = KuhinjeModel;

  