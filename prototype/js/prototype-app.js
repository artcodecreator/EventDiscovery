/**
 * EventDiscovery Pakistan (🇵🇰) - Lightweight UI & Bootstrap Application Controller
 * Uses native Bootstrap 5.3 components, data attributes, and clean state management.
 */

const PrototypeApp = {
    /**
     * Initialize shared components on any page
     */
    init: function(rootPrefix = '') {
        // Initialize Navbar Auth Dropdown / Buttons
        if (typeof PrototypeAuth !== 'undefined') {
            PrototypeAuth.renderNavbarAuth(rootPrefix);
        }

        // Initialize Bootstrap Popovers & Tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

        // Initialize Bootstrap Toasts
        const toastElList = document.querySelectorAll('.toast');
        toastElList.forEach(toastEl => new bootstrap.Toast(toastEl, { delay: 4000 }).show());
    },

    /**
     * Date & Time formatters
     */
    formatDate: function(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    },

    getDay: function(dateStr) {
        if (!dateStr) return '01';
        return String(new Date(dateStr + 'T00:00:00').getDate()).padStart(2, '0');
    },

    getMonthShort: function(dateStr) {
        if (!dateStr) return 'JAN';
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[new Date(dateStr + 'T00:00:00').getMonth()];
    },

    formatTime: function(timeStr) {
        if (!timeStr) return '';
        const parts = timeStr.split(':');
        let h = parseInt(parts[0], 10);
        const m = parts[1] || '00';
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    },

    getQueryParams: function() {
        const params = {};
        const q = window.location.search.substring(1);
        if (!q) return params;
        q.split('&').forEach(pair => {
            const [k, v] = pair.split('=');
            if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
        });
        return params;
    },

    getEventsList: function() {
        if (typeof PrototypeData !== 'undefined' && typeof PrototypeData.getAllEvents === 'function') {
            return PrototypeData.getAllEvents().filter(e => e.status !== 'deleted' && e.status !== 'rejected');
        }
        return (typeof PROTOTYPE_EVENTS !== 'undefined') ? PROTOTYPE_EVENTS : [];
    },

    getEventById: function(id) {
        if (typeof PrototypeData !== 'undefined' && typeof PrototypeData.getEventById === 'function') {
            return PrototypeData.getEventById(id);
        }
        const numId = parseInt(id, 10);
        return (typeof PROTOTYPE_EVENTS !== 'undefined') ? PROTOTYPE_EVENTS.find(e => e.id === numId) : null;
    },

    /**
     * Standard Bootstrap 5 Event Card Template
     */
    createEventCardHtml: function(event, rootPrefix = '', isHorizontal = false) {
        const isFav = (typeof PrototypeAuth !== 'undefined') ? PrototypeAuth.isEventFavorite(event.id) : false;
        const priceBadge = event.is_free ?
            '<span class="badge bg-success-subtle text-success border border-success-subtle fw-semibold">Free Entry</span>' :
            `<span class="badge bg-dark-subtle text-dark border fw-bold">Rs. ${Number(event.price).toLocaleString()}</span>`;
        const detailUrl = `${rootPrefix}events/detail.html?id=${event.id}`;

        if (isHorizontal) {
            return `
                <div class="col-12 event-card-item">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
                        <div class="row g-0">
                            <div class="col-sm-4 position-relative">
                                <img src="${event.image}" class="img-fluid h-100 w-100 object-fit-cover" style="min-height: 170px;" alt="${event.title}">
                                <div class="event-card-date-badge">
                                    <div class="day">${this.getDay(event.event_date)}</div>
                                    <div class="month">${this.getMonthShort(event.event_date)}</div>
                                </div>
                            </div>
                            <div class="col-sm-8 card-body d-flex flex-column justify-content-between p-3">
                                <div>
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="badge" style="background-color: ${event.category_color}; color: #fff;">
                                            <i class="fa-solid ${event.category_icon} me-1"></i> ${event.category_name}
                                        </span>
                                        ${priceBadge}
                                    </div>
                                    <h6 class="card-title fw-bold mb-1">
                                        <a href="${detailUrl}" class="text-dark text-decoration-none hover-primary">${event.title}</a>
                                    </h6>
                                    <p class="card-text text-muted small mb-2 text-truncate-2">${event.short_description}</p>
                                </div>
                                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                                    <div class="small text-muted">
                                        <i class="fa-solid fa-location-dot text-danger me-1"></i> ${event.venue_name}, <strong>${event.city}</strong>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <button type="button" class="btn btn-outline-info btn-sm rounded-pill" onclick="PrototypeApp.focusOnMap(${event.id})">
                                            <i class="fa-solid fa-crosshairs me-1"></i> Pin
                                        </button>
                                        <a href="${detailUrl}" class="btn btn-primary-gradient btn-sm rounded-pill px-3">
                                            View Pass
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="col-lg-4 col-md-6 event-card-item">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="position-relative" style="height: 190px;">
                        <img src="${event.image}" alt="${event.title}" class="w-100 h-100 object-fit-cover">
                        <div class="event-card-date-badge">
                            <div class="day">${this.getDay(event.event_date)}</div>
                            <div class="month">${this.getMonthShort(event.event_date)}</div>
                        </div>
                        <button type="button" class="event-card-fav-btn ${isFav ? 'active' : ''}" onclick="PrototypeApp.toggleFavorite(${event.id}, this, '${rootPrefix}')" title="Save Event">
                            <i class="fa-${isFav ? 'solid text-danger' : 'regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge" style="background-color: ${event.category_color}; color: #fff; font-size: 0.72rem;">
                                    <i class="fa-solid ${event.category_icon} me-1"></i> ${event.category_name}
                                </span>
                                ${priceBadge}
                            </div>
                            <h5 class="card-title fw-bold mb-2">
                                <a href="${detailUrl}" class="text-dark text-decoration-none hover-primary">${event.title}</a>
                            </h5>
                            <p class="card-text text-muted small mb-3 text-truncate-2">${event.short_description}</p>
                        </div>
                        <div>
                            <div class="small text-muted mb-3">
                                <div class="text-truncate mb-1"><i class="fa-solid fa-location-dot me-1 text-danger"></i> ${event.venue_name} (<strong>${event.city}</strong>)</div>
                                <div><i class="fa-regular fa-clock me-1 text-primary"></i> ${this.formatTime(event.start_time)} PKT</div>
                            </div>
                            <a href="${detailUrl}" class="btn btn-outline-primary btn-sm w-100 rounded-pill fw-semibold">
                                View Details & Pass
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Bookmark Toggle Helper
     */
    toggleFavorite: function(eventId, btnEl, rootPrefix = '') {
        if (!PrototypeAuth.isLoggedIn()) {
            showToast('Please sign in to save events to your bookmarks.', 'warning');
            setTimeout(() => window.location.href = rootPrefix + 'auth/login.html', 900);
            return;
        }
        const res = PrototypeAuth.toggleFavorite(eventId);
        if (btnEl) {
            const icon = btnEl.querySelector('i');
            btnEl.classList.toggle('active', res.isFavorite);
            if (icon) icon.className = `fa-${res.isFavorite ? 'solid text-danger' : 'regular'} fa-heart`;
            showToast(res.isFavorite ? 'Saved to Bookmarks 🇵🇰' : 'Removed from Bookmarks.', res.isFavorite ? 'success' : 'info');
        }
    },

    /**
     * Focus on map marker
     */
    focusOnMap: function(eventId) {
        if (typeof EventMap !== 'undefined' && EventMap.instances && EventMap.instances['eventMap']) {
            EventMap.focusEvent('eventMap', eventId);
            if (window.innerWidth < 992) {
                const mapEl = document.getElementById('eventMap');
                if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },

    /**
     * Homepage Controller
     */
    initHome: function(rootPrefix = '') {
        this.init(rootPrefix);
        const allEvents = this.getEventsList();

        // 1. Category Pills
        const pillsContainer = document.getElementById('categoryPillsContainer');
        if (pillsContainer && typeof PROTOTYPE_CATEGORIES !== 'undefined') {
            let html = `<a href="${rootPrefix}events/index.html" class="category-pill active"><i class="fa-solid fa-grid-2"></i> All Pakistan</a>`;
            PROTOTYPE_CATEGORIES.forEach(cat => {
                html += `
                    <a href="${rootPrefix}events/index.html?category=${cat.slug}" class="category-pill">
                        <i class="fa-solid ${cat.icon}" style="color: ${cat.color};"></i> ${cat.name}
                    </a>
                `;
            });
            pillsContainer.innerHTML = html;
        }

        // 2. Populate Category Select
        const catSelect = document.getElementById('heroCategorySelect');
        if (catSelect && typeof PROTOTYPE_CATEGORIES !== 'undefined') {
            catSelect.innerHTML = '<option value="">All Categories</option>' +
                PROTOTYPE_CATEGORIES.map(c => `<option value="${c.slug}">${c.name}</option>`).join('');
        }

        // 3. Featured Events
        const featuredContainer = document.getElementById('featuredEventsContainer');
        if (featuredContainer) {
            const featuredList = allEvents.filter(e => e.is_featured);
            const list = featuredList.length > 0 ? featuredList : allEvents.slice(0, 2);
            let html = '';
            list.forEach(event => {
                const isFav = PrototypeAuth.isEventFavorite(event.id);
                const priceBadge = event.is_free ? '<span class="text-success fw-bold">Free Entry</span>' : `Rs. ${Number(event.price).toLocaleString()}`;
                html += `
                    <div class="col-lg-6">
                        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 flex-md-row">
                            <div class="col-md-5 position-relative" style="min-height: 200px;">
                                <img src="${event.image}" alt="${event.title}" class="w-100 h-100 object-fit-cover">
                                <div class="event-card-date-badge">
                                    <div class="day">${this.getDay(event.event_date)}</div>
                                    <div class="month">${this.getMonthShort(event.event_date)}</div>
                                </div>
                                <span class="badge bg-warning text-dark position-absolute bottom-0 start-0 m-2 fw-bold" style="font-size: 0.68rem;">
                                    <i class="fa-solid fa-bolt me-1"></i> FEATURED
                                </span>
                            </div>
                            <div class="col-md-7 card-body d-flex flex-column justify-content-between p-4">
                                <div>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="badge" style="background-color: ${event.category_color}; color: #fff; font-size: 0.72rem;">
                                            <i class="fa-solid ${event.category_icon} me-1"></i> ${event.category_name}
                                        </span>
                                        <span class="small fw-bold">${priceBadge}</span>
                                    </div>
                                    <h5 class="card-title fw-bold mb-2">
                                        <a href="${rootPrefix}events/detail.html?id=${event.id}" class="text-dark text-decoration-none hover-primary">${event.title}</a>
                                    </h5>
                                    <p class="card-text text-muted small mb-3 text-truncate-2">${event.short_description}</p>
                                </div>
                                <div>
                                    <div class="small text-muted mb-3">
                                        <div class="mb-1"><i class="fa-solid fa-location-dot text-danger me-1"></i> ${event.venue_name}, <strong>${event.city}</strong></div>
                                        <div><i class="fa-regular fa-clock text-primary me-1"></i> ${this.formatTime(event.start_time)} PKT</div>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <a href="${rootPrefix}events/detail.html?id=${event.id}" class="btn btn-primary-gradient btn-sm flex-grow-1 rounded-pill">
                                            View Details <i class="fa-solid fa-arrow-right ms-1"></i>
                                        </a>
                                        <button type="button" class="btn btn-outline-secondary btn-sm rounded-circle ${isFav ? 'active' : ''}" onclick="PrototypeApp.toggleFavorite(${event.id}, this, '${rootPrefix}')" title="Save Event">
                                            <i class="fa-${isFav ? 'solid text-danger' : 'regular'} fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            featuredContainer.innerHTML = html;
        }

        // 4. Upcoming Events
        const upcomingContainer = document.getElementById('upcomingEventsContainer');
        if (upcomingContainer) {
            upcomingContainer.innerHTML = allEvents.slice(0, 6).map(e => this.createEventCardHtml(e, rootPrefix, false)).join('');
        }

        // 5. Initialize Homepage Map
        if (typeof EventMap !== 'undefined' && document.getElementById('homePreviewMap')) {
            EventMap.init('homePreviewMap', allEvents, { lat: 31.5204, lng: 74.3587, zoom: 6, rootPrefix: rootPrefix });
        }
    },

    /**
     * Events Listing Controller
     */
    initEventsList: function(rootPrefix = '') {
        this.init(rootPrefix);
        const allEvents = this.getEventsList();
        const params = this.getQueryParams();
        let viewMode = params.view || 'grid';
        let currentSearch = (params.search || '').trim().toLowerCase();
        let currentCity = (params.city || '').trim().toLowerCase();
        let currentCategory = (params.category || '').trim().toLowerCase();
        let currentSort = params.sort || 'date_asc';

        // Populate Category Filter Select & Custom Dropdown
        const catSelect = document.getElementById('filterCategory');
        if (catSelect && typeof PROTOTYPE_CATEGORIES !== 'undefined') {
            catSelect.innerHTML = '<option value="">All Categories</option>' +
                PROTOTYPE_CATEGORIES.map(c => `<option value="${c.slug}" ${currentCategory === c.slug ? 'selected' : ''}>${c.name}</option>`).join('');

            const catList = document.getElementById('filterCategoryList');
            if (catList) {
                catList.innerHTML = `<li><a class="dropdown-item ${!currentCategory ? 'active' : ''}" href="javascript:void(0)" data-value="">All Categories</a></li>` +
                    PROTOTYPE_CATEGORIES.map(c => `<li><a class="dropdown-item ${currentCategory === c.slug ? 'active' : ''}" href="javascript:void(0)" data-value="${c.slug}">${c.name}</a></li>`).join('');
            }
        }

        // Set inputs if provided via query params
        if (document.getElementById('filterSearch')) document.getElementById('filterSearch').value = params.search || '';
        if (document.getElementById('filterCity')) document.getElementById('filterCity').value = params.city || '';
        if (document.getElementById('filterSort')) document.getElementById('filterSort').value = currentSort;

        // Initialize custom responsive dropdown wrappers
        this.setupCustomDropdown('filterCityDropdownWrap', 'filterCity', 'filterCityLabel', 'filterCityList');
        this.setupCustomDropdown('filterCategoryDropdownWrap', 'filterCategory', 'filterCategoryLabel', 'filterCategoryList');
        this.setupCustomDropdown('filterSortDropdownWrap', 'filterSort', 'filterSortLabel', 'filterSortList');

        const renderFiltered = () => {
            let filtered = allEvents.filter(event => {
                const matchSearch = !currentSearch ||
                    event.title.toLowerCase().includes(currentSearch) ||
                    event.venue_name.toLowerCase().includes(currentSearch) ||
                    event.city.toLowerCase().includes(currentSearch) ||
                    event.category_name.toLowerCase().includes(currentSearch);
                const matchCity = !currentCity || event.city.toLowerCase() === currentCity;
                const matchCategory = !currentCategory || event.category_slug === currentCategory;
                return matchSearch && matchCity && matchCategory;
            });

            if (currentSort === 'date_asc') filtered.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
            else if (currentSort === 'date_desc') filtered.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
            else if (currentSort === 'popular') filtered.sort((a, b) => (b.rsvp_count || 0) - (a.rsvp_count || 0));
            else if (currentSort === 'title_asc') filtered.sort((a, b) => a.title.localeCompare(b.title));

            const countEl = document.getElementById('displayedEventsCount');
            if (countEl) countEl.textContent = filtered.length;

            const container = document.getElementById('eventCardsContainer');
            const noResults = document.getElementById('noResultsMessage');

            if (filtered.length === 0) {
                if (container) container.innerHTML = '';
                if (noResults) noResults.style.display = 'block';
            } else {
                if (noResults) noResults.style.display = 'none';
                if (container) {
                    const isHorizontal = (viewMode === 'split');
                    container.innerHTML = filtered.map(e => this.createEventCardHtml(e, rootPrefix, isHorizontal)).join('');
                }
            }

            if (viewMode === 'split' && typeof EventMap !== 'undefined' && document.getElementById('eventMap')) {
                EventMap.init('eventMap', filtered, { lat: 31.5204, lng: 74.3587, zoom: 6, rootPrefix: rootPrefix });
            }
        };

        renderFiltered();

        // Bind filter inputs
        const searchInput = document.getElementById('filterSearch');
        if (searchInput) searchInput.addEventListener('input', e => { currentSearch = e.target.value.trim().toLowerCase(); renderFiltered(); });

        const citySelect = document.getElementById('filterCity');
        if (citySelect) citySelect.addEventListener('change', e => { currentCity = e.target.value.trim().toLowerCase(); renderFiltered(); });

        if (catSelect) catSelect.addEventListener('change', e => { currentCategory = e.target.value.trim().toLowerCase(); renderFiltered(); });

        const sortSelect = document.getElementById('filterSort');
        if (sortSelect) sortSelect.addEventListener('change', e => { currentSort = e.target.value; renderFiltered(); });
    },

    /**
     * Helper to link custom responsive dropdown UI with underlying select element
     */
    setupCustomDropdown: function(wrapId, selectId, labelId, listId) {
        const wrap = document.getElementById(wrapId);
        const select = document.getElementById(selectId);
        const label = document.getElementById(labelId);
        const list = document.getElementById(listId);
        if (!wrap || !select || !label || !list) return;

        const syncUI = () => {
            const currentVal = (select.value || '').trim().toLowerCase();
            const items = list.querySelectorAll('.dropdown-item');
            let matchedText = '';
            items.forEach(item => {
                const itemVal = (item.getAttribute('data-value') || '').trim().toLowerCase();
                if (itemVal === currentVal) {
                    item.classList.add('active');
                    matchedText = item.textContent.trim();
                } else {
                    item.classList.remove('active');
                }
            });
            if (!matchedText && select.options && select.selectedIndex >= 0) {
                matchedText = select.options[select.selectedIndex].text;
            }
            if (matchedText) {
                label.textContent = matchedText;
            }
        };

        if (!wrap.dataset.customDropdownBound) {
            wrap.dataset.customDropdownBound = 'true';

            list.addEventListener('click', e => {
                const item = e.target.closest('.dropdown-item');
                if (!item) return;
                e.preventDefault();
                const val = item.getAttribute('data-value') ?? '';
                select.value = val;
                syncUI();
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });

            select.addEventListener('change', syncUI);
        }

        syncUI();
    },

    /**
     * Event Details Controller
     */
    initEventDetail: function(rootPrefix = '') {
        this.init(rootPrefix);
        const params = this.getQueryParams();
        const eventId = parseInt(params.id || '1', 10);
        const event = this.getEventById(eventId) || this.getEventsList()[0];
        if (!event) return;

        // Title & breadcrumbs
        document.title = `${event.title} | EventDiscovery Pakistan 🇵🇰`;
        const titleEl = document.getElementById('detailTitle');
        if (titleEl) titleEl.textContent = event.title;

        const breadcrumbCat = document.getElementById('detailBreadcrumbCat');
        if (breadcrumbCat) {
            breadcrumbCat.textContent = event.category_name;
            breadcrumbCat.href = `${rootPrefix}events/index.html?category=${event.category_slug}`;
        }
        const breadcrumbTitle = document.getElementById('detailBreadcrumbTitle');
        if (breadcrumbTitle) breadcrumbTitle.textContent = event.title;

        // Badges
        const catBadge = document.getElementById('detailCategoryBadge');
        if (catBadge) {
            catBadge.style.backgroundColor = event.category_color;
            catBadge.innerHTML = `<i class="fa-solid ${event.category_icon} me-1"></i> ${event.category_name}`;
        }
        const cityBadge = document.getElementById('detailCityBadge');
        if (cityBadge) cityBadge.innerHTML = `<i class="fa-solid fa-map-pin me-1"></i> ${event.city}, Pakistan`;

        const attendeeBadge = document.getElementById('detailAttendeeBadge');
        if (attendeeBadge) attendeeBadge.innerHTML = `<i class="fa-solid fa-users me-1 text-primary"></i> ${event.rsvp_count || 0} Attendees`;

        // Gallery Carousel
        const galleryContainer = document.getElementById('detailGalleryContainer');
        if (galleryContainer) {
            galleryContainer.innerHTML = `<img src="${event.image}" class="w-100 rounded-4 object-fit-cover shadow-sm" style="height: 420px;" alt="${event.title}">`;
        }

        // Full Description
        const descEl = document.getElementById('detailFullDescription');
        if (descEl) descEl.textContent = event.full_description;

        const dateEl = document.getElementById('detailDateText');
        if (dateEl) dateEl.innerHTML = `<i class="fa-regular fa-calendar-days text-primary me-1"></i> ${this.formatDate(event.event_date)}`;

        const timeEl = document.getElementById('detailTimeText');
        if (timeEl) timeEl.innerHTML = `<i class="fa-regular fa-clock text-info me-1"></i> ${this.formatTime(event.start_time)} - ${this.formatTime(event.end_time)}`;

        const priceEl = document.getElementById('detailPriceText');
        const priceFormatted = event.is_free ? 'Free Entry' : ('Rs. ' + Number(event.price).toLocaleString());
        if (priceEl) priceEl.innerHTML = `<i class="fa-solid fa-ticket me-1"></i> ${priceFormatted}`;

        // Sidebar Price
        const sidebarPrice = document.getElementById('detailSidebarPrice');
        if (sidebarPrice) sidebarPrice.innerHTML = event.is_free ? '<span class="text-success">Free Entry</span>' : `Rs. ${Number(event.price).toLocaleString()}`;

        // Venue Info & Map directions
        const venueInfo = document.getElementById('detailVenueInfo');
        if (venueInfo) venueInfo.innerHTML = `${event.venue_name} &bull; ${event.address || ''}, <strong>${event.city}</strong>`;

        const directionsBtn = document.getElementById('detailDirectionsBtn');
        if (directionsBtn) {
            directionsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue_name + ' ' + (event.address || '') + ' ' + event.city + ' Pakistan')}`;
        }

        // Organizer
        const orgName = document.getElementById('detailOrgName');
        if (orgName) orgName.textContent = event.organizer_name || 'Community Host';
        const orgEmail = document.getElementById('detailOrgEmail');
        if (orgEmail) {
            orgEmail.textContent = event.organizer_email || 'contact@eventdiscovery.pk';
            orgEmail.href = `mailto:${event.organizer_email || 'contact@eventdiscovery.pk'}`;
        }

        // RSVP and Bookmark state
        this.updateDetailRsvpState(event.id, rootPrefix);

        const favBtn = document.getElementById('detailFavBtn');
        if (favBtn) {
            const isFav = PrototypeAuth.isEventFavorite(event.id);
            favBtn.className = `btn btn-outline-secondary w-100 py-2 rounded-pill fw-semibold ${isFav ? 'active' : ''}`;
            favBtn.innerHTML = `<i class="fa-${isFav ? 'solid text-danger' : 'regular'} fa-heart me-1"></i> <span>${isFav ? 'Saved in Favorites' : 'Save Event to Favorites'}</span>`;
            favBtn.onclick = () => {
                if (!PrototypeAuth.isLoggedIn()) {
                    showToast('Please sign in to bookmark events.', 'warning');
                    setTimeout(() => window.location.href = rootPrefix + 'auth/login.html', 900);
                    return;
                }
                const res = PrototypeAuth.toggleFavorite(event.id);
                favBtn.className = `btn btn-outline-secondary w-100 py-2 rounded-pill fw-semibold ${res.isFavorite ? 'active' : ''}`;
                favBtn.innerHTML = `<i class="fa-${res.isFavorite ? 'solid text-danger' : 'regular'} fa-heart me-1"></i> <span>${res.isFavorite ? 'Saved in Favorites' : 'Save Event to Favorites'}</span>`;
                showToast(res.isFavorite ? 'Saved to Bookmarks 🇵🇰' : 'Removed from Bookmarks.', res.isFavorite ? 'success' : 'info');
            };
        }

        // Reviews
        const reviewsContainer = document.getElementById('detailReviewsContainer');
        if (reviewsContainer) {
            const reviews = (typeof PrototypeData !== 'undefined') ? PrototypeData.getReviews(event.id) : [];
            if (reviews.length > 0) {
                reviewsContainer.innerHTML = reviews.map(rev => `
                    <div class="card border-0 bg-light p-3 rounded-4 mb-2">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <div class="d-flex align-items-center gap-2">
                                <img src="${rev.user_avatar}" alt="${rev.user_name}" class="rounded-circle" style="width:34px; height:34px; object-fit:cover;">
                                <span class="fw-bold small text-dark">${rev.user_name}</span>
                            </div>
                            <div class="text-warning small"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                        </div>
                        <p class="text-secondary small mb-0">${rev.comment}</p>
                    </div>
                `).join('');
            } else {
                reviewsContainer.innerHTML = '<div class="p-3 bg-light rounded-3 text-muted small text-center"><i class="fa-regular fa-comments me-1"></i> Be the first to attend and submit a review!</div>';
            }
        }

        // Related Events
        const relatedContainer = document.getElementById('detailRelatedContainer');
        if (relatedContainer) {
            const allEvents = this.getEventsList();
            const related = allEvents.filter(e => e.category_id === event.category_id && e.id !== event.id).slice(0, 3);
            if (related.length > 0) {
                relatedContainer.innerHTML = related.map(rel => `
                    <a href="${rootPrefix}events/detail.html?id=${rel.id}" class="text-decoration-none text-dark d-flex gap-3 align-items-center mb-2">
                        <img src="${rel.image}" alt="${rel.title}" class="rounded-3 object-fit-cover" style="width: 60px; height: 50px;">
                        <div>
                            <div class="fw-semibold small text-truncate-2">${rel.title}</div>
                            <div class="text-muted" style="font-size: 0.75rem;"><i class="fa-regular fa-clock me-1"></i> ${this.formatDate(rel.event_date)} &bull; ${rel.city}</div>
                        </div>
                    </a>
                `).join('');
            } else {
                if (relatedContainer.parentElement) relatedContainer.parentElement.style.display = 'none';
            }
        }

        // Venue Map
        if (typeof EventMap !== 'undefined' && document.getElementById('detailVenueMap')) {
            EventMap.init('detailVenueMap', [event], {
                lat: event.latitude || 31.5204,
                lng: event.longitude || 74.3587,
                zoom: 15,
                noFitBounds: true,
                rootPrefix: rootPrefix
            });
        }
    },

    updateDetailRsvpState: function(eventId, rootPrefix = '') {
        const rsvpContainer = document.getElementById('detailRsvpContainer');
        const statusBadge = document.getElementById('detailPassStatusBadge');
        if (!rsvpContainer) return;

        const isRsvpd = PrototypeAuth.isEventRsvpd(eventId);

        if (statusBadge) {
            statusBadge.innerHTML = isRsvpd ?
                '<span class="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Confirmed Pass 🇵🇰</span>' :
                '<span class="badge bg-primary-subtle text-primary px-3 py-1 rounded-pill fw-bold"><i class="fa-solid fa-ticket me-1"></i> Open for Registration</span>';
        }

        if (isRsvpd) {
            rsvpContainer.innerHTML = `
                <button type="button" class="btn btn-outline-danger w-100 py-3 rounded-pill fw-bold" onclick="PrototypeApp.handleDetailRsvp(${eventId}, '${rootPrefix}')">
                    <i class="fa-solid fa-xmark me-2"></i> Cancel My Pass
                </button>
            `;
        } else {
            rsvpContainer.innerHTML = `
                <button type="button" class="btn btn-primary-gradient w-100 py-3 rounded-pill fw-bold" onclick="PrototypeApp.handleDetailRsvp(${eventId}, '${rootPrefix}')">
                    <i class="fa-solid fa-ticket me-2"></i> Get Event Pass (RSVP)
                </button>
            `;
        }
    },

    handleDetailRsvp: function(eventId, rootPrefix = '') {
        if (!PrototypeAuth.isLoggedIn()) {
            showToast('Please sign in to register for an event pass.', 'warning');
            setTimeout(() => window.location.href = rootPrefix + 'auth/login.html', 900);
            return;
        }

        const res = PrototypeAuth.toggleRsvp(eventId);
        this.updateDetailRsvpState(eventId, rootPrefix);

        if (res.isRsvpd) {
            showToast('🎉 Pass Confirmed! Added to your Digital Pass Wallet.', 'success');
        } else {
            showToast('Event pass registration cancelled.', 'info');
        }
    },

    /**
     * Categories Page Controller
     */
    initCategories: function(rootPrefix = '') {
        this.init(rootPrefix);
        const container = document.getElementById('categoriesGridContainer');
        if (!container || typeof PROTOTYPE_CATEGORIES === 'undefined') return;

        const allEvents = this.getEventsList();
        container.innerHTML = PROTOTYPE_CATEGORIES.map(cat => {
            const count = allEvents.filter(e => e.category_id === cat.id).length;
            return `
                <div class="col-lg-4 col-md-6">
                    <a href="${rootPrefix}events/index.html?category=${cat.slug}" class="text-decoration-none">
                        <div class="category-card shadow-sm">
                            <img src="${cat.image}" alt="${cat.name}" class="w-100 h-100 object-fit-cover">
                            <div class="category-card-overlay">
                                <div class="badge px-3 py-1 rounded-pill mb-2 align-self-start" style="background-color: ${cat.color}; color: #fff;">
                                    <i class="fa-solid ${cat.icon} me-1"></i> ${count} Events Active
                                </div>
                                <h4 class="fw-bold mb-1 text-white">${cat.name}</h4>
                                <p class="small text-light opacity-90 mb-0 text-truncate-2">${cat.description}</p>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }).join('');
    }
};

/**
 * Toast Notification Generator using standard Bootstrap 5 Toast
 */
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1090';
        document.body.appendChild(container);
    }

    const bgClass = type === 'danger' ? 'text-bg-danger' : (type === 'warning' ? 'text-bg-warning' : (type === 'info' ? 'text-bg-info' : 'text-bg-success'));
    const iconClass = type === 'danger' ? 'fa-circle-exclamation' : (type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-check');

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center ${bgClass} border-0 shadow-lg rounded-3`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2 fw-semibold">
                <i class="fa-solid ${iconClass}"></i>
                <span>${message}</span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    container.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
    bsToast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}
