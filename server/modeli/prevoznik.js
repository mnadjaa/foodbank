const db = require('./db');

const PrevoznikModel = {
  getAllPrevoznici: (callback) => {
    db.query('SELECT * FROM prevoznik', callback);
  },

  /*addPrevoznik: (prevoznikData, callback) => {
    const { Podrucje, Ime, Prezime, Telefon, Mejl, Vozilo } = prevoznikData;
    const insertQuery = 'INSERT INTO prevoznik (Podrucje, Ime, Prezime, Telefon, Mejl, Vozilo) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [Podrucje, Ime, Prezime, Telefon, Mejl, Vozilo], callback);
  },*/

  addPrevoznik: (prevoznikData, callback) => {
    const { Podrucje, Ime, Prezime, Telefon, Mejl, Vozilo, SID } = prevoznikData;

    const insertQuery = `
      INSERT INTO prevoznik
      (Podrucje, Ime, Prezime, Telefon, Mejl, Vozilo, SID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [Podrucje, Ime, Prezime, Telefon, Mejl, Vozilo, SID],
      callback
    );
  },

  deletePrevoznik: (pid, callback) => {
    const deleteQuery = 'DELETE FROM prevoznik WHERE PID = ?';
    db.query(deleteQuery, [pid], callback);
  }
};

module.exports = PrevoznikModel;