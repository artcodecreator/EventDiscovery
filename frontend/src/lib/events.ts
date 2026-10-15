export type EventReview = {
  id: number;
  rating: number;
  comment: string;
  user?: { username?: string; name?: string; avatar?: string };
  userName?: string;
  userAvatar?: string;
  createdAt?: string;
};

export type EventCategory = {
  id?: number | string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  gradient?: string;
  description?: string;
  image?: string;
};

export type EventItem = {
  id: number | string;
  documentId?: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  categoryId?: number;
  categoryColor: string;
  categoryIcon: string;
  city: string;
  venue: string;
  venueName?: string;
  address?: string;
  province?: string;
  date: string;
  eventDate?: string;
  time: string;
  startTime?: string;
  endTime?: string;
  price: string;
  priceValue?: number;
  isFree?: boolean;
  image: string;
  gallery?: string[];
  shortDescription?: string;
  description: string;
  fullDescription?: string;
  featured?: boolean;
  isFeatured?: boolean;
  status?: "pending" | "approved" | "rejected" | "deleted";
  capacity?: number;
  rsvpCount?: number;
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  reviews?: EventReview[];
};

export const categories: EventCategory[] = [
  {
    id: 1,
    name: "Technology & Hackathons",
    slug: "technology",
    icon: "fa-microchip",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    description: "AI conclaves, web3 sprints, developer summits, and robotics expos in Pakistani tech hubs.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Music & Qawwali Nights",
    slug: "music",
    icon: "fa-guitar",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    description: "Sufi fusion, Coke Studio guest artists, acoustic sitar recitals, and indie live performances.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Sports & Marathon Runs",
    slug: "sports",
    icon: "fa-person-running",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    description: "Karachi Sea View 10K peace runs, Margalla Trail challenges, and community cricket leagues.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Art, Culture & Heritage",
    slug: "art-culture",
    icon: "fa-palette",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    description: "Lok Virsa truck art workshops, Arabic calligraphy exhibitions, and theatrical literature fests.",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Food Street & Chai Fests",
    slug: "food-drink",
    icon: "fa-utensils",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    description: "Karachi Eat food festivals, Lahore Fort Road BBQ nights, and specialty matka chai sessions.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Community & Green Drives",
    slug: "community",
    icon: "fa-handshake-angle",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    description: "Margalla Hills reforestation campaigns, Clean & Green Pakistan drives, and youth blood camps.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Health, Yoga & Wellness",
    slug: "health-wellness",
    icon: "fa-spa",
    color: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    description: "Shakarparian morning mindfulness, mental health summits, and fitness bootcamps in Pakistan.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80"
  }
];

export const initialEvents: EventItem[] = [
  {
    id: 1,
    title: "Pakistan AI & Web3 Conclave 2026",
    slug: "pakistan-ai-web3-conclave-2026",
    categoryId: 1,
    categorySlug: "technology",
    category: "Technology & Hackathons",
    categoryColor: "#06b6d4",
    categoryIcon: "fa-microchip",
    shortDescription: "Pakistan's flagship artificial intelligence summit, hands-on LLM workshops, and startup investor networking at Expo Centre Lahore.",
    fullDescription: "Join over 1,500 software engineers, AI researchers, founders, and students at the premier technology gathering in Pakistan. Featuring keynote talks by leading global AI practitioners, dedicated breakout sessions on Generative AI, Web3 governance, Pakistani Fintech infrastructure, and a grand 24-hour hackathon with cash prizes up to PKR 1,000,000.\n\nAttendees will receive official digital credentials, complimentary high-tea, networking dinner access, and direct recruitment fast-tracks with top Pakistani tech firms.",
    description: "Pakistan's flagship artificial intelligence summit, hands-on LLM workshops, and startup investor networking at Expo Centre Lahore.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "Expo Centre Lahore",
    venueName: "Expo Centre Lahore",
    address: "Hall 1 & 2, Abdul Haque Rd, Johar Town",
    city: "Lahore",
    province: "Punjab",
    lat: 31.4687,
    lng: 74.2754,
    latitude: 31.4687,
    longitude: 74.2754,
    date: "2026-09-15",
    eventDate: "2026-09-15",
    time: "09:00 AM",
    startTime: "09:00:00",
    endTime: "18:00:00",
    isFree: false,
    priceValue: 2500,
    price: "Rs. 2,500",
    featured: true,
    isFeatured: true,
    status: "approved",
    organizerName: "Tech Pakistan Society",
    organizerEmail: "contact@techpakistan.pk",
    organizerPhone: "+92 42 3587 9011",
    rsvpCount: 342,
    capacity: 1500,
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "Outstanding event organization last year! Extremely excited for the 2026 AI keynotes and networking sessions with Pakistani tech founders.",
        user: { username: "Zainab Malik", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
        createdAt: "2026-08-10"
      },
      {
        id: 2,
        rating: 5,
        comment: "Expo Centre Lahore is the best venue for tech conferences. Smooth parking and solid workshops.",
        user: { username: "Hamza Tariq", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
        createdAt: "2026-08-14"
      }
    ]
  },
  {
    id: 2,
    title: "Lahore Sufi & Qawwali Night: Tribute to Sabri & Nusrat",
    slug: "lahore-sufi-qawwali-night",
    categoryId: 2,
    categorySlug: "music",
    category: "Music & Qawwali Nights",
    categoryColor: "#8b5cf6",
    categoryIcon: "fa-guitar",
    shortDescription: "An enchanting evening of classical Sufi poetry, soulful harmonium melodies, and live qawwali under the stars at Alhamra.",
    fullDescription: "Experience the profound spiritual heritage of Punjab and Sindh at the historic Alhamra Open Air Theatre in Lahore. Featuring acclaimed classical virtuosos alongside contemporary Coke Studio guest performers for a 4-hour live acoustic session.\n\nTraditional Kashmiri chai and jalebis will be served during intermission. Family seating and dedicated student enclosures are arranged.",
    description: "An enchanting evening of classical Sufi poetry, soulful harmonium melodies, and live qawwali under the stars at Alhamra.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "Alhamra Open Air Cultural Complex",
    venueName: "Alhamra Open Air Cultural Complex",
    address: "Gaddafi Stadium Cultural Wing, Ferozepur Road",
    city: "Lahore",
    province: "Punjab",
    lat: 31.5126,
    lng: 74.3352,
    latitude: 31.5126,
    longitude: 74.3352,
    date: "2026-09-20",
    eventDate: "2026-09-20",
    time: "07:30 PM",
    startTime: "19:30:00",
    endTime: "23:30:00",
    isFree: false,
    priceValue: 3500,
    price: "Rs. 3,500",
    featured: true,
    isFeatured: true,
    status: "approved",
    organizerName: "Punjab Arts & Culture Council",
    organizerEmail: "events@alhamra.punjab.gov.pk",
    organizerPhone: "+92 42 9920 0918",
    rsvpCount: 512,
    capacity: 800,
    reviews: [
      {
        id: 3,
        rating: 5,
        comment: "Unmatched spiritual ambiance! Alhamra's open-air acoustic setting with live Sufi kalam is pure magic.",
        user: { username: "Bilal Chaudhry", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
        createdAt: "2026-08-20"
      }
    ]
  },
  {
    id: 3,
    title: "Karachi Sea View 10K Peace Marathon 2026",
    slug: "karachi-sea-view-10k-peace-marathon",
    categoryId: 3,
    categorySlug: "sports",
    category: "Sports & Marathon Runs",
    categoryColor: "#10b981",
    categoryIcon: "fa-person-running",
    shortDescription: "Scenic coastal morning marathon along Clifton Sea View promenade supporting youth fitness and charity in Sindh.",
    fullDescription: "Lace up your running shoes for Karachi's biggest sunrise road race! Run along the Arabian Sea breeze from Beach View Park to Chunky Monkey Clifton and back.\n\nAll registered runners receive an official moisture-wicking race singlet, timing bib chip, finisher medal, and recovery nutrition pack at the finish village.",
    description: "Scenic coastal morning marathon along Clifton Sea View promenade supporting youth fitness and charity in Sindh.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "Sea View Beach Promenade Clifton",
    venueName: "Sea View Beach Promenade Clifton",
    address: "Beach View Park, Abdul Sattar Edhi Avenue, Clifton Block 4",
    city: "Karachi",
    province: "Sindh",
    lat: 24.7958,
    lng: 67.0345,
    latitude: 24.7958,
    longitude: 67.0345,
    date: "2026-09-28",
    eventDate: "2026-09-28",
    time: "06:00 AM",
    startTime: "06:00:00",
    endTime: "10:30:00",
    isFree: false,
    priceValue: 1500,
    price: "Rs. 1,500",
    featured: true,
    isFeatured: true,
    status: "approved",
    organizerName: "Karachi Runners Community",
    organizerEmail: "marathon@karachirunners.pk",
    organizerPhone: "+92 21 3582 4491",
    rsvpCount: 820,
    capacity: 2000,
    reviews: [
      {
        id: 4,
        rating: 5,
        comment: "Best road race experience in Pakistan. Running alongside the Arabian Sea breeze at sunrise is unforgettable.",
        user: { username: "Dr. Aliya Shah", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" },
        createdAt: "2026-08-25"
      }
    ]
  },
  {
    id: 4,
    title: "Lok Virsa Heritage & Folk Craft Festival",
    slug: "lok-virsa-heritage-folk-craft-festival",
    categoryId: 4,
    categorySlug: "art-culture",
    category: "Art, Culture & Heritage",
    categoryColor: "#ec4899",
    categoryIcon: "fa-palette",
    shortDescription: "Celebrate indigenous artisans, truck art masters, live pottery wheel demos, and regional cuisine at Shakarparian.",
    fullDescription: "A 3-day vibrant showcase celebrating the diverse living traditions of Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan, and Azad Kashmir.\n\nExplore interactive craft pavilions, live block printing masterclasses, traditional Rabab and Dhol performances, and authentic regional culinary streets.",
    description: "Celebrate indigenous artisans, truck art masters, live pottery wheel demos, and regional cuisine at Shakarparian.",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "Lok Virsa Heritage Museum",
    venueName: "Lok Virsa Heritage Museum",
    address: "Garden Avenue, Shakarparian Hills",
    city: "Islamabad",
    province: "ICT",
    lat: 33.6938,
    lng: 73.0682,
    latitude: 33.6938,
    longitude: 73.0682,
    date: "2026-10-05",
    eventDate: "2026-10-05",
    time: "11:00 AM",
    startTime: "11:00:00",
    endTime: "21:00:00",
    isFree: false,
    priceValue: 500,
    price: "Rs. 500",
    featured: false,
    isFeatured: false,
    status: "approved",
    organizerName: "National Heritage & Culture Division",
    organizerEmail: "info@lokvirsa.org.pk",
    organizerPhone: "+92 51 9249 200",
    rsvpCount: 420,
    capacity: 3000,
    reviews: [
      {
        id: 5,
        rating: 5,
        comment: "A magnificent display of Pakistani craftsmanship. Loved the live truck art and handmade ceramics.",
        user: { username: "Fatima Noor", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
        createdAt: "2026-09-01"
      }
    ]
  },
  {
    id: 5,
    title: "Karachi Eat & Food Fest 2026",
    slug: "karachi-eat-food-fest-2026",
    categoryId: 5,
    categorySlug: "food-drink",
    category: "Food Street & Chai Fests",
    categoryColor: "#f59e0b",
    categoryIcon: "fa-utensils",
    shortDescription: "Over 90 artisanal food stalls, sizzling chapli kebabs, Karachi biryani cook-offs, and live musical bands at Beach View Park.",
    fullDescription: "The biggest gastronomic festival in Pakistan returns! Sample signature fusion dishes, street style bun kebabs, gourmet desserts, specialty cold brews, and fiery BBQ from top culinary innovators across Karachi.\n\nEnjoy family dining lawns and evening pop-rock performances.",
    description: "Over 90 artisanal food stalls, sizzling chapli kebabs, Karachi biryani cook-offs, and live musical bands at Beach View Park.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "Beach View Park Clifton",
    venueName: "Beach View Park Clifton",
    address: "Sea View Road, Block 3, Clifton",
    city: "Karachi",
    province: "Sindh",
    lat: 24.8083,
    lng: 67.0289,
    latitude: 24.8083,
    longitude: 67.0289,
    date: "2026-10-12",
    eventDate: "2026-10-12",
    time: "02:00 PM",
    startTime: "14:00:00",
    endTime: "23:00:00",
    isFree: false,
    priceValue: 1000,
    price: "Rs. 1,000",
    featured: true,
    isFeatured: true,
    status: "approved",
    organizerName: "Eat Festival Pakistan",
    organizerEmail: "team@karachieat.com",
    organizerPhone: "+92 21 3530 8911",
    rsvpCount: 950,
    capacity: 5000,
    reviews: []
  },
  {
    id: 6,
    title: "Margalla Hills Reforestation & Clean Drive",
    slug: "margalla-hills-reforestation-clean-drive",
    categoryId: 6,
    categorySlug: "community",
    category: "Community & Green Drives",
    categoryColor: "#3b82f6",
    categoryIcon: "fa-handshake-angle",
    shortDescription: "Volunteer trail cleanup and indigenous pine tree planting drive on Trail 3 & 5 supporting Clean Green Pakistan.",
    fullDescription: "Give back to Islamabad's iconic national park! Join fellow nature enthusiasts for a morning tree planting expedition followed by trail conservation and plastic collection.\n\nTree saplings, gardening gloves, water bottles, and eco-certificates will be provided to all registered volunteers.",
    description: "Volunteer trail cleanup and indigenous pine tree planting drive on Trail 3 & 5 supporting Clean Green Pakistan.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "Margalla Trail 3 Parking Hub",
    venueName: "Margalla Trail 3 Parking Hub",
    address: "Margalla Road, Sector F-6 / E-7 Base",
    city: "Islamabad",
    province: "ICT",
    lat: 33.7431,
    lng: 73.0645,
    latitude: 33.7431,
    longitude: 73.0645,
    date: "2026-10-18",
    eventDate: "2026-10-18",
    time: "07:30 AM",
    startTime: "07:30:00",
    endTime: "12:00:00",
    isFree: true,
    priceValue: 0,
    price: "Free Entry",
    featured: false,
    isFeatured: false,
    status: "approved",
    organizerName: "Green Pakistan Youth Volunteer Corps",
    organizerEmail: "volunteer@cleanpakistan.org",
    organizerPhone: "+92 51 2871 144",
    rsvpCount: 280,
    capacity: 500,
    reviews: []
  },
  {
    id: 7,
    title: "NUST National Web3 & Cyber Security Sprint",
    slug: "nust-national-web3-cyber-sprint",
    categoryId: 1,
    categorySlug: "technology",
    category: "Technology & Hackathons",
    categoryColor: "#06b6d4",
    categoryIcon: "fa-microchip",
    shortDescription: "Inter-university ethical hacking CTF, blockchain smart contract security sprints, and cybersecurity career fair.",
    fullDescription: "Hosted at NUST SEECS in Islamabad. Teams from top Pakistani universities compete in real-world red-team/blue-team cyber defense challenges, vulnerability analysis, and zero-knowledge proof cryptography.\n\nIndustry partners include premier Pakistani telecom and cyber audit organizations.",
    description: "Inter-university ethical hacking CTF, blockchain smart contract security sprints, and cybersecurity career fair.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "NUST Main Campus (SEECS)",
    venueName: "NUST Main Campus (SEECS)",
    address: "Sector H-12, Kashmir Highway",
    city: "Islamabad",
    province: "ICT",
    lat: 33.6425,
    lng: 72.9904,
    latitude: 33.6425,
    longitude: 72.9904,
    date: "2026-10-24",
    eventDate: "2026-10-24",
    time: "09:30 AM",
    startTime: "09:30:00",
    endTime: "17:30:00",
    isFree: false,
    priceValue: 1200,
    price: "Rs. 1,200",
    featured: false,
    isFeatured: false,
    status: "approved",
    organizerName: "NUST Cyber Security Society",
    organizerEmail: "cyber@seecs.edu.pk",
    organizerPhone: "+92 51 9085 2000",
    rsvpCount: 310,
    capacity: 600,
    reviews: []
  },
  {
    id: 8,
    title: "Peshawar Qissa Khwani Cultural & Literary Dialogue",
    slug: "peshawar-qissa-khwani-cultural-dialogue",
    categoryId: 4,
    categorySlug: "art-culture",
    category: "Art, Culture & Heritage",
    categoryColor: "#ec4899",
    categoryIcon: "fa-palette",
    shortDescription: "Storytelling traditions of historic Qissa Khwani bazaar, Pashto poetry recitals, and vintage photography archives.",
    fullDescription: "Step into the timeless narrative heritage of Peshawar at the historical Gor Gathree complex. Renowned scholars, poets, and folklorists discuss centuries of Central Asian and Gandhara trade routes, traditional storytelling, and living preservation.\n\nIncludes Peshawari green tea (Qahwa) with cardamom and traditional sweets.",
    description: "Storytelling traditions of historic Qissa Khwani bazaar, Pashto poetry recitals, and vintage photography archives.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80"
    ],
    venue: "Gor Gathree Heritage Complex",
    venueName: "Gor Gathree Heritage Complex",
    address: "City Circular Road, Old Walled City",
    city: "Peshawar",
    province: "Khyber Pakhtunkhwa",
    lat: 34.0151,
    lng: 71.5805,
    latitude: 34.0151,
    longitude: 71.5805,
    date: "2026-11-02",
    eventDate: "2026-11-02",
    time: "03:00 PM",
    startTime: "15:00:00",
    endTime: "20:00:00",
    isFree: true,
    priceValue: 0,
    price: "Free Entry",
    featured: false,
    isFeatured: false,
    status: "approved",
    organizerName: "KP Tourism & Heritage Board",
    organizerEmail: "info@kptourism.gov.pk",
    organizerPhone: "+92 91 9211 091",
    rsvpCount: 195,
    capacity: 400,
    reviews: []
  }
];

// In-memory global store to guarantee consistent state in runtime & fallback
declare global {
  var __EVENT_STORE__: EventItem[] | undefined;
  var __USER_RSVPS__: { userId: string; eventId: number | string; ticketsCount: number; createdAt: string }[] | undefined;
  var __USER_FAVORITES__: { userId: string; eventId: number | string; createdAt: string }[] | undefined;
}

function getStore(): EventItem[] {
  if (!globalThis.__EVENT_STORE__) {
    globalThis.__EVENT_STORE__ = JSON.parse(JSON.stringify(initialEvents));
  }
  return globalThis.__EVENT_STORE__!;
}

function getRsvpsStore() {
  if (!globalThis.__USER_RSVPS__) {
    globalThis.__USER_RSVPS__ = [
      { userId: "1", eventId: 1, ticketsCount: 2, createdAt: new Date().toISOString() },
      { userId: "1", eventId: 2, ticketsCount: 1, createdAt: new Date().toISOString() }
    ];
  }
  return globalThis.__USER_RSVPS__!;
}

function getFavoritesStore() {
  if (!globalThis.__USER_FAVORITES__) {
    globalThis.__USER_FAVORITES__ = [
      { userId: "1", eventId: 2, createdAt: new Date().toISOString() },
      { userId: "1", eventId: 3, createdAt: new Date().toISOString() }
    ];
  }
  return globalThis.__USER_FAVORITES__!;
}

function toEvent(row: any, base: string): EventItem {
  const d = row.attributes ?? row;
  const media = d.coverImage?.url ?? d.image?.url ?? d.imageUrl ?? d.image;
  const cat = d.category?.data?.attributes ?? d.category?.attributes ?? d.category ?? {};
  const reviewData = d.reviews?.data ?? d.reviews ?? [];
  const catSlug = cat.slug ?? d.categorySlug ?? "technology";
  const matchedCat = categories.find(c => c.slug === catSlug) || categories[0];

  return {
    id: row.id,
    documentId: row.documentId ?? d.documentId,
    slug: d.slug,
    title: d.title,
    category: cat.name ?? matchedCat.name,
    categorySlug: catSlug,
    categoryId: matchedCat.id as number,
    categoryColor: cat.color ?? matchedCat.color,
    categoryIcon: cat.icon ?? matchedCat.icon,
    city: d.city,
    venue: d.venueName ?? d.venue ?? "Venue in Pakistan",
    venueName: d.venueName ?? d.venue,
    address: d.address ?? `${d.venueName ?? d.venue}, ${d.city}`,
    province: d.province ?? "Pakistan",
    date: d.eventDate ?? d.date,
    eventDate: d.eventDate ?? d.date,
    time: d.startTime ? `${d.startTime.slice(0, 5)} PKT` : (d.time ?? "18:00 PKT"),
    startTime: d.startTime ?? "18:00:00",
    endTime: d.endTime ?? "21:30:00",
    price: d.isFree ? "Free Entry" : `Rs. ${Number(d.price ?? d.priceValue ?? 0).toLocaleString("en-PK")}`,
    priceValue: Number(d.price ?? d.priceValue ?? 0),
    isFree: d.isFree ?? (Number(d.price ?? 0) === 0),
    image: media ? (String(media).startsWith("http") ? media : `${base}${media}`) : matchedCat.image ?? initialEvents[0].image,
    gallery: d.gallery?.map((g: any) => g.url ? (String(g.url).startsWith("http") ? g.url : `${base}${g.url}`) : g) ?? [media ? (String(media).startsWith("http") ? media : `${base}${media}`) : initialEvents[0].image],
    shortDescription: d.shortDescription ?? d.description?.slice(0, 160),
    description: d.description ?? d.shortDescription ?? "",
    fullDescription: d.fullDescription ?? d.description ?? d.shortDescription ?? "",
    featured: d.featured ?? d.isFeatured ?? false,
    isFeatured: d.featured ?? d.isFeatured ?? false,
    status: d.moderationStatus ?? d.status ?? "approved",
    capacity: d.capacity ?? 500,
    rsvpCount: d.rsvp_count ?? d.rsvpCount ?? 120,
    organizerName: d.organizerName ?? "EventDiscovery Pakistan Community",
    organizerEmail: d.organizerEmail ?? "community@eventdiscovery.pk",
    organizerPhone: d.organizerPhone ?? "+92 300 0000000",
    lat: Number(d.latitude ?? d.lat) || 31.5204,
    lng: Number(d.longitude ?? d.lng) || 74.3587,
    latitude: Number(d.latitude ?? d.lat) || 31.5204,
    longitude: Number(d.longitude ?? d.lng) || 74.3587,
    reviews: reviewData.map((r: any) => {
      const x = r.attributes ?? r;
      return {
        id: r.id,
        rating: x.rating,
        comment: x.comment,
        user: x.user?.data?.attributes ?? x.user ?? { username: x.userName ?? "Community Member" },
        createdAt: x.createdAt
      };
    })
  };
}

export async function getEvents(options: { includePending?: boolean; category?: string; city?: string; search?: string } = {}): Promise<EventItem[]> {
  const base = process.env.STRAPI_URL;
  let items: EventItem[] = [];

  if (base) {
    try {
      const queryParams: Record<string, string> = {
        populate: "*",
        "sort[0]": "eventDate:asc",
        "pagination[pageSize]": "100"
      };
      if (!options.includePending) {
        queryParams["filters[moderationStatus][$notIn][0]"] = "pending";
        queryParams["filters[moderationStatus][$notIn][1]"] = "rejected";
      }
      const query = new URLSearchParams(queryParams);
      const res = await fetch(`${base}/api/events?${query}`, { next: { revalidate: 30 } });
      if (res.ok) {
        const json = await res.json();
        const rows = json.data ?? [];
        if (rows.length > 0) {
          items = rows.map((row: any) => toEvent(row, base));
        }
      }
    } catch {
      // Fallback
    }
  }

  if (items.length === 0) {
    items = JSON.parse(JSON.stringify(getStore()));
    if (!options.includePending) {
      items = items.filter(e => e.status !== "pending" && e.status !== "rejected" && e.status !== "deleted");
    }
  }

  if (options.category) {
    items = items.filter(e => e.categorySlug.toLowerCase() === options.category!.toLowerCase());
  }
  if (options.city) {
    items = items.filter(e => e.city.toLowerCase() === options.city!.toLowerCase());
  }
  if (options.search) {
    const q = options.search.toLowerCase();
    items = items.filter(e =>
      [e.title, e.category, e.city, e.venue, e.venueName, e.shortDescription, e.description, e.organizerName]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }

  return items;
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const list = await getEvents({ includePending: true });
  return list.find(e => e.slug === slug) || null;
}

export async function getEventById(id: number | string): Promise<EventItem | null> {
  const list = await getEvents({ includePending: true });
  return list.find(e => String(e.id) === String(id) || e.documentId === String(id)) || null;
}

export async function getCategories(): Promise<EventCategory[]> {
  const base = process.env.STRAPI_URL;
  if (base) {
    try {
      const res = await fetch(`${base}/api/categories?${new URLSearchParams({ "pagination[pageSize]": "100" })}`, {
        next: { revalidate: 300 }
      });
      if (res.ok) {
        const data = await res.json();
        const rows = data.data ?? [];
        if (rows.length) {
          return rows.map((r: any) => {
            const d = r.attributes ?? r;
            const matched = categories.find(c => c.slug === d.slug);
            return {
              id: r.documentId ?? r.id,
              name: d.name,
              slug: d.slug,
              icon: d.icon || matched?.icon || "fa-layer-group",
              color: d.color || matched?.color || "#6366f1",
              gradient: matched?.gradient,
              description: matched?.description,
              image: matched?.image
            };
          });
        }
      }
    } catch {
      // Fallback
    }
  }
  return categories;
}

// Data manipulation helpers with local state update
export async function createEventSubmission(payload: any): Promise<EventItem> {
  const store = getStore();
  const cat = categories.find(c => String(c.id) === String(payload.category_id) || c.slug === payload.categorySlug || c.name === payload.category) || categories[0];
  const newId = store.length ? Math.max(...store.map(e => Number(e.id) || 0)) + 1 : 1;
  const slug = payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const newEvent: EventItem = {
    id: newId,
    documentId: `doc-${newId}-${Date.now()}`,
    slug,
    title: payload.title,
    categoryId: cat.id as number,
    categorySlug: cat.slug,
    category: cat.name,
    categoryColor: cat.color,
    categoryIcon: cat.icon,
    shortDescription: payload.short_description || payload.shortDescription || payload.description?.slice(0, 150),
    fullDescription: payload.full_description || payload.fullDescription || payload.description,
    description: payload.short_description || payload.description || "",
    image: payload.image || cat.image || initialEvents[0].image,
    gallery: [payload.image || cat.image || initialEvents[0].image],
    venue: payload.venue_name || payload.venue || "Selected Venue",
    venueName: payload.venue_name || payload.venue || "Selected Venue",
    address: payload.address || `${payload.venue_name || payload.venue}, ${payload.city}`,
    city: payload.city || "Lahore",
    province: payload.province || "Pakistan",
    lat: Number(payload.latitude || payload.lat) || 31.5204,
    lng: Number(payload.longitude || payload.lng) || 74.3587,
    latitude: Number(payload.latitude || payload.lat) || 31.5204,
    longitude: Number(payload.longitude || payload.lng) || 74.3587,
    date: payload.event_date || payload.date || new Date().toISOString().slice(0, 10),
    eventDate: payload.event_date || payload.date || new Date().toISOString().slice(0, 10),
    time: payload.start_time ? `${payload.start_time.slice(0, 5)} PKT` : "18:00 PKT",
    startTime: payload.start_time || "18:00:00",
    endTime: payload.end_time || "21:30:00",
    isFree: payload.ticket_type === "free" || payload.isFree || payload.price == 0,
    priceValue: Number(payload.price || 0),
    price: (payload.ticket_type === "free" || payload.isFree || payload.price == 0) ? "Free Entry" : `Rs. ${Number(payload.price || 0).toLocaleString("en-PK")}`,
    featured: false,
    isFeatured: false,
    status: "pending",
    organizerName: payload.organizer_name || payload.organizerName || "Community Member",
    organizerEmail: payload.organizer_email || payload.organizerEmail || "host@eventdiscovery.pk",
    organizerPhone: payload.organizer_phone || payload.organizerPhone || "+92 300 0000000",
    capacity: Number(payload.capacity || 250),
    rsvpCount: 0,
    reviews: []
  };

  store.unshift(newEvent);
  return newEvent;
}

export async function approveEvent(id: number | string): Promise<boolean> {
  const store = getStore();
  const event = store.find(e => String(e.id) === String(id) || e.documentId === String(id));
  if (event) {
    event.status = "approved";
    return true;
  }
  return false;
}

export async function rejectEvent(id: number | string): Promise<boolean> {
  const store = getStore();
  const event = store.find(e => String(e.id) === String(id) || e.documentId === String(id));
  if (event) {
    event.status = "rejected";
    return true;
  }
  return false;
}

export async function toggleFeatured(id: number | string): Promise<boolean> {
  const store = getStore();
  const event = store.find(e => String(e.id) === String(id) || e.documentId === String(id));
  if (event) {
    event.featured = !event.featured;
    event.isFeatured = event.featured;
    return event.featured;
  }
  return false;
}

export async function deleteEvent(id: number | string): Promise<boolean> {
  const store = getStore();
  const idx = store.findIndex(e => String(e.id) === String(id) || e.documentId === String(id));
  if (idx !== -1) {
    store[idx].status = "deleted";
    return true;
  }
  return false;
}

export async function getAdminStats() {
  const store = getStore().filter(e => e.status !== "deleted");
  const pending = store.filter(e => e.status === "pending");
  let totalRsvps = 0;
  let revenue = 0;

  store.forEach(e => {
    const count = e.rsvpCount || 0;
    totalRsvps += count;
    if (!e.isFree && e.priceValue) {
      revenue += count * Number(e.priceValue);
    }
  });

  return {
    totalEvents: store.length,
    pendingApprovals: pending.length,
    totalRsvps,
    estimatedRevenue: revenue
  };
}

export async function getUserRsvps(userId: string) {
  const rsvps = getRsvpsStore().filter(r => r.userId === userId);
  const store = getStore();
  return rsvps.map(r => {
    const event = store.find(e => String(e.id) === String(r.eventId) || e.documentId === String(r.eventId)) || store[0];
    return {
      id: `${r.userId}-${r.eventId}`,
      ticketsCount: r.ticketsCount,
      createdAt: r.createdAt,
      event
    };
  });
}

export async function toggleRsvp(userId: string, eventId: number | string, ticketsCount: number = 1) {
  const rsvps = getRsvpsStore();
  const idx = rsvps.findIndex(r => r.userId === userId && String(r.eventId) === String(eventId));
  const store = getStore();
  const event = store.find(e => String(e.id) === String(eventId) || e.documentId === String(eventId));

  if (idx !== -1) {
    rsvps.splice(idx, 1);
    if (event && (event.rsvpCount || 0) > 0) event.rsvpCount = (event.rsvpCount || 1) - 1;
    return { active: false };
  } else {
    rsvps.push({ userId, eventId, ticketsCount, createdAt: new Date().toISOString() });
    if (event) event.rsvpCount = (event.rsvpCount || 0) + ticketsCount;
    return { active: true, ticketsCount };
  }
}

export async function getUserFavorites(userId: string) {
  const favs = getFavoritesStore().filter(f => f.userId === userId);
  const store = getStore();
  return favs.map(f => {
    const event = store.find(e => String(e.id) === String(f.eventId) || e.documentId === String(f.eventId)) || store[0];
    return {
      id: `${f.userId}-${f.eventId}`,
      createdAt: f.createdAt,
      event
    };
  });
}

export async function toggleFavorite(userId: string, eventId: number | string) {
  const favs = getFavoritesStore();
  const idx = favs.findIndex(f => f.userId === userId && String(f.eventId) === String(eventId));
  if (idx !== -1) {
    favs.splice(idx, 1);
    return { bookmarked: false };
  } else {
    favs.push({ userId, eventId, createdAt: new Date().toISOString() });
    return { bookmarked: true };
  }
}

export async function addReview(eventId: number | string, review: { rating: number; comment: string; userName: string; avatar?: string }) {
  const store = getStore();
  const event = store.find(e => String(e.id) === String(eventId) || e.documentId === String(eventId));
  if (event) {
    if (!event.reviews) event.reviews = [];
    const newRev: EventReview = {
      id: event.reviews.length + 1,
      rating: review.rating,
      comment: review.comment,
      userName: review.userName,
      user: { username: review.userName, avatar: review.avatar },
      createdAt: new Date().toISOString().slice(0, 10)
    };
    event.reviews.unshift(newRev);
    return newRev;
  }
  return null;
}
