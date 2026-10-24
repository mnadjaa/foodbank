document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("donatori-tabela-container");

    if (!container) return;

    try {
        const htmlResponse = await fetch("/delovi/tabelaDonatori.html");

        if (!htmlResponse.ok) {
            throw new Error("Greška pri učitavanju tabele");
        }

        container.innerHTML = await htmlResponse.text();

        const response = await fetch("/donatori");

        if (!response.ok) {
            throw new Error("Greška pri učitavanju donatora");
        }

        const data = await response.json();
        const tableBody = document.getElementById("donatori-body");

        data.forEach((row, index) => {
            const tableRow = document.createElement("tr");

            const numberCell = document.createElement("td");
            numberCell.textContent = index + 1;

            const nameCell = document.createElement("td");
            nameCell.textContent = row.Naziv || "";

            tableRow.appendChild(numberCell);
            tableRow.appendChild(nameCell);
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error("Greška pri učitavanju donatora:", error);
    }
});
