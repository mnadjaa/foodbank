const db = require('../modeli/db'); 
const DonatoriModel = require('../modeli/donatori');
const KuhinjeModel=require('../modeli/kuhinje');
const UsersModel = require('../modeli/users');
const PrevoznikModel = require('../modeli/prevoznik');
const PrimalacUslugaModel= require('../modeli/primaociUsluga');
const DonacijaH= require('../modeli/donacijeH');

const deleteDonator = (req, res) => {
    const { userId } = req.body;
    const userIdInt = parseInt(userId);
   
    // Prvo nađemo username iz donatora
    DonatoriModel.dbTextDonatoriInfo((err, donatori) => {
        if (err) {
            return res.status(500).send('Greška pri dobijanju informacija o donatorima');
        }
        console.log('Svi donatori:', donatori); 

        const donator = donatori.find(donator => donator.DNTRID === userIdInt);
        if (!donator) {
            return res.status(404).send('Donator nije pronađen');
        }
        else{
            console.log('DNTRID:', donator.DNTRID);

        }

        const username = donator.Username;

        // Zatim nađemo korisnika u users prema username-u
        UsersModel.dbTextUsers((err, users) => {
            if (err) {
                return res.status(500).send('Greška pri dobijanju korisnika');
            }


            const user = users.find(user => user.Username === username);
            if (!user) {
                return res.status(404).send('Korisnik nije pronađen');
            }

            console.log('user:', users); 


            //prvo brisemo donatora
            DonatoriModel.dbObrisiDonatora(userId, (err, donatorDeleted) => {
                if (err) {
                    return res.status(500).send('Greška pri brisanju donatora');
                }

                // Obrišemo korisnika iz users
            UsersModel.dbObrisiUser(user.Username, (err, userDeleted) => {
                if (err) {
                    return res.status(500).send('Greška pri brisanju korisnika');
                }

                // Ako su korisnik i donator uspešno izbrisani
                res.status(200).send('Donator je uspešno obrisan');
               /* return res.send(`
                <script>
                  alert('Donator je uspešno obrisan!');
                  window.location.href = '/donatoriSef.html';
                </script>
              `);*/

                });
            });
        });
    });
};

const deleteKuhinja = (req, res) => {
    const { userId } = req.body;
    const kuhinjaIdInt = parseInt(userId);
   
    // sva polja svih kuhinja
    KuhinjeModel.dbTextKuhinjeInfo((err, kuhinje) => {
        if (err) {
            return res.status(500).send('Greška pri dobijanju informacija o kuhinjama');
        }
        console.log('Sve kuhinje:', kuhinje); 

        const kuhinja = kuhinje.find(kuhinja => kuhinja.KID === kuhinjaIdInt);
        if (!kuhinja) {
            return res.status(404).send('Kuhinja nije pronađena');
        }
        else{
            console.log('KuhinjaID:', kuhinja.KID);

        }

        const usernameKuhinje = kuhinja.Username;

        // Zatim nađemo korisnika u users prema username-u
        UsersModel.dbTextUsers((err, users) => {
            if (err) {
                return res.status(500).send('Greška pri dobijanju korisnika');
            }


            const user = users.find(user => user.Username === usernameKuhinje);
            if (!user) {
                return res.status(404).send('Korisnik nije pronađen');
            }

            console.log('user:', users); 


            //prvo brisemo kuhinju
            KuhinjeModel.dbObrisiKuhinju(userId, (err, kuhinjaDeleted) => {
                if (err) {
                    return res.status(500).send('Greška pri brisanju kuhinje');
                }

                // Obrišemo korisnika iz users
                UsersModel.dbObrisiUser(user.Username, (err, userDeleted) => {
                    if (err) {
                        return res.status(500).send('Greška pri brisanju korisnika');
                    }

                    // Ako su korisnik i kuhinja uspešno izbrisani
                    res.status(200).send('Kuhinja je uspešno obrisana');

                });
            });
        });
    });
};

const signupPrevoznik = (req, res) => {
    const { ime, prezime, email, telefon, vozilo, podrucje } = req.body;

    // Prvo nađemo ID šefa koji pokriva dato područje
    const podrucjeVelPocSl = podrucje.charAt(0).toUpperCase() + podrucje.slice(1);

    const findSefQuery = 'SELECT SID FROM sef WHERE Podrucje = ? LIMIT 1';
    db.query(findSefQuery, [podrucjeVelPocSl], (err, results) => {
        if (err) {
            return res.status(500).send('Greška pri dobijanju informacija o šefu');
        }

        // Ako ne pronađemo šefa za dato područje, vratimo odgovarajući odgovor
        if (results.length === 0) {
            return res.status(404).send('Nije pronađen odgovarajući šef za dato područje');
        }

        // Uzimamo ID prvog šefa koji pokriva područje
        const idSefa = results[0].SID;

        // Sada dodajemo novog prevoznika
        const prevoznikData = {
            Podrucje: podrucjeVelPocSl,
            Ime: ime,
            Prezime: prezime,
            Telefon: telefon,
            Mejl: email,
            Vozilo: vozilo,
            SID: idSefa // Dodajemo ID šefa u podatke novog prevoznika
        };

        PrevoznikModel.addPrevoznik(prevoznikData, (err, result) => {
            if (err) {
                return res.status(500).send('Greška pri dodavanju novog prevoznika');
            }
            res.send(`
            <script>
              alert('Novi prevoznik je uspešno dodat!');
              window.location.href = '/prevozniciSef.html';
            </script>
          `);        });
    });
};

const deletePrevoznik = (req, res) => {
    const { Id } = req.body;
    const prevoznikId = parseInt(Id);
   
    PrevoznikModel.deletePrevoznik(prevoznikId, (err, deletedPrevoznik) => {
        if (err) {
            return res.status(500).send('Greška pri brisanju prevoznika');
        }
        if (deletedPrevoznik.affectedRows === 0) {
            return res.status(404).send('Prevoznik nije pronađen');
        }
        res.status(200).send('Prevoznik je uspešno obrisan');
    });
};

const signupPU = (req, res) => {
    const { ime, prezime, podrucje, brojBonova } = req.body;

    // Pretvaranje prvog slova podrucja u veliko slovo
    const podrucjeVelSl = podrucje.charAt(0).toUpperCase() + podrucje.slice(1);

    let brojBonovaValue = brojBonova ? parseInt(brojBonova) : null; // Konvertujemo u broj, ako je polje prazno postavljamo na null


    // Pronalaženje ID-ja kuhinje na osnovu podrucja
    KuhinjeModel.dbTextKuhinjeInfo((err, kuhinje) => {
        if (err) {
            return res.status(500).send('Greška pri dobijanju informacija o kuhinjama');
        }

        // Pronalaženje kuhinje sa odgovarajućim područjem
        const kuhinja = kuhinje.find(k => k.Podrucje.toLowerCase() === podrucje.toLowerCase());

        // Ako nije pronađena kuhinja sa datim područjem
        if (!kuhinja) {
            return res.status(404).send('Kuhinja nije pronađena');
        }

        // Podaci za dodavanje novog primaoca usluga
        const primalacData = {
            Ime: ime,
            Prezime: prezime,
            Podrucje: podrucjeVelSl,
            BrojBonova: brojBonovaValue,
            KID: kuhinja.KID // Postavljanje KID-a na ID pronadjenog kuhinje
        };

        PrimalacUslugaModel.dbDodajPrimUsl(primalacData, (err, addedPrimalac) => {
            if (err) {
                return res.status(500).send('Greška pri dodavanju novog krajnjeg korisnika');
            }
            res.send(`
              <script>
                alert('Novi krajnji korisnik je uspešno dodat!');
                window.location.href = '/primUslSef.html';
              </script>
            `);
            //res.status(200).send('Novi korisnik je uspešno dodat');
        });
    });
};

const deletePU = (req, res) => {
    const { Id } = req.body;
    PrimalacUslugaModel.dbObrisiPrimUsl(Id, (err, result) => {
        if (err) {
            return res.status(500).send('Greška pri brisanju krajnjeg korisnika');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Krajnji korisnik nije pronađen');
        }
        res.status(200).send('Krajnji korisnik je uspešno obrisan');
    });
};

const deleteDonaciju = (req, res) => {
    const { Id } = req.body;
    DonacijaH.dbObrisDonacijuH(Id, (err, result) => {
        if (err) {
            console.error('Greška pri ažuriranju donacije:', err);
            return res.status(500).send('Greška pri ažuriranju donacije');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Donacija nije pronađena');
        }
        res.status(200).send('Donacija je uspešno obrisana');
    });
};

const odbiDonaciju = (req, res) => {
    const { Id } = req.body;  // Uzima id iz tela POST zahteva
    db.query('UPDATE donacijahrane SET Odbijena = "Yes" WHERE ID = ?', [Id], (err, result) => {
        if (err) {
            console.error('Greška pri ažuriranju donacije:', err);
            return res.status(500).send('Greška pri ažuriranju donacije');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Donacija nije pronađena');
        }
        res.status(200).send('Donacija je uspešno odbijena');
    });
};

module.exports = {
    deleteDonator, deleteKuhinja, signupPrevoznik, deletePrevoznik, signupPU, deletePU, deleteDonaciju, odbiDonaciju
};

/*
res.send(`
              <script>
                alert('Uspešno ste dodali kuhinju!');
                window.location.href = '/kuhinjeSef.html';
              </script>
            `);

            */