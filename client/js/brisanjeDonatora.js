const forma = document.getElementById('forma-obrisi-donatora');
const poruka = document.getElementById('poruka-obrisi');

function prikaziPoruku(tekst, uspeh) {
    poruka.textContent = tekst;
    poruka.className = 'd-block mt-3 text-center ' + (uspeh ? 'text-success' : 'text-danger');
}

// Traži red u tabeli donatora čija prva kolona ima zadati ID
function nadjiRed(id) {
    return [...document.querySelectorAll('#donatoriInfo-tabela-container tbody tr')].find(tr => {
        const prvaCelija = tr.querySelector('td');
        return prvaCelija && prvaCelija.textContent.trim() === id;
    });
}

forma.addEventListener('submit', async (e) => {
    e.preventDefault();   // ostajemo na istoj stranici

    const id = forma.elements['userId'].value.trim();
    const red = nadjiRed(id);

    if (!red) {
        prikaziPoruku(`Donator sa ID-em ${id} se ne nalazi u tabeli donatora.`, false);
        return;
    }

    try {
        const odgovor = await fetch(forma.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ userId: id })
        });

        if (!odgovor.ok) throw new Error();

        red.remove();   // tabela se odmah ažurira
        prikaziPoruku(`Donator sa ID-em ${id} je uspešno obrisan.`, true);
        forma.reset();
    } catch {
        prikaziPoruku('Došlo je do greške na serveru. Pokušajte ponovo.', false);
    }
});