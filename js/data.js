(function (root) {
  'use strict';

  root.DK_VENUES = [
    {
      id: 'roskilde-festival',
      name: 'Roskilde Festival',
      category: 'festival',
      city: 'Roskilde',
      address: 'Festival grounds at Trekroner, Darupvej, 4000 Roskilde',
      capacity: 130000,
      founded: 1971,
      website: 'https://roskilde-festival.dk',
      lat: 55.6197,
      lng: 12.0727,
      description: "Denmark's largest festival and one of the biggest in Northern Europe: 8 days, around 130,000 guests and one of the world's largest camping areas.",
      notes: 'Run non-profit by the Roskilde Festival Group; the camping area opens the Saturday before the festival.',
      contacts: [
        {
          id: 'rf-general',
          name: 'Roskilde Festival — general',
          role: 'General inquiries',
          email: 'info@roskilde-festival.dk',
          phone: '',
          socials: {
            instagram: 'https://www.instagram.com/roskildefestival/',
            facebook: 'https://www.facebook.com/roskildefestival',
            x: 'https://x.com/roskildefestival',
            youtube: 'https://www.youtube.com/user/RoskildeFestival',
            linkedin: 'https://www.linkedin.com/company/roskilde-festival/'
          },
          note: 'Press: press@roskilde-festival.dk'
        }
      ],
      partners: []
    },
    {
      id: 'smukfest',
      name: 'Smukfest (Skanderborg Festival)',
      category: 'festival',
      city: 'Skanderborg',
      address: 'Skanderborg Dyrehave (Bøgeskoven), 8660 Skanderborg',
      capacity: 60000,
      founded: 1980,
      website: 'https://www.smukfest.dk',
      lat: 56.0228,
      lng: 9.9072,
      description: "Denmark's second-largest festival, held in a beech forest — 'Danmarks Smukkeste Festival' (Denmark's Most Beautiful Festival)."
    },
    {
      id: 'tinderbox',
      name: 'Tinderbox',
      category: 'festival',
      city: 'Odense',
      address: 'Tusindårsskoven, Falen 177, 5250 Odense V',
      capacity: 40000,
      founded: 2015,
      website: 'https://tinderbox.dk',
      lat: 55.3825,
      lng: 10.3411,
      description: 'Three-day festival in Tusindårsskoven, a short walk or shuttle ride from Odense city centre.',
      notes: 'Owned by Down The Drain Group (same owner as NorthSide).',
      contacts: [
        {
          id: 'tb-general',
          name: 'Tinderbox — general',
          role: 'General inquiries',
          email: 'info@tinderbox.dk',
          phone: '',
          socials: {
            instagram: 'https://www.instagram.com/tinderboxfestival/',
            facebook: 'https://www.facebook.com/tinderboxdenmark',
            x: 'https://x.com/tinderboxdk'
          },
          note: ''
        }
      ],
      partners: ['northside']
    },
    {
      id: 'gron',
      name: 'Grøn',
      category: 'festival',
      city: 'Copenhagen',
      address: 'Refshaleøen, 1432 København K',
      capacity: 40000,
      founded: 2020,
      website: 'https://www.gron.dk',
      lat: 55.6905,
      lng: 12.6115,
      description: 'Multi-day festival on Refshaleøen with several stages; earlier editions were spread across Copenhagen.',
      notes: 'Shares the Refshaleøen festival site with Strøm, Copenhell and Loppen.'
    },
    {
      id: 'jelling-musikfestival',
      name: 'Jelling Musikfestival',
      category: 'festival',
      city: 'Jelling',
      address: 'Festivalplads, Mølvangvej 66B, 7300 Jelling',
      capacity: 38000,
      founded: 1993,
      website: 'https://jellingmusikfestival.dk',
      lat: 55.747,
      lng: 9.4225,
      description: "Denmark's third-largest festival, held on open grounds just south of Jelling with on-site camping."
    },
    {
      id: 'northside',
      name: 'NorthSide Festival',
      category: 'festival',
      city: 'Aarhus',
      address: 'Eskelunden, 8000 Aarhus C',
      capacity: 35000,
      founded: 2010,
      website: 'https://www.northside.dk',
      lat: 56.1538,
      lng: 10.2118,
      description: 'Urban three-day festival in Eskelunden, right by the Aarhus river in the heart of the city.',
      notes: 'At Eskelunden since 2022 (previously Ådalen, 2011–2019). Owned by Down The Drain Group (same owner as Tinderbox).',
      contacts: [
        {
          id: 'ns-general',
          name: 'NorthSide — general',
          role: 'General inquiries',
          email: 'info@northside.dk',
          phone: '',
          socials: {
            instagram: 'https://www.instagram.com/northsidefestival/',
            facebook: 'https://www.facebook.com/northsidefestival'
          },
          note: ''
        }
      ],
      partners: ['tinderbox']
    },
    {
      id: 'toender-festival',
      name: 'Tønder Festival',
      category: 'festival',
      city: 'Tønder',
      address: 'Festivalpladsen, 6270 Tønder',
      capacity: 25000,
      founded: 1974,
      website: 'https://www.toender-festival.dk',
      lat: 54.9315,
      lng: 8.8585,
      description: 'International folk and world music festival held near the German border since 1974.'
    },
    {
      id: 'heartland',
      name: 'Heartland Festival',
      category: 'festival',
      city: 'Kværndrup (Funen)',
      address: 'Egeskov Slot, Nyborgvej 24, 5772 Kværndrup',
      capacity: 25000,
      founded: 2017,
      website: 'https://www.heartlandfestival.dk',
      lat: 55.2849,
      lng: 10.4862,
      description: 'Festival in the grounds of Egeskov Castle combining music, talks and gastronomy.'
    },
    {
      id: 'strom',
      name: 'Strøm Festival',
      category: 'festival',
      city: 'Copenhagen',
      address: 'Refshaleøen, 1432 København K',
      capacity: 15000,
      founded: 2018,
      website: 'https://stromfestival.dk',
      lat: 55.69,
      lng: 12.6125,
      description: 'Electronic music festival on Refshaleøen.'
    },
    {
      id: 'copenhell',
      name: 'Copenhell',
      category: 'festival',
      city: 'Copenhagen',
      address: 'Refshaleøen, 1432 København K',
      capacity: 20000,
      founded: 2010,
      website: 'https://copenhell.dk',
      lat: 55.6898,
      lng: 12.6135,
      description: 'Heavy metal festival on Refshaleøen, one of the world’s largest dedicated metal festivals.'
    },
    {
      id: 'langelandsfestivalen',
      name: 'Langelandsfestivalen',
      category: 'festival',
      city: 'Langeskov (Funen)',
      address: 'Festival grounds, 5550 Langeskov',
      capacity: 12000,
      founded: 1991,
      website: 'https://www.langelandsfestivalen.dk',
      lat: 55.389,
      lng: 10.594,
      description: 'Family-friendly summer festival in Langeskov on Funen.'
    },
    {
      id: 'parken',
      name: 'Parken (Telia Parken)',
      category: 'stadium',
      city: 'Copenhagen',
      address: 'Øster Allé 39, 2100 København Ø',
      capacity: 38000,
      founded: 1992,
      website: 'https://www.parken.dk',
      lat: 55.6616,
      lng: 12.5689,
      description: "Denmark's national stadium in Østerbro; regular host of stadium-scale concerts."
    },
    {
      id: 'brondby-stadion',
      name: 'Brøndby Stadion',
      category: 'stadium',
      city: 'Brøndby',
      address: 'Brøndby Stadionvej 30, 2605 Brøndby',
      capacity: 29000,
      founded: 1965,
      website: 'https://brondbyif.dk',
      lat: 55.5982,
      lng: 12.5258,
      description: 'Home of Brøndby IF; also used for large open-air concerts.'
    },
    {
      id: 'royal-arena',
      name: 'Royal Arena',
      category: 'arena',
      city: 'Copenhagen',
      address: 'Hannemanns Allé 18, 2300 København S',
      capacity: 16000,
      founded: 2017,
      website: 'https://royal-arena.dk',
      lat: 55.6326,
      lng: 12.5657,
      description: 'Purpose-built indoor arena on Amager; hosted the Eurovision Song Contest 2014.',
      contacts: [
        {
          id: 'ra-general',
          name: 'Royal Arena — general',
          role: 'General inquiries',
          email: 'info@royal-arena.dk',
          phone: '',
          socials: {
            instagram: 'https://www.instagram.com/royalarena/',
            facebook: 'https://www.facebook.com/RoyalArenaDK',
            linkedin: 'https://www.linkedin.com/company/royal-arena/'
          },
          note: ''
        }
      ],
      partners: []
    },
    {
      id: 'jyske-bank-boxen',
      name: 'Jyske Bank Boxen',
      category: 'arena',
      city: 'Herning',
      address: 'Børkjærvej 6, 7400 Herning',
      capacity: 15000,
      founded: 2009,
      website: 'https://www.boxen.dk',
      lat: 56.1375,
      lng: 8.978,
      description: 'Multi-purpose indoor arena in Herning, a regular stop for major touring acts in Jutland.'
    },
    {
      id: 'ceres-arena',
      name: 'Ceres Arena',
      category: 'arena',
      city: 'Aarhus',
      address: 'Ceres Park, 8000 Aarhus C',
      capacity: 20000,
      founded: null,
      website: 'https://www.ceresarena.dk',
      lat: 56.1655,
      lng: 10.231,
      description: 'Large indoor arena in the Ceres Park complex, next to NRGi Park.'
    },
    {
      id: 'nrgi-park',
      name: 'NRGi Park (Aarhus Stadion)',
      category: 'stadium',
      city: 'Aarhus',
      address: 'Kongelunden, 8000 Aarhus C',
      capacity: 19400,
      founded: 1920,
      website: 'https://www.nrgipark.dk',
      lat: 56.1625,
      lng: 10.235,
      description: 'Home of AGF Aarhus; hosts concerts for major international acts.'
    },
    {
      id: 'forum-horsens',
      name: 'Forum Horsens',
      category: 'arena',
      city: 'Horsens',
      address: 'Kongevejen 33, 8700 Horsens',
      capacity: 8500,
      founded: null,
      website: 'https://forumhorsens.dk',
      lat: 55.8603,
      lng: 9.8497,
      description: 'Indoor event arena in Horsens hosting concerts, shows and exhibitions.'
    },
    {
      id: 'spar-nord-arena',
      name: 'Spar Nord Arena',
      category: 'arena',
      city: 'Aalborg',
      address: 'Østre Allé area, 9000 Aalborg',
      capacity: 6000,
      founded: null,
      website: 'https://sparnordarena.dk',
      lat: 57.0333,
      lng: 9.9133,
      description: 'Indoor arena in central Aalborg for concerts and sports.'
    },
    {
      id: 'gigantium',
      name: 'Gigantium',
      category: 'arena',
      city: 'Aalborg',
      address: 'Hadsundvej 12, 9000 Aalborg',
      capacity: 5000,
      founded: null,
      website: 'https://gigantium.dk',
      lat: 57.0455,
      lng: 9.9285,
      description: 'Large event hall in Aalborg used for concerts, trade fairs and sports.'
    },
    {
      id: 'kb-hallen',
      name: 'KB Hallen',
      category: 'hall',
      city: 'Frederiksberg (Copenhagen)',
      address: 'Peter Bangs Vej 147, 2000 Frederiksberg',
      capacity: 4000,
      founded: 1938,
      website: 'https://www.kbhallen.dk',
      lat: 55.7055,
      lng: 12.545,
      description: 'Historic concert hall from 1938; still one of Copenhagen’s key large rock/pop rooms.'
    },
    {
      id: 'akkc',
      name: 'Aalborg Kongres & Kultur Center',
      category: 'hall',
      city: 'Aalborg',
      address: 'Europa Plads 2, 9000 Aalborg',
      capacity: 2800,
      founded: null,
      website: 'https://www.akkc.dk',
      lat: 57.0443,
      lng: 9.9171,
      description: 'Congress and culture centre by the Aalborg waterfront with a large concert hall.'
    },
    {
      id: 'oeksnehallen',
      name: 'Øksnehallen',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Tietgensgade 65, 1620 København V',
      capacity: 2500,
      founded: 1957,
      website: 'https://www.oeksnehallen.dk',
      lat: 55.6903,
      lng: 12.5669,
      description: 'Iconic exhibition and concert hall near Tivoli in Vesterbro.'
    },
    {
      id: 'musikhuset-aarhus',
      name: 'Musikhuset Aarhus',
      category: 'hall',
      city: 'Aarhus',
      address: 'Thomas Jensens Allé 2, 8000 Aarhus C',
      capacity: 1900,
      founded: null,
      website: 'https://www.musikhuset.dk',
      lat: 56.1594,
      lng: 10.2075,
      description: 'Aarhus concert hall with several halls; home of the Aarhus Symphony Orchestra.'
    },
    {
      id: 'dr-koncerthuset',
      name: 'DR Koncerthuset',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Emil Holms Kanal 20, 0999 København C',
      capacity: 1800,
      founded: 2009,
      website: 'https://www.dr.dk/koncerthuset',
      lat: 55.6761,
      lng: 12.5896,
      description: "DR's concert hall on DR Byen; home of the Danish National Symphony Orchestra."
    },
    {
      id: 'pumpehuset',
      name: 'Pumpehuset',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Rådhuspladsen 77, 1550 København V',
      capacity: 1800,
      founded: null,
      website: 'https://pumpehuset.dk',
      lat: 55.676,
      lng: 12.5685,
      description: 'Rock and pop venue behind City Hall with two stages.'
    },
    {
      id: 'cirkusbygningen',
      name: 'Cirkusbygningen',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Jernbanegade 8, 1608 København V',
      capacity: 1600,
      founded: 1886,
      website: 'https://cirkusbygningen.dk',
      lat: 55.6801,
      lng: 12.5552,
      description: 'Historic circus building turned concert venue near the central station.'
    },
    {
      id: 'vega',
      name: 'Vega (Store Vega & Lille Vega)',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Enghavevej 40, 1674 København V',
      capacity: 1550,
      founded: null,
      website: 'https://www.vegacph.dk',
      lat: 55.6709,
      lng: 12.5478,
      description: 'Two halls in one building in Vesterbro — Store Vega (~1,550) and Lille Vega (~400); a landmark for international touring acts.',
      contacts: [
        {
          id: 'vega-general',
          name: 'Vega — general',
          role: 'General / booking inquiries',
          email: 'info@vegacph.dk',
          phone: '',
          socials: {
            instagram: 'https://www.instagram.com/vega_cph/',
            facebook: 'https://www.facebook.com/VEGAkbh/'
          },
          note: ''
        }
      ],
      partners: []
    },
    {
      id: 'voxhall',
      name: 'VoxHall',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Enghavevej 35, 1674 København V',
      capacity: 1500,
      founded: null,
      website: 'https://www.voxhall.dk',
      lat: 55.6712,
      lng: 12.5473,
      description: 'Concert venue next to Vega in Vesterbro with a main hall and smaller rooms.'
    },
    {
      id: 'amager-bio',
      name: 'Amager Bio',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Øresundsvej 6, 2300 København S',
      capacity: 1250,
      founded: 1991,
      website: 'https://amagerbio.dk',
      lat: 55.666,
      lng: 12.606,
      description: 'Classic rock club on Amager, Copenhagen.'
    },
    {
      id: 'musikkens-hus',
      name: 'Musikkens Hus',
      category: 'hall',
      city: 'Aalborg',
      address: 'Musikkens Plads 1, 9000 Aalborg',
      capacity: 1400,
      founded: 2007,
      website: 'https://www.musikkenshus.dk',
      lat: 57.0459,
      lng: 9.9192,
      description: 'Aalborg’s concert hall for classical, jazz and popular music by the Limfjord.'
    },
    {
      id: 'posten-odense',
      name: 'Posten',
      category: 'hall',
      city: 'Odense',
      address: 'Vestergade 88, 5000 Odense C',
      capacity: 1000,
      founded: null,
      website: 'https://postenlive.dk',
      lat: 55.404,
      lng: 10.387,
      description: 'Odense’s main rock venue in the city centre.'
    },
    {
      id: 'loppen',
      name: 'Loppen',
      category: 'hall',
      city: 'Copenhagen',
      address: 'Refshalevej 163A, 1432 København K',
      capacity: 800,
      founded: null,
      website: 'https://www.loppen.dk',
      lat: 55.6899,
      lng: 12.6105,
      description: 'Independent venue on Refshaleøen, a hub for emerging and experimental music.'
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
