fetch('/donacije')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('donacije-body');

        data.forEach(donacija => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${donacija.ID || ''}</td>
                <td>${donacija.Datum || ''}</td>
                <td>${donacija.Donator || ''}</td>
                <td>${donacija.Podrucje || ''}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Greška pri dohvatanju donacija:', error));