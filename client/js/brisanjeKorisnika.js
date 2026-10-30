const forma = document.getElementById('forma-obrisi-korisnika');
const poruka = document.getElementById('poruka-obrisi');

function prikaziPoruku(tekst, uspeh) {
    poruka.textContent = tekst;
    poruka.className = 'd-block mt-3 text-center ' + (uspeh ? 'text-success' : 'text-danger');
}

// Traži red u tabeli korisnika čija prva kolona ima zadati ID
function nadjiRed(id) {
    return [...document.querySelectorAll('#korisnici-tabela-container tbody tr')].find(tr => {
        const prvaCelija = tr.querySelector('td');
        return prvaCelija && prvaCelija.textContent.trim() === id;
    });
}

forma.addEventListener('submit', async (e) => {
    e.preventDefault();   // ostajemo na istoj stranici

    const id = forma.elements['Id'].value.trim();
    const red = nadjiRed(id);

    if (!red) {
        prikaziPoruku(`Korisnik sa ID-em ${id} se ne nalazi u tabeli korisnika.`, false);
        return;
    }

    try {
        const odgovor = await fetch(forma.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ Id: id })
        });

        if (!odgovor.ok) throw new Error();

        red.remove();   // tabela se odmah ažurira
        prikaziPoruku(`Korisnik sa ID-em ${id} je uspešno obrisan.`, true);
        forma.reset();
    } catch {
        prikaziPoruku('Došlo je do greške na serveru. Pokušajte ponovo.', false);
    }
});