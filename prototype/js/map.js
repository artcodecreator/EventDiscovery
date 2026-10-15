/**
 * Leaflet.js Interactive Event Map System (Pakistan Edition 🇵🇰)
 * Manages map initialization, category pins, popups, and list-to-map synchronization.
 */

const EventMap = {
    instances: {},
    markers: {},

    /**
     * Initialize Leaflet map
     */
    init: function(containerId, events = [], options = {}) {
        const container = document.getElementById(containerId);
        if (!container || typeof L === 'undefined') return null;

        // Default coordinates: Central Pakistan (Lahore/Islamabad corridor)
        let centerLat = options.lat || 31.5204;
        let centerLng = options.lng || 74.3587;
        let zoom = options.zoom || 6;

        if (events.length > 0 && !options.lat) {
            centerLat = events[0].latitude || events[0].lat;
            centerLng = events[0].longitude || events[0].lng;
        }

        // Clean up previous map instance if any
        if (this.instances[containerId]) {
            this.instances[containerId].remove();
        }

        // Create Map
        const map = L.map(containerId, {
            scrollWheelZoom: options.scrollWheelZoom !== undefined ? options.scrollWheelZoom : false
        }).setView([centerLat, centerLng], zoom);

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        this.instances[containerId] = map;
        this.markers[containerId] = [];

        // Add Markers
        if (events.length > 0) {
            this.addMarkers(containerId, events, options.rootPrefix || '');
            
            // If multiple markers and no custom fixed zoom, fit bounds across Pakistan
            if (events.length > 1 && !options.noFitBounds) {
                const group = new L.featureGroup(this.markers[containerId]);
                map.fitBounds(group.getBounds().pad(0.12));
            }
        }

        return map;
    },

    /**
     * Add markers for events
     */
    addMarkers: function(containerId, events, rootPrefix = '') {
        const map = this.instances[containerId];
        if (!map) return;

        // Clear existing markers
        if (this.markers[containerId]) {
            this.markers[containerId].forEach(m => map.removeLayer(m));
            this.markers[containerId] = [];
        }

        events.forEach(event => {
            const lat = event.latitude || event.lat;
            const lng = event.longitude || event.lng;
            if (!lat || !lng) return;

            // Custom category icon pin
            const customIcon = L.divIcon({
                className: 'custom-map-pin',
                html: `
                    <div class="custom-map-marker" style="background-color: ${event.category_color || '#6366f1'}" id="map-pin-${event.id}">
                        <i class="fa-solid ${event.category_icon || 'fa-calendar'}"></i>
                    </div>
                `,
                iconSize: [38, 38],
                iconAnchor: [19, 19],
                popupAnchor: [0, -20]
            });

            const priceText = event.is_free ? 'Free Entry' : ('Rs. ' + Number(event.price).toLocaleString());
            const detailUrl = `${rootPrefix}events/detail.html?id=${event.id}`;

            // Popup HTML card
            const popupContent = `
                <div class="map-popup-card">
                    <img src="${event.image}" alt="${event.title}" class="map-popup-img">
                    <div class="p-3">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="badge" style="background-color: ${event.category_color}; color: #fff; font-size: 0.7rem;">
                                ${event.category_name}
                            </span>
                            <span class="fw-bold text-success small">${priceText}</span>
                        </div>
                        <h6 class="fw-bold mb-1 text-truncate" title="${event.title}">
                            <a href="${detailUrl}" class="text-dark text-decoration-none">${event.title}</a>
                        </h6>
                        <div class="small text-muted mb-1"><i class="fa-solid fa-location-dot me-1 text-danger"></i> ${event.venue_name} (${event.city || ''})</div>
                        <div class="small text-muted mb-2"><i class="fa-regular fa-clock me-1 text-primary"></i> ${event.event_date} &bull; ${event.start_time}</div>
                        <a href="${detailUrl}" class="btn btn-primary-gradient btn-sm w-100 py-1" style="font-size: 0.8rem;">
                            View Event Pass
                        </a>
                    </div>
                </div>
            `;

            const marker = L.marker([lat, lng], { icon: customIcon })
                .bindPopup(popupContent)
                .addTo(map);

            marker.eventId = event.id;
            this.markers[containerId].push(marker);
        });
    },

    /**
     * Highlight a specific event marker and center map
     */
    focusEvent: function(containerId, eventId) {
        const map = this.instances[containerId];
        const markers = this.markers[containerId] || [];
        
        const targetMarker = markers.find(m => m.eventId == eventId);
        if (targetMarker && map) {
            map.setView(targetMarker.getLatLng(), 15, { animate: true });
            targetMarker.openPopup();
            
            // Add pulse effect to marker DOM
            document.querySelectorAll('.custom-map-marker').forEach(el => el.classList.remove('active-pin'));
            const pinEl = document.getElementById(`map-pin-${eventId}`);
            if (pinEl) {
                pinEl.classList.add('active-pin');
            }
        }
    }
};
