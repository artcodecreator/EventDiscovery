"use client";

import { useEffect, useRef } from "react";
import { EventItem } from "@/lib/events";

export default function MapPreview({ events }: { events: EventItem[] }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    import("leaflet").then(L => {
      if (cancelled || !host.current) return;

      const current = L.map(host.current, { scrollWheelZoom: false }).setView([30.5, 69.5], 5);
      map = current;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(current);

      const markers: any[] = [];
      events.forEach(event => {
        const lat = event.latitude || event.lat;
        const lng = event.longitude || event.lng;
        if (!lat || !lng) return;

        const customIcon = L.divIcon({
          className: "custom-map-pin",
          html: `
            <div class="custom-map-marker" style="background-color: ${event.categoryColor || '#6366f1'}">
              <i class="fa-solid ${event.categoryIcon || 'fa-calendar'}"></i>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18]
        });

        const popup = document.createElement("div");
        popup.className = "map-popup-card";
        popup.innerHTML = `
          <img src="${event.image}" alt="${event.title}" style="width:100%; height:90px; object-fit:cover; border-radius: 6px 6px 0 0;">
          <div style="padding: 8px;">
            <span class="badge" style="background-color:${event.categoryColor || '#6366f1'}; color:#fff; font-size:0.65rem;">${event.category}</span>
            <div style="font-weight:bold; font-size:0.85rem; margin-top:2px;">
              <a href="/events/${event.slug}" style="color:#0f172a; text-decoration:none;">${event.title}</a>
            </div>
            <div style="font-size:0.7rem; color:#64748b; margin-top:2px;">${event.city} &bull; ${event.price}</div>
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: customIcon })
          .bindPopup(popup)
          .addTo(current);

        markers.push(marker);
      });

      if (markers.length > 1) {
        const group = (L as any).featureGroup(markers);
        current.fitBounds(group.getBounds().pad(0.1));
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [events]);

  return <div ref={host} className="w-100 h-100" aria-label="Interactive map of Pakistani events" />;
}
