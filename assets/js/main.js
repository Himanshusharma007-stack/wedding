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

  function mapsLink(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query || "");
  }

  var weddingDate = (function () {
    var d = CFG.weddingDate || {};
    return new Date(d.year || 2026, (d.month || 12) - 1, d.day || 2, d.hour || 19, d.minute || 0, 0);
  })();

  /* ── Icons ────────────────────────────────────────────── */
  var ICONS = {
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    music: '<circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M9 17.5v-12l11-2v12"/><path d="M9 9.5l11-2"/>',
    rings: '<circle cx="9" cy="14" r="6"/><circle cx="16" cy="14" r="6"/><path d="M14 4.5 16 2l2 2.5-2 2.2z"/>',
    glass: '<path d="M8 22h8M12 15v7M5 3h14l-1.2 5.2A6 6 0 0 1 12 13a6 6 0 0 1-5.8-4.8Z"/>',
    heart: '<path d="M12 21s-7.5-4.7-9.4-9A5.3 5.3 0 0 1 12 6.9 5.3 5.3 0 0 1 21.4 12c-1.9 4.3-9.4 9-9.4 9z"/>',
  };

  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.heart) + "</svg>";
  }

  /* ── Loader ───────────────────────────────────────────── */
  function initLoader() {
    var loader = $("#loader");
    if (!loader) return;
    var hide = function () {
      setTimeout(function () {
        loader.classList.add("is-done");
        document.body.classList.add("is-ready");
      }, reduceMotion ? 0 : 900);
    };
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide);
    // Never let a slow asset trap the visitor behind the loader.
    setTimeout(hide, 4000);
  }

  /* ── Petals ───────────────────────────────────────────── */
  function initPetals() {
    var host = $("#petals");
    if (!host || reduceMotion) return;

    var colors = ["rgba(240,220,212,.85)", "rgba(220,185,100,.6)", "rgba(255,253,248,.75)", "rgba(226,178,168,.7)"];
    var count = window.innerWidth < 700 ? 10 : 18;

    for (var i = 0; i < count; i++) {
      var p = document.createElement("i");
      var size = 6 + Math.random() * 9;
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.width = size + "px";
      p.style.height = size * 0.72 + "px";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 14 + Math.random() * 16 + "s";
      p.style.animationDelay = -Math.random() * 25 + "s";
      p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      host.appendChild(p);
    }
  }

  /* ── Navigation ───────────────────────────────────────── */
  function initNav() {
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var links = $("#navLinks");
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && links) {
      var setOpen = function (open) {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      toggle.addEventListener("click", function () {
        setOpen(!nav.classList.contains("is-open"));
      });
      links.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
      });
    }

    // Smooth scroll with a nav-height offset.
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[data-scroll], a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (!id || id === "#" || id.charAt(0) !== "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight - 8);
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });

    // Highlight the section currently in view.
    var navLinks = $$("#navLinks a[href^='#']");
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            navLinks.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach(function (s) { spy.observe(s); });
    }
  }

  /* ── Reading progress ─────────────────────────────────── */
  function initProgress() {
    var bar = $("#progress i");
    if (!bar) return;

    var ticking = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ── Reveal on scroll ─────────────────────────────────── */
  var revealObserver = null;
  function observeReveals(root) {
    var items = $$(".reveal:not(.is-in), .timeline li:not(.is-in)", root || document);
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
    }
    items.forEach(function (el) { revealObserver.observe(el); });
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

    var note = $("#stdCounter");
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };

    var tick = function () {
      var diff = weddingDate.getTime() - Date.now();

      if (diff <= 0) {
        Object.keys(fields).forEach(function (k) { if (fields[k]) fields[k].textContent = "00"; });
        if (note) note.textContent = "Today is the day. Thank you for celebrating with us.";
        return;
      }

      var secs = Math.floor(diff / 1000);
      var days = Math.floor(secs / 86400);
      var hours = Math.floor((secs % 86400) / 3600);
      var mins = Math.floor((secs % 3600) / 60);

      fields.days.textContent = pad(days);
      fields.hours.textContent = pad(hours);
      fields.minutes.textContent = pad(mins);
      fields.seconds.textContent = pad(secs % 60);

      if (note) {
        note.textContent = days + (days === 1 ? " day" : " days") + " until we say “I do”";
      }
    };

    tick();
    setInterval(tick, 1000);
  }

  /* ── Hero + couple copy from config ───────────────────── */
  function initContent() {
    var hero = CFG.hero || {};
    var set = function (sel, value) {
      var el = $(sel);
      if (el && value) el.textContent = value;
    };
    set("#heroKicker", hero.kicker);
    set("#heroTagline", hero.tagline);
    set("#heroDate", hero.dateLabel);
    set("#heroPlace", hero.placeLabel);
    set("#hashtag", CFG.hashtag);
    set("#rsvpDeadline", (CFG.rsvp || {}).deadline);

    var people = $$("#couple .person");
    var order = [(CFG.couple || {}).groom, (CFG.couple || {}).bride];
    people.forEach(function (card, i) {
      var data = order[i];
      if (!data) return;
      var img = $("img", card);
      if (img && data.photo) {
        img.src = data.photo;
        img.alt = "Illustrated portrait of " + data.firstName;
      }
      set2($(".person__role", card), data.role);
      set2($(".person__name", card), data.firstName);
      set2($(".person__parents", card), data.parents);
      set2($(".person__blurb", card), data.blurb);
    });

    function set2(el, value) { if (el && value) el.textContent = value; }

    document.title = (CFG.couple.groom.firstName || "Himanshu") + " & " +
      (CFG.couple.bride.firstName || "Saloni") + " · " + (hero.dateLabel || "");
  }

  /* ── Story timeline ───────────────────────────────────── */
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
  }

  /* ── Events ───────────────────────────────────────────── */
  function initEvents() {
    var grid = $("#events-grid");
    if (!grid || !CFG.events) return;

    var venueLink = (CFG.venue || {}).mapUrl;

    grid.innerHTML = CFG.events
      .map(function (ev) {
        var query = ev.mapQuery || ((ev.venue || "") + " " + (ev.address || ""));
        var link = ev.mapUrl || venueLink || mapsLink(query);
        return (
          '<article class="event reveal' + (ev.highlight ? " event--highlight" : "") + '">' +
          (ev.highlight ? '<span class="event__ribbon">The big day</span>' : "") +
          (ev.image
            ? '<figure class="event__art"><img src="' + esc(ev.image) + '" alt="" loading="lazy" /></figure>'
            : "") +
          '<div class="event__icon">' + icon(ev.icon) + "</div>" +
          '<h3 class="event__name">' + esc(ev.name) + "</h3>" +
          '<p class="event__when">' + esc(ev.date) + "</p>" +
          '<p class="event__time">' + esc(ev.time) + "</p>" +
          '<p class="event__venue">' + esc(ev.venue) + "</p>" +
          '<p class="event__address">' + esc(ev.address) + "</p>" +
          (ev.note ? '<p class="event__note">' + esc(ev.note) + "</p>" : "") +
          (ev.dress ? '<span class="event__dress">' + esc(ev.dress) + "</span>" : "") +
          '<a class="event__map" href="' + esc(link) + '" target="_blank" rel="noopener">View on map</a>' +
          "</article>"
        );
      })
      .join("");
  }

  /* ── Venue ────────────────────────────────────────────── */
  function initVenue() {
    var v = CFG.venue;
    if (!v) return;

    var name = $("#venueName");
    var addr = $("#venueAddress");
    var dir = $("#venueDirections");
    var map = $("#venueMap");
    var notes = $("#venueNotes");
    var query = v.mapQuery || v.name + " " + v.address;

    if (name) name.textContent = v.name;
    if (addr) addr.textContent = v.address;
    if (dir) dir.href = v.mapUrl || mapsLink(query);
    // Coordinates pin the map exactly; a text query is only a best guess.
    if (map) {
      map.src =
        "https://www.google.com/maps?q=" +
        encodeURIComponent(v.coords || query) +
        (v.coords ? "&z=16" : "") +
        "&output=embed";
    }

    if (notes && v.notes) {
      notes.innerHTML = v.notes
        .map(function (n) {
          return "<li><h4>" + esc(n.title) + "</h4><p>" + esc(n.text) + "</p></li>";
        })
        .join("");
    }
  }

  /* ── Invocation ───────────────────────────────────────── */
  function initBlessing() {
    var b = CFG.blessing || {};
    var shlok = $("#blessingShlok");
    var meaning = $("#blessingMeaning");
    if (shlok && b.shlok) shlok.textContent = b.shlok;
    if (meaning) {
      if (b.meaning) meaning.textContent = b.meaning;
      else meaning.remove();
    }
  }

  /* ── Invitation card ──────────────────────────────────── */
  var HOUR_WORDS = ["twelve", "one", "two", "three", "four", "five", "six",
                    "seven", "eight", "nine", "ten", "eleven"];

  function timeInWords(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var word = HOUR_WORDS[h % 12];
    var part = h < 12 ? "in the morning" : h < 17 ? "in the afternoon" : "in the evening";
    var spoken = m === 0 ? word + " o'clock" : m === 30 ? "half past " + word : word + " " + m;
    return spoken.charAt(0).toUpperCase() + spoken.slice(1) + " " + part;
  }

  function initInvitation() {
    var inv = CFG.invitation;
    var section = $("#invitation");
    if (!section) return;
    if (!inv) { section.remove(); return; }

    var v = CFG.venue || {};
    var hero = CFG.hero || {};
    var put = function (sel, value) {
      var el = $(sel);
      if (el && value) el.textContent = value;
    };

    put("#inviteEyebrow", inv.eyebrow);
    put("#inviteOpening", inv.opening);
    put("#inviteRequest", inv.request);
    put("#inviteClosing", inv.closing);
    put("#inviteFootnote", inv.footnote);
    put("#inviteDate", hero.dateLabel);
    put("#inviteTime", timeInWords(weddingDate));
    put("#inviteVenue", v.name);
    put("#inviteAddress", v.address);

    var names = $$(".invite__names span");
    if (names.length === 2) {
      names[0].textContent = CFG.couple.groom.firstName;
      names[1].textContent = CFG.couple.bride.firstName;
    }

    var dir = $("#inviteDirections");
    if (dir) dir.href = v.mapUrl || mapsLink(v.mapQuery || v.name + " " + v.address);

    // The card leads with the wedding, so the other functions get a footnote.
    var also = $("#inviteAlso");
    var others = (CFG.events || []).filter(function (ev) { return !ev.highlight; });
    if (also && others.length) {
      also.innerHTML = others
        .map(function (ev) {
          return "<li><b>" + esc(ev.name) + "</b><span>" +
            esc(ev.date.replace(/^\w+, /, "")) + " · " +
            esc(ev.time.replace(/ onwards$/, "")) + "</span></li>";
        })
        .join("");
    }
  }

  /* ── Gallery + lightbox ───────────────────────────────── */
  function initGallery() {
    var grid = $("#gallery-grid");
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
      cap.textContent = items[current].caption;
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

  /* ── FAQ ──────────────────────────────────────────────── */
  function initFaq() {
    var list = $("#faq-list");
    if (!list || !CFG.faq) return;

    list.innerHTML = CFG.faq
      .map(function (item, i) {
        return (
          '<div class="faq__item reveal">' +
          '<button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
          "<span>" + esc(item.q) + "</span><i aria-hidden=\"true\"></i>" +
          "</button>" +
          '<div class="faq__a" id="faq-a-' + i + '"><div><p>' + esc(item.a) + "</p></div></div>" +
          "</div>"
        );
      })
      .join("");

    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".faq__q");
      if (!btn) return;
      var item = btn.parentElement;
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });

    var contacts = $("#contactsList");
    if (contacts && CFG.contacts) {
      var phoneIcon =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
      var mailIcon =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>';

      contacts.innerHTML = CFG.contacts
        .map(function (c) {
          var tel = String(c.phone).replace(/[^\d+]/g, "");
          var out =
            '<a href="tel:' + esc(tel) + '">' + phoneIcon +
            "<span>" + esc(c.name) + " · " + esc(c.phone) + "</span></a>";
          if (c.email) {
            out +=
              '<a href="mailto:' + esc(c.email) + '">' + mailIcon +
              "<span>" + esc(c.email) + "</span></a>";
          }
          return out;
        })
        .join("");
    }
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

  /* ── Save the date (.ics) + share ─────────────────────── */
  function icsStamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function downloadIcs() {
    var end = new Date(weddingDate.getTime() + 5 * 60 * 60 * 1000);
    var names = CFG.couple.groom.firstName + " & " + CFG.couple.bride.firstName;
    var venue = CFG.venue || {};

    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@wedding",
      "DTSTAMP:" + icsStamp(new Date()),
      "DTSTART:" + icsStamp(weddingDate),
      "DTEND:" + icsStamp(end),
      "SUMMARY:Wedding of " + names,
      "DESCRIPTION:We would love to have you there. " + (CFG.hashtag || ""),
      "LOCATION:" + (venue.name || "") + ", " + (venue.address || ""),
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "Himanshu-and-Saloni-Wedding.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast("Calendar invite downloaded");
  }

  function initActions() {
    $$("#saveDateBtn, #saveDateBtn2, #saveDateBtn3").forEach(function (btn) {
      btn.addEventListener("click", downloadIcs);
    });

    var share = $("#shareBtn");
    if (!share) return;

    share.addEventListener("click", function () {
      var url = CFG.siteUrl || window.location.href;
      var text =
        CFG.couple.groom.firstName + " & " + CFG.couple.bride.firstName +
        " are getting married on " + (CFG.hero.dateLabel || "2 December 2026") + "!";

      if (navigator.share) {
        navigator.share({ title: "Save the date", text: text, url: url }).catch(function () {});
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
    if (chips && CFG.events) {
      chips.innerHTML = CFG.events
        .map(function (ev) {
          return (
            '<label class="chip"><input type="checkbox" name="events" value="' + esc(ev.name) + '"' +
            (ev.highlight ? " checked" : "") + ' /><span>' + esc(ev.name) + "</span></label>"
          );
        })
        .join("");
    }

    // Guest count and meal only matter if they are actually coming.
    var guestFields = $("#guestFields");
    var eventFields = $("#eventsAttending");
    form.addEventListener("change", function (e) {
      if (e.target.name !== "attending") return;
      var coming = e.target.value.indexOf("accept") > -1;
      [guestFields, eventFields].forEach(function (el) {
        if (!el) return;
        el.style.display = coming ? "" : "none";
      });
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

      var digits = phone.value.replace(/\D/g, "");
      if (digits.length < 8) { setError(phone, "Please add a number we can reach you on"); ok = false; }
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
      return "https://wa.me/" + (CFG.rsvp.whatsappNumber || "") + "?text=" + encodeURIComponent(text);
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

      if (rsvp.endpoint) {
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
      } else {
        window.open(toWhatsapp(data), "_blank");
        done("Almost there — press send in WhatsApp to confirm.");
      }
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  function init() {
    initLoader();
    initPetals();
    initNav();
    initContent();
    initStory();
    initBlessing();
    initEvents();
    initInvitation();
    initVenue();
    initGallery();
    initFaq();
    initActions();
    initRsvp();
    initCountdown();
    initProgress();
    observeReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
