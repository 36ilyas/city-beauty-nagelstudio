# City Beauty · Nagelstudio Mönchengladbach-Rheydt

Statische One-Page-Website für das Nagelstudio **City Beauty**, Limitenstraße 39, 41236 Mönchengladbach-Rheydt.

**Live:** https://36ilyas.github.io/city-beauty-nagelstudio/

## Aufbau

```
index.html          Startseite (Hero, Studio, Leistungen, Ablauf, Preise, Galerie, Kontakt)
impressum.html      Impressum (Platzhalter müssen ergänzt werden)
datenschutz.html    Datenschutzerklärung
assets/css/         style.css (Design) + fonts.css (@font-face)
assets/fonts/       selbst gehostete Schriften (Cormorant Garamond, Jost, Parisienne)
assets/js/main.js   Navigation, Scroll-Reveal, Öffnungszeiten-Status, Lightbox, Karte
assets/img/         Bilder
```

Kein Build-Schritt, kein Framework, keine externen Requests beim Seitenaufruf.

## Features

- **Live-Öffnungszeiten** – Statusanzeige („Jetzt geöffnet bis 19:00“), der heutige Tag wird in der Tabelle hervorgehoben; Logik in `assets/js/main.js` (`HOURS`).
- **Mobil optimiert** – fluide Typografie (`clamp()`), Vollbild-Menü, feste Aktionsleiste mit „Anrufen“ und „Route“ ab Scrollposition.
- **Sanfte Effekte** – Scroll-Reveal per IntersectionObserver, Hero-Parallax, Hover-Transitions, Galerie-Lightbox (Pfeiltasten/ESC). Alles respektiert `prefers-reduced-motion`.
- **Datenschutzfreundlich** – Schriften lokal, keine Cookies, kein Tracking; die OpenStreetMap-Karte lädt erst nach Klick.
- **SEO** – Meta-/OG-Tags, `NailSalon`-JSON-LD mit Adresse, Telefon und Öffnungszeiten, `sitemap.xml`, `robots.txt`.

## Vor dem echten Livegang anpassen

1. **Impressum** – Name der Inhaberin/des Inhabers, E-Mail-Adresse, ggf. USt-IdNr. in `impressum.html` eintragen (die Felder in eckigen Klammern).
2. **Preise** – die Werte in `index.html` (Abschnitt „Preise“ und die Badges bei den Leistungen) sind Richtwerte aus dem Entwurf und müssen durch die echte Preisliste ersetzt werden.
3. **Fotos** – aktuell Stockfotos von [Pexels](https://www.pexels.com) (Pexels-Lizenz). Echte Studio- und Kundenfotos wirken deutlich besser: gleiche Dateinamen in `assets/img/` ersetzen (`-900.jpg` und `-1600.jpg` je Motiv).
4. **Online-Buchung** – alle Buttons führen derzeit auf `tel:+4921661463273`. Falls es einen Buchungslink gibt (z. B. über Google), diesen in `index.html` ersetzen.
5. **Eigene Domain** – im Repository unter *Settings → Pages → Custom domain* eintragen und die URLs in `index.html` (`canonical`, JSON-LD), `sitemap.xml` und `robots.txt` anpassen.

## Lokal ansehen

```bash
python -m http.server 8000
```

Danach http://localhost:8000 öffnen.

## Bildnachweis

Fotos: Pexels (Pexels-Lizenz, kostenlose kommerzielle Nutzung).
Schriften: Cormorant Garamond, Jost, Parisienne – SIL Open Font License 1.1.
