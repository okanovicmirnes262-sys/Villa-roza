/* Pandora Turist — interakcije: jezici, navigacija, animacije, forma */

(function () {
  "use strict";

  /* ---------- Jezik ---------- */

  const LANGS = ["hr", "en", "de"];

  function currentLang() {
    const saved = localStorage.getItem("pt-lang");
    return LANGS.includes(saved) ? saved : "hr";
  }

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.hr;
    document.documentElement.lang = lang;
    localStorage.setItem("pt-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  applyLang(currentLang());

  /* ---------- Ekran dobrodošlice (samo pri ulasku na stranicu) ---------- */

  const welcome = document.getElementById("welcome-screen");

  if (welcome) {
    const internal = document.referrer && document.referrer.indexOf(location.origin) === 0;
    if (internal) {
      welcome.remove();
    } else {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        welcome.classList.add("hide");
        document.body.style.overflow = "";
        setTimeout(() => welcome.remove(), 700);
      }, 2000);
    }
  }

  /* ---------- Zaglavlje pri skrolanju ---------- */

  const header = document.querySelector(".site-header");

  function onScroll() {
    header.classList.toggle("solid", window.scrollY > 60);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobilna navigacija ---------- */

  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      navToggle.textContent = open ? "✕" : "☰";
    });

    mainNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.textContent = "☰";
      })
    );
  }

  /* ---------- Galerija fotografija vile ---------- */

  document.querySelectorAll("[data-gallery]").forEach((box) => {
    const slug = box.dataset.gallery;
    const count = parseInt(box.dataset.count, 10) || 0;
    for (let i = 1; i <= count; i++) {
      const item = document.createElement("div");
      item.className = "g-item";
      const img = document.createElement("img");
      img.src = "assets/img/" + slug + "/" + slug + "-" + String(i).padStart(2, "0") + ".jpg";
      img.alt = box.dataset.alt || slug;
      img.loading = "lazy";
      item.appendChild(img);
      box.appendChild(item);
    }
  });

  /* ---------- Karusel vila ---------- */

  const slider = document.getElementById("villa-slider");

  if (slider) {
    const track = slider.querySelector(".vs-track");
    const slides = [...slider.querySelectorAll(".vs-slide")];
    const dotsBox = slider.querySelector(".vs-dots");
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Vila " + (i + 1));
      dot.addEventListener("click", () => go(i));
      dotsBox.appendChild(dot);
    });
    const dots = [...dotsBox.children];

    function go(i) {
      current = (i + slides.length) % slides.length;
      const slide = slides[current];
      const offset = slider.offsetWidth / 2 - slide.offsetLeft - slide.offsetWidth / 2;
      track.style.transform = "translateX(" + offset + "px)";
      slides.forEach((s, j) => s.classList.toggle("active", j === current));
      dots.forEach((d, j) => d.classList.toggle("active", j === current));
    }

    slider.querySelector(".vs-prev").addEventListener("click", () => go(current - 1));
    slider.querySelector(".vs-next").addEventListener("click", () => go(current + 1));
    window.addEventListener("resize", () => go(current));

    let startX = null;
    track.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    track.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (dx > 40) go(current - 1);
      else if (dx < -40) go(current + 1);
      startX = null;
    });

    go(0);
  }

  /* ---------- Animacija pri skrolanju ---------- */

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  /* ---------- Godina u podnožju ---------- */

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Forma za upit (mailto) ---------- */

  const form = document.getElementById("inquiry-form");

  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const lang = currentLang();
      const dict = I18N[lang] || I18N.hr;

      const lines = [
        dict["f.name"] + ": " + (data.get("name") || "-"),
        dict["f.email"] + ": " + (data.get("email") || "-"),
        dict["f.phone"] + ": " + (data.get("phone") || "-"),
        dict["f.interest"] + ": " + (data.get("interest") || "-"),
        dict["f.arrival"] + ": " + (data.get("arrival") || "-"),
        dict["f.departure"] + ": " + (data.get("departure") || "-"),
        dict["f.guests"] + ": " + (data.get("guests") || "-"),
        "",
        data.get("message") || ""
      ];

      const subject = "Upit / Inquiry — " + (data.get("interest") || "Pandora Turist");
      const href =
        "mailto:info@pandoraturist.hr?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      window.location.href = href;
    });
  }
})();
