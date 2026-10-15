"use client";

import Link from "next/link";
import { EventItem } from "@/lib/events";

export function EventCard({ event }: { event: EventItem }) {
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id })
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="event-card card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all hover-lift">
      <div className="position-relative" style={{ height: "190px" }}>
        <img
          src={event.image}
          alt={event.title}
          className="w-100 h-100 object-fit-cover"
        />
        <span
          className="badge category-badge position-absolute top-0 start-0 m-3"
          style={{ backgroundColor: event.categoryColor || "#6366f1", color: "#fff", fontSize: "0.75rem" }}
        >
          <i className={`fa-solid ${event.categoryIcon || 'fa-tag'} me-1`}></i> {event.category}
        </span>
        <button
          className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm"
          onClick={handleFavorite}
          title="Bookmark event"
        >
          <i className="fa-regular fa-heart text-danger"></i>
        </button>
        <span className="badge bg-dark-glass position-absolute bottom-0 end-0 m-3 text-white">
          {event.price}
        </span>
      </div>

      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
          <span><i className="fa-solid fa-location-dot me-1 text-primary"></i> {event.venueName || event.venue}, {event.city}</span>
        </div>

        <h5 className="card-title fw-bold mb-2 fs-6">
          <Link href={`/events/${event.slug}`} className="text-dark text-decoration-none hover-primary">
            {event.title}
          </Link>
        </h5>

        <p className="card-text text-secondary small line-clamp-2 mb-3 flex-grow-1">
          {event.shortDescription || event.description}
        </p>

        <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
          <div>
            <div className="small fw-semibold text-dark"><i className="fa-regular fa-calendar me-1 text-primary"></i> {event.eventDate || event.date}</div>
            <div className="text-muted" style={{ fontSize: "0.75rem" }}>{event.startTime || event.time} PKT</div>
          </div>
          <Link href={`/events/${event.slug}`} className="btn btn-primary-gradient btn-sm rounded-pill px-3 fw-semibold">
            View Pass
          </Link>
        </div>
      </div>
    </div>
  );
}
