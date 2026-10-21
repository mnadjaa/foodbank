
let trenutniGrad = 'svi';

document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('korisnici-tabela-container');

    if (!container) return;

    try {
        const htmlResponse = await fetch('/delovi/tabelaKorisnici.html');

        if (!htmlResponse.ok) {
            throw new Error('Greška pri učitavanju tabele');
        }

        container.innerHTML = await htmlResponse.text();

        const tableBody = document.getElementById('korisnici-body');
        const gradDropdown = document.getElementById('gradDropdown');
        const dropdownMenu = document.getElementById('gradovi-menu');

        // Prikaz i izbor grada
        gradDropdown.addEventListener('click', async function (event) {
            event.stopPropagation();

            dropdownMenu.classList.toggle('show');

            if (dropdownMenu.dataset.ucitano === 'true') return;

            try {
                const response = await fetch('/gradoviKorisnika');

                if (!response.ok) {
                    throw new Error('Greška pri učitavanju gradova');
                }

                const gradovi = await response.json();
                dropdownMenu.innerHTML = '';

                dodajOpcijuGrada('svi', 'Svi gradovi');

                [...new Set(gradovi)].forEach(grad => {
                    dodajOpcijuGrada(grad, grad);
                });

                dropdownMenu.dataset.ucitano = 'true';
            } catch (error) {
                console.error('Greška pri dohvatanju gradova:', error);
            }
        });

        function dodajOpcijuGrada(vrednost, tekst) {
            const link = document.createElement('a');
            link.className = 'dropdown-item';
            link.href = '#';
            link.textContent = tekst;

            link.addEventListener('click', function (event) {
                event.preventDefault();
                filtriranjePoGradu(vrednost);
                dropdownMenu.classList.remove('show');
            });

            dropdownMenu.appendChild(link);
        }

        // Zatvaranje menija klikom van njega
        document.addEventListener('click', function (event) {
            if (!dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Učitavanje tabele
        window.filtriranjePoGradu = async function (grad) {
            trenutniGrad = grad;

            try {
                const response = await fetch('/korisnici');

                if (!response.ok) {
                    throw new Error('Greška pri učitavanju korisnika');
                }

                const data = await response.json();

                const filtriraniPodaci = grad === 'svi'
                    ? data
                    : data.filter(k => k.Podrucje === grad);

                popunjavanjeTabele(filtriraniPodaci);
            } catch (error) {
                console.error('Greška pri dohvatanju korisnika:', error);
            }
        };

        function popunjavanjeTabele(data) {
            tableBody.innerHTML = '';

            data.forEach(k => {
                const row = document.createElement('tr');
                row.id = `red_${k.PUID}`;

                const trenutnoBonova = Number(k.BrojBonova) || 0;

                row.innerHTML = `
                    <td>${k.PUID}</td>
                    <td>${k.Podrucje || ''}</td>
                    <td>${k.Ime || ''}</td>
                    <td>${k.Prezime || ''}</td>
                    <td class="broj-bonova">${k.BrojBonova ?? ''}</td>
                    <td>
                        <div class="input-group">
                            <input
                                type="number"
                                class="form-control"
                                id="noviBrojBonova_${k.PUID}"
                                min="0"
                                step="1"
                                placeholder="Koliko bonova skidate">
                            <button
                                type="button"
                                class="btn btn-primary btn-promeni-bonove">
                                Promeni broj bonova
                            </button>
                        </div>
                    </td>
                `;

                row.querySelector('.btn-promeni-bonove')
                    .addEventListener('click', function () {
                        promBrBonova(k.PUID, trenutnoBonova);
                    });

                tableBody.appendChild(row);
            });
        }

        // Skidanje bonova
        async function promBrBonova(puid, trenutniBrojBonova) {
            const input = document.getElementById(`noviBrojBonova_${puid}`);
            const vrednost = input.value.trim();
            const noviBrojBonova = Number(vrednost);

            if (vrednost === '' || !Number.isInteger(noviBrojBonova)
                || noviBrojBonova < 0) {
                alert('Unesite validan ceo broj bonova koji nije negativan');
                return;
            }

            if (noviBrojBonova > trenutniBrojBonova) {
                alert('Ne možete oduzeti više bonova nego što korisnik ima');
                return;
            }

            try {
                const response = await fetch('/promeniBrBonova', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        puid: puid,
                        brojBonova: noviBrojBonova
                    })
                });

                if (!response.ok) {
                    throw new Error('Greška pri promeni broja bonova');
                }

                await response.json();
                await window.filtriranjePoGradu(trenutniGrad);
            } catch (error) {
                console.error('Greška pri promeni broja bonova:', error);
                alert('Greška pri promeni broja bonova.');
            }
        }

        await window.filtriranjePoGradu('svi');

    } catch (error) {
        console.error('Greška pri učitavanju tabele korisnika:', error);
    }
});
