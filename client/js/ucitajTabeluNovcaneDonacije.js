function ucitajNovcaneDonacije(sortType = 'Datum') {
    const url = sortType === 'Iznos'
        ? '/donacijeNSort'
        : '/donacijeN';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('donacijeN-body');

            tableBody.innerHTML = '';

            data.slice(0, 20).forEach(donacija => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${donacija.Datum || ''}</td>
                    <td>${donacija.Ime || ''}</td>
                    <td>${donacija.Iznos || ''}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error(error));
}

window.sortTable = function() {
    const selected = document.querySelector(
        'input[name="sort-type"]:checked'
    );

    if (selected) {
        ucitajNovcaneDonacije(selected.value);
    }
};

fetch('/delovi/tabelaNovcaneDonacije.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Greška pri učitavanju tabele novčanih donacija');
        }
        return response.text();
    })
    .then(html => {
        document.getElementById('tabela-novcane-donacije').innerHTML = html;
        ucitajNovcaneDonacije('Datum');
    })
    .catch(error => console.error(error));


    