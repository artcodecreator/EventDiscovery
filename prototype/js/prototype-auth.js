/**
 * EventDiscovery (Pakistan Edition 🇵🇰) - Prototype Auth & Session Engine
 * Manages user state, dummy authentication, registration, RSVPs, and Favorites via localStorage.
 */

const PrototypeAuth = {
    STORAGE_KEYS: {
        USER: 'eventdiscovery_user',
        RSVPS: 'eventdiscovery_rsvps',
        FAVORITES: 'eventdiscovery_favorites',
        CUSTOM_USERS: 'eventdiscovery_custom_users'
    },

    DEMO_USERS: [
        {
            id: 1,
            name: "Ahmed Khan",
            email: "ahmed.khan@eventdiscovery.pk",
            password: "Demo@1234",
            role: "user",
            city: "Lahore",
            phone: "+92 300 8472911",
            bio: "Tech enthusiast, classical music lover, and frequent attendee at Expo Centre Lahore.",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
        },
        {
            id: 2,
            name: "Hamza Tariq",
            email: "admin@eventdiscovery.pk",
            password: "Demo@1234",
            role: "admin",
            city: "Islamabad",
            phone: "+92 51 2284 900",
            bio: "Official Community & Events Administrator for Pakistan Discovery Hub.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80"
        }
    ],

    /**
     * Get currently logged-in user or null
     */
    getCurrentUser: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.USER);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading current user:', e);
            return null;
        }
    },

    /**
     * Check if user is authenticated
     */
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    },

    /**
     * Authenticate user with email and password
     */
    login: function(email, password) {
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPass = (password || '').trim();

        // 1. Check Demo Accounts
        let found = this.DEMO_USERS.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);

        // 2. Check Custom Registered Accounts
        if (!found) {
            const customUsers = this.getCustomUsers();
            found = customUsers.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
        }

        if (found) {
            // Save current session (excluding password)
            const sessionUser = { ...found };
            delete sessionUser.password;
            localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(sessionUser));

            // Initialize default RSVPs/Favorites for demo user if empty
            if (sessionUser.id === 1 && !localStorage.getItem(this.STORAGE_KEYS.RSVPS)) {
                localStorage.setItem(this.STORAGE_KEYS.RSVPS, JSON.stringify([1, 2]));
            }
            if (sessionUser.id === 1 && !localStorage.getItem(this.STORAGE_KEYS.FAVORITES)) {
                localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify([1, 3, 5]));
            }

            return { success: true, user: sessionUser };
        }

        return { success: false, message: 'Invalid Pakistani email address or password. Try the 1-click demo buttons!' };
    },

    /**
     * Register a new user
     */
    register: function(data) {
        const cleanEmail = (data.email || '').trim().toLowerCase();

        // Check if email already exists
        const allUsers = [...this.DEMO_USERS, ...this.getCustomUsers()];
        if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
            return { success: false, message: 'An account with this email address already exists.' };
        }

        const newUser = {
            id: Date.now(),
            name: data.name.trim(),
            email: cleanEmail,
            password: data.password,
            role: 'user',
            city: data.city || 'Lahore',
            phone: data.phone || '+92 300 0000000',
            bio: 'Active Pakistani community member.',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        };

        const customUsers = this.getCustomUsers();
        customUsers.push(newUser);
        localStorage.setItem(this.STORAGE_KEYS.CUSTOM_USERS, JSON.stringify(customUsers));

        // Auto login
        const sessionUser = { ...newUser };
        delete sessionUser.password;
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(sessionUser));

        return { success: true, user: sessionUser };
    },

    /**
     * Update user profile settings
     */
    updateProfile: function(updatedData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Not logged in.' };

        const updated = {
            ...currentUser,
            name: updatedData.name || currentUser.name,
            city: updatedData.city || currentUser.city,
            phone: updatedData.phone || currentUser.phone,
            bio: updatedData.bio || currentUser.bio
        };

        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(updated));
        return { success: true, user: updated };
    },

    /**
     * Sign out user
     */
    logout: function() {
        localStorage.removeItem(this.STORAGE_KEYS.USER);
    },

    /**
     * Get custom registered users
     */
    getCustomUsers: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.CUSTOM_USERS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Get user's RSVP'd event IDs
     */
    getRsvps: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.RSVPS);
            return data ? JSON.parse(data) : [1, 2];
        } catch (e) {
            return [1, 2];
        }
    },

    /**
     * Toggle / Set RSVP for an event
     */
    toggleRsvp: function(eventId) {
        const id = parseInt(eventId, 10);
        let rsvps = this.getRsvps();
        let isRsvpd = false;

        if (rsvps.includes(id)) {
            rsvps = rsvps.filter(item => item !== id);
            isRsvpd = false;
        } else {
            rsvps.push(id);
            isRsvpd = true;
        }

        localStorage.setItem(this.STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));
        return { success: true, isRsvpd: isRsvpd, count: rsvps.length };
    },

    /**
     * Check if an event is RSVP'd
     */
    isEventRsvpd: function(eventId) {
        const id = parseInt(eventId, 10);
        return this.getRsvps().includes(id);
    },

    /**
     * Get user's favorite event IDs
     */
    getFavorites: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.FAVORITES);
            return data ? JSON.parse(data) : [1, 3, 5];
        } catch (e) {
            return [1, 3, 5];
        }
    },

    /**
     * Toggle Favorite
     */
    toggleFavorite: function(eventId) {
        const id = parseInt(eventId, 10);
        let favs = this.getFavorites();
        let isFav = false;

        if (favs.includes(id)) {
            favs = favs.filter(item => item !== id);
            isFav = false;
        } else {
            favs.push(id);
            isFav = true;
        }

        localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
        return { success: true, isFavorite: isFav, count: favs.length };
    },

    /**
     * Check if an event is favorited
     */
    isEventFavorite: function(eventId) {
        const id = parseInt(eventId, 10);
        return this.getFavorites().includes(id);
    },

    /**
     * Dynamically render navigation bar auth area based on session state
     */
    renderNavbarAuth: function(rootPrefix = '') {
        const authContainer = document.getElementById('navbarAuthArea');
        if (!authContainer) return;

        const user = this.getCurrentUser();
        if (user) {
            authContainer.innerHTML = `
                <div class="dropdown w-100 w-lg-auto">
                    <button class="btn btn-dark-glass dropdown-toggle d-flex align-items-center justify-content-between justify-content-lg-start gap-2 border-0 py-1 px-2 pe-lg-3 w-100 w-lg-auto" type="button" id="userMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <div class="d-flex align-items-center gap-2">
                            <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}" alt="${user.name}" class="rounded-circle nav-avatar">
                            <div class="text-start">
                                <div class="small fw-semibold text-light leading-tight">${user.name.split(' ')[0]}</div>
                                <span class="badge ${user.role === 'admin' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'} py-0 px-1" style="font-size: 0.65rem;">
                                    ${(user.role || 'USER').toUpperCase()} 🇵🇰
                                </span>
                            </div>
                        </div>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-start dropdown-menu-lg-end dropdown-menu-dark shadow-lg border-dark" aria-labelledby="userMenuButton">
                        <li class="px-3 py-2 border-bottom border-dark">
                            <div class="fw-bold text-light">${user.name}</div>
                            <div class="small text-muted text-truncate" style="max-width: 220px;">${user.email}</div>
                        </li>
                        ${user.role === 'admin' ? `
                        <li>
                            <a class="dropdown-item py-2 text-warning fw-semibold" href="${rootPrefix}admin/dashboard.html">
                                <i class="fa-solid fa-shield-halved me-2 text-warning"></i> Admin Management
                            </a>
                        </li>
                        ` : ''}
                        <li>
                            <a class="dropdown-item py-2" href="${rootPrefix}events/create.html">
                                <i class="fa-solid fa-calendar-plus me-2 text-primary"></i> Submit New Event
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item py-2" href="${rootPrefix}user/dashboard.html">
                                <i class="fa-solid fa-gauge-high me-2 text-primary"></i> Dashboard Overview
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item py-2" href="${rootPrefix}user/dashboard.html?tab=rsvps">
                                <i class="fa-solid fa-ticket me-2 text-success"></i> My Event Passes
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item py-2" href="${rootPrefix}user/dashboard.html?tab=favorites">
                                <i class="fa-solid fa-heart me-2 text-danger"></i> Saved Favorites
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item py-2" href="${rootPrefix}user/dashboard.html?tab=profile">
                                <i class="fa-solid fa-user-gear me-2 text-info"></i> Profile Settings
                            </a>
                        </li>
                        <li><hr class="dropdown-divider border-dark"></li>
                        <li>
                            <a class="dropdown-item py-2 text-danger" href="javascript:void(0)" onclick="PrototypeAuth.handleLogout('${rootPrefix}')">
                                <i class="fa-solid fa-right-from-bracket me-2"></i> Sign Out
                            </a>
                        </li>
                    </ul>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <div class="d-flex align-items-center gap-2 w-100 flex-wrap">
                    <a href="${rootPrefix}auth/login.html" class="btn btn-outline-light btn-sm px-3 rounded-pill flex-grow-1 text-center">
                        <i class="fa-solid fa-arrow-right-to-bracket me-1"></i> Sign In
                    </a>
                    <a href="${rootPrefix}auth/register.html" class="btn btn-primary-gradient btn-sm px-3 rounded-pill flex-grow-1 text-center">
                        <i class="fa-solid fa-user-plus me-1"></i> Join Free
                    </a>
                </div>
            `;
        }
    },

    /**
     * Handle Sign Out with toast and redirect
     */
    handleLogout: function(rootPrefix = '') {
        this.logout();
        if (typeof showToast === 'function') {
            showToast('Signed out successfully. You are now browsing as a Guest.', 'info');
        }
        setTimeout(() => {
            window.location.href = rootPrefix + 'index.html';
        }, 600);
    }
};
