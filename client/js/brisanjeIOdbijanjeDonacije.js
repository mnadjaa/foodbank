// Proverava da li u prvoj koloni (ID) nekog reda postoji zadati ID
function idPostoji(tbodySelektori, id) {
    return tbodySelektori.some(sel =>
        [...document.querySelectorAll(sel + ' tr')].some(tr => {
            const prvaCelija = tr.querySelector('td');
            return prvaCelija && prvaCelija.textContent.trim() === id;
        })
    );
}

function ukloniRed(tbodySelektori, id) {
    tbodySelektori.forEach(sel => {
        document.querySelectorAll(sel + ' tr').forEach(tr => {
            const prvaCelija = tr.querySelector('td');
            if (prvaCelija && prvaCelija.textContent.trim() === id) tr.remove();
        });
    });
}

function prikaziPoruku(elId, tekst, uspeh) {
    const span = document.getElementById(elId);
    span.textContent = tekst;
    span.className = 'd-block mt-3 text-center ' + (uspeh ? 'text-success' : 'text-danger');
}

function povezi(formaId, porukaId, tabele, uspesnaPoruka, nePostojiPoruka) {
    const forma = document.getElementById(formaId);

    forma.addEventListener('submit', async (e) => {
        e.preventDefault();                       // sprečava otvaranje nove stranice

        const id = forma.elements['Id'].value.trim();

        if (!idPostoji(tabele, id)) {
            prikaziPoruku(porukaId, nePostojiPoruka(id), false);
            return;
        }

        try {
            const odgovor = await fetch(forma.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ Id: id })
            });

            if (!odgovor.ok) throw new Error();

            ukloniRed(tabele, id);                // tabela se odmah ažurira
            prikaziPoruku(porukaId, uspesnaPoruka(id), true);
            forma.reset();
        } catch {
            prikaziPoruku(porukaId, 'Došlo je do greške na serveru. Pokušajte ponovo.', false);
        }
    });
}

// Brisanje: proverava tabele izvršenih donacija (hrana + novac)
povezi(
    'forma-obrisi', 'poruka-obrisi',
    ['#donacije-body', '#tabela-novcane-donacije tbody'],
    id => `Donacija sa ID-em ${id} je uspešno obrisana.`,
    id => `Donacija sa ID-em ${id} se ne nalazi u tabeli izvršenih donacija.`
);

// Odbijanje: proverava tabelu tekućih donacija
povezi(
    'forma-odbij', 'poruka-odbij',
    ['#tekDonSef-body'],
    id => `Donacija sa ID-em ${id} je uspešno odbijena.`,
    id => `Donacija sa ID-em ${id} se ne nalazi u tabeli tekućih donacija.`
);