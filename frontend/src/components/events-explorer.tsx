"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { EventItem, EventCategory } from "@/lib/events";

export function EventsExplorer({
  initialEvents,
  categories,
  initialView = "grid",
  initialCategory = "",
  initialCity = "",
  initialSearch = ""
}: {
  initialEvents: EventItem[];
  categories: EventCategory[];
  initialView?: string;
  initialCategory?: string;
  initialCity?: string;
  initialSearch?: string;
}) {
  const [viewMode, setViewMode] = useState<"grid" | "split">(initialView === "split" ? "split" : "grid");
  const [search, setSearch] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("date_asc");
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [toast, setToast] = useState<string | null>(null);

  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleFavorite = async (e: React.MouseEvent, eventId: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId })
      });
      if (res.status === 401) {
        showToast("Please sign in to save events to favorites.");
        return;
      }
      const data = await res.json();
      showToast(data.data?.bookmarked ? "Event added to bookmarks! ❤️" : "Event removed from bookmarks.");
    } catch {
      showToast("Could not update bookmark.");
    }
  };

  const handleRsvp = async (e: React.MouseEvent, eventId: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, ticketsCount: 1 })
      });
      if (res.status === 401) {
        window.location.href = `/login?next=/events`;
        return;
      }
      const data = await res.json();
      showToast(data.data?.active ? "RSVP Pass confirmed! View in your dashboard. 🎟️" : "RSVP cancelled.");
    } catch {
      showToast("Could not complete RSVP.");
    }
  };

  // Filter and sort events
  const filteredEvents = events.filter(e => {
    if (selectedCategory && e.categorySlug.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedCity && e.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = [e.title, e.category, e.city, e.venue, e.venueName, e.description, e.shortDescription, e.organizerName]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "date_asc") return (a.eventDate || a.date || "").localeCompare(b.eventDate || b.date || "");
    if (sortBy === "date_desc") return (b.eventDate || b.date || "").localeCompare(a.eventDate || a.date || "");
    if (sortBy === "popular") return (b.rsvpCount || 0) - (a.rsvpCount || 0);
    if (sortBy === "title_asc") return a.title.localeCompare(b.title);
    return 0;
  });

  const resetFilters = () => {
    setSearch("");
    setSelectedCity("");
    setSelectedCategory("");
    setSortBy("date_asc");
  };

  // Initialize/Update Leaflet map in split view
  useEffect(() => {
    if (viewMode !== "split" || !mapHostRef.current) return;

    let isMounted = true;
    import("leaflet").then(L => {
      if (!isMounted || !mapHostRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapHostRef.current, { scrollWheelZoom: false }).setView([30.5, 69.5], 6);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];

      const newMarkers: any[] = [];
      filteredEvents.forEach(ev => {
        const lat = ev.latitude || ev.lat;
        const lng = ev.longitude || ev.lng;
        if (!lat || !lng) return;

        const customIcon = L.divIcon({
          className: "custom-map-pin",
          html: `
            <div class="custom-map-marker" style="background-color: ${ev.categoryColor || '#6366f1'}" id="map-pin-${ev.id}">
              <i class="fa-solid ${ev.categoryIcon || 'fa-calendar'}"></i>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -20]
        });

        const popupContent = document.createElement("div");
        popupContent.className = "map-popup-card";
        popupContent.innerHTML = `
          <img src="${ev.image}" alt="${ev.title}" class="map-popup-img" style="width:100%; height:120px; object-fit:cover; border-radius: 8px 8px 0 0;">
          <div style="padding: 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span class="badge" style="background-color:${ev.categoryColor || '#6366f1'}; color:#fff; font-size:0.7rem;">${ev.category}</span>
              <span style="font-weight:bold; color:#10b981; font-size:0.8rem;">${ev.price}</span>
            </div>
            <h6 style="font-weight:bold; margin-bottom:4px; font-size:0.95rem;">
              <a href="/events/${ev.slug}" style="color:#0f172a; text-decoration:none;">${ev.title}</a>
            </h6>
            <div style="font-size:0.75rem; color:#64748b; margin-bottom:4px;"><i class="fa-solid fa-location-dot text-danger"></i> ${ev.venueName || ev.venue} (${ev.city})</div>
            <div style="font-size:0.75rem; color:#64748b; margin-bottom:8px;"><i class="fa-regular fa-clock text-primary"></i> ${ev.eventDate || ev.date} &bull; ${ev.startTime || ev.time}</div>
            <a href="/events/${ev.slug}" class="btn btn-primary-gradient btn-sm w-100" style="font-size:0.8rem; border-radius:20px; padding: 4px 8px;">
              View Event Pass
            </a>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: customIcon })
          .bindPopup(popupContent)
          .addTo(map);

        (marker as any).eventId = ev.id;
        newMarkers.push(marker);
      });

      markersRef.current = newMarkers;

      if (newMarkers.length > 1) {
        const group = (L as any).featureGroup(newMarkers);
        map.fitBounds(group.getBounds().pad(0.12));
      } else if (newMarkers.length === 1) {
        map.setView(newMarkers[0].getLatLng(), 13);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [viewMode, filteredEvents]);

  const focusEventMarker = (eventId: number | string) => {
    if (viewMode !== "split" || !mapInstanceRef.current) return;
    const targetMarker = markersRef.current.find(m => String(m.eventId) === String(eventId));
    if (targetMarker) {
      mapInstanceRef.current.setView(targetMarker.getLatLng(), 14, { animate: true });
      targetMarker.openPopup();
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="toast show align-items-center text-bg-dark border-0 shadow-lg">
            <div className="d-flex">
              <div className="toast-body fw-semibold">{toast}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(null)}></button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-dark text-white py-4 border-bottom border-dark">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2 small text-muted">
                  <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Home</Link></li>
                  <li className="breadcrumb-item active text-primary" aria-current="page">Events</li>
                </ol>
              </nav>
              <h1 className="h2 fw-bold mb-0">Discover Events Across Pakistan</h1>
              <p className="text-muted small mb-0 mt-1">
                Showing <strong className="text-white">{filteredEvents.length}</strong> verified Pakistani community events
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "split" ? "btn-primary-gradient" : "btn-outline-light"}`}
                  onClick={() => setViewMode("split")}
                >
                  <i className="fa-solid fa-map-location-dot me-1"></i> Map & List View
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "grid" ? "btn-primary-gradient" : "btn-outline-light"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <i className="fa-solid fa-table-cells me-1"></i> Card Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="py-4">
        <div className="container">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3">
              <div className="row g-2 align-items-center">
                {/* Search */}
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="fa-solid fa-magnifying-glass text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0 ps-0"
                      placeholder="Live search title, venue, city..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* City */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-2">
                  <select
                    className="form-select bg-light"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                  >
                    <option value="">All Pakistan</option>
                    <option value="lahore">Lahore</option>
                    <option value="karachi">Karachi</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="rawalpindi">Rawalpindi</option>
                    <option value="peshawar">Peshawar</option>
                    <option value="faisalabad">Faisalabad</option>
                  </select>
                </div>

                {/* Category */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <select
                    className="form-select bg-light"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-2">
                  <select
                    className="form-select bg-light"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="date_asc">Date: Upcoming</option>
                    <option value="date_desc">Date: Furthest</option>
                    <option value="popular">Popularity / RSVPs</option>
                    <option value="title_asc">A to Z</option>
                  </select>
                </div>

                {/* Reset */}
                <div className="col-12 col-sm-6 col-md-6 col-lg-2">
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={resetFilters}>
                    <i className="fa-solid fa-rotate-left me-1"></i> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Split Map & List View */}
          {viewMode === "split" && (
            <div>
              <div className="row g-4" id="splitViewContainer">
                <div className="col-lg-7 order-2 order-lg-1">
                  <div className="row g-3">
                    {filteredEvents.map(ev => (
                      <div className="col-12 col-md-6 col-lg-12" key={ev.id} onMouseEnter={() => focusEventMarker(ev.id)}>
                        <div className="event-card card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                          <div className="row g-0 align-items-center">
                            <div className="col-12 col-md-5 position-relative split-card-img-col">
                              <img
                                src={ev.image}
                                alt={ev.title}
                                className="w-100 h-100 object-fit-cover"
                              />
                              <span className="badge category-badge position-absolute top-0 start-0 m-2" style={{ backgroundColor: ev.categoryColor || "#6366f1", color: "#fff" }}>
                                <i className={`fa-solid ${ev.categoryIcon || 'fa-tag'} me-1`}></i> {ev.category}
                              </span>
                              <button
                                className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm"
                                onClick={(e) => handleFavorite(e, ev.id)}
                                title="Save to bookmarks"
                              >
                                <i className="fa-regular fa-heart text-danger"></i>
                              </button>
                            </div>
                            <div className="col-12 col-md-7">
                              <div className="card-body p-3">
                                <div className="d-flex justify-content-between align-items-center small text-muted mb-1">
                                  <span><i className="fa-solid fa-location-dot me-1 text-primary"></i> {ev.city}</span>
                                  <span className="badge bg-success-subtle text-success border border-success-subtle">{ev.price}</span>
                                </div>
                                <h6 className="card-title fw-bold mb-1">
                                  <Link href={`/events/${ev.slug}`} className="text-dark text-decoration-none hover-primary">
                                    {ev.title}
                                  </Link>
                                </h6>
                                <p className="card-text text-secondary small line-clamp-2 mb-2">
                                  {ev.shortDescription || ev.description}
                                </p>
                                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                  <span className="small text-muted"><i className="fa-regular fa-calendar me-1"></i> {ev.eventDate || ev.date}</span>
                                  <div className="d-flex gap-1">
                                    <button className="btn btn-outline-primary btn-sm rounded-pill px-2" onClick={(e) => handleRsvp(e, ev.id)}>
                                      RSVP
                                    </button>
                                    <Link href={`/events/${ev.slug}`} className="btn btn-primary-gradient btn-sm rounded-pill px-3">
                                      Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-lg-5 order-1 order-lg-2 mb-3 mb-lg-0">
                  <div className="sticky-top split-map-sticky" style={{ top: "85px" }}>
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                      <div className="card-header bg-dark text-white py-2 px-3 d-flex justify-content-between align-items-center">
                        <span className="small fw-semibold"><i className="fa-solid fa-map me-1 text-primary"></i> Pakistan Live Geo-Map</span>
                        <span className="badge bg-success rounded-pill small">Interactive Pins</span>
                      </div>
                      <div ref={mapHostRef} className="events-split-map w-100" id="eventMap"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="row g-4">
              {filteredEvents.map(ev => (
                <div className="col-12 col-sm-6 col-lg-4" key={ev.id}>
                  <div className="event-card card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div className="position-relative" style={{ height: "200px" }}>
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <span className="badge category-badge position-absolute top-0 start-0 m-3" style={{ backgroundColor: ev.categoryColor || "#6366f1", color: "#fff" }}>
                        <i className={`fa-solid ${ev.categoryIcon || 'fa-tag'} me-1`}></i> {ev.category}
                      </span>
                      <button
                        className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm"
                        onClick={(e) => handleFavorite(e, ev.id)}
                        title="Save to bookmarks"
                      >
                        <i className="fa-regular fa-heart text-danger"></i>
                      </button>
                      <span className="badge bg-dark-glass position-absolute bottom-0 end-0 m-3 text-white">
                        {ev.price}
                      </span>
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                        <span><i className="fa-solid fa-location-dot me-1 text-primary"></i> {ev.venueName || ev.venue}, {ev.city}</span>
                        <span><i className="fa-solid fa-users me-1 text-info"></i> {ev.rsvpCount || 0} RSVPs</span>
                      </div>
                      <h5 className="card-title fw-bold mb-2">
                        <Link href={`/events/${ev.slug}`} className="text-dark text-decoration-none hover-primary">
                          {ev.title}
                        </Link>
                      </h5>
                      <p className="card-text text-secondary small line-clamp-2 mb-3 flex-grow-1">
                        {ev.shortDescription || ev.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                        <div>
                          <div className="small fw-semibold text-dark"><i className="fa-regular fa-calendar me-1 text-primary"></i> {ev.eventDate || ev.date}</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>{ev.startTime || ev.time} PKT</div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={(e) => handleRsvp(e, ev.id)}>
                            RSVP
                          </button>
                          <Link href={`/events/${ev.slug}`} className="btn btn-primary-gradient btn-sm rounded-pill px-3">
                            View Pass
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-5">
              <i className="fa-regular fa-face-frown fa-4x text-muted mb-3 d-block"></i>
              <h4 className="fw-bold">No Matching Events Found</h4>
              <p className="text-muted">No events currently match your live filter criteria.</p>
              <button type="button" className="btn btn-primary-gradient rounded-pill px-4" onClick={resetFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
