/* Zajednički okvir stranice: spinner, sidebar, gornja traka, footer i biblioteke.
   Svaka stranica ima samo <main> sa svojim sadržajem, a ovaj fajl ga ubaci u okvir.

   Podešavanje se radi preko atributa na <body>:
     data-role="gost|donator|kuhinja|sef"   koji sidebar meni se prikazuje
     data-layout="auth"                     stranica bez sidebara (prijava, registracija, forme)
     data-topbar="login|account"            login = dugme "Prijavi se"; account = ID + "Odjavi se"
     data-add-href / data-add-text          dugme "Dodaj ..." u gornjoj traci
   Aktivna stavka menija se određuje automatski po imenu fajla. */
(function () {
    'use strict';

    /* ---------- Meniji po ulozi: [stranica, ikonica, naziv] ---------- */
    var MENUS = {
        gost: [
            ['index.html',     'fa-utensils',    'O nama'],
            ['doniraj.html',   'fa-donate',      'Doniraj'],
            ['donacije.html',  'fa-table',       'Donacije'],
            ['kuhinje.html',   'fa-coffee',      'Kuhinja'],
            ['donatori.html',  'fa-list-ul',     'Donatori']
        ],
        donator: [
            ['donator.html',         'fa-check',   'Dobrodošli'],
            ['donirajDonator.html',  'fa-donate',  'Doniraj'],
            ['donacijeDonator.html', 'fa-table',   'Donacije'],
            ['kuhinjeDonator.html',  'fa-coffee',  'Kuhinja'],
            ['donatoriDonator.html', 'fa-list-ul', 'Donatori']
        ],
        kuhinja: [
            ['kuhinja.html',         'fa-check',       'Dobrodošli'],
            ['donacijeKuhinja.html', 'fa-table',       'Donacije'],
            ['kuhinjeKuhinja.html',  'fa-coffee',      'Kuhinja'],
            ['primUslKuhinja.html',  'fa-user-circle', 'Krajnji korisnici'],
            ['donatoriKuhija.html',  'fa-list-ul',     'Donatori']
        ],
        sef: [
            ['sef.html',           'fa-check',       'Dobrodošli'],
            ['donacijeSef.html',   'fa-table',       'Donacije'],
            ['kuhinjeSef.html',    'fa-coffee',      'Kuhinja'],
            ['primUslSef.html',    'fa-user-circle', 'Krajnji korisnici'],
            ['donatoriSef.html',   'fa-list-ul',     'Donatori'],
            ['prevozniciSef.html', 'fa-truck',       'Prevoznici']
        ]
    };

    /* ---------- Biblioteke (redosled je bitan) ---------- */
    var LIBS = [
        'https://code.jquery.com/jquery-3.4.1.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js',
        'lib/easing/easing.min.js'
    ];

    /* ---------- Delovi okvira ---------- */
    var SPINNER =
        '<div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">' +
            '<div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">' +
                '<span class="sr-only">Loading...</span>' +
            '</div>' +
        '</div>';

    var FOOTER =
        '<div class="container-fluid pt-4 px-4">' +
            '<div class="bg-light rounded-top p-4">' +
                '<div class="row">' +
                    '<div class="col-12 col-sm-6 text-center text-sm-start">' +
                        '&copy; <a href="#">ObrokZaSve</a>, All Right Reserved.' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    var BACK_TO_TOP = '<a href="#" class="btn btn-lg btn-primary btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>';

    function sidebar(role, current) {
        var links = (MENUS[role] || MENUS.gost).map(function (item) {
            var active = item[0] === current ? ' active' : '';
            return '<a href="' + item[0] + '" class="nav-item nav-link' + active + '">' +
                   '<i class="fa ' + item[1] + ' me-2"></i>' + item[2] + '</a>';
        }).join('');

        return '<div class="sidebar pe-4 pb-3">' +
                   '<nav class="navbar bg-light navbar-light">' +
                       '<a href="index.html" class="navbar-brand mx-4 mb-3">' +
                           '<h3 class="text-primary"><i class="fa fa-hashtag me-2"></i>OZS</h3>' +
                       '</a>' +
                       '<div class="navbar-nav w-100">' + links + '</div>' +
                   '</nav>' +
               '</div>';
    }

    function topbar(cfg) {
        var right = '';

        if (cfg.topbar === 'login') {
            right =
                '<div class="navbar-nav align-items-center ms-auto">' +
                    '<div class="nav-item">' +
                        '<a href="signin.html" class="nav-link"><i class="fas fa-user-circle me-lg-2"></i>Prijavi se</a>' +
                    '</div>' +
                '</div>';
        } else if (cfg.topbar === 'account') {
            right =
                '<div class="navbar-nav align-items-center ms-auto">' +
                    '<span class="d-none d-lg-inline-flex" id="id" style="color: rgb(42, 134, 150);">ID: </span>' +
                '</div>' +
                '<div class="navbar-nav align-items-center ms-auto">' +
                    '<form action="/logout" method="POST">' +
                        '<button type="submit" class="btn btn-link nav-link">' +
                            '<i class="fa fa-arrow-left me-lg-2"></i>' +
                            '<span class="d-none d-lg-inline-flex">Odjavi se</span>' +
                        '</button>' +
                    '</form>' +
                '</div>';
        } else if (cfg.addHref) {
            right =
                '<div class="navbar-nav align-items-center ms-auto">' +
                    '<a href="' + cfg.addHref + '" class="nav-link bottom-right-link">' +
                        '<i class="fa fa-plus me-lg-2"></i>' +
                        '<span class="d-none d-lg-inline-flex">' + (cfg.addText || 'Dodaj') + '</span>' +
                    '</a>' +
                '</div>';
        }

        return '<nav class="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">' +
                   '<a href="index.html" class="navbar-brand d-flex d-lg-none me-4">' +
                       '<h2 class="text-primary mb-0"><i class="fa fa-hashtag"></i></h2>' +
                   '</a>' +
                   '<a href="#" class="sidebar-toggler flex-shrink-0"><i class="fa fa-bars"></i></a>' +
                   right +
               '</nav>';
    }

    /* ID prijavljenog korisnika u gornjoj traci */
    function loadAccountId() {
        fetch('/getID')
            .then(function (r) { return r.text(); })
            .then(function (id) { document.getElementById('id').textContent = 'ID: ' + id; })
            .catch(function (e) { console.error('Greška pri dohvatanju ID-a:', e); });
    }

    /* ---------- Sastavljanje stranice ---------- */
    var body = document.body;
    var main = document.querySelector('main');
    var d = body.dataset;
    var cfg = {
        role: d.role || 'gost',
        layout: d.layout,
        topbar: d.topbar,
        addHref: d.addHref,
        addText: d.addText
    };
    var current = location.pathname.split('/').pop() || 'index.html';

    var shell = document.createElement('div');
    shell.className = 'container-xxl position-relative bg-white d-flex p-0';

    if (cfg.layout === 'auth') {
        shell.innerHTML = SPINNER + '<div id="page-slot" class="w-100"></div>';
    } else {
        shell.innerHTML =
            SPINNER +
            sidebar(cfg.role, current) +
            '<div class="content">' +
                topbar(cfg) +
                '<div id="page-slot"></div>' +
                FOOTER +
            '</div>' +
            BACK_TO_TOP;
    }

    body.insertBefore(shell, main);
    var slot = shell.querySelector('#page-slot');
    while (main.firstChild) { slot.parentNode.insertBefore(main.firstChild, slot); }
    slot.remove();
    main.remove();

    if (cfg.topbar === 'account') { loadAccountId(); }

    /* ---------- Biblioteke i main.js (document.write da se učitaju sinhrono i redom) ---------- */
    if (document.querySelector('.owl-carousel')) { LIBS.push('lib/owlcarousel/owl.carousel.min.js'); }
    LIBS.push('js/main.js');
    document.write(LIBS.map(function (src) { return '<script src="' + src + '"><\/script>'; }).join(''));
})();
