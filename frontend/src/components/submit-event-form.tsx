"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EventCategory } from "@/lib/events";

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Lahore: { lat: 31.5204, lng: 74.3587 },
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Rawalpindi: { lat: 33.5651, lng: 73.0169 },
  Peshawar: { lat: 34.0151, lng: 71.5805 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Faisalabad: { lat: 31.4504, lng: 73.135 },
  Quetta: { lat: 30.1798, lng: 66.975 }
};

export function SubmitEventForm({ categories }: { categories: EventCategory[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category_id: categories[0]?.slug || "technology",
    capacity: 250,
    short_description: "",
    full_description: "",
    event_date: new Date().toISOString().slice(0, 10),
    start_time: "18:00",
    end_time: "21:30",
    ticket_type: "free",
    price: 0,
    city: "Lahore",
    venue_name: "",
    address: "",
    latitude: 31.5204,
    longitude: 74.3587,
    image: "",
    organizer_name: "",
    organizer_email: "",
    organizer_phone: "+92 300 "
  });

  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCityChange = (city: string) => {
    const coords = CITY_COORDS[city] || CITY_COORDS["Lahore"];
    setFormData(prev => ({
      ...prev,
      city,
      latitude: coords.lat,
      longitude: coords.lng
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/submit-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.status === 401) {
        window.location.href = "/login?next=/submit-event";
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit event. Please check inputs.");
        return;
      }

      setSuccessNotice("Your event submission was received! It is now pending admin review and approval. 🇵🇰");
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch {
      setErrorMessage("Network error submitting event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card bg-white p-4 p-md-5 rounded-4 shadow-sm border">
      {successNotice && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
          <i className="fa-solid fa-circle-check fa-lg"></i>
          <div>{successNotice}</div>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <i className="fa-solid fa-triangle-exclamation fa-lg"></i>
          <div>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <span className="badge bg-primary rounded-circle" style={{ width: "24px", height: "24px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>1</span>
            Event Basic Information
          </h5>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Event Title <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control rounded-3 p-2"
              placeholder="e.g. Lahore Tech Conclave 2026 or Sufi Night at Lok Virsa"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
              minLength={5}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-muted">Category <span className="text-danger">*</span></label>
              <select
                className="form-select rounded-3 p-2"
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-muted">Max Capacity (Seats / Attendees) <span className="text-danger">*</span></label>
              <input
                type="number"
                className="form-control rounded-3 p-2"
                min={10}
                max={50000}
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Short Summary (1-2 sentences) <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control rounded-3 p-2"
              placeholder="A brief hook shown on cards and search results..."
              value={formData.short_description}
              onChange={e => setFormData({ ...formData, short_description: e.target.value })}
              required
              maxLength={200}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Full Event Agenda & Details <span className="text-danger">*</span></label>
            <textarea
              className="form-control rounded-3 p-2"
              rows={5}
              placeholder="Provide complete schedule, keynote speakers, parking instructions, entry guidelines in Pakistan..."
              value={formData.full_description}
              onChange={e => setFormData({ ...formData, full_description: e.target.value })}
              required
            ></textarea>
          </div>
        </div>

        {/* Section 2: Schedule & Ticket Pricing */}
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <span className="badge bg-primary rounded-circle" style={{ width: "24px", height: "24px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>2</span>
            Schedule & Ticket Pricing (PKR / PKT)
          </h5>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Date <span className="text-danger">*</span></label>
              <input
                type="date"
                className="form-control rounded-3 p-2"
                value={formData.event_date}
                onChange={e => setFormData({ ...formData, event_date: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Start Time (PKT) <span className="text-danger">*</span></label>
              <input
                type="time"
                className="form-control rounded-3 p-2"
                value={formData.start_time}
                onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">End Time (PKT)</label>
              <input
                type="time"
                className="form-control rounded-3 p-2"
                value={formData.end_time}
                onChange={e => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-muted d-block">Access Model</label>
              <div className="d-flex gap-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="ticket_type"
                    id="typeFree"
                    value="free"
                    checked={formData.ticket_type === "free"}
                    onChange={() => setFormData({ ...formData, ticket_type: "free", price: 0 })}
                  />
                  <label className="form-check-label fw-semibold text-success" htmlFor="typeFree">
                    <i className="fa-solid fa-gift me-1"></i> Free Entry
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="ticket_type"
                    id="typePaid"
                    value="paid"
                    checked={formData.ticket_type === "paid"}
                    onChange={() => setFormData({ ...formData, ticket_type: "paid" })}
                  />
                  <label className="form-check-label fw-semibold text-dark" htmlFor="typePaid">
                    <i className="fa-solid fa-money-bill-wave me-1 text-primary"></i> Paid Pass (PKR)
                  </label>
                </div>
              </div>
            </div>
            {formData.ticket_type === "paid" && (
              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">Ticket Price (PKR / Rs.)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold text-muted">Rs.</span>
                  <input
                    type="number"
                    className="form-control rounded-end-3 p-2"
                    min={50}
                    step={50}
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Venue & Location */}
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <span className="badge bg-primary rounded-circle" style={{ width: "24px", height: "24px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>3</span>
            Venue & Pakistan Location
          </h5>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-muted">City in Pakistan <span className="text-danger">*</span></label>
              <select
                className="form-select rounded-3 p-2"
                value={formData.city}
                onChange={e => handleCityChange(e.target.value)}
                required
              >
                <option value="Lahore">Lahore, Punjab</option>
                <option value="Karachi">Karachi, Sindh</option>
                <option value="Islamabad">Islamabad (Capital)</option>
                <option value="Rawalpindi">Rawalpindi, Punjab</option>
                <option value="Peshawar">Peshawar, Khyber Pakhtunkhwa</option>
                <option value="Multan">Multan, Punjab</option>
                <option value="Faisalabad">Faisalabad, Punjab</option>
                <option value="Quetta">Quetta, Balochistan</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-muted">Venue Name / Hall / Auditorium <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control rounded-3 p-2"
                placeholder="e.g. Expo Centre Hall 1, Alhamra Arts Council, Beach View Park"
                value={formData.venue_name}
                onChange={e => setFormData({ ...formData, venue_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Full Physical Address</label>
            <input
              type="text"
              className="form-control rounded-3 p-2"
              placeholder="e.g. Block L, Phase 2, Johar Town or Shahrah-e-Firdousi, Clifton"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        {/* Section 4: Banner Image & Preview */}
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <span className="badge bg-primary rounded-circle" style={{ width: "24px", height: "24px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>4</span>
            Event Cover Banner
          </h5>

          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Cover Image URL (Web or Unsplash)</label>
            <input
              type="url"
              className="form-control rounded-3 p-2"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.image}
              onChange={e => handleImageChange(e.target.value)}
            />
            <div className="form-text small">Leave blank to use the default high-resolution category banner.</div>
          </div>

          {imagePreview && (
            <div className="p-3 bg-light rounded-3 text-center border mb-3">
              <div className="small text-muted mb-2 fw-semibold">Banner Preview:</div>
              <img src={imagePreview} alt="Banner Preview" className="rounded-3 shadow-sm object-fit-cover" style={{ maxHeight: "200px", width: "100%" }} />
            </div>
          )}
        </div>

        {/* Section 5: Organizer Details */}
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <span className="badge bg-primary rounded-circle" style={{ width: "24px", height: "24px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>5</span>
            Organizer Contact Details
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Host / Organization Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control rounded-3 p-2"
                placeholder="e.g. Lahore Tech Society"
                value={formData.organizer_name}
                onChange={e => setFormData({ ...formData, organizer_name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Host Contact Email <span className="text-danger">*</span></label>
              <input
                type="email"
                className="form-control rounded-3 p-2"
                placeholder="contact@organization.pk"
                value={formData.organizer_email}
                onChange={e => setFormData({ ...formData, organizer_email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small text-muted">Host Contact Phone</label>
              <input
                type="tel"
                className="form-control rounded-3 p-2"
                placeholder="+92 300 1234567"
                value={formData.organizer_phone}
                onChange={e => setFormData({ ...formData, organizer_phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-3">
          <Link href="/events" className="btn btn-outline-secondary rounded-pill px-4">
            <i className="fa-solid fa-arrow-left me-1"></i> Cancel
          </Link>
          <button type="submit" className="btn btn-primary-gradient rounded-pill px-5 py-2 fw-bold" disabled={submitting}>
            <i className={`fa-solid ${submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'} me-2`}></i>
            {submitting ? "Submitting..." : "Submit Event for Approval 🇵🇰"}
          </button>
        </div>
      </form>
    </div>
  );
}
