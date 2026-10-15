"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { EventItem } from "@/lib/events";

export function EventDetailClient({
  event,
  relatedEvents = []
}: {
  event: EventItem;
  relatedEvents?: EventItem[];
}) {
  const [reviews, setReviews] = useState(event.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [ticketsCount, setTicketsCount] = useState(1);
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: string } | null>(null);

  const mapHostRef = useRef<HTMLDivElement>(null);

  const showToast = (text: string, type: string = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRsvp = async () => {
    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, ticketsCount })
      });
      if (res.status === 401) {
        window.location.href = `/login?next=/events/${event.slug}`;
        return;
      }
      const data = await res.json();
      setHasRsvpd(data.data?.active);
      showToast(data.data?.active ? `Pass confirmed for ${ticketsCount} attendee(s)! 🎟️ Check your dashboard.` : "RSVP cancelled.", "success");
    } catch {
      showToast("Failed to complete RSVP.", "danger");
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id })
      });
      if (res.status === 401) {
        window.location.href = `/login?next=/events/${event.slug}`;
        return;
      }
      const data = await res.json();
      setIsBookmarked(data.data?.bookmarked);
      showToast(data.data?.bookmarked ? "Event added to your bookmarks! ❤️" : "Event removed from bookmarks.", "info");
    } catch {
      showToast("Could not update bookmark.", "danger");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, rating, comment })
      });
      if (res.status === 401) {
        window.location.href = `/login?next=/events/${event.slug}`;
        return;
      }
      const data = await res.json();
      if (data.data) {
        setReviews([data.data, ...reviews]);
        setComment("");
        showToast("Review submitted successfully! ⭐", "success");
      }
    } catch {
      showToast("Failed to submit review.", "danger");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!mapHostRef.current) return;
    let isMounted = true;
    import("leaflet").then(L => {
      if (!isMounted || !mapHostRef.current) return;

      const lat = event.latitude || event.lat || 31.5204;
      const lng = event.longitude || event.lng || 74.3587;

      const map = L.map(mapHostRef.current, { scrollWheelZoom: false }).setView([lat, lng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const customIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div class="custom-map-marker" style="background-color: ${event.categoryColor || '#6366f1'}">
            <i class="fa-solid ${event.categoryIcon || 'fa-location-dot'}"></i>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${event.title}</strong><br/>${event.venueName || event.venue}, ${event.city}`)
        .openPopup();
    });

    return () => {
      isMounted = false;
    };
  }, [event]);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venueName || event.venue}, ${event.city}, Pakistan`)}`;

  return (
    <div>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className={`toast show align-items-center text-bg-${toastMessage.type} border-0 shadow-lg`}>
            <div className="d-flex">
              <div className="toast-body fw-semibold">{toastMessage.text}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage(null)}></button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs & Title Bar */}
      <div className="bg-dark text-white py-4 border-bottom border-dark">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 small text-muted">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/events" className="text-muted text-decoration-none">Events</Link></li>
              <li className="breadcrumb-item">
                <Link href={`/events?category=${event.categorySlug}`} className="text-muted text-decoration-none">
                  {event.category}
                </Link>
              </li>
              <li className="breadcrumb-item active text-light" aria-current="page">{event.title}</li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className="badge" style={{ fontSize: "0.8rem", backgroundColor: event.categoryColor || "#6366f1", color: "#fff" }}>
              <i className={`fa-solid ${event.categoryIcon || 'fa-tag'} me-1`}></i> {event.category}
            </span>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
              <i className="fa-solid fa-location-dot me-1"></i> {event.city}, Pakistan
            </span>
            <span className="badge bg-light text-dark fw-bold">
              <i className="fa-solid fa-users me-1 text-info"></i> {event.rsvpCount || 0} Attending
            </span>
          </div>
          <h1 className="display-6 fw-bold mb-0 text-white">{event.title}</h1>
        </div>
      </div>

      {/* Main Body */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {/* Left Column: Cover Banner, Description, Venue Map, Reviews */}
            <div className="col-lg-8">
              {/* Cover Banner */}
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="position-relative detail-cover-banner">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <span className="badge bg-dark-glass position-absolute bottom-0 end-0 m-3 text-white px-3 py-2 fs-6">
                    {event.price}
                  </span>
                </div>
              </div>

              {/* Event Description Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <h3 className="fw-bold mb-3">About This Event</h3>
                <div className="text-secondary mb-4" style={{ whiteSpace: "pre-line", fontSize: "1.05rem", lineHeight: 1.8 }}>
                  {event.fullDescription || event.description}
                </div>

                {/* Highlight Badges */}
                <div className="row g-3 py-3 border-top border-bottom my-3">
                  <div className="col-12 col-sm-4 text-center">
                    <div className="text-muted small">Event Date</div>
                    <div className="fw-bold text-dark">{event.eventDate || event.date}</div>
                  </div>
                  <div className="col-12 col-sm-4 text-center border-start-sm border-end-sm py-2 py-sm-0 border-top-mobile border-bottom-mobile">
                    <div className="text-muted small">Timing (PKT)</div>
                    <div className="fw-bold text-dark">{event.startTime || event.time} PKT</div>
                  </div>
                  <div className="col-12 col-sm-4 text-center">
                    <div className="text-muted small">Pass / Ticket</div>
                    <div className="fw-bold text-success">{event.price}</div>
                  </div>
                </div>
              </div>

              {/* Venue Location Leaflet Map Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="fw-bold mb-1"><i className="fa-solid fa-map-location-dot text-primary me-2"></i> Pakistani Venue Location</h4>
                    <div className="text-muted small">{event.venueName || event.venue} &bull; {event.address || event.city}</div>
                  </div>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm rounded-pill">
                    <i className="fa-solid fa-diamond-turn-right me-1"></i> Directions
                  </a>
                </div>
                <div ref={mapHostRef} className="detail-venue-map w-100" style={{ height: "340px", borderRadius: "12px" }}></div>
              </div>

              {/* Reviews and Ratings */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Community Reviews & Feedback</h4>
                  <span className="badge bg-warning-subtle text-dark border border-warning-subtle px-3 py-2 rounded-pill">
                    <i className="fa-solid fa-star text-warning me-1"></i> Community Rated
                  </span>
                </div>

                {/* Reviews List */}
                <div className="d-flex flex-column gap-3 mb-4">
                  {reviews.length === 0 ? (
                    <p className="text-muted small mb-0">No community reviews submitted yet. Be the first to share your experience!</p>
                  ) : (
                    reviews.map((rev, idx) => (
                      <div key={rev.id || idx} className="p-3 border rounded-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="fw-bold text-dark">{rev.user?.username || rev.userName || "Event Attendee"}</div>
                          <div className="text-warning">
                            {Array.from({ length: rev.rating || 5 }, (_, i) => (
                              <i key={i} className="fa-solid fa-star"></i>
                            ))}
                          </div>
                        </div>
                        <p className="small text-secondary mb-0">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Review Form */}
                <form onSubmit={handleReviewSubmit} className="p-3 border rounded-4 bg-light">
                  <h6 className="fw-bold mb-2">Leave a Community Review</h6>
                  <div className="mb-2 d-flex align-items-center gap-2">
                    <span className="small text-muted fw-semibold">Rating:</span>
                    <select
                      className="form-select form-select-sm rounded-3"
                      style={{ width: "120px" }}
                      value={rating}
                      onChange={e => setRating(Number(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                      <option value={2}>⭐⭐ (2/5)</option>
                      <option value={1}>⭐ (1/5)</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <textarea
                      className="form-control rounded-3"
                      rows={2}
                      placeholder="Share your thoughts about this Pakistani event..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary-gradient btn-sm rounded-pill px-4" disabled={submittingReview}>
                    {submittingReview ? "Submitting..." : "Post Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: RSVP Box, Organizer, Related Events */}
            <div className="col-lg-4">
              {/* RSVP Pass Card */}
              <div className="detail-sidebar-card mb-4 bg-white p-4 rounded-4 shadow-sm border sticky-top" style={{ top: "85px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small text-uppercase fw-semibold">Pass Status</span>
                  <span className={`badge ${hasRsvpd ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-primary-subtle text-primary border border-primary-subtle'} rounded-pill px-3 py-1`}>
                    {hasRsvpd ? 'Pass Registered 🎟️' : 'Admission Open'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="display-6 fw-bold text-dark mb-1">{event.price}</div>
                  <div className="small text-muted">{event.rsvpCount || 0} attendees confirmed &bull; Capacity: {event.capacity || 500}</div>
                </div>

                {/* Tickets Counter */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Number of Tickets / Passes:</label>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setTicketsCount(Math.max(1, ticketsCount - 1))}>-</button>
                    <input type="text" className="form-control text-center bg-white" value={ticketsCount} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setTicketsCount(Math.min(10, ticketsCount + 1))}>+</button>
                  </div>
                </div>

                {/* RSVP Button */}
                <button
                  type="button"
                  className={`btn ${hasRsvpd ? 'btn-outline-danger' : 'btn-primary-gradient'} w-100 py-2 rounded-pill fw-bold mb-2 shadow-sm`}
                  onClick={handleRsvp}
                >
                  <i className={`fa-solid ${hasRsvpd ? 'fa-xmark' : 'fa-ticket'} me-2`}></i>
                  {hasRsvpd ? 'Cancel Registration' : 'Reserve Event Pass 🇵🇰'}
                </button>

                {/* Save to Bookmarks */}
                <button
                  type="button"
                  className={`btn ${isBookmarked ? 'btn-danger' : 'btn-outline-secondary'} w-100 py-2 rounded-pill fw-semibold`}
                  onClick={handleBookmark}
                >
                  <i className={`fa-${isBookmarked ? 'solid' : 'regular'} fa-heart me-1`}></i>
                  <span>{isBookmarked ? 'Saved in Bookmarks' : 'Save Event to Favorites'}</span>
                </button>
              </div>

              {/* Host Profile Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <h5 className="fw-bold mb-3"><i className="fa-solid fa-building-flag text-primary me-2"></i> Event Host / Organization</h5>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="brand-icon" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                    <i className="fa-solid fa-landmark"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">{event.organizerName || "Pakistan Community Host"}</div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">Verified Pakistani Host 🇵🇰</span>
                  </div>
                </div>
                <div className="small text-muted d-flex flex-column gap-2">
                  <div>
                    <i className="fa-regular fa-envelope text-primary me-2"></i>
                    <a href={`mailto:${event.organizerEmail || 'contact@eventdiscovery.pk'}`} className="text-muted text-decoration-none">
                      {event.organizerEmail || "contact@eventdiscovery.pk"}
                    </a>
                  </div>
                  <div>
                    <i className="fa-solid fa-phone text-success me-2"></i>
                    <span>{event.organizerPhone || "+92 300 0000000"}</span>
                  </div>
                </div>
              </div>

              {/* Related Events */}
              {relatedEvents.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h5 className="fw-bold mb-3">More in This Category</h5>
                  <div className="d-flex flex-column gap-3">
                    {relatedEvents.map(rel => (
                      <Link
                        key={rel.id}
                        href={`/events/${rel.slug}`}
                        className="d-flex gap-3 text-decoration-none text-dark align-items-center p-2 rounded-3 hover-bg-light"
                      >
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="rounded-3 object-fit-cover"
                          style={{ width: "60px", height: "60px" }}
                        />
                        <div>
                          <div className="fw-bold text-truncate" style={{ maxWidth: "180px" }}>{rel.title}</div>
                          <div className="small text-muted">{rel.city} &bull; {rel.price}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
