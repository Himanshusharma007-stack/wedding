# Himanshu &amp; Saloni — Wedding Website

A single-page save-the-date and invitation site for **2 December 2026**. No build step, no
dependencies, no framework: open `index.html` and it works.

## What's inside

| Section | What it does |
| --- | --- |
| Envelope | A maroon cover with a gold seal; guests tap “Open the invitation” (skipped on deep links like `#venue`) |
| Invitation card | On a maroon backdrop with a gold mandala and marigold garlands: Ganesha, the shloka, both families, names, date, venue, the reception line and a live countdown |
| The Couple | Illustrated portraits of Himanshu and Saloni |
| Our Story | A four-step timeline of how you got here |
| Celebrations | Grouped by day, one card per function with time, map and its own calendar invite, plus “add all four” |
| Venue &amp; Travel | Embedded map, directions and travel notes, plus a separate block for the reception venue |
| Footer | Tap-to-call contacts and a share button |
| Gallery | A fixed seven-photo mosaic of mounted prints; click any image for a full-screen viewer (arrow keys work) |

The RSVP form is built but switched off. Set `rsvp.enabled` to `true` in `config.js` to bring
it back; while it is `false` the section and its nav link are removed from the page entirely.

## Running it

Double-click `index.html`, or serve the folder so the map embed and fonts behave exactly as
they will in production:

```bash
python3 -m http.server 4321
# then open http://127.0.0.1:4321
```

## Editing your details

Everything you are likely to change lives in **`assets/js/config.js`** — names, dates, venues,
story text, phone numbers, the hashtag. Nothing in the HTML needs to be touched.

The real details are already in place: Comfort Inn Shubhra in Ghazipur, the four functions
(Mehendi 10 AM and Sangeet 6 PM on 1 December, Haldi 10 AM and Shaadi 8 PM on 2 December),
and both your phone numbers. The Reception (5 December, 12 PM, at residence in Muzaffarnagar)
has its own `venue`, `address` and `mapUrl`, and `showOnInvitation: true` adds it to the main card. Event times are India time (`start: "2026-12-01T10:00"`), so the
countdown and calendar invites are correct for guests abroad too.

Things still worth a look before you send the link out:

1. **`story`** — the four milestones are written as friendly placeholders. Replace them with
   how it actually happened.
2. **`couple.*.parents`** — currently "Mr. & Mrs. Sharma" and "Mr. & Mrs. Yadav". Swap in full
   names if you would rather print those.
3. **`venue.notes`** — the travel guidance (Ghazipur City station, Varanasi airport) is a
   sensible default; correct the distances if you know better.
4. **`rsvp.deadline`** — set to 1 November 2026 at the moment.
5. **`weddingDate`** — drives the countdown and the date on the card, set to 2 December at 8 PM.
   `month` is 1-based.

### How the maps work

The venue has three related fields. `coords` (`"latitude,longitude"`) pins the embedded map
exactly and never fails to resolve, `mapUrl` is what the **Get directions** button and every
"View on map" link open, and `mapQuery` is the plain-text fallback if the other two are
removed. An individual event can override the link with its own `mapUrl` if a function ever
moves to a different address.

### Collecting RSVPs, if you turn it back on

With `rsvp.endpoint` left empty, submitting the form opens WhatsApp with a pre-filled message
to `rsvp.whatsappNumber`. That needs no setup at all and works well for a few hundred guests.

To collect responses in a spreadsheet or inbox instead, create a form endpoint (Formspree,
Getform, Basin, or a Google Apps Script web app) and paste the URL into `rsvp.endpoint`. The
form POSTs JSON with these keys: `name`, `phone`, `email`, `attending`, `guests`, `meal`,
`events`, `message`. If the request fails, it quietly falls back to WhatsApp so no RSVP is lost.

## Publishing

Any static host will do, since there is no server side.

- **Netlify** — drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel** — `npx vercel` in this folder.
- **GitHub Pages** — push the folder to a repo and enable Pages on the `main` branch.

After deploying, set `siteUrl` in `config.js` to your live URL and change the `og:image` meta
tag in `index.html` to the full `https://...` path. WhatsApp and iMessage need an absolute URL
to show the preview card when guests share the invitation.

## The artwork

The portraits in `assets/img/` are hand-painted-style illustrations generated from your
photographs, so nothing on the site is a raw photo. Drop in replacements with the same
filenames and they will appear everywhere automatically:

| File | Used for |
| --- | --- |
| `himanshu.jpg` | Groom portrait, gallery |
| `saloni.jpg` | Bride portrait, gallery |
| `couple.jpg` | Gallery, social share preview |
| `couple-walking.jpg` | Story section |
| `floral-arch.jpg` | Floral arch at the top of the invitation card |
| `ganesha.jpg` | Ganesha on the invitation card |
| `event-sangeet.jpg` | Sangeet card |
| `event-haldi.jpg` | Haldi card |
| `event-mandap.jpg` | Shaadi card |
| `gallery-baraat.jpg` | Gallery |
| `gallery-mehndi.jpg` | Mehendi card, gallery |
| `gallery-diyas.jpg` | Gallery |
| `mandala.svg`, `toran.svg` | Gold mandala and marigold garland behind the invitation card |

The Ganesha painting is on ivory paper and is blended into the page rather than cropped, so
if you swap it, keep a light background and it will sit on the section the same way.

The gallery layout is designed for exactly seven photos, in the order they appear in the `gallery`
array (the first is the large feature, the third is the tall one). Swap images freely; if you add
more than seven, the extras flow on below the mosaic.

## Notes

- Fonts load from Google Fonts, so the first view needs a connection; the site degrades to
  system serifs offline.
- Respects `prefers-reduced-motion` — the envelope and scroll animations turn off for guests
  who ask for that.
- Works down to small phones, and prints reasonably if someone wants a paper copy.
