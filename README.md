# Himanshu &amp; Saloni — Wedding Website

A single-page save-the-date and invitation site for **2 December 2026**. No build step, no
dependencies, no framework: open `index.html` and it works.

## What's inside

| Section | What it does |
| --- | --- |
| Hero | Names, date, and a live countdown to the ceremony |
| The Couple | Illustrated portraits of Himanshu and Saloni |
| Our Story | A four-step timeline of how you got here |
| Celebrations | A card per function with date, venue, dress code and a map link |
| Invocation | Ganesha and the shloka, straight after the hero (`blessing` in `config.js`) |
| Save the date | Downloads a `.ics` calendar invite and shares the link |
| Venue &amp; Travel | Embedded map, directions, and travel notes |
| Gallery | Click any image for a full-screen viewer (arrow keys work) |
| Invitation | The formal invitation card, with the other functions noted below it |
| FAQ | Expandable answers plus tap-to-call contacts |

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
story text, FAQ answers, phone numbers, the hashtag. Nothing in the HTML needs to be touched.

The real details are already in place: Comfort Inn Shubhra in Ghazipur, the three functions
(Sangeet on 1 December, Haldi and the Marriage on 2 December), and both your phone numbers.

Things still worth a look before you send the link out:

1. **`story`** — the four milestones are written as friendly placeholders. Replace them with
   how it actually happened.
2. **`couple.*.parents`** — currently "Mr. & Mrs. Sharma" and "Mr. & Mrs. Yadav". Swap in full
   names if you would rather print those.
3. **`venue.notes`** — the travel guidance (Ghazipur City station, Varanasi airport) is a
   sensible default; correct the distances if you know better.
4. **`rsvp.deadline`** — set to 1 November 2026 at the moment.
5. **`weddingDate`** — drives the countdown and the calendar invite, set to 2 December at 9 PM.
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
| `couple-walking.jpg` | Story section, save-the-date background |
| `floral-arch.jpg` | Hero background |
| `ganesha.jpg` | The invocation below the hero |
| `event-sangeet.jpg` | Sangeet card |
| `event-haldi.jpg` | Haldi card |
| `event-mandap.jpg` | Marriage card |
| `gallery-baraat.jpg` | Gallery |
| `gallery-mehndi.jpg` | Gallery |
| `gallery-diyas.jpg` | Gallery |

The Ganesha painting is on ivory paper and is blended into the page rather than cropped, so
if you swap it, keep a light background and it will sit on the section the same way.

To add more gallery photos, drop them in `assets/img/` and add an entry to the `gallery` array
in `config.js`.

## Notes

- Fonts load from Google Fonts, so the first view needs a connection; the site degrades to
  system serifs offline.
- Respects `prefers-reduced-motion` — the falling petals and scroll animations turn off for
  guests who ask for that.
- Works down to small phones, and prints reasonably if someone wants a paper copy.
