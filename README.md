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
