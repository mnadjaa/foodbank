document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("donatoriInfo-tabela-container");

    if (!container) return;

    try {
        const htmlResponse = await fetch("/delovi/tabelaDonatoriInfo.html");

        if (!htmlResponse.ok) {
            throw new Error("Greška pri učitavanju tabele");
        }

        container.innerHTML = await htmlResponse.text();

        const response = await fetch("/donatoriInfo");

        if (!response.ok) {
            throw new Error("Greška pri učitavanju donatora");
        }

        const data = await response.json();
        const tableBody = document.getElementById("donatoriInfo-body");

        data.forEach(row => {
            const tableRow = document.createElement("tr");

            [
                row.DNTRID,
                row.Naziv || "",
                row.Telefon || "",
                row.Mejl || "",
                row.Adresa || ""
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                tableRow.appendChild(cell);
            });

            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error("Greška pri učitavanju donatora:", error);
    }
});
