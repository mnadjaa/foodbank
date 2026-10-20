fetch('/donacijeKuh')
    .then(response => {
        if (!response.ok) {
            throw new Error('Greška pri dohvatanju donacija.');
        }

        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('donKuh-body');

        data.forEach(donacija => {
            const row = document.createElement('tr');
            row.id = `red_${donacija.ID}`;

            row.innerHTML = `
                <td>${donacija.ID || ''}</td>
                <td>${donacija.Datum || ''}</td>
                <td>${donacija.Opis || ''}</td>
                <td>${donacija.Donator || ''}</td>
                <td>
                    <button
                        onclick="donacijaStigla('${donacija.ID}')"
                        class="btn btn-primary btn-sm">
                        Donacija je stigla
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Greška pri dohvatanju donacija:', error);
    });


function donacijaStigla(ID) {
    fetch('/donacijaStigla', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID: ID })
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
