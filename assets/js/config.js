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

  // The main wedding ceremony. Month is 1-based. Time is 24h, local.
  weddingDate: { year: 2026, month: 12, day: 2, hour: 21, minute: 0 },

  // The invocation below the hero.
  blessing: {
    shlok: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
    meaning:
      "O Lord with the curved trunk and mighty form, whose brilliance equals a crore suns — remove all obstacles from every undertaking, always.",
  },

  hero: {
    kicker: "Together with our families",
    tagline: "are getting married",
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
      date: "The decision",
      title: "A very easy yes",
      text:
        "There was no grand plan. We simply realised we were describing the same life, so we decided to build it together — and our families were delighted to agree.",
    },
    {
      date: "2 December 2026",
      title: "Forever, officially",
      text:
        "We would love for you to be in the room when we say the words out loud. Bring your dancing shoes and a healthy appetite.",
    },
  ],

  // Every function happens at the venue below, so they share its map link.
  events: [
    {
      name: "Sangeet",
      icon: "music",
      image: "assets/img/event-sangeet.jpg",
      date: "Tuesday, 1 December 2026",
      time: "8:00 PM onwards",
      venue: "Comfort Inn Shubhra",
      address: "Mahuabagh, Ghazipur",
      note: "Rehearsed performances, unrehearsed dancing, dinner well past midnight.",
      dress: "Indo-western glam",
    },
    {
      name: "Haldi",
      icon: "sun",
      image: "assets/img/event-haldi.jpg",
      date: "Wednesday, 2 December 2026",
      time: "10:00 AM onwards",
      venue: "Comfort Inn Shubhra",
      address: "Mahuabagh, Ghazipur",
      note: "Turmeric, marigolds and absolutely no clean clothes.",
      dress: "Anything yellow",
    },
    {
      name: "Marriage",
      icon: "rings",
      image: "assets/img/event-mandap.jpg",
      date: "Wednesday, 2 December 2026",
      time: "9:00 PM onwards",
      venue: "Comfort Inn Shubhra",
      address: "Mahuabagh, Ghazipur",
      note: "The pheras, the promises, and the moment we have been counting down to.",
      dress: "Traditional festive",
      highlight: true,
    },
  ],

  // The formal invitation card.
  invitation: {
    eyebrow: "With the blessings of our families",
    opening: "Mr. & Mrs. Sharma and Mr. & Mrs. Yadav",
    request: "request the pleasure of your company at the marriage of their children",
    closing: "Dinner and dancing to follow",
    footnote: "Your presence is the only gift we ask for.",
  },

  venue: {
    name: "Comfort Inn Shubhra",
    address: "Mahuabagh, Ghazipur, Uttar Pradesh 233001",
    mapQuery: "Comfort Inn Shubhra, Mahuabagh, Ghazipur, Uttar Pradesh 233001",
    // Used to drop the map pin exactly on the venue: "latitude,longitude".
    coords: "25.5795468,83.5760501",
    // Opens turn-by-turn directions straight from wherever the guest is.
    mapUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Comfort+Inn+Shubhra,+Mahuabagh,+Ghazipur,+Uttar+Pradesh+233001",
    notes: [
      {
        title: "Getting there",
        text:
          "Ghazipur City railway station is the closest stop, about fifteen minutes from the hotel. Flying guests usually land at Varanasi (LBS International), roughly two hours away by road.",
      },
      {
        title: "Where to stay",
        text:
          "Every function is at Comfort Inn Shubhra, so staying at the venue is easiest. Tell us if you need a room and we will help you book one.",
      },
      {
        title: "Parking",
        text:
          "There is parking on site at the hotel for all three functions.",
      },
    ],
  },

  gallery: [
    { src: "assets/img/couple.jpg", caption: "Us, illustrated" },
    { src: "assets/img/gallery-baraat.jpg", caption: "The baraat arrives" },
    { src: "assets/img/himanshu.jpg", caption: "Himanshu" },
    { src: "assets/img/gallery-mehndi.jpg", caption: "Mehndi, still drying" },
    { src: "assets/img/saloni.jpg", caption: "Saloni" },
    { src: "assets/img/couple-walking.jpg", caption: "Under the lights" },
    { src: "assets/img/gallery-diyas.jpg", caption: "Lamps for the evening" },
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

  faq: [
    {
      q: "Can I bring a plus one?",
      a: "Your invitation will mention the number of seats reserved for you. If you would like to bring someone extra, just ask us — we will try our best.",
    },
    {
      q: "Are children welcome?",
      a: "Absolutely. We love having little ones around, and there will be a quiet corner for them to retreat to on the wedding night.",
    },
    {
      q: "What should I wear?",
      a: "Each function has a suggested colour palette listed above. Indian festive wear is always a safe and very welcome choice.",
    },
    {
      q: "Are you making a registry?",
      a: "Your presence is genuinely the only gift we are asking for. If you insist, your blessings and a good dance floor showing will do nicely.",
    },
  ],

  hashtag: "#HimanshuWedsSaloni",
  siteUrl: "",
};
