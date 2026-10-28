const bcrypt = require('bcryptjs'); //za hesiranje
const db = require('./modeli/db'); //povezivanje s MySQL-om
const DonatoriModel = require('./modeli/donatori');
const KuhinjeModel = require('./modeli/kuhinje');
//const SefoviModel = require('./modeli/sefovi');  //dodaj prvo sefa
const UsersModel = require('./modeli/users');

//const router = express.Router(); // Kreiranje rute koristeći express.Router()

// Middleware za proveru da li je korisnik prijavljen
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next(); // Nastavi ako je korisnik prijavljen
    }
    res.redirect('/login'); // Ako nije prijavljen, preusmeri na prijavu
  };
  
  // Middleware za proveru da li korisnik ima određenu ulogu
  const hasRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.session.user && req.session.user.userType === requiredRole) {
        return next(); // Ako ima ispravnu ulogu
      }
      res.status(403).send('Pristup zabranjen'); // Ako nema ispravnu ulogu
    };
  };



//dodavanje donatora 
const signupDonator = (req, res) => {
  const { usernameDonator, emailDonator, nazivDonator, telefonDonator, adresaDonator, passwordDonator } = req.body;


  if (!usernameDonator || !emailDonator || !passwordDonator) {
    return res.status(400).send('Niste popunili sva obavezna polja.');
}

  // Provera da li korisnik već postoji
  UsersModel.dbTextUsers((err, users) => {
    if (err) {
      return res.status(500).send('Greška na serveru');
    }

    const userExists = users.some(user => user.Username === usernameDonator);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Korisničko ime je zauzeto' });

    }

    // Dodavanje korisnika u tabelu "users"
    UsersModel.dbDodajUser(usernameDonator, (err, userResults) => {
      if (err) {
        return res.status(500).send('Greška pri registraciji u tabelu users');
      }

      // Dodavanje donatora u tabelu "donator"
      const donatorData = {
        Naziv: nazivDonator,
        Telefon: telefonDonator,
        Mejl: emailDonator,
        Adresa: adresaDonator,
        Username: usernameDonator,
        Password: passwordDonator
      };

      DonatoriModel.dbDodajDonatora(donatorData, (err, donatorResults) => {
        if (err) {
          return res.status(500).send('Greška pri registraciji');
        }

        res.send(`
      <script>
        alert('Uspešno ste dodali donatora!');
        window.location.href = '/donatoriSef.html';
      </script>
    `);
      });
    });
  });
};

//dodavanje kuhinje
const signupKuhinja = (req, res) => {
  console.log("Pozvana signupKuhinja funkcija");
  const { usernameKuhinja, podrucjeKuhinja, nazivKuhinja, adresaKuhinja, idSefaKuhinja, passwordKuhinja } = req.body;

  // Provera da li korisnik već postoji
  UsersModel.dbTextUsers((err, users) => {
      if (err) {
          console.log("Greška na serveru:", err);
          return res.status(500).send('Greška na serveru');
      }

      const userExists = users.some(user => user.Username === usernameKuhinja);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Korisničko ime je zauzeto' });
      }

      // Dodavanje korisnika u tabelu "users"
      UsersModel.dbDodajUser(usernameKuhinja, (err, userResults) => {
          if (err) {
              console.log("Greška pri registraciji u tabelu users:", err);
              return res.status(500).send('Greška pri registraciji u tabelu users');
          }
          const parsedSID  = isNaN(parseInt(req.body.idSefaKuhinja)) ? null : parseInt(req.body.idSefaKuhinja);

          // Dodavanje kuhinje u tabelu "kuhinja"
          const kuhinjaData = {
              Naziv: nazivKuhinja,
              Adresa: adresaKuhinja,
              Podrucje: podrucjeKuhinja,
              Username: usernameKuhinja,
              Password: passwordKuhinja,
              SID: parsedSID
          };

          KuhinjeModel.dbDodajKuhinju(kuhinjaData, (err, kuhinjaResults) => {
              if (err) {
                  console.log("Greška pri registraciji:", err);
                  return res.status(500).send('Greška pri registraciji');
              }

              console.log("Uspešna registracija kuhinje");
              res.send(`
              <script>
                alert('Uspešno ste dodali kuhinju!');
                window.location.href = '/kuhinjeSef.html';
              </script>
            `);

          });
      });
  });
};

//dodavanje sefa  - ne moze preko aplikacije
/*
const signupSef = (req, res) => {
  const { usernameSef, emailSef, podrucjeSef, passwordSef } = req.body;

 

  // Provera da li korisnik već postoji
  db.query(`SELECT * FROM 'users' WHERE Username = ?`, [usernameSef], (err, results) => {
    if (err) {
      return res.status(500).send('Greška na serveru');
    }

    if (results.length > 0) {
      return res.status(400).send('Korisnik već postoji');
    }

    // Lozinka bez hesiranja - razmislite o dodavanju hesiranja lozinke za produkciju

    db.query(
      `INSERT INTO users (Username) VALUES (?)`,
      [usernameSef],
      (err, results) => {
        if (err) {
          return res.status(500).send('Greška pri registraciji u tabelu users');
        }

    
      }
    );
    db.query(
      `INSERT INTO  'sef' (Username, Mejl, Podrucje, Password) VALUES (?, ?, ?, ?)`,
      [usernameSef, emailSef, podrucjeSef, passwordSef],
      (err, results) => {
        if (err) {
          return res.status(500).send('Greška pri registraciji');
        }

       res.redirect('/login'); // Redirekcija na stranicu za prijavljivanje
      }
    );
  });
};
*/

//prijava
const login = (req, res) => {
  const { username, password } = req.body;

  const findUser = (table, callback) => {
    db.query(`SELECT * FROM ${table} WHERE Username = ? AND Password = ?`, [username, password], callback);
  };

  const uspeh = (userType, redirect) => {
    req.session.user = { username: username, userType: userType };
    console.log(`Sesija postavljena za ${userType}:`, req.session.user);
    return res.json({ success: true, redirect: redirect });
  };

  findUser('sef', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Greška na serveru' });
    if (results.length > 0) return uspeh('sef', '/sef');

    findUser('kuhinja', (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Greška na serveru' });
      if (results.length > 0) return uspeh('kuhinja', '/kuhinja');

      findUser('donator', (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Greška na serveru' });
        if (results.length > 0) return uspeh('donator', '/donator');

        return res.status(400).json({ success: false, message: 'Neispravno korisničko ime ili lozinka' });
      });
    });
  });
};

// Odjava
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Greška pri odjavi');
    }

    res.redirect('/index.html'); // Odjava uspješna
  });
};

module.exports = { signupDonator, signupKuhinja,login, logout, isAuthenticated, hasRole};