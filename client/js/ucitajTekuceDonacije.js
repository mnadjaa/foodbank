fetch('/tekDonSef')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('tekDonSef-body');

        data.forEach(donacija => {
            const row = document.createElement('tr');

            let formatiranDatum = '';

            if (donacija.Datum != null) {
                const datum = new Date(donacija.Datum);
                const minuti = ('0' + datum.getMinutes()).slice(-2);

                formatiranDatum =
                    `${datum.getDate()}/${datum.getMonth() + 1}/${datum.getFullYear()} ${datum.getHours()}:${minuti}`;
            }

            row.innerHTML = `
                <td>${donacija.ID || ''}</td>
                <td>${formatiranDatum}</td>
                <td>${donacija.Opis || ''}</td>
                <td>${donacija.Podrucje || ''}</td>
                <td>${donacija.AdresaPreuzeca || ''}</td>
                <td>${donacija.DNTRID || ''}</td>
                <td contenteditable="true"
                    onblur="updateDonacija(${donacija.ID}, 'PID', this.innerText)">${donacija.PID || ''}</td>
                <td contenteditable="true"
                    onblur="updateDonacija(${donacija.ID}, 'KID', this.innerText)">${donacija.KID || ''}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Greška pri dohvatanju tekućih donacija:', error));


function updateDonacija(id, field, value) {
    fetch('/updatetekDonSef', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, field, value })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Greška pri ažuriranju donacije.');
        }

        alert('Donacija je uspešno ažurirana.');
        location.reload();
    })
    .catch(error => {
        console.error('Greška pri ažuriranju donacije:', error);
        alert('Greška pri ažuriranju donacije.');
    });
}
