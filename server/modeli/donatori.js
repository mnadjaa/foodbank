// Uvoz potrebnih modula
const db = require('./db'); // Relativni put za konekciju s bazom

// Model za donatore
const DonatoriModel = {};

// Funkcija za vraćanje svih donatora bez DNTRID-a
DonatoriModel.dbTextDonatori = (callback) => {
  db.query('SELECT Naziv, Telefon, Mejl, Adresa FROM donator', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju svih donatora:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za vraćanje svih donatora s DNTRID-om
DonatoriModel.dbTextDonatoriInfo = (callback) => {
  db.query('SELECT * FROM donator', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju informacija o donatorima:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

DonatoriModel.dbDonatorID=(username,callback)=>{
  db.query('SELECT DNTRID FROM donator WHERE Username = ?', [username], (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju donatora:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za brisanje donatora na osnovu DNTRID-a
DonatoriModel.dbObrisiDonatora = (dntrid, callback) => {
  db.query('DELETE FROM donator WHERE DNTRID = ?', [dntrid], (err, results) => {
    if (err) {
      console.error('Greška pri brisanju donatora:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za dodavanje novog donatora
DonatoriModel.dbDodajDonatora = (donatorData, callback) => {
  const { Naziv, Telefon, Mejl, Adresa, Username, Password } = donatorData;
  const insertQuery = 'INSERT INTO donator (Naziv, Telefon, Mejl, Adresa, Username, Password) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertQuery, [Naziv, Telefon, Mejl, Adresa, Username, Password], (err, results) => {
    if (err) {
      console.error('Greška pri dodavanju novog donatora:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Izvoz modela
module.exports = DonatoriModel;