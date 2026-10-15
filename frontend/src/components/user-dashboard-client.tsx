"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type UserRsvp = {
  id: string;
  ticketsCount: number;
  createdAt: string;
  event: any;
};

type UserFavorite = {
  id: string;
  createdAt: string;
  event: any;
};

export function UserDashboardClient({
  user,
  initialRsvps,
  initialFavorites
}: {
  user: { name?: string | null; email?: string | null; city?: string; phone?: string; bio?: string; role?: string };
  initialRsvps: UserRsvp[];
  initialFavorites: UserFavorite[];
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "passes" | "saved" | "activity" | "settings">("overview");
  const [rsvps, setRsvps] = useState<UserRsvp[]>(initialRsvps);
  const [favorites, setFavorites] = useState<UserFavorite[]>(initialFavorites);
  const [profileData, setProfileData] = useState({
    name: user.name || "Ahmed Khan",
    email: user.email || "ahmed.khan@eventdiscovery.pk",
    city: user.city || "Lahore",
    phone: user.phone || "+92 300 8472911",
    bio: user.bio || "Active Pakistani tech community enthusiast and cultural event attendee."
  });
  const [selectedPassEvent, setSelectedPassEvent] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" | "warning" | "danger" } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const showToast = (text: string, type: "success" | "info" | "warning" | "danger" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const cancelPass = async (eventId: number | string) => {
    if (!confirm("Are you sure you want to cancel this event pass registration?")) return;
    try {
      const res = await fetch("/api/rsvps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId })
      });
      const data = await res.json();
      setRsvps(prev => prev.filter(r => String(r.event?.id) !== String(eventId)));
      showToast("Event pass cancelled.", "info");
    } catch {
      showToast("Failed to cancel pass", "danger");
    }
  };

  const removeFavorite = async (eventId: number | string) => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId })
      });
      setFavorites(prev => prev.filter(f => String(f.event?.id) !== String(eventId)));
      showToast("Event removed from saved bookmarks.", "info");
    } catch {
      showToast("Failed to remove bookmark", "danger");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      showToast("Profile changes saved successfully! 🇵🇰", "success");
    } catch {
      showToast("Error updating profile", "danger");
    } finally {
      setProfileSaving(false);
    }
  };

  const nextUpcomingEvent = rsvps[0]?.event;

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

      {/* Page Title Bar */}
      <div className="bg-dark text-white py-4 border-bottom border-dark">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 small text-muted">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">User Dashboard</li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="h2 fw-bold mb-1">Welcome Back, {profileData.name.split(" ")[0]}! 🇵🇰</h1>
              <p className="text-muted small mb-0">Manage your active event passes, saved bookmarks, and Pakistani profile preferences.</p>
            </div>
            <div className="d-flex gap-2">
              <Link href="/events" className="btn btn-primary-gradient btn-sm rounded-pill px-3 py-2 fw-semibold">
                <i className="fa-solid fa-compass me-1"></i> Discover Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="row g-4">
            {/* Left Sidebar: Profile Card & Navigation Pills */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center mb-3 bg-white">
                <div className="position-relative d-inline-block mx-auto mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
                    alt="User Avatar"
                    className="rounded-circle shadow-sm"
                    style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid var(--primary-color)" }}
                  />
                </div>
                <h5 className="fw-bold mb-0 text-dark">{profileData.name}</h5>
                <p className="text-muted small mb-2">{profileData.email}</p>
                <div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
                    <i className="fa-solid fa-circle-check me-1"></i> Verified User
                  </span>
                </div>
              </div>

              {/* Navigation Pills */}
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <div className="nav nav-pills dashboard-nav-pills d-flex flex-row flex-lg-column overflow-x-auto text-nowrap pb-1 pb-lg-0">
                  <button
                    className={`nav-link d-flex align-items-center gap-2 mb-lg-1 flex-shrink-0 me-1 me-lg-0 ${activeTab === "overview" ? "active" : ""}`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <i className="fa-solid fa-chart-pie me-1"></i> Overview
                  </button>
                  <button
                    className={`nav-link d-flex align-items-center justify-content-between mb-lg-1 flex-shrink-0 me-1 me-lg-0 ${activeTab === "passes" ? "active" : ""}`}
                    onClick={() => setActiveTab("passes")}
                  >
                    <span><i className="fa-solid fa-ticket me-2"></i> My Passes (RSVP)</span>
                    <span className="badge bg-primary text-white rounded-pill ms-2">{rsvps.length}</span>
                  </button>
                  <button
                    className={`nav-link d-flex align-items-center justify-content-between mb-lg-1 flex-shrink-0 me-1 me-lg-0 ${activeTab === "saved" ? "active" : ""}`}
                    onClick={() => setActiveTab("saved")}
                  >
                    <span><i className="fa-solid fa-heart me-2 text-danger"></i> Saved Bookmarks</span>
                    <span className="badge bg-danger text-white rounded-pill ms-2">{favorites.length}</span>
                  </button>
                  <button
                    className={`nav-link d-flex align-items-center gap-2 mb-lg-1 flex-shrink-0 me-1 me-lg-0 ${activeTab === "activity" ? "active" : ""}`}
                    onClick={() => setActiveTab("activity")}
                  >
                    <i className="fa-solid fa-clock-rotate-left me-1"></i> Activity History
                  </button>
                  <button
                    className={`nav-link d-flex align-items-center gap-2 mb-lg-1 flex-shrink-0 me-1 me-lg-0 ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <i className="fa-solid fa-gear me-1"></i> Profile Settings
                  </button>
                  <hr className="d-none d-lg-block my-2 border-secondary-subtle" />
                  <button
                    className="nav-link text-danger d-flex align-items-center gap-2 flex-shrink-0"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <i className="fa-solid fa-right-from-bracket me-1"></i> Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Right Area: Tab Contents */}
            <div className="col-lg-9">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div>
                  <div className="row g-3 mb-4">
                    <div className="col-sm-4">
                      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex align-items-center gap-3">
                          <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                            <i className="fa-solid fa-ticket"></i>
                          </div>
                          <div>
                            <div className="text-muted small fw-semibold text-uppercase">Active Passes</div>
                            <h3 className="fw-bold mb-0">{rsvps.length}</h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex align-items-center gap-3">
                          <div className="stat-icon-wrapper bg-danger-subtle text-danger">
                            <i className="fa-solid fa-heart"></i>
                          </div>
                          <div>
                            <div className="text-muted small fw-semibold text-uppercase">Bookmarks</div>
                            <h3 className="fw-bold mb-0">{favorites.length}</h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                        <div className="d-flex align-items-center gap-3">
                          <div className="stat-icon-wrapper bg-success-subtle text-success">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          <div>
                            <div className="text-muted small fw-semibold text-uppercase">Home City</div>
                            <h4 className="fw-bold mb-0 text-truncate">{profileData.city}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Upcoming Pass Banner */}
                  {nextUpcomingEvent && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-white" style={{ background: "var(--primary-gradient)" }}>
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-bold mb-2">
                            <i className="fa-solid fa-qrcode me-1 text-primary"></i> Digital Pass Ready
                          </span>
                          <h4 className="fw-bold mb-1">{nextUpcomingEvent.title}</h4>
                          <p className="mb-0 opacity-90 small">
                            <i className="fa-solid fa-location-dot me-1"></i> {nextUpcomingEvent.venueName || nextUpcomingEvent.venue}, {nextUpcomingEvent.city} &bull; {nextUpcomingEvent.eventDate || nextUpcomingEvent.date}
                          </p>
                        </div>
                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                          <button
                            type="button"
                            className="btn btn-light text-primary rounded-pill px-4 fw-bold shadow-sm"
                            onClick={() => setSelectedPassEvent(nextUpcomingEvent)}
                          >
                            <i className="fa-solid fa-eye me-1"></i> View QR Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Pass List */}
                  <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">Upcoming Event Passes</h5>
                      <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => setActiveTab("passes")}>
                        View All Passes
                      </button>
                    </div>
                    {rsvps.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        <i className="fa-regular fa-calendar-xmark fa-2x mb-2 d-block"></i>
                        <p className="small mb-0">You do not have any registered event passes yet.</p>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {rsvps.slice(0, 3).map(r => (
                          <div className="col-md-6" key={r.id}>
                            <div className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "220px" }}>{r.event?.title}</div>
                                <div className="small text-muted">{r.event?.city} &bull; {r.ticketsCount || 1} pass(es)</div>
                              </div>
                              <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => setSelectedPassEvent(r.event)}>
                                <i className="fa-solid fa-qrcode"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: MY PASSES (RSVP WALLET) */}
              {activeTab === "passes" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-0">Digital Pass Wallet 🇵🇰</h5>
                      <p className="text-muted small mb-0">Present these QR passes at the venue entrance in Lahore, Karachi, Islamabad, etc.</p>
                    </div>
                    <Link href="/events" className="btn btn-primary-gradient btn-sm rounded-pill px-3">
                      <i className="fa-solid fa-plus me-1"></i> Get More Passes
                    </Link>
                  </div>
                  {rsvps.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="fa-solid fa-ticket fa-3x text-muted opacity-50 mb-3 d-block"></i>
                      <h6 className="fw-bold text-dark">No Active Passes</h6>
                      <p className="small text-muted">Explore events across Pakistan and RSVP to generate instant digital admission passes.</p>
                      <Link href="/events" className="btn btn-outline-primary rounded-pill px-4">Browse Events</Link>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {rsvps.map(r => (
                        <div className="col-md-6" key={r.id}>
                          <div className="card border rounded-4 overflow-hidden h-100 shadow-sm">
                            <div className="position-relative" style={{ height: "140px" }}>
                              <img
                                src={r.event?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600"}
                                alt={r.event?.title}
                                className="w-100 h-100 object-fit-cover"
                              />
                              <span className="badge bg-dark position-absolute top-0 end-0 m-2">
                                <i className="fa-solid fa-ticket text-primary me-1"></i> {r.ticketsCount || 1} Pass(es)
                              </span>
                            </div>
                            <div className="p-3">
                              <h6 className="fw-bold mb-1 text-truncate">{r.event?.title}</h6>
                              <div className="small text-muted mb-2"><i className="fa-solid fa-location-dot me-1 text-primary"></i> {r.event?.venueName || r.event?.venue}, {r.event?.city}</div>
                              <div className="small text-muted mb-3"><i className="fa-regular fa-clock me-1 text-info"></i> {r.event?.eventDate || r.event?.date} &bull; {r.event?.startTime || r.event?.time}</div>
                              <div className="d-flex gap-2">
                                <button className="btn btn-primary-gradient btn-sm flex-grow-1 rounded-pill" onClick={() => setSelectedPassEvent(r.event)}>
                                  <i className="fa-solid fa-qrcode me-1"></i> Show QR Pass
                                </button>
                                <button className="btn btn-outline-danger btn-sm rounded-pill px-3" title="Cancel Pass" onClick={() => cancelPass(r.event?.id)}>
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SAVED BOOKMARKS */}
              {activeTab === "saved" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-0">Saved Events (Bookmarks)</h5>
                      <p className="text-muted small mb-0">Events you have bookmarked for later exploration.</p>
                    </div>
                    <Link href="/events" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                      Explore More
                    </Link>
                  </div>
                  {favorites.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="fa-regular fa-heart fa-3x text-muted opacity-50 mb-3 d-block"></i>
                      <h6 className="fw-bold text-dark">No Saved Events</h6>
                      <p className="small text-muted">Tap the heart icon on any event card to save it here.</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {favorites.map(f => (
                        <div className="col-md-6" key={f.id}>
                          <div className="card border rounded-4 overflow-hidden h-100 shadow-sm">
                            <div className="position-relative" style={{ height: "130px" }}>
                              <img
                                src={f.event?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600"}
                                alt={f.event?.title}
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h6 className="fw-bold mb-1 text-truncate">
                                <Link href={`/events/${f.event?.slug}`} className="text-dark text-decoration-none hover-primary">
                                  {f.event?.title}
                                </Link>
                              </h6>
                              <div className="small text-muted mb-2">{f.event?.city} &bull; {f.event?.price || "Free Entry"}</div>
                              <div className="d-flex justify-content-between align-items-center">
                                <Link href={`/events/${f.event?.slug}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                  View Details
                                </Link>
                                <button className="btn btn-sm btn-outline-danger rounded-circle" title="Remove Bookmark" onClick={() => removeFavorite(f.event?.id)}>
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ACTIVITY HISTORY */}
              {activeTab === "activity" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                  <h5 className="fw-bold mb-3">Recent Account Actions</h5>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item px-0 py-3 d-flex align-items-center gap-3">
                      <div className="stat-icon-wrapper bg-success-subtle text-success rounded-circle" style={{ width: "40px", height: "40px" }}>
                        <i className="fa-solid fa-ticket"></i>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">Confirmed pass registration for Pakistan AI Summit 2026</div>
                        <div className="text-muted small">Expo Centre, Lahore &bull; 2 hours ago</div>
                      </div>
                    </div>
                    <div className="list-group-item px-0 py-3 d-flex align-items-center gap-3">
                      <div className="stat-icon-wrapper bg-danger-subtle text-danger rounded-circle" style={{ width: "40px", height: "40px" }}>
                        <i className="fa-solid fa-heart"></i>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">Added Coke Studio Live Concert to Bookmarks</div>
                        <div className="text-muted small">Alhamra Arts Council &bull; 1 day ago</div>
                      </div>
                    </div>
                    <div className="list-group-item px-0 py-3 d-flex align-items-center gap-3">
                      <div className="stat-icon-wrapper bg-info-subtle text-info rounded-circle" style={{ width: "40px", height: "40px" }}>
                        <i className="fa-solid fa-user-check"></i>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">Account signed in via verified session</div>
                        <div className="text-muted small">Lahore, Pakistan &bull; Today</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PROFILE SETTINGS */}
              {activeTab === "settings" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                  <h5 className="fw-bold mb-3">Profile Information</h5>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Full Name</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          value={profileData.name}
                          onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Email Address</label>
                        <input
                          type="email"
                          className="form-control rounded-3 bg-light"
                          value={profileData.email}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Primary City in Pakistan</label>
                        <select
                          className="form-select rounded-3"
                          value={profileData.city}
                          onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                        >
                          <option value="Lahore">Lahore, Punjab</option>
                          <option value="Karachi">Karachi, Sindh</option>
                          <option value="Islamabad">Islamabad (Capital)</option>
                          <option value="Rawalpindi">Rawalpindi, Punjab</option>
                          <option value="Peshawar">Peshawar, KP</option>
                          <option value="Multan">Multan, Punjab</option>
                          <option value="Faisalabad">Faisalabad, Punjab</option>
                          <option value="Quetta">Quetta, Balochistan</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Mobile Phone Number</label>
                        <input
                          type="tel"
                          className="form-control rounded-3"
                          value={profileData.phone}
                          onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-muted">Short Community Bio</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={3}
                        value={profileData.bio}
                        onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary-gradient rounded-pill px-4 fw-semibold" disabled={profileSaving}>
                      <i className={`fa-solid fa-floppy-disk me-1 ${profileSaving ? "fa-spin" : ""}`}></i> Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* QR Ticket Pass Modal */}
      {selectedPassEvent && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Official Event Pass 🇵🇰</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedPassEvent(null)}></button>
              </div>
              <div className="modal-body p-4 text-center bg-light">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-3">
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold mb-2">
                    <i className="fa-solid fa-circle-check me-1"></i> VERIFIED ADMISSION PASS
                  </span>
                  <h5 className="fw-bold mb-1">{selectedPassEvent.title}</h5>
                  <div className="small text-muted mb-3">{selectedPassEvent.venueName || selectedPassEvent.venue}, {selectedPassEvent.city}</div>

                  {/* QR Illustration */}
                  <div className="p-3 bg-light rounded-3 d-inline-block mx-auto mb-3 border">
                    <i className="fa-solid fa-qrcode fa-6x text-dark"></i>
                  </div>
                  <div className="fw-bold text-dark font-monospace">PK-PASS-{selectedPassEvent.id}8291-1</div>
                  <div className="text-muted small mt-1">
                    Attendee: <strong className="text-dark">{profileData.name}</strong>
                  </div>
                </div>
                <p className="text-muted small mb-0"><i className="fa-solid fa-circle-info me-1 text-primary"></i> Show this QR code at the venue check-in desk.</p>
              </div>
              <div className="modal-footer bg-light border-0 justify-content-between">
                <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => setSelectedPassEvent(null)}>Close</button>
                <button type="button" className="btn btn-primary-gradient rounded-pill px-4" onClick={() => window.print()}>
                  <i className="fa-solid fa-print me-1"></i> Print Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
