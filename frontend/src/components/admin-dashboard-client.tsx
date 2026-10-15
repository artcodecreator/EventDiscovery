"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type EventItem = {
  id: number | string;
  documentId?: string;
  title: string;
  slug: string;
  category: string;
  categoryColor?: string;
  categoryIcon?: string;
  city: string;
  venueName?: string;
  venue?: string;
  eventDate?: string;
  date?: string;
  startTime?: string;
  time?: string;
  price?: string;
  priceValue?: number;
  isFree?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  status?: string;
  image?: string;
  organizerName?: string;
  organizerEmail?: string;
  rsvpCount?: number;
};

type UserItem = {
  id: string;
  name: string;
  email: string;
  city?: string;
  phone?: string;
  role?: string;
};

export function AdminDashboardClient({
  initialEvents,
  initialStats,
  initialUsers
}: {
  initialEvents: EventItem[];
  initialStats: { totalEvents: number; pendingApprovals: number; totalRsvps: number; estimatedRevenue: number };
  initialUsers: UserItem[];
}) {
  const [activeTab, setActiveTab] = useState<"approvals" | "events" | "users">("approvals");
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [stats, setStats] = useState(initialStats);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "warning" | "danger" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "warning" | "danger" | "info" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [eventsRes, statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/events").then(r => r.json()),
        fetch("/api/admin/stats").then(r => r.json()),
        fetch("/api/admin/users").then(r => r.json())
      ]);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      showToast("Admin data refreshed.", "info");
    } catch {
      showToast("Failed to refresh data", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number | string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Event approved! It is now live in public search and discovery.", "success");
        setEvents(prev => prev.map(e => (String(e.id) === String(id) ? { ...e, status: "approved" } : e)));
        setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
      }
    } catch {
      showToast("Error approving event", "danger");
    }
  };

  const handleReject = async (id: number | string) => {
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Event submission marked as rejected.", "warning");
        setEvents(prev => prev.map(e => (String(e.id) === String(id) ? { ...e, status: "rejected" } : e)));
        setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
      }
    } catch {
      showToast("Error rejecting event", "danger");
    }
  };

  const handleToggleFeatured = async (id: number | string) => {
    try {
      const res = await fetch("/api/admin/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.isFeatured ? "Event marked as FEATURED on homepage." : "Event removed from featured.", "info");
        setEvents(prev => prev.map(e => (String(e.id) === String(id) ? { ...e, featured: data.isFeatured, isFeatured: data.isFeatured } : e)));
      }
    } catch {
      showToast("Error updating featured status", "danger");
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to remove this event from EventDiscovery Pakistan?")) return;
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Event deleted.", "danger");
        setEvents(prev => prev.filter(e => String(e.id) !== String(id)));
        setStats(prev => ({ ...prev, totalEvents: Math.max(0, prev.totalEvents - 1) }));
      }
    } catch {
      showToast("Error deleting event", "danger");
    }
  };

  const pendingEvents = events.filter(e => e.status === "pending");
  const filteredEvents = events.filter(e => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.venueName && e.venueName.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Toast alert */}
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

      {/* Admin Title Bar */}
      <div className="bg-dark text-white py-4 border-bottom border-dark">
        <div className="container-fluid px-lg-5">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span className="admin-badge mb-2 d-inline-block">
                <i className="fa-solid fa-shield-halved me-1"></i> Super Admin Panel
              </span>
              <h1 className="h2 fw-bold mb-1">Platform Management & Approval Center</h1>
              <p className="text-muted small mb-0">Oversee event submissions, community approvals, ticket analytics, and user accounts across Pakistan.</p>
            </div>
            <div className="d-flex gap-2">
              <Link href="/submit-event" className="btn btn-primary-gradient btn-sm rounded-pill px-3 py-2 fw-semibold">
                <i className="fa-solid fa-plus me-1"></i> Add New Event
              </Link>
              <button type="button" className="btn btn-outline-light btn-sm rounded-pill px-3 py-2" onClick={refreshData} disabled={loading}>
                <i className={`fa-solid fa-rotate me-1 ${loading ? "fa-spin" : ""}`}></i> Refresh Stats
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid px-lg-5">
          {/* KPI Analytics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-xl-3 col-sm-6">
              <div className="admin-card-stat">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small fw-semibold text-uppercase">Total Events Listed</div>
                    <h3 className="fw-bold mt-1 mb-0">{stats.totalEvents}</h3>
                    <div className="small text-success mt-1"><i className="fa-solid fa-arrow-trend-up me-1"></i> Active in Pakistan</div>
                  </div>
                  <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6">
              <div className="admin-card-stat">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small fw-semibold text-uppercase">Pending Approvals</div>
                    <h3 className="fw-bold mt-1 mb-0 text-warning">{stats.pendingApprovals}</h3>
                    <div className="small text-muted mt-1"><i className="fa-solid fa-clock me-1"></i> Awaiting Review</div>
                  </div>
                  <div className="stat-icon-wrapper bg-warning-subtle text-warning">
                    <i className="fa-solid fa-hourglass-half"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6">
              <div className="admin-card-stat">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small fw-semibold text-uppercase">Total RSVP Registrations</div>
                    <h3 className="fw-bold mt-1 mb-0">{stats.totalRsvps.toLocaleString()}</h3>
                    <div className="small text-info mt-1"><i className="fa-solid fa-users me-1"></i> Verified Attendees</div>
                  </div>
                  <div className="stat-icon-wrapper bg-info-subtle text-info">
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-sm-6">
              <div className="admin-card-stat">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small fw-semibold text-uppercase">Estimated Pass Revenue</div>
                    <h3 className="fw-bold mt-1 mb-0 text-success">Rs. {stats.estimatedRevenue.toLocaleString()}</h3>
                    <div className="small text-muted mt-1">Currency: PKR 🇵🇰</div>
                  </div>
                  <div className="stat-icon-wrapper bg-success-subtle text-success">
                    <i className="fa-solid fa-money-bill-wave"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Management Interface */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white border-bottom p-0">
              <ul className="nav nav-tabs border-0 px-3 pt-2 flex-nowrap overflow-x-auto text-nowrap admin-nav-tabs">
                <li className="nav-item flex-shrink-0">
                  <button
                    className={`nav-link fw-semibold py-2 py-md-3 px-3 px-md-4 border-0 ${activeTab === "approvals" ? "active border-bottom border-3 border-primary text-dark" : "text-muted"}`}
                    onClick={() => setActiveTab("approvals")}
                  >
                    <i className="fa-solid fa-stamp me-2 text-warning"></i> Event Approval Workflow
                    <span className="badge bg-warning text-dark ms-2 rounded-pill">{pendingEvents.length}</span>
                  </button>
                </li>
                <li className="nav-item flex-shrink-0">
                  <button
                    className={`nav-link fw-semibold py-2 py-md-3 px-3 px-md-4 border-0 ${activeTab === "events" ? "active border-bottom border-3 border-primary text-dark" : "text-muted"}`}
                    onClick={() => setActiveTab("events")}
                  >
                    <i className="fa-solid fa-list-check me-2 text-primary"></i> All Events Management
                  </button>
                </li>
                <li className="nav-item flex-shrink-0">
                  <button
                    className={`nav-link fw-semibold py-2 py-md-3 px-3 px-md-4 border-0 ${activeTab === "users" ? "active border-bottom border-3 border-primary text-dark" : "text-muted"}`}
                    onClick={() => setActiveTab("users")}
                  >
                    <i className="fa-solid fa-users-gear me-2 text-info"></i> Registered Accounts
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body p-4 bg-white">
              {/* TAB 1: Event Approvals */}
              {activeTab === "approvals" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Submissions Requiring Review</h5>
                      <p className="text-muted small mb-0">Approve or reject public submissions before they appear in public listings.</p>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>City & Venue</th>
                          <th>Date / Time</th>
                          <th>Access Model</th>
                          <th>Host / Organizer</th>
                          <th>Status</th>
                          <th className="text-end">Review Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingEvents.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-5 text-muted">
                              <i className="fa-solid fa-circle-check fa-3x text-success mb-2 d-block"></i>
                              <h6 className="fw-bold text-dark">All Submissions Approved!</h6>
                              <p className="small text-muted mb-0">There are no pending events waiting for review right now.</p>
                            </td>
                          </tr>
                        ) : (
                          pendingEvents.map(ev => (
                            <tr key={ev.id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={ev.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100"}
                                    alt={ev.title}
                                    className="rounded-2 object-fit-cover"
                                    style={{ width: "44px", height: "44px" }}
                                  />
                                  <div>
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "220px" }}>{ev.title}</div>
                                    <span className="badge" style={{ backgroundColor: ev.categoryColor || "#6366f1", color: "#fff", fontSize: "0.65rem" }}>
                                      {ev.category}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="small fw-semibold text-dark">{ev.venueName || ev.venue}</div>
                                <div className="text-muted small">{ev.city}</div>
                              </td>
                              <td>
                                <div className="small text-dark">{ev.eventDate || ev.date}</div>
                                <div className="text-muted small">{ev.startTime || ev.time} PKT</div>
                              </td>
                              <td>{ev.isFree ? <span className="text-success fw-bold">Free</span> : (ev.price || `Rs. ${ev.priceValue}`)}</td>
                              <td>
                                <div className="small fw-semibold">{ev.organizerName}</div>
                                <div className="text-muted small">{ev.organizerEmail}</div>
                              </td>
                              <td>
                                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">Pending</span>
                              </td>
                              <td className="text-end">
                                <div className="d-flex gap-1 justify-content-end">
                                  <button type="button" className="btn btn-success btn-sm rounded-pill px-3" onClick={() => handleApprove(ev.id)}>
                                    <i className="fa-solid fa-check me-1"></i> Approve
                                  </button>
                                  <button type="button" className="btn btn-outline-danger btn-sm rounded-pill px-2" onClick={() => handleReject(ev.id)}>
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: All Events Directory */}
              {activeTab === "events" && (
                <div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Master Event Directory</h5>
                      <p className="text-muted small mb-0">Toggle featured status, inspect passes, and manage event lifecycles.</p>
                    </div>
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        placeholder="Filter by title, city..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ minWidth: "220px" }}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Banner & Title</th>
                          <th>Category</th>
                          <th>City</th>
                          <th>RSVPs</th>
                          <th>Featured</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents.map(ev => {
                          const isFeatured = ev.featured || ev.isFeatured;
                          const statusBadge =
                            ev.status === "pending" ? (
                              <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Pending</span>
                            ) : ev.status === "rejected" ? (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Rejected</span>
                            ) : (
                              <span className="badge bg-success-subtle text-success border border-success-subtle">Approved</span>
                            );

                          return (
                            <tr key={ev.id}>
                              <td className="text-muted small">#{ev.id}</td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={ev.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100"}
                                    alt={ev.title}
                                    className="rounded-2 object-fit-cover"
                                    style={{ width: "40px", height: "40px" }}
                                  />
                                  <div>
                                    <Link href={`/events/${ev.slug}`} target="_blank" className="fw-bold text-dark text-decoration-none hover-primary text-truncate d-block" style={{ maxWidth: "240px" }}>
                                      {ev.title}
                                    </Link>
                                    <div className="text-muted small">{ev.venueName || ev.venue}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge" style={{ backgroundColor: ev.categoryColor || "#6366f1", color: "#fff", fontSize: "0.65rem" }}>
                                  {ev.category}
                                </span>
                              </td>
                              <td><span className="badge bg-light text-dark border">{ev.city}</span></td>
                              <td><span className="fw-bold text-primary">{ev.rsvpCount || 0}</span></td>
                              <td>
                                <button
                                  type="button"
                                  className={`btn btn-sm ${isFeatured ? "btn-warning text-dark" : "btn-outline-secondary"} rounded-pill px-2 py-1`}
                                  style={{ fontSize: "0.75rem" }}
                                  onClick={() => handleToggleFeatured(ev.id)}
                                >
                                  <i className={`fa-solid ${isFeatured ? "fa-star" : "fa-star-half-stroke"} me-1`}></i>
                                  {isFeatured ? "Featured" : "Standard"}
                                </button>
                              </td>
                              <td>{statusBadge}</td>
                              <td className="text-end">
                                <div className="d-flex gap-1 justify-content-end">
                                  <Link href={`/events/${ev.slug}`} className="btn btn-light btn-sm rounded-circle" title="View Public Page">
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                  </Link>
                                  <button type="button" className="btn btn-outline-danger btn-sm rounded-circle" title="Delete Event" onClick={() => handleDelete(ev.id)}>
                                    <i className="fa-regular fa-trash-can"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Registered Accounts */}
              {activeTab === "users" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Community Members & Organizers</h5>
                      <p className="text-muted small mb-0">Manage roles and profiles across Pakistan.</p>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Email Address</th>
                          <th>City</th>
                          <th>Phone</th>
                          <th>Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                                  alt={u.name}
                                  className="rounded-circle"
                                  style={{ width: "36px", height: "36px", objectFit: "cover" }}
                                />
                                <div className="fw-semibold text-dark">{u.name}</div>
                              </div>
                            </td>
                            <td className="text-muted small">{u.email}</td>
                            <td><span className="badge bg-light text-dark border">{u.city || "Lahore"}</span></td>
                            <td className="text-muted small">{u.phone || "+92 300 0000000"}</td>
                            <td>
                              <span className={`badge ${u.role === "admin" ? "bg-danger-subtle text-danger border border-danger-subtle" : "bg-primary-subtle text-primary border border-primary-subtle"}`}>
                                {(u.role || "USER").toUpperCase()}
                              </span>
                            </td>
                            <td><span className="badge bg-success-subtle text-success border border-success-subtle">Active</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
