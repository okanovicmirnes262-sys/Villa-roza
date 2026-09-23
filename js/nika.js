/* Nika — virtualna asistentica Pandora Turista.
   Radi bez poslužitelja: odgovara iz baze znanja sastavljene od sadržaja ove stranice. */

(function () {
  "use strict";

  const PHONE = "385955868987";
  const EMAIL = "info@pandoraturist.hr";
  const MAPS = "https://www.google.com/maps/search/?api=1&query=Srima+I+61A%2C+22211+Vodice";
  const STORE = "nika-v1";

  const VILLAS = {
    julija: { name: "Villa Julija", page: "villa-julija.html", guests: 10, bed: 5, bath: 4 },
    loreta: { name: "Villa Loreta", page: "villa-loreta.html", guests: 8, bed: 4, bath: 4 },
    nika: { name: "Villa Nika", page: "villa-nika.html", guests: 6, bed: 3, bath: 3 },
    franko: { name: "Villa Franko", page: "villa-franko.html", guests: 6, bed: 3, bath: 3 },
    roko: { name: "Villa Roko & Oskar", page: "villa-roko-i-oscar.html", guests: 6, bed: 3, bath: 3 }
  };
  const VILLA_ORDER = ["julija", "loreta", "nika", "franko", "roko"];

  const VILLA_KW = {
    nika: ["nika$", "nike$", "niki$", "niku$", "nikom$"],
    franko: ["frank"],
    loreta: ["loret"],
    roko: ["roko$", "roka$", "roku$", "oskar", "oscar"],
    julija: ["julij", "julia"]
  };

  /* Namjere poredane po prioritetu: kod jednakog broja pogodaka pobjeđuje ranija. */
  const INTENTS = [
    ["book", ["rezerv", "book", "buchen", "buchung", "reserv", "upit", "inquir", "anfrage", "slobod", "availab", "verfugbar", "frei$", "termin"]],
    ["price", ["cijen", "kost", "cost", "price", "preis", "euro", "eur$", "popust", "discount", "rabatt", "jeftin", "cheap", "platit", "placa", "pay$", "zahlen"]],
    ["checkin", ["check", "prijav", "odjav", "kljuc", "key$", "keys$", "schlussel", "anreise", "abreise", "arrival", "departure", "dolazak", "odlazak"]],
    ["hours", ["radno vrijeme", "otvoren", "zatvoren", "open$", "opening", "hours", "offnungszeit", "geoffnet"]],
    ["pets", ["ljubim", "pas$", "psa$", "psom$", "mack", "pet$", "pets", "dog", "cat$", "cats", "haustier", "hund", "katze"]],
    ["wellness", ["wellness", "saun", "jacuz", "whirlpool", "teretan", "gym$", "fitness", "spa$", "masaz", "massage"]],
    ["kids", ["djec", "dijet", "kids", "child", "kinder", "kind$", "igralist", "playground", "spielplatz", "beba", "baby", "obitelj", "family", "familie"]],
    ["pool", ["bazen", "pool", "schwimmbad"]],
    ["amenities", ["klim", "air condition", "aircon", "wifi", "wi fi", "internet", "wlan", "parking", "parkir", "parkplatz", "auto$", "car$", "kuhinj", "kitchen", "kuche", "rostilj", "grill", "bbq", "barbecue", "perilic", "washing", "waschmaschine", "rucnik", "towel", "handtuch", "posteljin", "bed linen", "bettwasche"]],
    ["airport", ["aerodrom", "zracn", "airport", "flug", "flight", "zadar", "split$"]],
    ["beach", ["plaz", "mora$", "moru$", "morem$", "beach", "sea$", "strand", "meer", "kupanj", "swim", "schwimm", "udaljen", "daleko", "distance", "far$", "entfern", "weit"]],
    ["capacity", ["osob", "gost", "ljudi", "guest", "people", "person", "kapacit", "capacity", "soba", "sobe", "spavac", "bedroom", "schlafzimmer", "zimmer", "kupaon", "bathroom", "badezimmer", "bader", "wc$", "toalet", "kupatil", "prima$", "primaju", "sleeps", "accommodate"]],
    ["boat", ["brod", "izlet", "boat", "trip", "excursion", "tour$", "tours", "ausflug", "boot", "schiff", "zlarin", "prvic", "tvrdav", "fortress", "festung", "nikol", "kornat", "cruise", "krstar", "plovid", "ulaznic", "karte$", "kartu$", "ticket"]],
    ["restaurant", ["restoran", "restaurant", "jelo", "jela", "hrana", "food", "essen", "pizz", "riba", "ribu", "fish", "fisch", "rucak", "rucku", "lunch", "dinner", "vecera", "veceru", "abendessen", "menu", "jelovnik", "speisekarte", "caffe", "kava", "kavu", "coffee", "kaffee", "stol$", "stola", "table", "tisch", "roza"]],
    ["destination", ["destinac", "znamenit", "sight", "sehenswurd", "nocni", "nightlife", "night", "nachtleben", "hacienda", "huka", "provod", "zabav", "fun$", "crkv", "church", "kirche", "povijes", "history", "geschicht", "prizb", "blue beach", "plava plaz", "hangar", "sto raditi", "sta raditi", "what to do", "things to do", "aktivnost", "activit", "unternehmen", "vodic", "sibenik"]],
    ["about", ["o vama", "o nama", "tko ste", "who are", "about you", "about us", "uber euch", "uber uns", "1967", "australij", "australia", "australien", "vlasni", "owner", "besitzer", "your story", "vasa prica"]],
    ["contact", ["kontakt", "contact", "telefon", "phone", "broj$", "mail", "nazvat", "nazov", "zvati", "call$", "anruf", "whatsapp", "viber", "poruk"]],
    ["location", ["gdje", "adres", "lokacij", "where", "address", "location", "wo$", "adresse", "lage$", "srima", "srimi", "zaton", "na karti", "map$", "maps", "kako doci", "how to get", "anfahrt", "nalazi"]],
    ["villas", ["vil", "smjest", "accommod", "unterkunft", "kuca", "kucu", "house", "haus", "apartman", "apartment", "ferienwohnung", "nocen", "overnight", "stay$"]],
    ["thanks", ["hvala", "thanks", "thank", "danke", "zahval", "super$", "odlicn", "great$", "perfect", "savrsen", "top$"]],
    ["greet", ["bok$", "pozdrav", "hej$", "zdravo", "dobar dan", "dobro jutro", "dobra vecer", "hello", "hi$", "hey$", "good morning", "good evening", "hallo", "guten", "servus", "gruss", "cao$", "ciao"]]
  ];

  const CANCEL_KW = ["odustan", "prekin", "cancel", "abbrech", "stop$", "nevermind"];

  const LANG_HINTS = {
    hr: { strong: ["bok", "hvala", "molim", "koliko", "gdje", "sto", "sta", "kako", "imate", "zelim"], weak: ["je", "li", "ima", "imaju", "vila", "vile", "bazen", "plaza", "brod", "izlet", "cijena", "osoba", "soba", "mogu", "da", "ne", "za", "i", "u", "na", "se", "od", "koja", "koje", "koji"] },
    en: { strong: ["hello", "hi", "thanks", "thank", "please", "how", "what", "where", "which", "the"], weak: ["is", "are", "when", "does", "you", "your", "have", "has", "can", "much", "many", "there", "with", "for", "book", "price", "near", "far", "pool", "beach", "boat", "trip", "guests", "and", "of", "we"] },
    de: { strong: ["hallo", "danke", "bitte", "wie", "was", "wo", "gibt", "ich", "ist", "und"], weak: ["sind", "es", "haben", "habt", "wir", "der", "die", "das", "ein", "eine", "mit", "fur", "zum", "zur", "preis", "kostet", "strand", "boot", "ausflug", "zimmer", "buchen", "personen", "weit", "kann", "konnen", "einen"] }
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Tekstovi (HR / EN / DE) ---------- */

  const T = {
    hr: {
      sub: "Virtualna asistentica · Pandora Turist",
      ph: "Napišite pitanje…",
      send: "Pošalji",
      openL: "Razgovarajte s Nikom",
      closeL: "Zatvori",
      bubble: "Bok, ja sam Nika! 👋 Mogu li vam pomoći?",
      cleared: "🧹 Razgovor je obrisan.",
      hello: "Bok! Ja sam <b>Nika</b>, virtualna asistentica Pandora Turista. 👋<br>Pitajte me o našim vilama, izletu brodom ili restoranu Villa Roza — ili odmah pošaljite upit za rezervaciju.",
      cVillas: "Vile", cBoat: "Izlet brodom", cRest: "Restoran", cBook: "Rezervacija", cContact: "Kontakt", cOther: "Ostale vile", cCancel: "Odustani", cTable: "Stol u restoranu",
      bCall: "📞 Nazovi", bMail: "✉️ E-mail", bDetails: "Fotografije i detalji", bBookVilla: "Rezerviraj ovu vilu", bBookBoat: "Rezerviraj izlet", bBookRest: "Rezerviraj stol",
      bMoreBoat: "Više o izletu", bMoreRest: "Više o restoranu", bDest: "Istražite destinaciju", bAbout: "Naša priča", bMap: "📍 Na karti", bInquiry: "Pošalji upit",
      bSendMail: "✉️ Pošalji e-mailom", bSendWa: "💬 Pošalji na WhatsApp",
      srimaLine: "Srima, 200 m od prve plaže",
      cap: (v) => `do ${v.guests} osoba · ${v.bed} spavaće sobe · ${v.bath} kupaonice`,
      amenLine: "privatni bazen, klima-uređaji, besplatan Wi-Fi, parking",
      nearLine: "restoran 150 m, trgovina 100 m",
      airLine: "zračne luke: Zadar 60 km, Split 70 km",
      extra: {
        nika: "Elegantan, prozračan interijer i soba u prizemlju s izravnim izlazom na bazen.",
        franko: "Svijetli interijer, dnevni boravak otvorenog tipa i spavaća soba u prizemlju s izlazom na bazen.",
        loreta: "Prostrana terasa — idealna za obitelji i veća društva.",
        roko: "Uređena okućnica s ležaljkama i dječjim igralištem."
      },
      julija: "<b>Villa Julija</b> · Zaton kraj Šibenika, u zelenilu<br>• do 10 osoba · 5 spavaćih soba · 4 kupaonice<br>• privatni bazen, jacuzzi i sauna, teretana<br>• sjenica s ljetnom kuhinjom i roštiljem, boćalište, dječje igralište<br>• klima-uređaji, besplatan Wi-Fi, parking<br>• plaža 12 km (Vodice), restorani i trgovine 10 km<br>• zračne luke: Zadar 50 km, Split 70 km",
      capLine: (v) => `<b>${esc(v.name)}</b> — do ${v.guests} osoba, ${v.bed >= 5 ? v.bed + " spavaćih soba" : v.bed + " spavaće sobe"}, ${v.bath} kupaonice`,
      capIntro: "Kapaciteti naših vila:",
      villasAll: "Imamo pet superior vila s privatnim bazenima:<br>• <b>Villa Julija</b> — Zaton, do 10 osoba, wellness i teretana<br>• <b>Villa Loreta</b> — Srima, do 8 osoba<br>• <b>Villa Nika</b> — Srima, do 6 osoba<br>• <b>Villa Franko</b> — Srima, do 6 osoba<br>• <b>Villa Roko & Oskar</b> — Srima, do 6 osoba, dječje igralište<br>Vile u Srimi udaljene su 200 m od prve plaže. Koja vas zanima?",
      price: "Cijene smještaja ovise o terminu, trajanju boravka i broju gostiju, pa vam <b>ponudu šaljemo na upit</b> — brzo i bez obveze. 😊<br><br>Za <b>izlet brodom</b>: djeca do 4 godine ne plaćaju, a od 4 do 12 godina imaju 50 % popusta. Ulaznice se kupuju u restoranu Villa Roza u Srimi.",
      priceBoat: "Točnu cijenu izleta brodom rado ćemo vam javiti na upit ili telefonom. 😊<br>• djeca do 4 godine ne plaćaju<br>• od 4 do 12 godina 50 % popusta<br>• ulaznice se kupuju u restoranu Villa Roza u Srimi",
      unknown: "Za tu informaciju najbolje je da nas izravno kontaktirate — rado ćemo vam odgovoriti. 😊",
      hours: "Točno radno vrijeme restorana Villa Roza najbolje je provjeriti telefonom — rado ćemo vam odgovoriti i rezervirati stol. 😊",
      wellness: "Wellness imamo u <b>Villi Juliji</b> (Zaton kraj Šibenika): jacuzzi i sauna, teretana i privatni bazen — uz sjenicu s ljetnom kuhinjom, boćalište i dječje igralište. Ostale vile imaju privatni bazen, ali nemaju wellness.",
      kids: "Za obitelji s djecom preporučujem:<br>• <b>Villa Roko & Oskar</b> — dječje igralište u uređenoj okućnici, 200 m od plaže<br>• <b>Villa Julija</b> — dječje igralište, boćalište i puno prostora za do 10 osoba<br><br>Na izletu brodom djeca do 4 godine ne plaćaju, a od 4 do 12 godina imaju 50 % popusta.",
      pool: "Da — <b>sve naše vile imaju privatni bazen</b>. 🏊 Villa Julija uz bazen nudi i jacuzzi, saunu i teretanu.",
      amen: "Sve vile imaju <b>klima-uređaje, besplatan Wi-Fi, potpuno opremljenu kuhinju i privatni parking</b>. Vile u Srimi imaju natkrivenu terasu s roštiljem, a Villa Julija sjenicu s ljetnom kuhinjom i roštiljem.",
      airport: "Najbliže zračne luke su <b>Zadar</b> (oko 60 km od Srime) i <b>Split</b> (oko 70 km). Od Ville Julije do Zadra je oko 50 km.",
      airV: (v, isJulija) => `<b>${esc(v.name)}</b>: zračna luka Zadar oko ${isJulija ? 50 : 60} km, Split oko 70 km.`,
      beach: "Vile u Srimi (Nika, Franko, Loreta, Roko & Oskar) udaljene su samo <b>200 m</b> od prve plaže. 🏖️ Villa Julija je u Zatonu, oko <b>12 km</b> od plaža u Vodicama. U blizini su i poznata Plava plaža i plaža Hangar u Vodicama.",
      beachV: (v, isJulija) => isJulija ? "<b>Villa Julija</b> je u Zatonu, oko 12 km od plaža u Vodicama." : `<b>${esc(v.name)}</b> je samo 200 m od prve plaže. 🏖️`,
      boat: "<b>Izlet brodom Roko & Oskar</b> 🚤<br>• polazak iz luke Srima u <b>9:30</b>, povratak u <b>15:00</b><br>• tvrđava sv. Nikole (obilazak morskim putem) → otok <b>Zlarin</b> (1 sat, koralji) → <b>Prvić Luka</b> (45 min, muzej Fausta Vrančića) → kupanje i ručak na brodu<br>• do 12 putnika, hrana i piće dobrodošlice uključeni<br>• cjelodnevni, poludnevni i noćni izleti<br>• ulaznice u restoranu Villa Roza; djeca do 4 god. besplatno, 4–12 god. 50 % popusta",
      rest: "<b>Restoran Villa Roza</b> 🍽️ nalazi se u Srimi, uz šetnicu između Vodica i Šibenika.<br>• velika terasa za 300 gostiju<br>• dalmatinska kuhinja: riba, meso, pizza i tjestenina<br>• pizzeria s krušnom peći i caffe bar<br>Za veće grupe i proslave preporučujemo rezervaciju.",
      dest: "U okolici vas čeka puno toga:<br>• <b>plaže</b>: Plava plaža i plaža Hangar u Vodicama<br>• <b>zabava</b>: caffe bar Huka i noćni klub Hacienda<br>• <b>povijest</b>: starokršćanska bazilika u Prižbi, crkvica Gospe, crkve sv. Ilije i sv. Križa<br>• <b>gastro</b>: uz naš restoran Villa Roza — Arausa, Roki, Makina, Rico, Dalmacija i meksički Santa Maria",
      about: "Pandora Turist obiteljska je tvrtka iz Srime s tradicijom od <b>1967.</b> Osnivači su se nakon godina rada u Australiji vratili u Srimu i prvo otvorili restoran Villa Roza. Danas imamo pet superior vila s bazenima, izletnički brod Roko & Oskar i restoran.",
      contact: "📍 Srima I 61A, 22211 Srima – Vodice<br>📞 <a href=\"tel:+385955868987\">+385 95 586 8987</a><br>✉️ <a href=\"mailto:info@pandoraturist.hr\">info@pandoraturist.hr</a>",
      location: "Nalazimo se u <b>Srimi</b>, malom mjestu na šibenskoj rivijeri spojenom s Vodicama — nekoliko minuta od Vodica i petnaestak od Šibenika.<br>📍 Srima I 61A, 22211 Srima – Vodice<br>Villa Julija nalazi se u Zatonu kraj Šibenika.",
      greet: "Bok! 😊 Kako vam mogu pomoći?",
      thanks: "Nema na čemu! 😊 Ako trebate još nešto, tu sam.",
      fallback: "Oprostite, nisam sigurna da sam vas razumjela. 🙈 Pitajte me npr. o vilama, bazenu, udaljenosti plaže, izletu brodom, restoranu ili rezervaciji — ili nas kontaktirajte izravno.",
      askItem: "Rado! 😊 Što želite rezervirati?",
      askItemAgain: "Odaberite, molim, jednu od ponuđenih opcija:",
      okItem: (x) => `Rado ću pripremiti upit za: <b>${esc(x)}</b>.<br>`,
      datesVilla: "Za koje datume? (npr. 12.–19. srpnja)",
      datesBoat: "Koji datum izleta vas zanima?",
      datesRest: "Za koji datum i vrijeme?",
      guests: "Koliko osoba?",
      guestsAgain: "Molim upišite broj osoba (npr. 4).",
      name: "Na koje ime da glasi upit?",
      nameAgain: "Molim upišite svoje ime.",
      phone: "I broj telefona, da vas možemo brzo kontaktirati?",
      phoneAgain: "Molim upišite ispravan broj telefona (npr. +385 91 234 5678).",
      warnVilla: (v) => v.guests === 10 ? "Napomena: Villa Julija prima do 10 osoba." : `Napomena: ${esc(v.name)} prima do ${v.guests} osoba — za veću grupu pogledajte Villu Juliju (do 10 osoba) ili Villu Loretu (do 8).`,
      warnBoat: "Napomena: brod prima do 12 putnika.",
      summary: (d) => `Hvala, ${esc(d.name)}! Evo sažetka vašeg upita:<br>• <b>${esc(d.item)}</b><br>• Termin: ${esc(d.dates)}<br>• Osoba: ${esc(d.guests)}<br>• Telefon: ${esc(d.phone)}<br><br>Pošaljite ga jednim klikom — javit ćemo vam se u najkraćem roku. 😊`,
      mailSubject: "Upit",
      mailIntro: "Upit poslan putem chatbota Nika",
      fItem: "Zanima me", fDates: "Termin", fGuests: "Broj osoba", fName: "Ime", fPhone: "Telefon",
      cancelled: "U redu, odustali smo od upita. Mogu li pomoći s nečim drugim?",
      itemBoat: "Izlet brodom Roko & Oskar",
      itemRest: "Stol u restoranu Villa Roza"
    },

    en: {
      sub: "Virtual assistant · Pandora Turist",
      ph: "Type your question…",
      send: "Send",
      openL: "Chat with Nika",
      closeL: "Close",
      bubble: "Hi, I'm Nika! 👋 Can I help you?",
      cleared: "🧹 The conversation has been cleared.",
      hello: "Hi! I'm <b>Nika</b>, Pandora Turist's virtual assistant. 👋<br>Ask me about our villas, the boat trip or restaurant Villa Roza — or send a booking inquiry right away.",
      cVillas: "Villas", cBoat: "Boat trip", cRest: "Restaurant", cBook: "Booking", cContact: "Contact", cOther: "Other villas", cCancel: "Cancel", cTable: "Restaurant table",
      bCall: "📞 Call us", bMail: "✉️ E-mail", bDetails: "Photos & details", bBookVilla: "Book this villa", bBookBoat: "Book the trip", bBookRest: "Reserve a table",
      bMoreBoat: "More about the trip", bMoreRest: "More about the restaurant", bDest: "Explore the area", bAbout: "Our story", bMap: "📍 On the map", bInquiry: "Send an inquiry",
      bSendMail: "✉️ Send by e-mail", bSendWa: "💬 Send via WhatsApp",
      srimaLine: "Srima, 200 m from the first beach",
      cap: (v) => `up to ${v.guests} guests · ${v.bed} bedrooms · ${v.bath} bathrooms`,
      amenLine: "private pool, air conditioning, free Wi-Fi, parking",
      nearLine: "restaurant 150 m, shop 100 m",
      airLine: "airports: Zadar 60 km, Split 70 km",
      extra: {
        nika: "Elegant, airy interior and a ground-floor room with direct pool access.",
        franko: "Bright interior, open-plan living area and a ground-floor bedroom with pool access.",
        loreta: "Spacious terrace — ideal for families and larger groups.",
        roko: "Landscaped garden with sun loungers and a children's playground."
      },
      julija: "<b>Villa Julija</b> · Zaton near Šibenik, surrounded by greenery<br>• up to 10 guests · 5 bedrooms · 4 bathrooms<br>• private pool, jacuzzi and sauna, gym<br>• gazebo with summer kitchen and barbecue, boccia court, children's playground<br>• air conditioning, free Wi-Fi, parking<br>• beach 12 km (Vodice), restaurants and shops 10 km<br>• airports: Zadar 50 km, Split 70 km",
      capLine: (v) => `<b>${esc(v.name)}</b> — up to ${v.guests} guests, ${v.bed} bedrooms, ${v.bath} bathrooms`,
      capIntro: "Our villas at a glance:",
      villasAll: "We have five superior villas with private pools:<br>• <b>Villa Julija</b> — Zaton, up to 10 guests, wellness & gym<br>• <b>Villa Loreta</b> — Srima, up to 8 guests<br>• <b>Villa Nika</b> — Srima, up to 6 guests<br>• <b>Villa Franko</b> — Srima, up to 6 guests<br>• <b>Villa Roko & Oskar</b> — Srima, up to 6 guests, children's playground<br>The villas in Srima are 200 m from the first beach. Which one interests you?",
      price: "Accommodation prices depend on your dates, length of stay and number of guests, so we <b>send you an offer on request</b> — quickly and with no obligation. 😊<br><br>For the <b>boat trip</b>: children under 4 travel free, ages 4–12 get 50% off. Tickets are sold at restaurant Villa Roza in Srima.",
      priceBoat: "We'll gladly tell you the exact price of the boat trip on request or by phone. 😊<br>• children under 4 travel free<br>• ages 4–12 get 50% off<br>• tickets are sold at restaurant Villa Roza in Srima",
      unknown: "For that information it's best to contact us directly — we'll be happy to help. 😊",
      hours: "For the exact opening hours of restaurant Villa Roza please give us a call — we'll gladly answer and reserve a table for you. 😊",
      wellness: "Our wellness villa is <b>Villa Julija</b> (Zaton near Šibenik): jacuzzi and sauna, a gym and a private pool — plus a gazebo with summer kitchen, a boccia court and a playground. The other villas have private pools but no wellness area.",
      kids: "For families with children I recommend:<br>• <b>Villa Roko & Oskar</b> — children's playground in the garden, 200 m from the beach<br>• <b>Villa Julija</b> — playground, boccia court and plenty of space for up to 10 guests<br><br>On the boat trip children under 4 travel free and ages 4–12 get 50% off.",
      pool: "Yes — <b>all our villas have a private pool</b>. 🏊 Villa Julija also offers a jacuzzi, sauna and gym.",
      amen: "All villas have <b>air conditioning, free Wi-Fi, a fully equipped kitchen and private parking</b>. The villas in Srima have a covered terrace with barbecue, and Villa Julija a gazebo with summer kitchen and barbecue.",
      airport: "The nearest airports are <b>Zadar</b> (about 60 km from Srima) and <b>Split</b> (about 70 km). From Villa Julija it's about 50 km to Zadar.",
      airV: (v, isJulija) => `<b>${esc(v.name)}</b>: Zadar airport about ${isJulija ? 50 : 60} km, Split about 70 km.`,
      beach: "Our villas in Srima (Nika, Franko, Loreta, Roko & Oskar) are just <b>200 m</b> from the first beach. 🏖️ Villa Julija is in Zaton, about <b>12 km</b> from the beaches in Vodice. The popular Blue Beach and Hangar beach in Vodice are also close by.",
      beachV: (v, isJulija) => isJulija ? "<b>Villa Julija</b> is in Zaton, about 12 km from the beaches in Vodice." : `<b>${esc(v.name)}</b> is just 200 m from the first beach. 🏖️`,
      boat: "<b>Boat trip aboard Roko & Oskar</b> 🚤<br>• departure from Srima harbour at <b>9:30</b>, return at <b>15:00</b><br>• St. Nicholas Fortress (seen from the sea) → <b>Zlarin</b> island (1 hour, corals) → <b>Prvić Luka</b> (45 min, Faust Vrančić museum) → swimming and lunch on board<br>• up to 12 passengers, welcome food and drinks included<br>• full-day, half-day and night tours<br>• tickets at restaurant Villa Roza; children under 4 free, ages 4–12 50% off",
      rest: "<b>Restaurant Villa Roza</b> 🍽️ is in Srima, on the promenade between Vodice and Šibenik.<br>• large terrace for 300 guests<br>• Dalmatian cuisine: fish, meat, pizza and pasta<br>• pizzeria with a bread oven and a coffee bar<br>For larger groups and celebrations we recommend booking ahead.",
      dest: "There's plenty to enjoy nearby:<br>• <b>beaches</b>: Blue Beach and Hangar beach in Vodice<br>• <b>nightlife</b>: Huka bar and the Hacienda club<br>• <b>history</b>: the early Christian basilica at Prižba, the Virgin Mary chapel, the churches of St. Elijah and the Holy Cross<br>• <b>food</b>: besides our Villa Roza — Arausa, Roki, Makina, Rico, Dalmacija and the Mexican Santa Maria",
      about: "Pandora Turist is a family company from Srima with a tradition dating back to <b>1967</b>. After years of working in Australia, the founders returned to Srima and first opened restaurant Villa Roza. Today we have five superior villas with pools, the excursion boat Roko & Oskar and the restaurant.",
      contact: "📍 Srima I 61A, 22211 Srima – Vodice, Croatia<br>📞 <a href=\"tel:+385955868987\">+385 95 586 8987</a><br>✉️ <a href=\"mailto:info@pandoraturist.hr\">info@pandoraturist.hr</a>",
      location: "We're in <b>Srima</b>, a small town on the Šibenik riviera joined with Vodice — a few minutes from Vodice and about fifteen from Šibenik.<br>📍 Srima I 61A, 22211 Srima – Vodice<br>Villa Julija is in Zaton near Šibenik.",
      greet: "Hi! 😊 How can I help you?",
      thanks: "You're welcome! 😊 If you need anything else, I'm here.",
      fallback: "Sorry, I'm not sure I understood. 🙈 Ask me about the villas, pools, distance to the beach, the boat trip, the restaurant or booking — or contact us directly.",
      askItem: "Gladly! 😊 What would you like to book?",
      askItemAgain: "Please choose one of the options:",
      okItem: (x) => `I'll prepare an inquiry for: <b>${esc(x)}</b>.<br>`,
      datesVilla: "For which dates? (e.g. 12–19 July)",
      datesBoat: "Which date would you like for the trip?",
      datesRest: "For which date and time?",
      guests: "How many people?",
      guestsAgain: "Please enter the number of people (e.g. 4).",
      name: "What name should the inquiry be under?",
      nameAgain: "Please enter your name.",
      phone: "And your phone number, so we can get back to you quickly?",
      phoneAgain: "Please enter a valid phone number (e.g. +44 7700 900123).",
      warnVilla: (v) => v.guests === 10 ? "Note: Villa Julija sleeps up to 10 guests." : `Note: ${esc(v.name)} sleeps up to ${v.guests} guests — for a larger group see Villa Julija (up to 10) or Villa Loreta (up to 8).`,
      warnBoat: "Note: the boat takes up to 12 passengers.",
      summary: (d) => `Thank you, ${esc(d.name)}! Here's your inquiry:<br>• <b>${esc(d.item)}</b><br>• Dates: ${esc(d.dates)}<br>• Guests: ${esc(d.guests)}<br>• Phone: ${esc(d.phone)}<br><br>Send it with one click — we'll get back to you shortly. 😊`,
      mailSubject: "Inquiry",
      mailIntro: "Inquiry sent via the Nika chatbot",
      fItem: "Interested in", fDates: "Dates", fGuests: "Guests", fName: "Name", fPhone: "Phone",
      cancelled: "Okay, I've cancelled the inquiry. Can I help with anything else?",
      itemBoat: "Boat trip Roko & Oskar",
      itemRest: "Table at restaurant Villa Roza"
    },

    de: {
      sub: "Virtuelle Assistentin · Pandora Turist",
      ph: "Ihre Frage…",
      send: "Senden",
      openL: "Mit Nika chatten",
      closeL: "Schließen",
      bubble: "Hallo, ich bin Nika! 👋 Kann ich helfen?",
      cleared: "🧹 Der Chatverlauf wurde gelöscht.",
      hello: "Hallo! Ich bin <b>Nika</b>, die virtuelle Assistentin von Pandora Turist. 👋<br>Fragen Sie mich zu unseren Villen, dem Bootsausflug oder dem Restaurant Villa Roza — oder senden Sie gleich eine Buchungsanfrage.",
      cVillas: "Villen", cBoat: "Bootsausflug", cRest: "Restaurant", cBook: "Buchen", cContact: "Kontakt", cOther: "Weitere Villen", cCancel: "Abbrechen", cTable: "Tisch im Restaurant",
      bCall: "📞 Anrufen", bMail: "✉️ E-Mail", bDetails: "Fotos & Details", bBookVilla: "Diese Villa anfragen", bBookBoat: "Ausflug buchen", bBookRest: "Tisch reservieren",
      bMoreBoat: "Mehr zum Ausflug", bMoreRest: "Mehr zum Restaurant", bDest: "Umgebung entdecken", bAbout: "Unsere Geschichte", bMap: "📍 Auf der Karte", bInquiry: "Anfrage senden",
      bSendMail: "✉️ Per E-Mail senden", bSendWa: "💬 Per WhatsApp senden",
      srimaLine: "Srima, 200 m zum ersten Strand",
      cap: (v) => `bis zu ${v.guests} Personen · ${v.bed} Schlafzimmer · ${v.bath} Bäder`,
      amenLine: "Privatpool, Klimaanlage, kostenloses WLAN, Parkplatz",
      nearLine: "Restaurant 150 m, Laden 100 m",
      airLine: "Flughäfen: Zadar 60 km, Split 70 km",
      extra: {
        nika: "Elegantes, luftiges Interieur und ein Zimmer im Erdgeschoss mit direktem Poolzugang.",
        franko: "Helles Interieur, offener Wohnbereich und ein Schlafzimmer im Erdgeschoss mit Poolzugang.",
        loreta: "Großzügige Terrasse — ideal für Familien und größere Gruppen.",
        roko: "Gepflegter Garten mit Liegen und Kinderspielplatz."
      },
      julija: "<b>Villa Julija</b> · Zaton bei Šibenik, im Grünen<br>• bis zu 10 Personen · 5 Schlafzimmer · 4 Bäder<br>• Privatpool, Whirlpool und Sauna, Fitnessraum<br>• Pergola mit Sommerküche und Grill, Boccia-Bahn, Kinderspielplatz<br>• Klimaanlage, kostenloses WLAN, Parkplatz<br>• Strand 12 km (Vodice), Restaurants und Läden 10 km<br>• Flughäfen: Zadar 50 km, Split 70 km",
      capLine: (v) => `<b>${esc(v.name)}</b> — bis zu ${v.guests} Personen, ${v.bed} Schlafzimmer, ${v.bath} Bäder`,
      capIntro: "Unsere Villen im Überblick:",
      villasAll: "Wir haben fünf Superior-Villen mit Privatpool:<br>• <b>Villa Julija</b> — Zaton, bis zu 10 Personen, Wellness & Fitness<br>• <b>Villa Loreta</b> — Srima, bis zu 8 Personen<br>• <b>Villa Nika</b> — Srima, bis zu 6 Personen<br>• <b>Villa Franko</b> — Srima, bis zu 6 Personen<br>• <b>Villa Roko & Oskar</b> — Srima, bis zu 6 Personen, Kinderspielplatz<br>Die Villen in Srima liegen 200 m vom ersten Strand. Welche interessiert Sie?",
      price: "Die Preise hängen von Reisezeit, Aufenthaltsdauer und Personenzahl ab — wir <b>senden Ihnen gerne ein unverbindliches Angebot</b>. 😊<br><br>Beim <b>Bootsausflug</b> fahren Kinder bis 4 Jahre gratis, von 4 bis 12 Jahren gibt es 50 % Rabatt. Tickets sind im Restaurant Villa Roza in Srima erhältlich.",
      priceBoat: "Den genauen Preis des Bootsausflugs nennen wir Ihnen gerne auf Anfrage oder telefonisch. 😊<br>• Kinder bis 4 Jahre fahren gratis<br>• von 4 bis 12 Jahren 50 % Rabatt<br>• Tickets gibt es im Restaurant Villa Roza in Srima",
      unknown: "Für diese Information kontaktieren Sie uns am besten direkt — wir helfen Ihnen gerne. 😊",
      hours: "Die genauen Öffnungszeiten des Restaurants Villa Roza erfragen Sie am besten telefonisch — wir reservieren Ihnen gerne auch einen Tisch. 😊",
      wellness: "Unsere Wellness-Villa ist die <b>Villa Julija</b> (Zaton bei Šibenik): Whirlpool und Sauna, Fitnessraum und Privatpool — dazu eine Pergola mit Sommerküche, Boccia-Bahn und Spielplatz. Die anderen Villen haben einen Privatpool, aber keinen Wellnessbereich.",
      kids: "Für Familien mit Kindern empfehle ich:<br>• <b>Villa Roko & Oskar</b> — Kinderspielplatz im Garten, 200 m zum Strand<br>• <b>Villa Julija</b> — Spielplatz, Boccia-Bahn und viel Platz für bis zu 10 Personen<br><br>Beim Bootsausflug fahren Kinder bis 4 Jahre gratis, von 4 bis 12 Jahren mit 50 % Rabatt.",
      pool: "Ja — <b>alle unsere Villen haben einen Privatpool</b>. 🏊 Die Villa Julija bietet zusätzlich Whirlpool, Sauna und Fitnessraum.",
      amen: "Alle Villen haben <b>Klimaanlage, kostenloses WLAN, eine voll ausgestattete Küche und einen privaten Parkplatz</b>. Die Villen in Srima haben eine überdachte Terrasse mit Grill, die Villa Julija eine Pergola mit Sommerküche und Grill.",
      airport: "Die nächsten Flughäfen sind <b>Zadar</b> (ca. 60 km von Srima) und <b>Split</b> (ca. 70 km). Von der Villa Julija sind es ca. 50 km nach Zadar.",
      airV: (v, isJulija) => `<b>${esc(v.name)}</b>: Flughafen Zadar ca. ${isJulija ? 50 : 60} km, Split ca. 70 km.`,
      beach: "Unsere Villen in Srima (Nika, Franko, Loreta, Roko & Oskar) liegen nur <b>200 m</b> vom ersten Strand. 🏖️ Die Villa Julija liegt in Zaton, ca. <b>12 km</b> von den Stränden in Vodice. In der Nähe sind auch der Blaue Strand und der Hangar-Strand in Vodice.",
      beachV: (v, isJulija) => isJulija ? "Die <b>Villa Julija</b> liegt in Zaton, ca. 12 km von den Stränden in Vodice." : `Die <b>${esc(v.name)}</b> liegt nur 200 m vom ersten Strand. 🏖️`,
      boat: "<b>Bootsausflug mit der Roko & Oskar</b> 🚤<br>• Abfahrt vom Hafen Srima um <b>9:30</b>, Rückkehr um <b>15:00</b><br>• Festung des hl. Nikolaus (vom Meer aus) → Insel <b>Zlarin</b> (1 Stunde, Korallen) → <b>Prvić Luka</b> (45 Min., Faust-Vrančić-Museum) → Baden und Mittagessen an Bord<br>• bis zu 12 Passagiere, Willkommensessen und -getränke inklusive<br>• Ganztages-, Halbtages- und Nachtausflüge<br>• Tickets im Restaurant Villa Roza; Kinder bis 4 gratis, 4–12 Jahre 50 % Rabatt",
      rest: "Das <b>Restaurant Villa Roza</b> 🍽️ liegt in Srima an der Promenade zwischen Vodice und Šibenik.<br>• große Terrasse für 300 Gäste<br>• dalmatinische Küche: Fisch, Fleisch, Pizza und Pasta<br>• Pizzeria mit Brotofen und Café-Bar<br>Für größere Gruppen und Feiern empfehlen wir eine Reservierung.",
      dest: "In der Umgebung gibt es viel zu erleben:<br>• <b>Strände</b>: Blauer Strand und Hangar-Strand in Vodice<br>• <b>Nachtleben</b>: Bar Huka und Club Hacienda<br>• <b>Geschichte</b>: frühchristliche Basilika in Prižba, Marienkapelle, Kirchen des hl. Elias und des hl. Kreuzes<br>• <b>Gastronomie</b>: neben unserer Villa Roza — Arausa, Roki, Makina, Rico, Dalmacija und das mexikanische Santa Maria",
      about: "Pandora Turist ist ein Familienunternehmen aus Srima mit Tradition seit <b>1967</b>. Nach Jahren der Arbeit in Australien kehrten die Gründer nach Srima zurück und eröffneten zuerst das Restaurant Villa Roza. Heute gehören fünf Superior-Villen mit Pool, das Ausflugsboot Roko & Oskar und das Restaurant dazu.",
      contact: "📍 Srima I 61A, 22211 Srima – Vodice, Kroatien<br>📞 <a href=\"tel:+385955868987\">+385 95 586 8987</a><br>✉️ <a href=\"mailto:info@pandoraturist.hr\">info@pandoraturist.hr</a>",
      location: "Wir sind in <b>Srima</b>, einem kleinen Ort an der Riviera von Šibenik direkt bei Vodice — wenige Minuten von Vodice und ca. fünfzehn von Šibenik.<br>📍 Srima I 61A, 22211 Srima – Vodice<br>Die Villa Julija liegt in Zaton bei Šibenik.",
      greet: "Hallo! 😊 Wie kann ich Ihnen helfen?",
      thanks: "Gern geschehen! 😊 Wenn Sie noch etwas brauchen, bin ich da.",
      fallback: "Entschuldigung, das habe ich nicht ganz verstanden. 🙈 Fragen Sie mich z. B. zu den Villen, Pools, zur Entfernung zum Strand, zum Bootsausflug, zum Restaurant oder zur Buchung — oder kontaktieren Sie uns direkt.",
      askItem: "Gerne! 😊 Was möchten Sie buchen?",
      askItemAgain: "Bitte wählen Sie eine der Optionen:",
      okItem: (x) => `Ich bereite eine Anfrage vor für: <b>${esc(x)}</b>.<br>`,
      datesVilla: "Für welchen Zeitraum? (z. B. 12.–19. Juli)",
      datesBoat: "An welchem Tag möchten Sie den Ausflug machen?",
      datesRest: "Für welches Datum und welche Uhrzeit?",
      guests: "Wie viele Personen?",
      guestsAgain: "Bitte geben Sie die Personenzahl ein (z. B. 4).",
      name: "Auf welchen Namen soll die Anfrage laufen?",
      nameAgain: "Bitte geben Sie Ihren Namen ein.",
      phone: "Und Ihre Telefonnummer, damit wir uns schnell melden können?",
      phoneAgain: "Bitte geben Sie eine gültige Telefonnummer ein (z. B. +49 151 23456789).",
      warnVilla: (v) => v.guests === 10 ? "Hinweis: Die Villa Julija bietet Platz für bis zu 10 Personen." : `Hinweis: Die ${esc(v.name)} bietet Platz für bis zu ${v.guests} Personen — für größere Gruppen empfehlen wir die Villa Julija (bis 10) oder die Villa Loreta (bis 8).`,
      warnBoat: "Hinweis: Das Boot nimmt bis zu 12 Passagiere mit.",
      summary: (d) => `Danke, ${esc(d.name)}! Hier Ihre Anfrage:<br>• <b>${esc(d.item)}</b><br>• Zeitraum: ${esc(d.dates)}<br>• Personen: ${esc(d.guests)}<br>• Telefon: ${esc(d.phone)}<br><br>Senden Sie sie mit einem Klick — wir melden uns schnellstmöglich. 😊`,
      mailSubject: "Anfrage",
      mailIntro: "Anfrage über den Chatbot Nika",
      fItem: "Interesse an", fDates: "Zeitraum", fGuests: "Personen", fName: "Name", fPhone: "Telefon",
      cancelled: "In Ordnung, die Anfrage ist abgebrochen. Kann ich sonst noch helfen?",
      itemBoat: "Bootsausflug Roko & Oskar",
      itemRest: "Tisch im Restaurant Villa Roza"
    }
  };

  /* ---------- Prepoznavanje teksta ---------- */

  function norm(s) {
    return String(s).toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");
  }

  function parse(text) {
    const tokens = norm(text).split(/[^a-z0-9]+/).filter(Boolean);
    return { tokens, padded: " " + tokens.join(" ") + " " };
  }

  function score(p, keywords) {
    let s = 0;
    for (const k of keywords) {
      if (k.includes(" ")) {
        if (p.padded.includes(" " + k)) s += 2;
      } else if (k.endsWith("$")) {
        if (p.tokens.includes(k.slice(0, -1))) s += 1;
      } else if (p.tokens.some((t) => t.startsWith(k))) {
        s += 1;
      }
    }
    return s;
  }

  function detectLang(p) {
    const res = {};
    for (const lang in LANG_HINTS) {
      const h = LANG_HINTS[lang];
      res[lang] = p.tokens.reduce((n, t) => n + (h.strong.includes(t) ? 2 : h.weak.includes(t) ? 1 : 0), 0);
    }
    const sorted = Object.keys(res).sort((a, b) => res[b] - res[a]);
    const best = sorted[0];
    return res[best] >= 2 && res[best] > res[sorted[1]] ? best : null;
  }

  function detectVilla(p) {
    for (const k of Object.keys(VILLA_KW)) if (score(p, VILLA_KW[k]) > 0) return k;
    return null;
  }

  function bestIntent(p) {
    let best = null, top = 0;
    for (const [id, kw] of INTENTS) {
      const s = score(p, kw);
      if (s > top) { top = s; best = id; }
    }
    return best;
  }

  const hasVillaWord = (p) => p.tokens.some((t) => t.startsWith("vil"));

  /* ---------- Stanje razgovora (sessionStorage) ---------- */

  let state = { msgs: [], flow: null, ctx: {}, open: false, bubbleShown: false, lang: null };
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || "null");
    if (saved && Array.isArray(saved.msgs)) state = Object.assign(state, saved);
  } catch (e) { /* bez spremanja */ }

  function save() {
    state.msgs = state.msgs.slice(-60);
    try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* bez spremanja */ }
  }

  const uiLang = () => (T[document.documentElement.lang] ? document.documentElement.lang : "hr");

  /* ---------- Gumbi ---------- */

  const mainChips = (L) => [L.cVillas, L.cBoat, L.cRest, L.cBook, L.cContact].map((s) => ({ s, x: s }));

  const contactChips = (L) => [
    { s: L.bCall, u: "tel:+" + PHONE },
    { s: "💬 WhatsApp", u: "https://wa.me/" + PHONE, e: 1 },
    { s: L.bMail, u: "mailto:" + EMAIL }
  ];

  const villaChips = (k, L) => [
    { s: L.bBookVilla, k: k },
    { s: L.bDetails, u: VILLAS[k].page },
    { s: L.cOther, x: L.cOther }
  ];

  const cancelChip = (L) => [{ s: L.cCancel, x: L.cCancel }];

  function villaCard(k, L) {
    if (k === "julija") return L.julija;
    const v = VILLAS[k];
    return `<b>${esc(v.name)}</b> · ${L.srimaLine}<br>• ${L.cap(v)}<br>• ${L.amenLine}<br>• ${L.nearLine}<br>• ${L.airLine}<br>${L.extra[k]}`;
  }

  /* ---------- Odgovori ---------- */

  function answer(intent, vk, L) {
    const v = vk ? VILLAS[vk] : null;
    switch (intent) {
      case "price": return { h: L.price, b: [{ s: L.bInquiry, k: vk || "" }, contactChips(L)[0]] };
      case "checkin":
      case "pets": return { h: L.unknown, b: contactChips(L) };
      case "hours": return { h: L.hours, b: [{ s: L.bBookRest, k: "restaurant" }, contactChips(L)[0]] };
      case "wellness": return { h: L.wellness, b: villaChips("julija", L) };
      case "kids": return { h: L.kids, b: [{ s: VILLAS.roko.name, x: VILLAS.roko.name }, { s: VILLAS.julija.name, x: VILLAS.julija.name }] };
      case "pool": return { h: L.pool, b: vk ? villaChips(vk, L) : [{ s: L.cVillas, x: L.cVillas }] };
      case "amenities": return { h: L.amen, b: vk ? villaChips(vk, L) : [{ s: L.cVillas, x: L.cVillas }] };
      case "airport": return { h: v ? L.airV(v, vk === "julija") : L.airport, b: v ? villaChips(vk, L) : [{ s: L.bMap, u: MAPS, e: 1 }] };
      case "beach": return { h: v ? L.beachV(v, vk === "julija") : L.beach, b: v ? villaChips(vk, L) : [{ s: L.cVillas, x: L.cVillas }, { s: L.bDest, u: "destinacija.html" }] };
      case "capacity":
        if (v) return { h: L.capLine(v) + ".", b: villaChips(vk, L) };
        return { h: L.capIntro + "<br>" + VILLA_ORDER.map((k) => "• " + L.capLine(VILLAS[k])).join("<br>"), b: VILLA_ORDER.map((k) => ({ s: VILLAS[k].name, x: VILLAS[k].name })) };
      case "boat": return { h: L.boat, b: [{ s: L.bBookBoat, k: "boat" }, { s: L.bMoreBoat, u: "izleti-brodom.html" }] };
      case "restaurant": return { h: L.rest, b: [{ s: L.bBookRest, k: "restaurant" }, { s: L.bMoreRest, u: "restoran-villa-roza.html" }, contactChips(L)[0]] };
      case "destination": return { h: L.dest, b: [{ s: L.bDest, u: "destinacija.html" }] };
      case "about": return { h: L.about, b: [{ s: L.bAbout, u: "o-nama.html" }] };
      case "contact": return { h: L.contact, b: contactChips(L) };
      case "location": return { h: L.location, b: [{ s: L.bMap, u: MAPS, e: 1 }, { s: L.bDest, u: "destinacija.html" }] };
      case "villas":
        if (vk) return { h: villaCard(vk, L), b: villaChips(vk, L) };
        return { h: L.villasAll, b: VILLA_ORDER.map((k) => ({ s: VILLAS[k].name, x: VILLAS[k].name })) };
      case "thanks": return { h: L.thanks, b: mainChips(L) };
      case "greet": return { h: L.greet, b: mainChips(L) };
      default:
        if (vk) return { h: villaCard(vk, L), b: villaChips(vk, L) };
        return { h: L.fallback, b: mainChips(L).concat([contactChips(L)[0]]) };
    }
  }

  /* ---------- Upit za rezervaciju ---------- */

  function itemLabel(item, L) {
    if (VILLAS[item]) return VILLAS[item].name;
    return item === "boat" ? L.itemBoat : L.itemRest;
  }

  function itemChips(L) {
    return VILLA_ORDER.map((k) => ({ s: VILLAS[k].name, x: VILLAS[k].name }))
      .concat([{ s: L.cBoat, x: L.cBoat }, { s: L.cTable, x: L.cTable }], cancelChip(L));
  }

  function datesPrompt(item, L) {
    if (item === "boat") return L.datesBoat;
    if (item === "restaurant") return L.datesRest;
    return L.datesVilla;
  }

  function startFlow(lang, item) {
    const L = T[lang];
    state.flow = { lang, item: item || null, step: item ? "dates" : "item", data: {} };
    if (!item) return { h: L.askItem, b: itemChips(L) };
    return { h: L.okItem(itemLabel(item, L)) + datesPrompt(item, L), b: cancelChip(L) };
  }

  function detectItem(p) {
    const vk = detectVilla(p);
    const boat = score(p, INTENTS.find((i) => i[0] === "boat")[1]);
    if (vk && !(vk === "roko" && boat > 0 && !hasVillaWord(p))) return vk;
    if (boat > 0) return "boat";
    if (score(p, INTENTS.find((i) => i[0] === "restaurant")[1]) > 0) return "restaurant";
    return null;
  }

  function flowStep(text, p) {
    const f = state.flow;
    const L = T[f.lang];
    if (score(p, CANCEL_KW) > 0) {
      state.flow = null;
      return { h: L.cancelled, b: mainChips(L) };
    }
    const clean = text.trim().slice(0, 120);
    switch (f.step) {
      case "item": {
        const it = detectItem(p);
        if (!it) return { h: L.askItemAgain, b: itemChips(L) };
        f.item = it;
        f.step = "dates";
        return { h: L.okItem(itemLabel(it, L)) + datesPrompt(it, L), b: cancelChip(L) };
      }
      case "dates":
        f.data.dates = clean;
        f.step = "guests";
        return { h: L.guests, b: cancelChip(L) };
      case "guests": {
        const nums = clean.match(/\d+/g);
        if (!nums) return { h: L.guestsAgain, b: cancelChip(L) };
        const total = nums.slice(0, 3).reduce((a, n) => a + parseInt(n, 10), 0);
        f.data.guests = clean;
        f.step = "name";
        let warn = "";
        if (VILLAS[f.item] && total > VILLAS[f.item].guests) warn = L.warnVilla(VILLAS[f.item]);
        if (f.item === "boat" && total > 12) warn = L.warnBoat;
        return { h: (warn ? warn + "<br><br>" : "") + L.name, b: cancelChip(L) };
      }
      case "name":
        if (clean.length < 2) return { h: L.nameAgain, b: cancelChip(L) };
        f.data.name = clean.slice(0, 80);
        f.step = "phone";
        return { h: L.phone, b: cancelChip(L) };
      case "phone": {
        if (clean.replace(/\D/g, "").length < 6) return { h: L.phoneAgain, b: cancelChip(L) };
        f.data.phone = clean.slice(0, 40);
        state.flow = null;
        return summary(f, L);
      }
    }
    state.flow = null;
    return { h: L.fallback, b: mainChips(L) };
  }

  function summary(f, L) {
    const d = Object.assign({ item: itemLabel(f.item, L) }, f.data);
    const body = [
      L.mailIntro,
      "",
      L.fItem + ": " + d.item,
      L.fDates + ": " + d.dates,
      L.fGuests + ": " + d.guests,
      L.fName + ": " + d.name,
      L.fPhone + ": " + d.phone
    ].join("\n");
    const mail = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(L.mailSubject + " — " + d.item) + "&body=" + encodeURIComponent(body);
    const wa = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(body);
    return {
      h: L.summary(d),
      b: [
        { s: L.bSendMail, u: mail, p: 1 },
        { s: L.bSendWa, u: wa, e: 1 },
        { s: L.bCall, u: "tel:+" + PHONE }
      ]
    };
  }

  /* ---------- Glavna logika ---------- */

  function reply(text) {
    const p = parse(text);
    if (state.flow) return flowStep(text, p);

    const lang = detectLang(p) || uiLang();
    state.lang = lang;
    const L = T[lang];

    let vk = detectVilla(p);
    const intent = bestIntent(p);

    if (vk === "nika" && !hasVillaWord(p) && (intent === "greet" || intent === "thanks")) vk = null;
    if (vk === "roko" && !hasVillaWord(p) && score(p, INTENTS.find((i) => i[0] === "boat")[1]) > 0) vk = null;

    if (vk) state.ctx.villa = vk;

    if (intent === "book") {
      let item = vk;
      if (!item) item = detectItem(p);
      return startFlow(lang, item);
    }

    const kw = (id) => INTENTS.find((i) => i[0] === id)[1];
    if (!vk && intent !== "book" && score(p, kw("price")) > 0 && score(p, kw("boat")) > 0) {
      return { h: L.priceBoat, b: [{ s: L.bBookBoat, k: "boat" }, contactChips(L)[0]] };
    }

    const useCtx = ["capacity", "beach", "airport"].includes(intent);
    return answer(intent, vk || (useCtx ? state.ctx.villa : null), L);
  }

  /* ---------- Sučelje ---------- */

  const root = document.createElement("div");
  root.className = "nika";
  root.innerHTML =
    '<button class="nika-launcher" type="button"><span aria-hidden="true">N</span><span class="nika-online"></span></button>' +
    '<div class="nika-bubble" hidden><button class="nika-bubble-close" type="button">×</button><span class="nika-bubble-text"></span></div>' +
    '<section class="nika-panel" role="dialog" aria-hidden="true">' +
      '<header class="nika-head"><div class="nika-avatar" aria-hidden="true">N</div>' +
      '<div class="nika-title"><strong>Nika</strong><span class="nika-sub"></span></div>' +
      '<button class="nika-close" type="button">×</button></header>' +
      '<div class="nika-msgs" aria-live="polite"></div>' +
      '<form class="nika-form"><input type="text" maxlength="300" autocomplete="off" enterkeyhint="send"><button type="submit">➤</button></form>' +
    "</section>";
  document.body.appendChild(root);

  const launcher = root.querySelector(".nika-launcher");
  const bubble = root.querySelector(".nika-bubble");
  const panel = root.querySelector(".nika-panel");
  const msgsEl = root.querySelector(".nika-msgs");
  const form = root.querySelector(".nika-form");
  const input = form.querySelector("input");

  function setLabels() {
    const L = T[uiLang()];
    root.querySelector(".nika-sub").textContent = L.sub;
    root.querySelector(".nika-bubble-text").textContent = L.bubble;
    input.placeholder = L.ph;
    form.querySelector("button").setAttribute("aria-label", L.send);
    launcher.setAttribute("aria-label", L.openL);
    panel.setAttribute("aria-label", "Nika — " + L.sub);
    root.querySelector(".nika-close").setAttribute("aria-label", L.closeL);
    root.querySelector(".nika-bubble-close").setAttribute("aria-label", L.closeL);
  }

  function scrollDown() { msgsEl.scrollTop = msgsEl.scrollHeight; }

  function renderChips(buttons) {
    const box = document.createElement("div");
    box.className = "nika-chips";
    buttons.forEach((b) => {
      let el;
      if (b.u) {
        el = document.createElement("a");
        el.href = b.u;
        if (b.e) { el.target = "_blank"; el.rel = "noopener"; }
      } else {
        el = document.createElement("button");
        el.type = "button";
        el.addEventListener("click", () => {
          if (b.k !== undefined) userBook(b.k, b.s);
          else userSay(b.x || b.s);
        });
      }
      el.className = "nika-chip" + (b.p ? " primary" : "");
      el.textContent = b.s;
      box.appendChild(el);
    });
    return box;
  }

  function renderMsg(m, withChips) {
    const el = document.createElement("div");
    el.className = "nika-msg " + (m.r === "u" ? "user" : "bot");
    if (m.r === "u") el.textContent = m.h;
    else el.innerHTML = m.h;
    msgsEl.appendChild(el);
    if (withChips && m.b && m.b.length) msgsEl.appendChild(renderChips(m.b));
    scrollDown();
  }

  function renderAll() {
    msgsEl.innerHTML = "";
    state.msgs.forEach((m, i) => renderMsg(m, i === state.msgs.length - 1));
  }

  function clearChips() { msgsEl.querySelectorAll(".nika-chips").forEach((c) => c.remove()); }

  function pushBot(r) {
    const m = { r: "b", h: r.h, b: r.b || [] };
    state.msgs.forEach((x) => { delete x.b; });
    state.msgs.push(m);
    renderMsg(m, true);
    save();
  }

  function pushUser(text) {
    clearChips();
    const m = { r: "u", h: text };
    state.msgs.push(m);
    renderMsg(m, false);
    save();
  }

  let busy = false;

  function botRespond(fn) {
    busy = true;
    const typing = document.createElement("div");
    typing.className = "nika-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(typing);
    scrollDown();
    setTimeout(() => {
      typing.remove();
      pushBot(fn());
      busy = false;
    }, 550 + Math.random() * 350);
  }

  function userSay(text) {
    text = String(text).trim().slice(0, 300);
    if (!text || busy) return;
    if (isClearCommand(text)) return clearConversation();
    pushUser(text);
    botRespond(() => reply(text));
  }

  function userBook(item, label) {
    if (busy) return;
    pushUser(label);
    botRespond(() => startFlow(state.lang || uiLang(), item || null));
  }

  function isClearCommand(text) {
    const t = norm(text).replace(/[\s.!]+$/g, "").replace(/^[\/\\\uff0f]\s*/, "");
    return ["clear", "obrisi", "izbrisi", "reset", "loschen"].includes(t) && /^\s*[\/\\\uff0f]/.test(text);
  }

  function clearConversation() {
    state.msgs = [];
    state.flow = null;
    state.ctx = {};
    state.lang = null;
    msgsEl.innerHTML = "";
    const h = hello();
    pushBot({ h: T[uiLang()].cleared + "<br><br>" + h.h, b: h.b });
  }

  function hello() {
    const L = T[uiLang()];
    return { h: L.hello, b: mainChips(L) };
  }

  function openChat() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    bubble.hidden = true;
    state.open = true;
    state.bubbleShown = true;
    if (!state.msgs.length) pushBot(hello());
    save();
    scrollDown();
    if (window.matchMedia("(min-width: 561px)").matches) input.focus();
  }

  function closeChat() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    state.open = false;
    save();
  }

  launcher.addEventListener("click", () => (panel.classList.contains("open") ? closeChat() : openChat()));
  root.querySelector(".nika-close").addEventListener("click", closeChat);
  bubble.addEventListener("click", (e) => {
    if (e.target.closest(".nika-bubble-close")) { bubble.hidden = true; return; }
    openChat();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    userSay(text);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closeChat();
  });

  document.querySelectorAll(".lang-switch button").forEach((b) =>
    b.addEventListener("click", () => {
      setTimeout(() => {
        setLabels();
        if (state.msgs.length === 1 && state.msgs[0].r === "b" && !state.flow) {
          state.msgs = [];
          pushBot(hello());
          renderAll();
        }
      }, 0);
    })
  );

  setLabels();
  renderAll();
  if (state.open) openChat();

  if (!state.bubbleShown) {
    setTimeout(() => {
      if (!state.open && !state.bubbleShown) {
        bubble.hidden = false;
        state.bubbleShown = true;
        save();
      }
    }, 8000);
  }
})();
