document.addEventListener("DOMContentLoaded", async function () {
    const tabelaContainer = document.getElementById("kuhinje-tabela");

    if (!tabelaContainer) return;

    try {
        // Učitavanje zajedničkog HTML-a
        const htmlResponse = await fetch("/delovi/tabelaKuhinje.html");

        if (!htmlResponse.ok) {
            throw new Error("Greška pri učitavanju tabele");
        }

        tabelaContainer.innerHTML = await htmlResponse.text();

        // Podešavanja za konkretnu stranicu
        const endpoint = tabelaContainer.dataset.endpoint;
        const prikaziId = tabelaContainer.dataset.prikaziId === "true";

        const prvaKolona = document.getElementById("kuhinje-prva-kolona");
        prvaKolona.textContent = prikaziId ? "ID" : "";

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error("Greška pri učitavanju kuhinja");
        }

        const data = await response.json();
        const tableBody = document.getElementById("kuhinje-body");

        data.forEach((row, index) => {
            const tableRow = document.createElement("tr");

            tableRow.innerHTML = `
                <td>${prikaziId ? row.KID : index + 1}</td>
                <td>${row.Naziv || ""}</td>
                <td>${row.Podrucje || ""}</td>
                <td>${row.Adresa || ""}</td>
                <td>${row.Stanje ?? ""}</td>
            `;

            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error("Greška pri učitavanju kuhinja:", error);
    }
});
