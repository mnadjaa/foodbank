const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');//ipak ne koristimo
const session = require('express-session');
const path = require('path');
const db = require('./modeli/db');
const kuhinja = require('./modeli/kuhinje');
const donator = require('./modeli/donatori');
const donacijaN = require('./modeli/donacijeN');
const donacijaH = require('./modeli/donacijeH');
const prevoz = require('./modeli/prevoznik');
const primUsl=require('./modeli/primaociUsluga');

const app = express();
const PORT = process.env.PORT || 3872;

//chat start
//chat end

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({        
  secret: 'your_secret_key', // 
  resave: false,
  saveUninitialized: true,  //
  cookie: { secure: false } 
}));


app.use(express.static('client')); // Poslužuje datoteke iz foldera 'client'
app.use(express.static(path.join(__dirname,'..', 'client')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Došlo je do greške!');
});

// Uvezivanje kontrolera
const loginController = require('./login');
const sefKontroler = require('./kontroleri/sef');   
const kuhinjaKontroler = require('./kontroleri/kuhinja');
const donatorKontroler = require('./kontroleri/donator');

//const { isAuthenticated, hasRole } = require('./login'); // Uvoz middleware-a
const { isAuthenticated, hasRole } = loginController;


app.post('/login', (req, res) => {//post umesto get jer se salju osetljivi podaci
  // Pristupite vrednostima koje je korisnik uneo u formi putem req.body objekta, navodimo name
  console.log(req.body);
  const username = req.body.username;                         
  const password = req.body.password;
  console.log('Korisnik se prijavio sa korisničkim imenom:', username, 'i šifrom:', password);

  req.session.username=username;
  req.session.save();

  loginController.login(req,res);
});


app.get('/getID', (req, res) => {
  const username = req.session.username;
  function findUserIDByUsername(username, callback) {
      db.query('SELECT SID FROM sef WHERE Username = ? UNION ALL SELECT KID FROM kuhinja WHERE Username = ? UNION ALL SELECT DNTRID FROM donator WHERE Username = ?', [username, username, username], (err, results) => {
          if (err) {
              console.error('Greška pri pronalaženju ID-ja:', err);
              callback(err, null);
          } else {
              // Prosljeđujemo samo prvu vrednost ID-ja
              callback(null, results.length > 0 ? results[0].SID : null);
          }
      });
  }
  findUserIDByUsername(username, (err, id) => {
      if (err) {
          return res.status(500).json({ error: 'Greška pri pronalaženju ID-ja.' });
      }
      res.send(id.toString());
  });
});


app.post('/izmeniKuhinju', isAuthenticated, (req, res) => {
  console.log("pozvana ruta izmeni-kuhinju")
  const username = req.session.username;
  const novoStanje = req.body.novoStanje;
  console.log("username i novostanje:", username, novoStanje);

  kuhinjaKontroler.promeniStKuh(username, novoStanje, res);
});


app.post('/signupDonator', loginController.signupDonator); // Registracija donatora
app.post('/signupKuhinja',loginController.signupKuhinja); //Registracija kuhinje
//app.post('/signupSef', loginController.signupSef); // Registracija sefa - nemamo to, necemo da dodajemo sefa

app.post('/signupPrevoznik', sefKontroler.signupPrevoznik); // Dodavanje prevoznika
app.post('/signupPU', sefKontroler.signupPU); // Dodavanje prevoznika


app.post('/deleteDonator', sefKontroler.deleteDonator);
app.post('/deleteKuhinja', sefKontroler.deleteKuhinja);
app.post('/deletePrevoznik', sefKontroler.deletePrevoznik);
app.post('/deletePU', sefKontroler.deletePU);
app.post('/deleteDonaciju',sefKontroler.deleteDonaciju);
app.post('/odbiDonaciju',sefKontroler.odbiDonaciju);

app.post('/logout', loginController.logout); // Odjava



//za korisnike:
app.get('/sef', isAuthenticated, hasRole('sef'), (req, res) => {          
  console.log('Pozvana ruta za sefa');//
  res.sendFile(path.join(__dirname, '..','client', 'sef.html'));
});
app.get('/kuhinja', isAuthenticated, hasRole('kuhinja'), (req, res) => {
  console.log('Pozvana ruta za kuhinju');
res.sendFile(path.join(__dirname, '..','client', 'kuhinja.html'));
});
app.get('/donator', isAuthenticated, hasRole('donator'), (req, res) => {
  console.log('Pozvana ruta za donatora');
  res.sendFile(path.join(__dirname, '..','client', 'donator.html'));
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html')); // Glavna stranica
});


//prikaz tabela:
app.get('/donacije', (req, res) => {
  db.query('SELECT d.ID, d.Datum, don.Naziv AS Donator, d.Podrucje FROM donacijahrane d JOIN donator don ON d.DNTRID = don.DNTRID WHERE d.Izvrsena = "Yes" ORDER BY d.Datum DESC', (err, results) => {
      if (err) {
          // Obrada greške
          console.error('Greška pri dohvatanju podataka iz baze:', err);
          res.status(500).json({ error: 'Greška pri dohvatanju podataka iz baze' });
          return;
      }
      const formattedResults = results.map(row => {   //da ne vraca vreme i da bude dan/mesec/godina
        let formatiranDatum='';
        if(row.Datum!=null){
          const datum=new Date(row.Datum); 
          formatiranDatum= `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;//getMonth vraca mesece od 0 do 11

        }
        return{
          Datum:formatiranDatum,
          Donator: row.Donator, 
        Podrucje: row.Podrucje,
        ID:row.ID
        } 
    });
    console.log(formattedResults);
    res.json(formattedResults); // Slanje formatiranih podataka kao JSON odgovor
  });
});


app.get('/vasedonacije', (req, res) => {
  const username = req.session.username;
  donatorKontroler.getDonacijeByUsername(username, (err, results) => {
    if (err) {
      console.error('Greška pri dohvatanju donacija:', err);
      return res.status(500).json({ error: 'Greška pri dohvatanju donacija' });
    }
    res.json(results);
  });
});

app.get('/vaseNeizvdon', (req, res) => {
  const username = req.session.username; //req.session - obj koji sadrzi podatke o sesiji tog korisnika
  donatorKontroler.getDonUTokuByUsername(username, (err, results) => {
    if (err) {
      console.error('Greška pri dohvatanju donacija u toku:', err);
      return res.status(500).json({ error: 'Greška pri dohvatanju donacija u toku' });
    }
    res.json(results);
  });
});

app.get('/odbijenedon', (req, res) => {
  const username = req.session.username;
  donatorKontroler.getOdbDonByUsername(username, (err, results) => {
    if (err) {
      console.error('Greška pri dohvatanju donacija u toku:', err);
      return res.status(500).json({ error: 'Greška pri dohvatanju donacija u toku' });
    }
    res.json(results);
  });
});




app.get('/donacijeKuh',(req,res)=>{
  const username = req.session.username;
  kuhinjaKontroler.getDonacijeZaKuhinju(username,(err,results)=>{
    if (err) {
      console.error('Greška pri dohvatanju donacija:', err);
      return res.status(500).json({ error: 'Greška pri dohvatanju donacija' });
    }
    res.json(results);  
  })
})


app.get('/kuhinje',(req,res)=>{
  kuhinja.dbTextKuhinje((err, results) => {
    if (err) {
        console.error('Greška pri dobijanju podataka o kuhinjama:', err);
        res.status(500).json({ error: 'Greška pri dobijanju podataka o kuhinjama' });
        return;
    }
    res.json(results);
})
})
//tabela kuhinja za korisnika kuhinja
app.get('/kuhinjeK',(req,res)=>{
  kuhinja.dbTextKuhinjeInfo((err, results) => {
    if (err) {
        console.error('Greška pri dobijanju podataka o kuhinjama:', err);
        res.status(500).json({ error: 'Greška pri dobijanju podataka o kuhinjama' });
        return;
    }
    res.json(results);
})
})


app.get('/donatori',(req,res)=>{
  donator.dbTextDonatori((err, results) => {
    if (err) {
        console.error('Greška pri dobijanju podataka o donatorima:', err);
        res.status(500).json({ error: 'Greška pri dobijanju podataka o donatorima' });
        return;
    }
 res.json(results);
})
})
app.get('/donatoriInfo',(req,res)=>{
  donator.dbTextDonatoriInfo((err, results) => {
    if (err) {
        console.error('Greška pri dobijanju podataka o donatorima:', err);
        res.status(500).json({ error: 'Greška pri dobijanju podataka o donatorima' });
        return;
    }
 res.json(results);
})
})



app.get('/donacijeN',(req,res)=>{
  donacijaN.dbTextDonacijeN((err, results) => {
    if (err) {
        console.error('Greška pri dobijanju podataka o novcanim donacijama:', err);
        res.status(500).json({ error: 'Greška pri dobijanju podataka o novcanim donacijama' });
        return;
    }  

    const formattedResults = results.map(row => {

      let formatiranDatum=null;
        if(row.Datum!=null){
          const datum=new Date(row.Datum);  //        Datum: new Date(row.Datum).toLocaleDateString(),
          formatiranDatum= `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;

        }
      return{
        Datum: formatiranDatum,
        Ime: row.Donator,
        Iznos: row.Iznos
      };
    });
  res.json(formattedResults); // Slanje formatiranih podataka kao JSON odgovor
});
});

app.get('/donacijeNSort',(req,res)=>{
  donacijaN.dbTextDonacijeNSort((err, results) => {
    if (err) {
        console.error('Greška pri dobijanju podataka o novcanim donacijama:', err);
        res.status(500).json({ error: 'Greška pri dobijanju podataka o novcanim donacijama' });
        return;
    }  

    const formattedResults = results.map(row => {
      const datum=new Date(row.Datum);
      const formatiranDatum= `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()}`;
      return{
        Datum: formatiranDatum,
        Ime: row.Donator,
        Iznos: row.Iznos
      };
    });
  res.json(formattedResults); // Slanje formatiranih podataka kao JSON odgovor
});
});

app.get('/rasporedp', (req, res) => {
  db.query('SELECT donacijahrane.Datum, donacijahrane.Podrucje, donacijahrane.AdresaPreuzeca, donacijahrane.Opis, prevoznik.PID FROM donacijahrane JOIN prevoznik ON donacijahrane.PID = prevoznik.PID WHERE donacijahrane.Izvrsena = "No" ORDER BY prevoznik.PID, donacijahrane.Datum DESC',(err, results) => {
      if (err) {
          console.error('Greška pri dobijanju podataka o donacijama:', err);
          res.status(500).json({ error: 'Greška pri dobijanju podataka o donacijama' });
          return;
      }
      res.json(results);
})
})



app.get('/prevoznici',(req,res)=>{
  prevoz.getAllPrevoznici((err,results)=>{
    if (err) {
      console.error('Greška pri dobijanju podataka o prevoznicima:', err);
      res.status(500).json({ error: 'Greška pri dobijanju podataka o prevoznicima' });
      return;
  }
  res.json(results);
  })})
app.get('/gradovi', (req, res) => {
  prevoz.getAllPrevoznici((err, results) => {
      if (err) {
          console.error('Greška pri dobijanju prevoznika iz baze:', err);
          res.status(500).json({ error: 'Greška pri dobijanju prevoznika iz baze' });
          return;
      }
      // vracamo samo podrucja tj gradove kao niz
      const gradovi = results.map(prevoznik => prevoznik.Podrucje);
      res.json(gradovi);
  });
});
app.get('/korisnici',(req,res)=>{
  primUsl.dbTextPrimUsl((err, results) => {
    if (err) {
      console.error('Greška pri dobijanju podataka o krajnjim korisnicima:', err);
      res.status(500).json({ error: 'Greška pri dobijanju podataka o krajnjim korisnicima' });
      return;
  }
  res.json(results);
  })
})
app.get('/gradoviKorisnika', (req, res) => {
  primUsl.dbTextPrimUsl((err, results) => {
      if (err) {
          console.error('Greška pri dobijanju krajnjih korisnika iz baze:', err);
          res.status(500).json({ error: 'Greška pri dobijanju krajnjih korisnika iz baze' });
          return;
      }
      // vracamo samo podrucja tj gradove kao niz
      const gradovi = results.map(prevoznik => prevoznik.Podrucje);
      res.json(gradovi);
  });
});


app.post('/promeniBrBonova', (req, res) => {
  const { puid, brojBonova } = req.body;
  primUsl.dbSkiniBonove(puid, brojBonova, (err, results) => {
      if (err) {
          console.error('Greška pri skidanju bonova:', err);
          return res.status(500).json({ error: 'Greška pri skidanju bonova' });
      }
        const newBrojBonova = results.BrojBonova;
      res.json({ success: true, newBrojBonova: brojBonova });
  });
});


app.post('/doniraj',(req,res)=>{
  console.log("pozvana ruta doniraj")
  const username = req.session.username;
  console.log("username:", username);
  const { adresaPreuzeca,grad, opis, datumVreme, telefon } = req.body;
  console.log( adresaPreuzeca, opis, datumVreme, telefon );

  donator.dbDonatorID(username, (err, results) => {
    if (err) {
      console.error('Greška pri dobijanju donatora:', err);
      return; 
    }
    const dntrid = results[0].DNTRID;
    console.log('DNTRID:', dntrid);  

    const donacijaHraneData = {
      Izvrsena: 'No',
      Datum: datumVreme,
      Opis: opis,
      Podrucje: grad,  
      AdresaPreuzeca: adresaPreuzeca,
      DNTRID: dntrid
    };
 
    
    donacijaH.dbDoniraj(donacijaHraneData, (err, results) => {
      if (err) {
        console.error('Greška pri dodavanju donacije hrane:', err);
        res.status(500).send('Došlo je do greške pri dodavanju donacije');
      } else {
      return res.send(`
                <script>
                  alert('Donacija uspešno poslata!');
                  window.location.href = '/donirajDonator.html';
                </script>
      `);
        //res.send('Donacija je uspešno dodata');
      }
    });
  });
});


app.post('/dodajDonN',(req,res)=>{
  console.log("pozvana ruta dodajDonN");
  const { datumVreme,iznos, ime, dntrid } = req.body;
  const donacijaData = {//{ Izvrsena, Datum, Iznos, DNTRID, Ime } = novcanaDonacijaData;
    Izvrsena: 'Yes',
    Datum: datumVreme=== '' ? null : datumVreme,
    Iznos: iznos,
    DNTRID: dntrid === '' ? null : dntrid,  
    Ime:ime
  };

  donacijaN.dbDodajDonacijuN(donacijaData,(err, results)=>{
    if (err) {
      console.error('Greška pri dodavanju donacije:', err);
      res.status(500).send('Došlo je do greške pri dodavanju donacije');
    } else {
    return res.send(`
              <script>
                alert('Donacija uspešno dodata!');
                window.location.href = '/donacijeSef.html';
              </script>
    `);}
  })
});

app.post('/dodajDonH',(req,res)=>{
  console.log("pozvana ruta dodajDonH");
  const username = req.session.username;
  db.query('SELECT SID FROM sef WHERE Username=?',[username], (err, results) => {
    if (err) {
      console.error('Greška pri dohvatanju podataka iz baze:', err);
      res.status(500).json({ error: 'Greška pri dohvatanju podataka iz baze' });
      return;
  }

  const sid = results[0].SID; 
  const { datumVreme, opis, grad,dntrid ,kid,pid} = req.body;
  const donacijaData = {
    Izvrsena: 'Yes',
    Datum: datumVreme ? datumVreme : null,
    Opis: opis=== '' ? null : opis,
    Podrucje: grad,
    DNTRID: dntrid === '' ? null : dntrid,  
    KID:kid=== '' ? null : kid,
    SID:sid==='' ? null : sid,
    PID:pid===''? null : pid
  };

  donacijaH.dbDodajDonacijuH(donacijaData,(err, results)=>{
    if (err) {
      console.error('Greška pri dodavanju donacije:', err);
      res.status(500).send('Došlo je do greške pri dodavanju donacije');
    } else {
    return res.send(`
              <script>
                alert('Donacija uspešno dodata!');
                window.location.href = '/donacijeSef.html';
              </script>
    `);}
  })
})})

app.post('/dodajDonHKuh', isAuthenticated, (req, res) => {
  console.log("pozvana ruta izmeni-kuhinju");
  const username = req.session.username;
  console.log('Username:', username);

  kuhinjaKontroler.getKuhinjaInfoByUsername(username, (err, { kid, grad }) => {
      if (err) {
          console.error('Greška:', err);
          res.status(500).send('Došlo je do greške pri dobijanju informacija o kuhinji');
          return;
      } 

      console.log('KID:', kid);
      console.log('Područje:', grad);

      const { datumVreme, opis, dntrid } = req.body;
      const donacijaData = {
          Izvrsena: 'Yes',
          Datum: datumVreme ? datumVreme : null,
          Opis: opis === '' ? null : opis,
          Podrucje: grad,
          AdresaPreuzeca: null,
          DNTRID: dntrid === '' ? null : dntrid,
          SID: null,
          PID: null,
          KID: kid
      };

      donacijaH.dbDodajDonacijuH(donacijaData, (err, results) => {
          if (err) {
              console.error('Greška pri dodavanju donacije:', err);
              res.status(500).send('Došlo je do greške pri dodavanju donacije');
          } else {
              return res.send(`
                  <script>
                      alert('Donacija uspešno dodata!');
                      window.location.href = '/donacijeKuhinja.html';
                  </script>
              `);
          }
      });
  });
});

app.post('/donacijaStigla',(req,res)=>{
  const{ID}=req.body;
  db.query('UPDATE donacijahrane SET Izvrsena = "Yes" WHERE ID = ?', [ID], (err, result) => {
    if (err) {
      console.error('Greška pri ažuriranju donacije:', err);
      return res.status(500).json({ error: 'Greška pri ažuriranju donacije' });
  }
  if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Donacija sa datim ID-jem nije pronađena.' });
  }
  res.json({ success: true, message: 'Donacija je uspešno ažurirana.' });
});
  })


app.get('/tekDonSef', (req, res) => {
  db.query('SELECT * FROM donacijahrane WHERE Izvrsena="No" AND Odbijena="No" ORDER BY Podrucje',(err, results) => {
      if (err) {
          console.error('Greška pri dobijanju podataka o donacijama:', err);
          res.status(500).json({ error: 'Greška pri dobijanju podataka o donacijama' });
          return;
      }
      res.json(results);
})})
// Dohvatanje gradova iz donacija
app.get('/gradoviDonacije', (req, res) => {
  donacijaH.dbTextDonacijeH((err, results) => {
      if (err) {
          console.error('Greška pri dobijanju donacija iz baze:', err);
          res.status(500).json({ error: 'Greška pri dobijanju donacija iz baze' });
          return;
      }
      const gradovi = results.map(donacija => donacija.Podrucje);
      console.log(gradovi);
      res.json(gradovi);
  });
});

// Ažuriranje donacije
app.post('/updatetekDonSef', (req, res) => {
  const { id, field, value } = req.body;
  let query = '';
  if (field === 'PID') {
      query = 'UPDATE donacijahrane SET PID = ? WHERE ID = ?';
  } else if (field === 'KID') {
      query = 'UPDATE donacijahrane SET KID = ? WHERE ID = ?';
  } else {
      return res.status(400).json({ error: 'Nevažeće polje za ažuriranje' });
  }

  db.query(query, [value, id], (err, result) => {
      if (err) {
          console.error('Greška pri ažuriranju donacije:', err);
          return res.status(500).json({ error: 'Greška pri ažuriranju donacije' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Donacija sa datim ID-jem nije pronađena.' });
      }
      res.json({ success: true, message: 'Donacija je uspešno ažurirana.' });
  });
});


app.get('/', (req, res) => {// Ruta bez autentikacije
  res.sendFile(path.join(__dirname, 'client', 'index.html')); // Posluživanje glavne stranice
});

cron.schedule('0 0 1 * *', () => { // //minut (0) sat (0) dan (1) svakog meseca (*) dan u nedelji - bilo koji (*)//testirano! radi
  console.log('Pokrećem ažuriranje broja bonova za sve korisnike');
  primUsl.updateBonoviNa90((err, results) => {
    if (err) {
      console.error('Greška pri ažuriranju broja bonova:', err);
    } else {
      console.log('Broj bonova uspešno ažuriran za sve korisnike');
    }
  });
});


app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/client/signin.html'); 
});

// proba
app.get('/about', (req, res) => {
  res.send('Hello World!');
});

// Pokretanje servera
app.listen(PORT,()=>{
    console.log('server je pokrenut');
});
