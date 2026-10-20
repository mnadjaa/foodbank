fetch('delovi/tabelaDonacije.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('tabela-donacije').innerHTML = html;

        return fetch('/donacije');
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('donacije-body');
        const limit = 20;

        data.slice(0, limit).forEach(donacija => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${donacija.Datum || ''}</td>
                <td>${donacija.Donator || ''}</td>
                <td>${donacija.Podrucje || ''}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Greška pri učitavanju donacija:', error));