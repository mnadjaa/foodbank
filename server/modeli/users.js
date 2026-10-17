// Uvoz potrebnih modula
const db = require('./db'); // Relativni put za konekciju s bazom

// Model za tabelu "users"
const UsersModel = {};

// Funkcija za dodavanje novog korisnika
UsersModel.dbDodajUser = (username, callback) => {
  const insertQuery = 'INSERT INTO users (Username) VALUES (?)';
  db.query(insertQuery, [username], (err, results) => {
    if (err) {
      console.error('Greška pri dodavanju korisnika:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za prikaz svih korisnika
UsersModel.dbTextUsers = (callback) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju korisnika:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za brisanje korisnika na osnovu usenamea
UsersModel.dbObrisiUser = (username, callback) => {
  db.query('DELETE FROM users WHERE Username = ?', [username], (err, results) => {
    if (err) {
      console.error('Greška pri brisanju korisnika:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Izvoz modela
module.exports = UsersModel;