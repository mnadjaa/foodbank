// Odbijene donacije
fetch('/odbijenedon')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('odbijenedon-body');

        data.slice(0, 50).forEach(donacija => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${donacija.ID || ''}</td>
                <td>${donacija.Datum || ''}</td>
                <td>${donacija.Opis || ''}</td>
                <td>${donacija.Podrucje || ''}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Greška pri učitavanju odbijenih donacija:', error));


// Izvršene donacije
fetch('/vasedonacije')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('vasedonacije-body');

        data.forEach(donacija => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${donacija.ID || ''}</td>
                <td>${donacija.Datum || ''}</td>
                <td>${donacija.Opis || ''}</td>
                <td>${donacija.Podrucje || ''}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Greška pri učitavanju izvršenih donacija:', error));


// Donacije u toku
fetch('/vaseNeizvdon')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('vaseNeizvdon-body');

        data.forEach(donacija => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${donacija.ID || ''}</td>
                <td>${donacija.Datum || ''}</td>
                <td>${donacija.Opis || ''}</td>
                <td>${donacija.Podrucje || ''}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Greška pri učitavanju donacija u toku:', error));