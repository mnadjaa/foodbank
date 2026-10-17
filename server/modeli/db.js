const mysql = require('mysql2');

// Postavljanje konekcije sa MySQL bazom podataka
const db = mysql.createConnection({
  host: 'localhost', //
  user: 'root', // 
  password: 'root', // 
  database: 'ozs', // 
});

// Povezivanje s bazom podataka
db.connect((err) => {
  if (err) {
    console.error('Greška prilikom povezivanja s bazom podataka:', err);
  } else {
    console.log('Uspešno povezan s bazom podataka');
  }
});




module.exports = db; // Izvoz konekcije