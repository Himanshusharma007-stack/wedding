/**
 * Wedding website configuration.
 * Everything you may want to change lives in this one file.
 */
window.WEDDING = {
  couple: {
    groom: {
      firstName: "Himanshu",
      fullName: "Himanshu Sharma",
      role: "The Groom",
      photo: "assets/img/himanshu.jpg",
      blurb:
        "An engineer at heart and a hopeless romantic by evening. He collects playlists, opinions on chai, and reasons to make Saloni laugh.",
      parents: "Son of Mr. & Mrs. Sharma",
      instagram: "",
    },
    bride: {
      firstName: "Saloni",
      fullName: "Saloni Yadav",
      role: "The Bride",
      photo: "assets/img/saloni.jpg",
      blurb:
        "Sunshine in a room full of people. She dances first, plans everything twice, and somehow makes every ordinary day feel like a celebration.",
      parents: "Daughter of Mr. & Mrs. Yadav",
      instagram: "",
    },
  },

  // The Shaadi itself. Month is 1-based. Time is 24h, India time (IST).
  weddingDate: { year: 2026, month: 12, day: 2, hour: 20, minute: 0 },

  // The invocation at the top of the invitation card.
  blessing: {
    shlok: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
  },

  hero: {
    dateLabel: "Wednesday, 2 December 2026",
    placeLabel: "Ghazipur, Uttar Pradesh",
  },

  story: [
    {
      date: "Where we met",
      title: "Two desks at Gigforce",
      text:
        "We were colleagues first. Same office, same long days at Gigforce, and a hello that neither of us thought would matter very much at the time.",
    },
    {
      date: "The conversations",
      title: "Talking, and then not stopping",
      text:
        "Work chats turned into lunch, lunch turned into evenings, and evenings turned into the kind of conversations that run well past midnight. Somewhere in there we stopped being just colleagues.",
    },
    {
      date: "2 December 2026",
      title: "Forever, officially",
      text:
        "We would love for you to be in the room when we say the words out loud. Bring your dancing shoes and a healthy appetite.",
    },
  ],

  // Every function happens at the venue below unless an event sets its own
  // `venue`, `address` and `mapUrl`. `showOnInvitation` adds a line for that
  // event to the main invitation card. `start` is local time in India (IST),
  // written as "YYYY-MM-DDTHH:MM". `hours` is used for the calendar invite.
  events: [
    {
      name: "Mehendi",
      image: "assets/img/gallery-mehndi.jpg",
      start: "2026-12-01T10:00",
      hours: 4,
      note: "Henna, music, chai and a long, lazy morning of stories.",
    },
    {
      name: "Sangeet",
      image: "assets/img/event-sangeet.jpg",
      start: "2026-12-01T18:00",
      hours: 5,
      note: "Rehearsed performances, unrehearsed dancing, dinner well past midnight.",
    },
    {
      name: "Haldi",
      image: "assets/img/event-haldi.jpg",
      start: "2026-12-02T10:00",
      hours: 3,
      note: "Turmeric, marigolds and absolutely no clean clothes.",
    },
    {
      name: "Shaadi",
      image: "assets/img/event-mandap.jpg",
      start: "2026-12-02T20:00",
      hours: 6,
      note: "The pheras, the promises, and the moment we have been counting down to.",
      highlight: true,
    },
    {
      name: "Reception",
      image: "assets/img/couple.jpg",
      start: "2026-12-05T12:00",
      hours: 4,
      venue: "At Residence",
      address: "Muzaffarnagar, Uttar Pradesh",
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=29.481293,77.717783",
      note: "Lunch, blessings and one more celebration with family and friends, at home.",
      showOnInvitation: true,
    },
  ],

  // The formal invitation card.
  invitation: {
    eyebrow: "With the blessings of our families",
    opening: "Mr. & Mrs. Sharma and Mr. & Mrs. Yadav",
    request: "request the pleasure of your company at the marriage of their children",
    footnote: "Your presence is the only gift we ask for.",
  },

  venue: {
    name: "Comfort Inn Shubhra",
    address: "Mahuabagh, Ghazipur, Uttar Pradesh 233001",
    mapQuery: "Comfort Inn Shubhra, Mahuabagh, Ghazipur, Uttar Pradesh 233001",
    // Used to drop the map pin exactly on the venue: "latitude,longitude".
    coords: "25.5795468,83.5760501",
    // Opened by "Get directions", every Ghazipur event's map link and the footer.
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Comfort+Inn+Shubhra,+Mahuabagh,+Ghazipur,+Uttar+Pradesh+233001",
    notes: [
      {
        title: "Getting there",
        text:
          "Ghazipur City railway station is the closest stop, about fifteen minutes from the hotel. Flying guests usually land at Varanasi (LBS International), roughly two hours away by road.",
      },
      {
        title: "Where to stay",
        text:
          "Every wedding function is at Comfort Inn Shubhra, so staying at the venue is easiest. Tell us if you need a room and we will help you book one.",
      },
      {
        title: "Parking",
        text:
          "There is parking on site at the hotel for all four wedding functions.",
      },
    ],
  },

  gallery: [
    { src: "assets/img/couple.jpg", caption: "Us, illustrated" },
    { src: "assets/img/gallery-rings-mountains.jpg", caption: "Promise in the hills" },
    { src: "assets/img/gallery-walk.jpg", caption: "Walking together" },
    { src: "assets/img/gallery-rings-mandir.jpg", caption: "Blessed beginnings" },
    { src: "assets/img/gallery-bench-laugh.jpg", caption: "Laughter and stories" },
    { src: "assets/img/couple-walking.jpg", caption: "Under the lights" },
    { src: "assets/img/gallery-bench-hug.jpg", caption: "Quiet moments together" },
  ],

  rsvp: {
    // Set to true to bring the RSVP form back.
    enabled: false,
    // Paste a Formspree / Google Apps Script / Getform endpoint here to collect
    // responses by email. Leave empty to fall back to WhatsApp.
    endpoint: "",
    // Used when no endpoint is set. Include the country code, no + or spaces.
    whatsappNumber: "918449844583",
    deadline: "Kindly respond by 1 November 2026",
    maxGuests: 6,
  },

  contacts: [
    { name: "Himanshu", phone: "+91 84498 44583", email: "hishrma00@gmail.com" },
    { name: "Saloni", phone: "+91 83828 74045" },
  ],

  hashtag: "#HimanshuWedsSaloni",
  siteUrl: "https://himanshusharma007-stack.github.io/wedding/",
};
