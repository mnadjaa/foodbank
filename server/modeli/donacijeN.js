// Uvoz potrebnih modula
const db = require('./db'); // Relativni put za konekciju s bazom

// Model za novčane donacije
const NovcaneDonacijeModel = {};

// Funkcija za vraćanje svih novčanih donacija - ne koristimo nigde
/*
NovcaneDonacijeModel.dbTextDonacijeN = (callback) => {
  db.query('SELECT * FROM donacijanovcana', (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju svih novčanih donacija:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};
*/

//samo one izvrsene
NovcaneDonacijeModel.dbTextDonacijeN = (callback) => {
  const query = `
    SELECT 
      dn.DONNVCID,
      COALESCE(dn.Ime, d.Naziv) AS Donator,
      dn.Datum,
      dn.Iznos,
      dn.DNTRID
    FROM 
      donacijanovcana dn
    LEFT JOIN 
      donator d ON dn.DNTRID = d.DNTRID
    WHERE dn.Izvrsena = 'Yes'
    ORDER BY 
      dn.Datum DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju svih novčanih donacija:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};



NovcaneDonacijeModel.dbTextDonacijeNSort = (callback) => {
  const query = `
    SELECT 
      dn.DONNVCID,
      COALESCE(dn.Ime, d.Naziv) AS Donator,
      dn.Datum,
      dn.Iznos,
      dn.DNTRID
    FROM 
      donacijanovcana dn
    LEFT JOIN 
      donator d ON dn.DNTRID = d.DNTRID
    WHERE dn.Izvrsena = 'Yes'
    ORDER BY 
      dn.Iznos DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju svih novčanih donacija:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za brisanje novčane donacije na osnovu DONNVCID-a
NovcaneDonacijeModel.dbObrisiDonacijuN = (donnvcid, callback) => {
  db.query('DELETE FROM donacijanovcana WHERE DONNVCID = ?', [donnvcid], (err, results) => {
    if (err) {
      console.error('Greška pri brisanju novčane donacije:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Funkcija za dodavanje nove novčane donacije
NovcaneDonacijeModel.dbDodajDonacijuN = (novcanaDonacijaData, callback) => {
  const { Izvrsena, Datum, Iznos, DNTRID, Ime } = novcanaDonacijaData;
  const insertQuery = 'INSERT INTO donacijanovcana (Izvrsena, Datum, Iznos, DNTRID, Ime) VALUES (?, ?, ?, ?, ?)';
  db.query(insertQuery, [Izvrsena, Datum, Iznos, DNTRID, Ime], (err, results) => {
    if (err) {
      console.error('Greška pri dodavanju nove novčane donacije:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Izvoz modela
module.exports = NovcaneDonacijeModel;