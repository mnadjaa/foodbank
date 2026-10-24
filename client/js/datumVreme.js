document.addEventListener("DOMContentLoaded", function () {
    const polje = document.querySelector("#datumVreme");

    if (!polje) return;

    flatpickr(polje, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true
    });
});
