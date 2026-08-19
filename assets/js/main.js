/* City Beauty – Interaktionen
   Alles ohne Framework, ohne externe Requests. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- Jahr */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------- Öffnungszeiten */
  // Index = getDay() (0 = Sonntag). Minuten seit Mitternacht.
  var HOURS = [
    null,                     // Sonntag
    { open: 600, close: 1140 },
    { open: 600, close: 1140 },
    { open: 600, close: 1140 },
    { open: 600, close: 1140 },
    { open: 600, close: 1140 },
    { open: 600, close: 1050 } // Samstag 10:00 – 17:30
  ];
  var DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  function fmt(min) {
    return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
  }

  function updateOpeningState() {
    var now = new Date();
    var dayIdx = now.getDay();
    var today = HOURS[dayIdx];
    var mins = now.getHours() * 60 + now.getMinutes();
    var pill = $('#status-pill');
    var text = $('#status-text');
    var note = $('#hours-note');
    var isOpen = !!today && mins >= today.open && mins < today.close;
    var label;

    if (!today) {
      label = 'Heute geschlossen';
    } else if (isOpen) {
      label = 'Jetzt geöffnet bis ' + fmt(today.close);
    } else if (mins < today.open) {
      label = 'Heute ab ' + fmt(today.open) + ' geöffnet';
    } else {
      label = 'Heute geschlossen';
    }

    if (text) text.textContent = label;
    if (pill) pill.classList.toggle('status--open', isOpen);

    // Heutige Zeile in der Tabelle markieren
    $$('#hours .hours__row').forEach(function (row) {
      row.classList.toggle('is-today', Number(row.getAttribute('data-day')) === dayIdx);
    });

    if (note) {
      if (isOpen) {
        note.innerHTML = '<strong>' + label + '.</strong> Rufen Sie kurz an – dann halten wir einen Platz für Sie frei.';
      } else {
        var nextIdx = -1;
        if (today && mins < today.open) {
          nextIdx = dayIdx;
        } else {
          for (var i = 1; i <= 7; i++) {
            var idx = (dayIdx + i) % 7;
            if (HOURS[idx]) { nextIdx = idx; break; }
          }
        }
        var when = nextIdx === dayIdx ? 'heute' : (nextIdx === (dayIdx + 1) % 7 ? 'morgen' : 'am ' + DAYS[nextIdx]);
        note.innerHTML = '<strong>Gerade geschlossen.</strong> Wir sind ' + when + ' ab ' + fmt(HOURS[nextIdx].open) + ' Uhr für Sie da – am besten kurz anrufen.';
      }
    }
  }
  updateOpeningState();
  setInterval(updateOpeningState, 60000);

  /* ------------------------------------------------------------- Header */
  var header = $('#header');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 12);
  }
  onScroll();

  /* --------------------------------------------------------- Mobile-Menü */
  var burger = $('#burger');
  var mobileNav = $('#mobile-nav');

  function setNav(open) {
    if (!burger || !mobileNav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    mobileNav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setNav(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  $$('#mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () { setNav(false); });
  });

  // Beim Wechsel auf Desktop-Breite darf kein Overlay stehen bleiben.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1120) setNav(false);
  });

  /* ------------------------------------------------- Scroll-Reveal */
  var revealItems = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------- Aktiver Navigationspunkt */
  var sections = $$('main section[id]');
  var navLinks = $$('#nav a');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------- Sanfter Hero-Parallax */
  var heroImg = $('#hero-img');
  var ticking = false;
  function parallax() {
    ticking = false;
    if (!heroImg) return;
    var offset = Math.min(window.scrollY, 700) * 0.06;
    heroImg.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0) scale(1.04)';
  }

  window.addEventListener('scroll', function () {
    onScroll();
    if (!reduceMotion && window.innerWidth > 980 && !ticking) {
      ticking = true;
      window.requestAnimationFrame(parallax);
    }
  }, { passive: true });
  if (!reduceMotion && window.innerWidth > 980) parallax();

  /* ------------------------------------------------------------ Lightbox */
  var lightbox = $('#lightbox');
  var lbImg = $('#lb-img');
  var items = $$('#gallery .gallery__item');
  var current = 0;

  function openLightbox(index) {
    if (!lightbox || !items.length) return;
    current = (index + items.length) % items.length;
    var btn = items[current];
    var inner = $('img', btn);
    lbImg.src = btn.getAttribute('data-full');
    lbImg.alt = inner ? inner.alt : '';
    lightbox.classList.add('is-open');
    document.body.classList.add('nav-open');
    $('#lb-close').focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    if (items[current]) items[current].focus();
  }

  items.forEach(function (btn, i) {
    btn.addEventListener('click', function () { openLightbox(i); });
  });
  if (lightbox) {
    $('#lb-close').addEventListener('click', closeLightbox);
    $('#lb-prev').addEventListener('click', function () { openLightbox(current - 1); });
    $('#lb-next').addEventListener('click', function () { openLightbox(current + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
      setNav(false);
    }
    if (lightbox && lightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowLeft') openLightbox(current - 1);
      if (e.key === 'ArrowRight') openLightbox(current + 1);
    }
  });

  /* ------------------------------------------------------ Karte nachladen */
  var mapConsent = $('#map-consent');
  if (mapConsent) {
    mapConsent.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=6.4405%2C51.1639%2C6.4545%2C51.1700&layer=mapnik&marker=51.16694%2C6.44751';
      frame.title = 'Karte: Limitenstraße 39, 41236 Mönchengladbach';
      frame.loading = 'lazy';
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      mapConsent.parentNode.replaceChild(frame, mapConsent);
    });
  }
})();
