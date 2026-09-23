# Pandora Turist — web stranica

Statična web stranica za obiteljsku tvrtku **Pandora Turist** iz Srime kraj Vodica (vile Nika i Franko, izleti brodom Roko & Oskar, restoran Villa Roza), izrađena po uzoru na elegantni stil stranice Amadria Park.

## Struktura

| Datoteka | Sadržaj |
|---|---|
| `index.html` | Naslovnica: hero, o nama, vile, izleti brodom, restoran, galerija, dojmovi, obrazac za upit, kontakt |
| `villa-nika.html` | Detalji Ville Nike |
| `villa-franko.html` | Detalji Ville Franko |
| `izleti-brodom.html` | Izleti brodom Roko & Oskar (Kornati, Krka, šibenski arhipelag) |
| `restoran-villa-roza.html` | Restoran Villa Roza |
| `css/style.css` | Sav dizajn (elegantno svijetli stil, responzivno) |
| `js/translations.js` | Prijevodi HR / EN / DE |
| `js/main.js` | Prekidač jezika, navigacija, animacije, obrazac za upit |
| `js/nika.js`, `css/nika.css` | Chatbot Nika (baza znanja HR/EN/DE, upit za rezervaciju) |
| `assets/img/*.svg` | Ilustracije-rezervacije mjesta za prave fotografije |

## Pokretanje

Nije potreban nikakav build — otvorite `index.html` u pregledniku ili poslužite mapu bilo kojim statičnim serverom:

```bash
python3 -m http.server 8000
```

## Jezici

Stranica podržava hrvatski, engleski i njemački. Odabir (HR / EN / DE u zaglavlju) sprema se u `localStorage`. Svi prijevodi nalaze se u `js/translations.js` — za izmjenu teksta uredite vrijednost pod odgovarajućim ključem u sva tri jezika.

## Obrazac za upit

Obrazac na naslovnici (`#upit`) ne zahtijeva backend: slanjem se otvara e-mail program gosta s pripremljenom porukom za `info@pandoraturist.hr`. Po želji se kasnije može spojiti na servis poput Formspree-a ili vlastiti backend.

## Zamjena ilustracija pravim fotografijama

Slike u `assets/img/` stilizirane su SVG ilustracije koje služe kao rezervirana mjesta. Za pravu produkciju zamijenite ih fotografijama (npr. `villa-nika.jpg`) i ažurirajte `src` atribute u HTML-u — sav raspored (object-fit: cover) radit će jednako s fotografijama bilo koje veličine.

## Chatbot Nika

Nika je virtualna asistentica koja se prikazuje kao plutajući gumb na svim stranicama. Radi bez poslužitelja i bez troškova: odgovara iz baze znanja u `js/nika.js`, sastavljene od sadržaja ove stranice (vile, izleti, restoran, destinacija, kontakt).

- **Jezik**: odgovara na jeziku odabranom na stranici; ako gost piše na drugom jeziku (HR/EN/DE), prilagođava se.
- **Upit za rezervaciju**: prikuplja vilu/izlet/stol, termin, broj osoba, ime i telefon, pa nudi slanje e-mailom, WhatsAppom ili poziv.
- **Naredba `/clear`** (ili `/obriši`) briše razgovor, započeti upit i kontekst.
- **Razgovor se pamti** tijekom posjeta (sessionStorage) i nastavlja se pri prelasku na drugu stranicu.

Kad se promijeni neki podatak na stranici (npr. kapacitet vile ili vrijeme polaska broda), ažurirajte isti podatak i u `js/nika.js` — tekstovi odgovora nalaze se u objektu `T` (po jezicima), a podaci o vilama u objektu `VILLAS`.

## Nakon izmjena CSS-a ili JS-a

Sve stranice učitavaju `css/*.css` i `js/*.js` s oznakom verzije (npr. `js/nika.js?v=3`). Kad izmijenite neku od tih datoteka, povećajte broj (`?v=4`) u svim HTML datotekama — tako preglednici posjetitelja odmah učitaju novu verziju umjesto stare iz predmemorije.
