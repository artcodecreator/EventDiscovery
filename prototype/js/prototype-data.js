/**
 * EventDiscovery (Pakistan Edition 🇵🇰) - Prototype Mock Database
 * Contains categories, events, and reviews dataset for static prototype.
 */

const PROTOTYPE_CATEGORIES = [
    {
        id: 1,
        slug: 'technology',
        name: 'Technology & Hackathons',
        description: 'AI conclaves, web3 sprints, developer summits, and robotics expos in Pakistani tech hubs.',
        icon: 'fa-microchip',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 2,
        slug: 'music',
        name: 'Music & Qawwali Nights',
        description: 'Sufi fusion, Coke Studio guest artists, acoustic sitar recitals, and indie live performances.',
        icon: 'fa-guitar',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        slug: 'sports',
        name: 'Sports & Marathon Runs',
        description: 'Karachi Sea View 10K peace runs, Margalla Trail challenges, and community cricket leagues.',
        icon: 'fa-person-running',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 4,
        slug: 'art-culture',
        name: 'Art, Culture & Heritage',
        description: 'Lok Virsa truck art workshops, Arabic calligraphy exhibitions, and theatrical literature fests.',
        icon: 'fa-palette',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 5,
        slug: 'food-drink',
        name: 'Food Street & Chai Fests',
        description: 'Karachi Eat food festivals, Lahore Fort Road BBQ nights, and specialty matka chai sessions.',
        icon: 'fa-utensils',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 6,
        slug: 'community',
        name: 'Community & Green Drives',
        description: 'Margalla Hills reforestation campaigns, Clean & Green Pakistan drives, and youth blood camps.',
        icon: 'fa-handshake-angle',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 7,
        slug: 'health-wellness',
        name: 'Health, Yoga & Wellness',
        description: 'Shakarparian morning mindfulness, mental health summits, and fitness bootcamps in Pakistan.',
        icon: 'fa-spa',
        color: '#14b8a6',
        gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80'
    }
];

const PROTOTYPE_EVENTS = [
    {
        id: 1,
        title: "Pakistan AI & Web3 Conclave 2026",
        slug: "pakistan-ai-web3-conclave-2026",
        category_id: 1,
        category_slug: "technology",
        category_name: "Technology & Hackathons",
        category_color: "#06b6d4",
        category_icon: "fa-microchip",
        short_description: "Pakistan's flagship artificial intelligence summit, hands-on LLM workshops, and startup investor networking at Expo Centre Lahore.",
        full_description: "Join over 1,500 software engineers, AI researchers, founders, and students at the premier technology gathering in Pakistan. Featuring keynote talks by leading global AI practitioners, dedicated breakout sessions on Generative AI, Web3 governance, Pakistani Fintech infrastructure, and a grand 24-hour hackathon with cash prizes up to PKR 1,000,000.\n\nAttendees will receive official digital credentials, complimentary high-tea, networking dinner access, and direct recruitment fast-tracks with top Pakistani tech firms.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "Expo Centre Lahore",
        address: "Hall 1 & 2, Abdul Haque Rd, Johar Town",
        city: "Lahore",
        latitude: 31.4687,
        longitude: 74.2754,
        event_date: "2026-09-15",
        start_time: "09:00:00",
        end_time: "18:00:00",
        is_free: false,
        price: 2500,
        is_featured: true,
        organizer_name: "Tech Pakistan Society",
        organizer_email: "contact@techpakistan.pk",
        organizer_phone: "+92 42 3587 9011",
        rsvp_count: 342,
        capacity: 1500
    },
    {
        id: 2,
        title: "Lahore Sufi & Qawwali Night: Tribute to Sabri & Nusrat",
        slug: "lahore-sufi-qawwali-night",
        category_id: 2,
        category_slug: "music",
        category_name: "Music & Qawwali Nights",
        category_color: "#8b5cf6",
        category_icon: "fa-guitar",
        short_description: "An enchanting evening of classical Sufi poetry, soulful harmonium melodies, and live qawwali under the stars at Alhamra.",
        full_description: "Experience the profound spiritual heritage of Punjab and Sindh at the historic Alhamra Open Air Theatre in Lahore. Featuring acclaimed classical virtuosos alongside contemporary Coke Studio guest performers for a 4-hour live acoustic session.\n\nTraditional Kashmiri chai and jalebis will be served during intermission. Family seating and dedicated student enclosures are arranged.",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "Alhamra Open Air Cultural Complex",
        address: "Gaddafi Stadium Cultural Wing, Ferozepur Road",
        city: "Lahore",
        latitude: 31.5126,
        longitude: 74.3352,
        event_date: "2026-09-20",
        start_time: "19:30:00",
        end_time: "23:30:00",
        is_free: false,
        price: 3500,
        is_featured: true,
        organizer_name: "Punjab Arts & Culture Council",
        organizer_email: "events@alhamra.punjab.gov.pk",
        organizer_phone: "+92 42 9920 0918",
        rsvp_count: 512,
        capacity: 800
    },
    {
        id: 3,
        title: "Karachi Sea View 10K Peace Marathon 2026",
        slug: "karachi-sea-view-10k-peace-marathon",
        category_id: 3,
        category_slug: "sports",
        category_name: "Sports & Marathon Runs",
        category_color: "#10b981",
        category_icon: "fa-person-running",
        short_description: "Scenic coastal morning marathon along Clifton Sea View promenade supporting youth fitness and charity in Sindh.",
        full_description: "Lace up your running shoes for Karachi's biggest sunrise road race! Run along the Arabian Sea breeze from Beach View Park to Chunky Monkey Clifton and back.\n\nAll registered runners receive an official moisture-wicking race singlet, timing bib chip, finisher medal, and recovery nutrition pack at the finish village.",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "Sea View Beach Promenade Clifton",
        address: "Beach View Park, Abdul Sattar Edhi Avenue, Clifton Block 4",
        city: "Karachi",
        latitude: 24.7958,
        longitude: 67.0345,
        event_date: "2026-09-28",
        start_time: "06:00:00",
        end_time: "10:30:00",
        is_free: false,
        price: 1500,
        is_featured: true,
        organizer_name: "Karachi Runners Community",
        organizer_email: "marathon@karachirunners.pk",
        organizer_phone: "+92 21 3582 4491",
        rsvp_count: 820,
        capacity: 2000
    },
    {
        id: 4,
        title: "Lok Virsa Heritage & Folk Craft Festival",
        slug: "lok-virsa-heritage-folk-craft-festival",
        category_id: 4,
        category_slug: "art-culture",
        category_name: "Art, Culture & Heritage",
        category_color: "#ec4899",
        category_icon: "fa-palette",
        short_description: "Celebrate indigenous artisans, truck art masters, live pottery wheel demos, and regional cuisine at Shakarparian.",
        full_description: "A 3-day vibrant showcase celebrating the diverse living traditions of Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan, and Azad Kashmir.\n\nExplore interactive craft pavilions, live block printing masterclasses, traditional Rabab and Dhol performances, and authentic regional culinary streets.",
        image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "Lok Virsa Heritage Museum",
        address: "Garden Avenue, Shakarparian Hills",
        city: "Islamabad",
        latitude: 33.6938,
        longitude: 73.0682,
        event_date: "2026-10-05",
        start_time: "11:00:00",
        end_time: "21:00:00",
        is_free: false,
        price: 500,
        is_featured: false,
        organizer_name: "National Heritage & Culture Division",
        organizer_email: "info@lokvirsa.org.pk",
        organizer_phone: "+92 51 9249 200",
        rsvp_count: 420,
        capacity: 3000
    },
    {
        id: 5,
        title: "Karachi Eat & Food Fest 2026",
        slug: "karachi-eat-food-fest-2026",
        category_id: 5,
        category_slug: "food-drink",
        category_name: "Food Street & Chai Fests",
        category_color: "#f59e0b",
        category_icon: "fa-utensils",
        short_description: "Over 90 artisanal food stalls, sizzling chapli kebabs, Karachi biryani cook-offs, and live musical bands at Beach View Park.",
        full_description: "The biggest gastronomic festival in Pakistan returns! Sample signature fusion dishes, street style bun kebabs, gourmet desserts, specialty cold brews, and fiery BBQ from top culinary innovators across Karachi.\n\nEnjoy family dining lawns and evening pop-rock performances.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "Beach View Park Clifton",
        address: "Sea View Road, Block 3, Clifton",
        city: "Karachi",
        latitude: 24.8083,
        longitude: 67.0289,
        event_date: "2026-10-12",
        start_time: "14:00:00",
        end_time: "23:00:00",
        is_free: false,
        price: 1000,
        is_featured: true,
        organizer_name: "Eat Festival Pakistan",
        organizer_email: "team@karachieat.com",
        organizer_phone: "+92 21 3530 8911",
        rsvp_count: 950,
        capacity: 5000
    },
    {
        id: 6,
        title: "Margalla Hills Reforestation & Clean Drive",
        slug: "margalla-hills-reforestation-clean-drive",
        category_id: 6,
        category_slug: "community",
        category_name: "Community & Green Drives",
        category_color: "#3b82f6",
        category_icon: "fa-handshake-angle",
        short_description: "Volunteer trail cleanup and indigenous pine tree planting drive on Trail 3 & 5 supporting Clean Green Pakistan.",
        full_description: "Give back to Islamabad's iconic national park! Join fellow nature enthusiasts for a morning tree planting expedition followed by trail conservation and plastic collection.\n\nTree saplings, gardening gloves, water bottles, and eco-certificates will be provided to all registered volunteers.",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "Margalla Trail 3 Parking Hub",
        address: "Margalla Road, Sector F-6 / E-7 Base",
        city: "Islamabad",
        latitude: 33.7431,
        longitude: 73.0645,
        event_date: "2026-10-18",
        start_time: "07:30:00",
        end_time: "12:00:00",
        is_free: true,
        price: 0,
        is_featured: false,
        organizer_name: "Green Pakistan Youth Volunteer Corps",
        organizer_email: "volunteer@cleanpakistan.org",
        organizer_phone: "+92 51 2871 144",
        rsvp_count: 280,
        capacity: 500
    },
    {
        id: 7,
        title: "NUST National Web3 & Cyber Security Sprint",
        slug: "nust-national-web3-cyber-sprint",
        category_id: 1,
        category_slug: "technology",
        category_name: "Technology & Hackathons",
        category_color: "#06b6d4",
        category_icon: "fa-microchip",
        short_description: "Inter-university ethical hacking CTF, blockchain smart contract security sprints, and cybersecurity career fair.",
        full_description: "Hosted at NUST SEECS in Islamabad. Teams from top Pakistani universities compete in real-world red-team/blue-team cyber defense challenges, vulnerability analysis, and zero-knowledge proof cryptography.\n\nIndustry partners include premier Pakistani telecom and cyber audit organizations.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "NUST Main Campus (SEECS)",
        address: "Sector H-12, Kashmir Highway",
        city: "Islamabad",
        latitude: 33.6425,
        longitude: 72.9904,
        event_date: "2026-10-24",
        start_time: "09:30:00",
        end_time: "17:30:00",
        is_free: false,
        price: 1200,
        is_featured: false,
        organizer_name: "NUST Cyber Security Society",
        organizer_email: "cyber@seecs.edu.pk",
        organizer_phone: "+92 51 9085 2000",
        rsvp_count: 310,
        capacity: 600
    },
    {
        id: 8,
        title: "Peshawar Qissa Khwani Cultural & Literary Dialogue",
        slug: "peshawar-qissa-khwani-cultural-dialogue",
        category_id: 4,
        category_slug: "art-culture",
        category_name: "Art, Culture & Heritage",
        category_color: "#ec4899",
        category_icon: "fa-palette",
        short_description: "Storytelling traditions of historic Qissa Khwani bazaar, Pashto poetry recitals, and vintage photography archives.",
        full_description: "Step into the timeless narrative heritage of Peshawar at the historical Gor Gathree complex. Renowned scholars, poets, and folklorists discuss centuries of Central Asian and Gandhara trade routes, traditional storytelling, and living preservation.\n\nIncludes Peshawari green tea (Qahwa) with cardamom and traditional sweets.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80"
        ],
        venue_name: "Gor Gathree Heritage Complex",
        address: "City Circular Road, Old Walled City",
        city: "Peshawar",
        latitude: 34.0151,
        longitude: 71.5805,
        event_date: "2026-11-02",
        start_time: "15:00:00",
        end_time: "20:00:00",
        is_free: true,
        price: 0,
        is_featured: false,
        organizer_name: "KP Tourism & Heritage Board",
        organizer_email: "info@kptourism.gov.pk",
        organizer_phone: "+92 91 9211 091",
        rsvp_count: 195,
        capacity: 400
    }
];

const PROTOTYPE_REVIEWS = [
    {
        event_id: 1,
        user_name: "Zainab Malik",
        user_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        rating: 5,
        comment: "The AI workshops and keynote discussions were world-class! Truly elevated the Pakistani tech ecosystem.",
        created_at: "2026-08-10"
    },
    {
        event_id: 1,
        user_name: "Bilal Farooq",
        user_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        rating: 5,
        comment: "Superbly organized at Expo Centre Lahore. Easy parking, great high-tea, and fantastic networking.",
        created_at: "2026-08-12"
    },
    {
        event_id: 2,
        user_name: "Fatima Noor",
        user_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        rating: 5,
        comment: "Unforgettable spiritual vibe at Alhamra. The tribute to Nusrat Fateh Ali Khan moved the entire audience.",
        created_at: "2026-08-05"
    }
];

const PrototypeData = {
    STORAGE_KEYS: {
        CUSTOM_EVENTS: 'eventdiscovery_custom_events',
        REVIEWS: 'eventdiscovery_reviews',
        EVENT_STATUS: 'eventdiscovery_event_status'
    },

    getAllEvents: function() {
        let events = [...PROTOTYPE_EVENTS];
        try {
            const custom = localStorage.getItem(this.STORAGE_KEYS.CUSTOM_EVENTS);
            if (custom) {
                const parsed = JSON.parse(custom);
                if (Array.isArray(parsed)) {
                    events = [...parsed, ...events];
                }
            }

            // Apply any status overrides from admin management
            const statusMap = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EVENT_STATUS) || '{}');
            events = events.map(ev => {
                if (statusMap[ev.id]) {
                    return { ...ev, ...statusMap[ev.id] };
                }
                return { ...ev, status: ev.status || 'approved' };
            });
        } catch (e) {
            console.warn('Error loading custom events from localStorage', e);
        }
        return events;
    },

    getEventById: function(id) {
        const numId = parseInt(id, 10);
        return this.getAllEvents().find(e => e.id === numId);
    },

    getCategories: function() {
        return PROTOTYPE_CATEGORIES;
    },

    getReviews: function(eventId) {
        const numId = parseInt(eventId, 10);
        let reviews = PROTOTYPE_REVIEWS.filter(r => r.event_id === numId);
        try {
            const customReviews = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REVIEWS) || '[]');
            const filteredCustom = customReviews.filter(r => r.event_id === numId);
            reviews = [...filteredCustom, ...reviews];
        } catch (e) {
            console.warn('Error loading custom reviews', e);
        }
        return reviews;
    },

    addReview: function(review) {
        try {
            const customReviews = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REVIEWS) || '[]');
            customReviews.unshift(review);
            localStorage.setItem(this.STORAGE_KEYS.REVIEWS, JSON.stringify(customReviews));
            return true;
        } catch (e) {
            return false;
        }
    },

    addEvent: function(data) {
        try {
            const category = PROTOTYPE_CATEGORIES.find(c => c.id === parseInt(data.category_id, 10)) || PROTOTYPE_CATEGORIES[0];
            const newEvent = {
                id: Date.now(),
                title: data.title,
                slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                category_id: category.id,
                category_slug: category.slug,
                category_name: category.name,
                category_color: category.color,
                category_icon: category.icon,
                short_description: data.short_description,
                full_description: data.full_description,
                image: data.image || category.image,
                gallery: [data.image || category.image],
                venue_name: data.venue_name,
                address: data.address,
                city: data.city || 'Lahore',
                latitude: data.latitude ? parseFloat(data.latitude) : 31.5204,
                longitude: data.longitude ? parseFloat(data.longitude) : 74.3587,
                event_date: data.event_date,
                start_time: data.start_time || '18:00:00',
                end_time: data.end_time || '21:00:00',
                is_free: data.is_free === true || data.is_free === 'true' || Number(data.price) === 0,
                price: Number(data.price) || 0,
                is_featured: false,
                status: 'pending', // Requires admin approval workflow
                organizer_name: data.organizer_name || 'Community Host',
                organizer_email: data.organizer_email || 'host@eventdiscovery.pk',
                organizer_phone: data.organizer_phone || '+92 300 1234567',
                rsvp_count: 0,
                capacity: parseInt(data.capacity, 10) || 100
            };

            const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CUSTOM_EVENTS) || '[]');
            custom.unshift(newEvent);
            localStorage.setItem(this.STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(custom));
            return { success: true, event: newEvent };
        } catch (e) {
            return { success: false, message: e.message };
        }
    },

    updateEventStatus: function(eventId, status) {
        try {
            const statusMap = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EVENT_STATUS) || '{}');
            statusMap[eventId] = { ...(statusMap[eventId] || {}), status: status };
            localStorage.setItem(this.STORAGE_KEYS.EVENT_STATUS, JSON.stringify(statusMap));
            return true;
        } catch (e) {
            return false;
        }
    },

    toggleFeatured: function(eventId) {
        try {
            const current = this.getEventById(eventId);
            if (!current) return false;
            const newFeatured = !current.is_featured;
            const statusMap = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EVENT_STATUS) || '{}');
            statusMap[eventId] = { ...(statusMap[eventId] || {}), is_featured: newFeatured };
            localStorage.setItem(this.STORAGE_KEYS.EVENT_STATUS, JSON.stringify(statusMap));
            return newFeatured;
        } catch (e) {
            return false;
        }
    },

    deleteEvent: function(eventId) {
        try {
            const numId = parseInt(eventId, 10);
            let custom = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CUSTOM_EVENTS) || '[]');
            custom = custom.filter(e => e.id !== numId);
            localStorage.setItem(this.STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(custom));

            const statusMap = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.EVENT_STATUS) || '{}');
            statusMap[numId] = { ...(statusMap[numId] || {}), status: 'deleted' };
            localStorage.setItem(this.STORAGE_KEYS.EVENT_STATUS, JSON.stringify(statusMap));
            return true;
        } catch (e) {
            return false;
        }
    }
};

