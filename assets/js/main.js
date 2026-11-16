/* ============================================================
   Himanshu & Saloni — site behaviour
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.WEDDING || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setText(sel, value, root) {
    var el = typeof sel === "string" ? $(sel, root) : sel;
    if (el && value) el.textContent = value;
  }

  function mapsLink(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query || "");
  }

  var venue = CFG.venue || {};
  var venueLink = venue.mapUrl || mapsLink(venue.mapQuery || venue.name + " " + venue.address);

  /* ── Dates (all times in the config are India time) ───── */
  var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
  var IST_OFFSET_MS = 330 * 60 * 1000;

  // Parses "2026-12-02T20:00" into its parts, without trusting the guest's timezone.
  function parseStart(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(str || "");
    if (!m) return null;
    return { year: +m[1], month: +m[2], day: +m[3], hour: +m[4], minute: +m[5] };
  }

  // The real instant of an India-time moment, so countdowns are right abroad too.
  function istInstant(p) {
    return new Date(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - IST_OFFSET_MS);
  }

  function weekday(p) { return WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()]; }

  function dayLabel(p) { return weekday(p) + ", " + p.day + " " + MONTHS[p.month - 1] + " " + p.year; }

  function clockLabel(p) {
    var h = p.hour % 12 || 12;
    var mm = p.minute < 10 ? "0" + p.minute : String(p.minute);
    return { clock: h + ":" + mm, meridiem: p.hour < 12 ? "AM" : "PM" };
  }

  var weddingParts = (function () {
    var d = CFG.weddingDate || {};
    return { year: d.year || 2026, month: d.month || 12, day: d.day || 2, hour: d.hour || 20, minute: d.minute || 0 };
  })();
  var weddingDate = istInstant(weddingParts);

  var events = (CFG.events || [])
    .map(function (ev) {
      var parts = parseStart(ev.start);
      if (!parts) return null;
      var copy = {};
      Object.keys(ev).forEach(function (k) { copy[k] = ev[k]; });
      copy.parts = parts;
      copy.instant = istInstant(parts);
      return copy;
    })
    .filter(Boolean)
    .sort(function (a, b) { return a.instant - b.instant; });

  /* ── Envelope cover ───────────────────────────────────── */
  function initCover() {
    var cover = $("#cover");
    var button = $("#openInvite");
    if (!cover || !button) return;

    // Guests arriving on a deep link (e.g. #venue) skip straight to the content.
    if (window.location.hash.length > 1) {
      cover.remove();
      return;
    }

    document.body.classList.add("is-locked");
    button.focus({ preventScroll: true });

    var open = function () {
      cover.classList.add("is-open");
      document.body.classList.remove("is-locked");
      setTimeout(function () { cover.remove(); }, reduceMotion ? 0 : 1000);
      document.removeEventListener("keydown", onKey);
    };
    var onKey = function (e) {
      if (e.key === "Escape" || e.key === "Enter") open();
    };
    button.addEventListener("click", open);
    document.addEventListener("keydown", onKey);
  }

  /* ── Navigation ───────────────────────────────────────── */
  function initNav() {
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var links = $("#navLinks");
    if (!nav) return;

    var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    if (toggle && links) {
      toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    }

    // Smooth scroll with a nav-height offset.
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      var target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (toggle) setOpen(false);
      var top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight - 1);
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });

    // Highlight the section currently in view.
    var navLinks = $$("#navLinks a");
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ── Reveal on scroll ─────────────────────────────────── */
  function observeReveals() {
    var items = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ── Invitation card ──────────────────────────────────── */
  function initInvitation() {
    var inv = CFG.invitation || {};
    var couple = CFG.couple || {};
    var shlok = (CFG.blessing || {}).shlok;

    setText("#blessingShlok", shlok);
    setText("#inviteEyebrow", inv.eyebrow);
    setText("#inviteOpening", inv.opening);
    setText("#inviteRequest", inv.request);
    setText("#inviteFootnote", inv.footnote);
    setText("#groomName", (couple.groom || {}).firstName);
    setText("#brideName", (couple.bride || {}).firstName);
    setText("#inviteVenue", venue.name);
    setText("#inviteAddress", venue.address);
    var venueLinkEl = $("#inviteVenueLink");
    if (venueLinkEl) venueLinkEl.href = venueLink;

    var time = clockLabel(weddingParts);
    setText('[data-date="weekday"]', weekday(weddingParts));
    setText('[data-date="month"]', MONTHS[weddingParts.month - 1]);
    setText('[data-date="day"]', (weddingParts.day < 10 ? "0" : "") + weddingParts.day);
    setText('[data-date="year"]', String(weddingParts.year));
    setText('[data-date="time"]', time.clock + " " + time.meridiem);
    var bar = $("#datebar");
    if (bar) bar.setAttribute("aria-label", dayLabel(weddingParts) + " at " + time.clock + " " + time.meridiem);

    var also = $("#inviteAlso");
    var extras = events.filter(function (ev) { return ev.showOnInvitation; });
    if (!also) return;
    if (!extras.length) { also.remove(); return; }
    also.innerHTML = extras
      .map(function (ev) {
        var t = clockLabel(ev.parts);
        var link = ev.mapUrl || (ev.venue ? mapsLink(ev.venue + " " + (ev.address || "")) : venueLink);
        return (
          "<li>" +
          '<a class="invite__also-link" href="' + esc(link) + '" target="_blank" rel="noopener" title="Open event location in Google Maps">' +
          '<p class="label">' + esc(ev.name) + "</p>" +
          '<p class="invite__also-when">' + esc(dayLabel(ev.parts).replace(/ \d{4}$/, "")) +
          " &nbsp;·&nbsp; " + esc(t.clock + " " + t.meridiem) + "</p>" +
          '<p class="invite__also-where">' + esc([ev.venue, ev.address].filter(Boolean).join(", ")) + "</p>" +
          "</a>" +
          "</li>"
        );
      })
      .join("");
  }

  /* ── Countdown ────────────────────────────────────────── */
  function initCountdown() {
    var fields = {
      days: $('[data-cd="days"]'),
      hours: $('[data-cd="hours"]'),
      minutes: $('[data-cd="minutes"]'),
      seconds: $('[data-cd="seconds"]'),
    };
    if (!fields.days) return;
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    var timer = null;

    var tick = function () {
      var diff = weddingDate.getTime() - Date.now();
      if (diff <= 0) {
        Object.keys(fields).forEach(function (k) { fields[k].textContent = "00"; });
        clearInterval(timer);
        return;
      }
      var secs = Math.floor(diff / 1000);
      fields.days.textContent = pad(Math.floor(secs / 86400));
      fields.hours.textContent = pad(Math.floor((secs % 86400) / 3600));
      fields.minutes.textContent = pad(Math.floor((secs % 3600) / 60));
      fields.seconds.textContent = pad(secs % 60);
    };

    tick();
    timer = setInterval(tick, 1000);
  }

  /* ── Couple ───────────────────────────────────────────── */
  function initCouple() {
    var couple = CFG.couple || {};
    $$("#couple .person").forEach(function (card) {
      var data = couple[card.getAttribute("data-person")];
      if (!data) return;
      var img = $("img", card);
      if (img && data.photo) {
        img.src = data.photo;
        img.alt = "Portrait of " + data.firstName;
      }
      setText(".person__role", data.role, card);
      setText(".person__name", data.firstName, card);
      setText(".person__parents", data.parents, card);
      setText(".person__blurb", data.blurb, card);
    });
  }

  /* ── Celebrations, grouped by day ─────────────────────── */
  var DAY_WORDS = ["One", "Two", "Three", "Four", "Five"];

  function initEvents() {
    var host = $("#eventDays");
    if (!host || !events.length) return;

    var days = [];
    events.forEach(function (ev, index) {
      var key = ev.start.slice(0, 10);
      var last = days[days.length - 1];
      if (!last || last.key !== key) {
        last = { key: key, parts: ev.parts, items: [] };
        days.push(last);
      }
      last.items.push({ ev: ev, index: index });
    });
    days.forEach(function (day) {
      if (day.items.length === 1) day.items[0].wide = true;
    });

    host.innerHTML = days
      .map(function (day, i) {
        var p = day.parts;
        return (
          '<div class="day">' +
          '<div class="day__head reveal">' +
          '<span class="day__num">' + esc(MONTHS[p.month - 1].slice(0, 3)) + "<b>" + p.day + "</b></span>" +
          '<h3 class="day__title"><small>Day ' + (DAY_WORDS[i] || i + 1) + "</small>" +
          esc(weekday(p) + ", " + p.day + " " + MONTHS[p.month - 1] + " " + p.year) + "</h3>" +
          "</div>" +
          '<div class="day__events">' + day.items.map(renderEvent).join("") + "</div>" +
          "</div>"
        );
      })
      .join("");

    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-ics]");
      if (!btn) return;
      var ev = events[Number(btn.getAttribute("data-ics"))];
      downloadIcs([ev], ev.name + " - Himanshu and Saloni.ics", ev.name + " added to your calendar");
    });
  }

  function renderEvent(item) {
    var ev = item.ev;
    var time = clockLabel(ev.parts);
    var link = ev.mapUrl || (ev.venue ? mapsLink(ev.venue + " " + (ev.address || "")) : venueLink);
    return (
      '<article class="card event reveal' + (ev.highlight ? " event--highlight" : "") +
      (item.wide ? " event--wide" : "") + '">' +
      '<figure class="event__art">' +
      (ev.highlight ? '<span class="event__ribbon">The Wedding</span>' : "") +
      (ev.image ? '<img src="' + esc(ev.image) + '" alt="" loading="lazy" />' : "") +
      "</figure>" +
      '<div class="event__body">' +
      '<p class="event__time"><b>' + esc(time.clock) + "</b>" + esc(time.meridiem) + "</p>" +
      '<h4 class="event__name">' + esc(ev.name) + "</h4>" +
      (ev.venue ? '<p class="event__venue">' + esc([ev.venue, ev.address].filter(Boolean).join(" · ")) + "</p>" : "") +
      (ev.note ? '<p class="event__note">' + esc(ev.note) + "</p>" : "") +
      (ev.dress ? '<span class="event__dress">Dress · ' + esc(ev.dress) + "</span>" : "") +
      '<div class="event__links">' +
      '<a href="' + esc(link) + '" target="_blank" rel="noopener">Map</a>' +
      '<button type="button" data-ics="' + item.index + '">Add to calendar</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  /* ── Story ────────────────────────────────────────────── */
  function initStory() {
    var list = $("#timeline");
    if (!list || !CFG.story) return;
    list.innerHTML = CFG.story
      .map(function (item) {
        return (
          '<li class="reveal">' +
          '<p class="timeline__date">' + esc(item.date) + "</p>" +
          '<h3 class="timeline__title">' + esc(item.title) + "</h3>" +
          '<p class="timeline__text">' + esc(item.text) + "</p>" +
          "</li>"
        );
      })
      .join("");

    var toggle = $("#storyToggle");
    var body = $("#storyBody");
    if (!toggle || !body) return;
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Hide our story" : "Read our story";
      if (open) $$(".reveal", body).forEach(function (el) { el.classList.add("is-in"); });
    });
  }

  /* ── Venue ────────────────────────────────────────────── */
  function initVenue() {
    var query = venue.mapQuery || venue.name + " " + venue.address;
    setText("#venueName", venue.name);
    setText("#venueAddress", venue.address);

    var dir = $("#venueDirections");
    if (dir) dir.href = venueLink;

    // Coordinates pin the map exactly; a text query is only a best guess.
    var map = $("#venueMap");
    if (map) {
      map.src = "https://www.google.com/maps?q=" + encodeURIComponent(venue.coords || query) +
        (venue.coords ? "&z=16" : "") + "&output=embed";
    }

    var notes = $("#venueNotes");
    if (notes && venue.notes) {
      notes.innerHTML = venue.notes
        .map(function (n) { return "<li><h4>" + esc(n.title) + "</h4><p>" + esc(n.text) + "</p></li>"; })
        .join("");
    }

    // Events held somewhere else (the reception) get their own block.
    var others = $("#otherVenues");
    var elsewhere = events.filter(function (ev) { return ev.venue; });
    if (!others) return;
    if (!elsewhere.length) { others.remove(); return; }
    others.innerHTML = elsewhere
      .map(function (ev) {
        var t = clockLabel(ev.parts);
        var link = ev.mapUrl || mapsLink(ev.venue + " " + (ev.address || ""));
        return (
          '<div class="card venue-extra__item reveal">' +
          "<div>" +
          '<p class="label">' + esc(ev.name) + " &nbsp;·&nbsp; " +
          esc(dayLabel(ev.parts).replace(/ \d{4}$/, "") + ", " + t.clock + " " + t.meridiem) + "</p>" +
          '<h3 class="venue__name">' + esc(ev.venue) + "</h3>" +
          '<p class="venue__address">' + esc(ev.address) + "</p>" +
          "</div>" +
          '<a class="btn btn--solid" href="' + esc(link) + '" target="_blank" rel="noopener">Get directions</a>' +
          "</div>"
        );
      })
      .join("");
  }

  /* ── Gallery + lightbox ───────────────────────────────── */
  function initGallery() {
    var grid = $("#galleryGrid");
    var items = CFG.gallery || [];
    if (!grid || !items.length) return;

    grid.innerHTML = items
      .map(function (item, i) {
        return (
          '<button class="gallery__item reveal" type="button" data-index="' + i + '" ' +
          'aria-label="Open image: ' + esc(item.caption) + '">' +
          '<img src="' + esc(item.src) + '" alt="' + esc(item.caption) + '" loading="lazy" />' +
          '<span class="gallery__cap">' + esc(item.caption) + "</span>" +
          "</button>"
        );
      })
      .join("");

    var box = $("#lightbox");
    var img = $("#lbImage");
    var cap = $("#lbCaption");
    var current = 0;
    var lastFocused = null;

    function show(i) {
      current = (i + items.length) % items.length;
      img.src = items[current].src;
      img.alt = items[current].caption;
      cap.textContent = items[current].caption + "  ·  " + (current + 1) + " / " + items.length;
    }
    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      box.hidden = false;
      requestAnimationFrame(function () { box.classList.add("is-open"); });
      document.body.style.overflow = "hidden";
      $("#lbClose").focus();
    }
    function close() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () { box.hidden = true; }, 350);
      if (lastFocused) lastFocused.focus();
    }

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".gallery__item");
      if (btn) open(Number(btn.dataset.index));
    });
    $("#lbClose").addEventListener("click", close);
    $("#lbPrev").addEventListener("click", function () { show(current - 1); });
    $("#lbNext").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ── Contacts ─────────────────────────────────────────── */
  function initContacts() {
    var contacts = $("#contactsList");
    if (!contacts || !CFG.contacts) return;
    var phoneIcon =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
    var mailIcon =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>';

    contacts.innerHTML = CFG.contacts
      .map(function (c) {
        var tel = String(c.phone).replace(/[^\d+]/g, "");
        var out = '<a href="tel:' + esc(tel) + '">' + phoneIcon +
          "<span>" + esc(c.name) + " · " + esc(c.phone) + "</span></a>";
        if (c.email) {
          out += '<a href="mailto:' + esc(c.email) + '">' + mailIcon + "<span>" + esc(c.email) + "</span></a>";
        }
        return out;
      })
      .join("");
  }

  /* ── Toast ────────────────────────────────────────────── */
  var toastTimer = null;
  function toast(message) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 3200);
  }

  /* ── Calendar (.ics) + share ──────────────────────────── */
  function icsStamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function downloadIcs(list, filename, message) {
    var names = CFG.couple.groom.firstName + " & " + CFG.couple.bride.firstName;
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//EN", "CALSCALE:GREGORIAN"];

    list.forEach(function (ev, i) {
      var end = new Date(ev.instant.getTime() + (ev.hours || 4) * 3600 * 1000);
      lines.push(
        "BEGIN:VEVENT",
        "UID:" + ev.start.replace(/\D/g, "") + "-" + i + "@himanshu-saloni",
        "DTSTAMP:" + icsStamp(new Date()),
        "DTSTART:" + icsStamp(ev.instant),
        "DTEND:" + icsStamp(end),
        "SUMMARY:" + ev.name + " · " + names,
        "DESCRIPTION:" + (ev.dress ? "Dress: " + ev.dress + ". " : "") + (CFG.hashtag || ""),
        "LOCATION:" + (ev.venue || venue.name || "") + ", " + (ev.address || venue.address || ""),
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");

    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast(message);
  }

  function initActions() {
    // Footer place links follow the config, so a changed map link updates everywhere.
    var footerWedding = $("#footerWedding");
    var reception = events.filter(function (ev) { return ev.venue && ev.mapUrl; })[0];
    var footerReception = $("#footerReception");
    if (footerWedding) footerWedding.href = venueLink;
    if (footerReception && reception) footerReception.href = reception.mapUrl;

    var shaadi = events.filter(function (ev) { return ev.highlight; })[0] ||
      { name: "Wedding", start: "", instant: weddingDate, hours: 6 };

    var saveDate = $("#saveDateBtn");
    if (saveDate) {
      saveDate.addEventListener("click", function () {
        downloadIcs([shaadi], "Himanshu-and-Saloni-Wedding.ics", "Calendar invite downloaded");
      });
    }

    var saveAll = $("#saveAllBtn");
    if (saveAll) {
      saveAll.addEventListener("click", function () {
        downloadIcs(events, "Himanshu-and-Saloni-Celebrations.ics", "All celebrations added to your calendar");
      });
    }

    var share = $("#shareBtn");
    if (!share) return;
    share.addEventListener("click", function () {
      var url = CFG.siteUrl || window.location.href.split("#")[0];
      var text = CFG.couple.groom.firstName + " & " + CFG.couple.bride.firstName +
        " are getting married on " + ((CFG.hero || {}).dateLabel || dayLabel(weddingParts)) + "!";

      if (navigator.share) {
        navigator.share({ title: "You are invited", text: text, url: url }).catch(function () {});
        return;
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text + " " + url).then(
          function () { toast("Invitation link copied"); },
          function () { toast(url); }
        );
        return;
      }
      window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank");
    });
  }

  /* ── RSVP ─────────────────────────────────────────────── */
  function initRsvp() {
    var rsvp = CFG.rsvp || {};
    var section = $("#rsvp");

    if (!rsvp.enabled) {
      if (section) section.remove();
      $$('a[href="#rsvp"]').forEach(function (a) { a.remove(); });
      return;
    }

    var form = $("#rsvpForm");
    if (!form) return;
    var status = $("#rsvpStatus");
    var submit = $("#rsvpSubmit");
    setText("#rsvpDeadline", rsvp.deadline);

    var guests = $("#rsvpGuests");
    if (guests) {
      var max = rsvp.maxGuests || 6;
      guests.innerHTML = "";
      for (var i = 1; i <= max; i++) {
        var opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = i === 1 ? "Just me" : i + " guests";
        guests.appendChild(opt);
      }
    }

    var chips = $("#eventChips");
    if (chips) {
      chips.innerHTML = events
        .map(function (ev) {
          return '<label class="chip"><input type="checkbox" name="events" value="' + esc(ev.name) + '"' +
            (ev.highlight ? " checked" : "") + " /><span>" + esc(ev.name) + "</span></label>";
        })
        .join("");
    }

    // Guest count and events only matter if they are actually coming.
    var guestFields = $("#guestFields");
    var eventFields = $("#eventsAttending");
    form.addEventListener("change", function (e) {
      if (e.target.name !== "attending") return;
      var coming = e.target.value.indexOf("accept") > -1;
      [guestFields, eventFields].forEach(function (el) { if (el) el.style.display = coming ? "" : "none"; });
    });

    function setError(input, message) {
      var slot = form.querySelector('[data-error-for="' + input.id + '"]');
      if (slot) slot.textContent = message || "";
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate() {
      var ok = true;
      var name = $("#rsvpName");
      var phone = $("#rsvpPhone");
      var email = $("#rsvpEmail");

      if (!name.value.trim()) { setError(name, "Please tell us your name"); ok = false; }
      else setError(name, "");

      if (phone.value.replace(/\D/g, "").length < 8) { setError(phone, "Please add a number we can reach you on"); ok = false; }
      else setError(phone, "");

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        setError(email, "That email does not look quite right");
        ok = false;
      } else setError(email, "");

      return ok;
    }

    function collect() {
      var data = {
        name: $("#rsvpName").value.trim(),
        phone: $("#rsvpPhone").value.trim(),
        email: $("#rsvpEmail").value.trim(),
        attending: (form.querySelector('input[name="attending"]:checked') || {}).value || "",
        guests: $("#rsvpGuests").value,
        meal: $("#rsvpMeal").value,
        events: $$('input[name="events"]:checked', form).map(function (c) { return c.value; }).join(", "),
        message: $("#rsvpMessage").value.trim(),
      };
      if (data.attending.indexOf("accept") === -1) {
        data.guests = "0";
        data.events = "—";
      }
      return data;
    }

    function toWhatsapp(data) {
      var text =
        "*RSVP — " + (CFG.hashtag || "Wedding") + "*\n" +
        "Name: " + data.name + "\n" +
        "Phone: " + data.phone + "\n" +
        (data.email ? "Email: " + data.email + "\n" : "") +
        "Attending: " + data.attending + "\n" +
        (data.guests !== "0" ? "Guests: " + data.guests + "\nMeal: " + data.meal + "\nEvents: " + data.events + "\n" : "") +
        (data.message ? "Note: " + data.message : "");
      return "https://wa.me/" + (rsvp.whatsappNumber || "") + "?text=" + encodeURIComponent(text);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        status.textContent = "Just a couple of details missing.";
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var data = collect();
      submit.disabled = true;
      status.textContent = "Sending…";
      var done = function (message) {
        status.textContent = message;
        submit.disabled = false;
      };

      if (!rsvp.endpoint) {
        window.open(toWhatsapp(data), "_blank");
        done("Almost there — press send in WhatsApp to confirm.");
        return;
      }

      fetch(rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad response");
          form.reset();
          done("Thank you, " + data.name.split(" ")[0] + ". Your RSVP is with us.");
          toast("RSVP received");
        })
        .catch(function () {
          done("We could not send that. Please message us on WhatsApp instead.");
          window.open(toWhatsapp(data), "_blank");
        });
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  function init() {
    initCover();
    initRsvp();
    initNav();
    initInvitation();
    initCountdown();
    initCouple();
    initEvents();
    initStory();
    initVenue();
    initGallery();
    initContacts();
    initActions();
    observeReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
