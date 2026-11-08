"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type EventItem = {
  id: number | string;
  documentId?: string;
  title: string;
  slug: string;
  category: string;
  categorySlug?: string;
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
  capacity?: number;
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
  status?: "active" | "suspended";
};

type CategoryItem = {
  id?: number | string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  eventCount?: number;
};

type ReviewItem = {
  id: number;
  eventId: number | string;
  eventTitle: string;
  eventSlug: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt?: string;
};

export function AdminDashboardClient({
  initialEvents,
  initialStats,
  initialUsers,
  initialCategories,
  initialReviews
}: {
  initialEvents: EventItem[];
  initialStats: { totalEvents: number; pendingApprovals: number; totalRsvps: number; estimatedRevenue: number };
  initialUsers: UserItem[];
  initialCategories: CategoryItem[];
  initialReviews: ReviewItem[];
}) {
  const [activeTab, setActiveTab] = useState<"approvals" | "events" | "categories" | "users" | "reviews">("approvals");
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [stats, setStats] = useState(initialStats);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);

  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "warning" | "danger" | "info" } | null>(null);

  // Edit Event State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    venue: "",
    city: "Lahore",
    date: "",
    time: "",
    category: "",
    isFree: true,
    price: "",
    capacity: 250
  });

  // Category Modal State
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    icon: "fa-layer-group",
    color: "#059669",
    description: ""
  });

  const showToast = (text: string, type: "success" | "warning" | "danger" | "info" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [eventsRes, statsRes, usersRes, catsRes, revsRes] = await Promise.all([
        fetch("/api/admin/events").then(r => r.json()),
        fetch("/api/admin/stats").then(r => r.json()),
        fetch("/api/admin/users").then(r => r.json()),
        fetch("/api/admin/categories").then(r => r.json()),
        fetch("/api/admin/reviews").then(r => r.json())
      ]);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (revsRes.data) setReviews(revsRes.data);
      showToast("Admin data refreshed.", "info");
    } catch {
      showToast("Failed to refresh data", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Event Approval
  const handleApprove = async (id: number | string) => {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Event approved! It is now live in public discovery.", "success");
        setEvents(prev => prev.map(e => (String(e.id) === String(id) ? { ...e, status: "approved" } : e)));
        setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
      }
    } catch {
      showToast("Error approving event", "danger");
    }
  };

  // Event Rejection
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

  // Event Toggle Featured
  const handleToggleFeatured = async (id: number | string) => {
    try {
      const res = await fetch("/api/admin/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.isFeatured ? "Event spotlighted on homepage." : "Event removed from featured.", "info");
        setEvents(prev => prev.map(e => (String(e.id) === String(id) ? { ...e, featured: data.isFeatured, isFeatured: data.isFeatured } : e)));
      }
    } catch {
      showToast("Error updating featured status", "danger");
    }
  };

  // Event Delete
  const handleDeleteEvent = async (id: number | string) => {
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

  // Open Edit Event Modal
  const openEditEventModal = (event: EventItem) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      venue: event.venue || event.venueName || "",
      city: event.city || "Lahore",
      date: event.date || event.eventDate || "",
      time: event.time || event.startTime || "18:00 PKT",
      category: event.category || "Technology & Hackathons",
      isFree: event.isFree ?? (event.price === "Free Entry" || event.price === "Free" || event.priceValue === 0),
      price: event.price || "",
      capacity: event.capacity || 250
    });
  };

  // Save Event Edits
  const handleSaveEventEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingEvent.id,
          title: eventFormData.title,
          venue: eventFormData.venue,
          venueName: eventFormData.venue,
          city: eventFormData.city,
          date: eventFormData.date,
          eventDate: eventFormData.date,
          time: eventFormData.time,
          category: eventFormData.category,
          isFree: eventFormData.isFree,
          price: eventFormData.isFree ? "Free Entry" : eventFormData.price,
          capacity: Number(eventFormData.capacity)
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        showToast("Event details updated successfully! 🇵🇰", "success");
        setEvents(prev => prev.map(ev => (String(ev.id) === String(editingEvent.id) ? { ...ev, ...data.data } : ev)));
        setEditingEvent(null);
      } else {
        showToast(data.error || "Failed to update event", "danger");
      }
    } catch {
      showToast("Error saving event edits", "danger");
    }
  };

  // Export CSV Report
  const exportEventsCsv = () => {
    const headers = ["ID", "Title", "Category", "City", "Venue", "Date", "Time", "Price", "Capacity", "RSVPs", "Status", "Featured", "Organizer"];
    const rows = events.map(e => [
      `"${e.id}"`,
      `"${(e.title || "").replace(/"/g, '""')}"`,
      `"${e.category || ""}"`,
      `"${e.city || ""}"`,
      `"${(e.venue || e.venueName || "").replace(/"/g, '""')}"`,
      `"${e.date || e.eventDate || ""}"`,
      `"${e.time || ""}"`,
      `"${e.isFree ? "Free Entry" : (e.price || "Paid")}"`,
      e.capacity || 0,
      e.rsvpCount || 0,
      e.status || "approved",
      e.featured ? "Yes" : "No",
      `"${(e.organizerName || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eventdiscovery-pakistan-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Event report CSV exported successfully!", "success");
  };

  // Category Actions
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      slug: "",
      icon: "fa-layer-group",
      color: "#059669",
      description: ""
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "fa-layer-group",
      color: cat.color || "#059669",
      description: cat.description || ""
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingCategory);
      const url = "/api/admin/categories";
      const method = isEdit ? "PATCH" : "POST";
      const payload = isEdit
        ? { id: editingCategory?.id, ...categoryFormData, slug: categoryFormData.slug || editingCategory?.slug }
        : categoryFormData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        showToast(data.message || (isEdit ? "Category updated!" : "Category created!"), "success");
        if (isEdit) {
          setCategories(prev => prev.map(c => ((c.id && c.id === editingCategory?.id) || c.slug === editingCategory?.slug ? { ...c, ...data.data } : c)));
        } else {
          setCategories(prev => [...prev, data.data]);
        }
        setIsCategoryModalOpen(false);
      } else {
        showToast(data.error || "Failed to save category", "danger");
      }
    } catch {
      showToast("Error saving category", "danger");
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete category '${cat.name}'?`)) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, slug: cat.slug })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Category deleted.", "success");
        setCategories(prev => prev.filter(c => c.slug !== cat.slug && String(c.id) !== String(cat.id)));
      } else {
        showToast(data.error || "Cannot delete category", "danger");
      }
    } catch {
      showToast("Error deleting category", "danger");
    }
  };

  // User Management Actions
  const handleToggleUserRole = async (user: UserItem) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (user.email === "admin@eventdiscovery.pk" && newRole === "user") {
      showToast("Super Administrator cannot be demoted.", "warning");
      return;
    }
    if (!confirm(`Change role for ${user.name} to ${newRole.toUpperCase()}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User role updated to ${newRole.toUpperCase()}.`, "success");
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, role: newRole } : u)));
      } else {
        showToast(data.error || "Failed to update role", "danger");
      }
    } catch {
      showToast("Error updating role", "danger");
    }
  };

  const handleToggleUserStatus = async (user: UserItem) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    if (user.email === "admin@eventdiscovery.pk") {
      showToast("Super Administrator account cannot be suspended.", "warning");
      return;
    }
    if (!confirm(`Set status for ${user.name} to ${newStatus.toUpperCase()}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User status set to ${newStatus.toUpperCase()}.`, "info");
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: newStatus } : u)));
      } else {
        showToast(data.error || "Failed to update status", "danger");
      }
    } catch {
      showToast("Error updating status", "danger");
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (user.email === "admin@eventdiscovery.pk") {
      showToast("Super Administrator account cannot be deleted.", "warning");
      return;
    }
    if (!confirm(`Permanently delete account for ${user.name} (${user.email})?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast("User account deleted.", "danger");
        setUsers(prev => prev.filter(u => u.id !== user.id));
      } else {
        showToast(data.error || "Failed to delete user", "danger");
      }
    } catch {
      showToast("Error deleting user", "danger");
    }
  };

  // Review Moderation Action
  const handleDeleteReview = async (review: ReviewItem) => {
    if (!confirm(`Delete review by "${review.userName}" on "${review.eventTitle}"?`)) return;

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: review.eventId, reviewId: review.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Review deleted successfully.", "success");
        setReviews(prev => prev.filter(r => !(String(r.eventId) === String(review.eventId) && r.id === review.id)));
      } else {
        showToast(data.error || "Failed to delete review", "danger");
      }
    } catch {
      showToast("Error deleting review", "danger");
    }
  };

  // Filtering
  const pendingEvents = events.filter(e => e.status === "pending");
  const filteredEvents = events.filter(e => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      (e.venue && e.venue.toLowerCase().includes(q))
    );
  });

  const filteredUsers = users.filter(u => {
    if (!userSearchTerm) return true;
    const q = userSearchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.city && u.city.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="d-flex flex-column flex-grow-1 bg-light">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className={`toast show align-items-center text-white bg-${toastMessage.type} border-0 shadow-lg rounded-3`} role="alert">
            <div className="d-flex">
              <div className="toast-body fw-semibold d-flex align-items-center gap-2">
                <i className={`fa-solid ${toastMessage.type === "success" ? "fa-circle-check" : toastMessage.type === "danger" ? "fa-triangle-exclamation" : "fa-circle-info"}`}></i>
                {toastMessage.text}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage(null)}></button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <div className="bg-dark text-white py-4 border-bottom border-dark position-relative overflow-hidden">
        <div className="container position-relative">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 rounded-pill small fw-bold">
                  <i className="fa-solid fa-shield-halved me-1"></i> SUPER ADMINISTRATOR
                </span>
                <span className="text-muted small">&bull; Management Center</span>
              </div>
              <h1 className="h2 fw-bold mb-1">EventDiscovery Pakistan Portal 🇵🇰</h1>
              <p className="text-muted small mb-0">Control directory listings, moderate reviews, oversee categories, and manage community accounts.</p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Link href="/events" className="btn btn-outline-light rounded-pill btn-sm px-3 fw-semibold">
                <i className="fa-regular fa-eye me-1"></i> Public Catalog
              </Link>
              <button className="btn btn-primary rounded-pill btn-sm px-3 fw-semibold" onClick={refreshData} disabled={loading}>
                <i className={`fa-solid fa-arrows-rotate me-1 ${loading ? "fa-spin" : ""}`}></i> Sync Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="py-4 flex-grow-1">
        <div className="container">
          {/* KPI Analytics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper bg-primary-subtle text-primary rounded-4" style={{ width: "48px", height: "48px" }}>
                    <i className="fa-solid fa-calendar-days fs-5"></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-semibold">Total Listed Events</div>
                    <div className="fs-3 fw-bold text-dark">{stats.totalEvents}</div>
                  </div>
                </div>
                <div className="small text-success mt-2"><i className="fa-solid fa-signal me-1"></i> Live in directory</div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-warning border-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper bg-warning-subtle text-warning rounded-4" style={{ width: "48px", height: "48px" }}>
                    <i className="fa-solid fa-clock-rotate-left fs-5"></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-semibold">Pending Approvals</div>
                    <div className="fs-3 fw-bold text-warning">{stats.pendingApprovals}</div>
                  </div>
                </div>
                <div className="small text-warning mt-2"><i className="fa-solid fa-shield-halved me-1"></i> Requires moderation</div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper bg-success-subtle text-success rounded-4" style={{ width: "48px", height: "48px" }}>
                    <i className="fa-solid fa-ticket fs-5"></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-semibold">Total Community RSVPs</div>
                    <div className="fs-3 fw-bold text-dark">{stats.totalRsvps.toLocaleString("en-PK")}</div>
                  </div>
                </div>
                <div className="small text-info mt-2"><i className="fa-solid fa-users me-1"></i> Confirmed attendees</div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper bg-info-subtle text-info rounded-4" style={{ width: "48px", height: "48px" }}>
                    <i className="fa-solid fa-money-bill-wave fs-5"></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-semibold">Estimated Gross Revenue</div>
                    <div className="fs-3 fw-bold text-dark">Rs. {stats.estimatedRevenue.toLocaleString("en-PK")}</div>
                  </div>
                </div>
                <div className="small text-muted mt-2">PKR Ticket Value</div>
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
                    <span className="badge bg-light text-dark border ms-2 rounded-pill">{events.length}</span>
                  </button>
                </li>
                <li className="nav-item flex-shrink-0">
                  <button
                    className={`nav-link fw-semibold py-2 py-md-3 px-3 px-md-4 border-0 ${activeTab === "categories" ? "active border-bottom border-3 border-primary text-dark" : "text-muted"}`}
                    onClick={() => setActiveTab("categories")}
                  >
                    <i className="fa-solid fa-layer-group me-2 text-success"></i> Categories Management
                    <span className="badge bg-light text-dark border ms-2 rounded-pill">{categories.length}</span>
                  </button>
                </li>
                <li className="nav-item flex-shrink-0">
                  <button
                    className={`nav-link fw-semibold py-2 py-md-3 px-3 px-md-4 border-0 ${activeTab === "users" ? "active border-bottom border-3 border-primary text-dark" : "text-muted"}`}
                    onClick={() => setActiveTab("users")}
                  >
                    <i className="fa-solid fa-users-gear me-2 text-info"></i> Registered Accounts
                    <span className="badge bg-light text-dark border ms-2 rounded-pill">{users.length}</span>
                  </button>
                </li>
                <li className="nav-item flex-shrink-0">
                  <button
                    className={`nav-link fw-semibold py-2 py-md-3 px-3 px-md-4 border-0 ${activeTab === "reviews" ? "active border-bottom border-3 border-primary text-dark" : "text-muted"}`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    <i className="fa-solid fa-star-half-stroke me-2 text-warning"></i> Review Moderation
                    <span className="badge bg-light text-dark border ms-2 rounded-pill">{reviews.length}</span>
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
                              <i className="fa-solid fa-circle-check fa-3x text-success mb-3 d-block opacity-50"></i>
                              <div className="fw-bold fs-6">No Pending Events</div>
                              <p className="small mb-0">All submitted community events have been reviewed!</p>
                            </td>
                          </tr>
                        ) : (
                          pendingEvents.map(event => (
                            <tr key={event.id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="rounded-3 overflow-hidden bg-light border flex-shrink-0" style={{ width: "42px", height: "42px" }}>
                                    <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100"} alt="" className="w-100 h-100 object-fit-cover" />
                                  </div>
                                  <div>
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "200px" }}>{event.title}</div>
                                    <span className="badge bg-light text-muted border small">{event.category}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold text-dark">{event.city}</div>
                                <div className="text-muted small text-truncate" style={{ maxWidth: "160px" }}>{event.venue || event.venueName}</div>
                              </td>
                              <td>
                                <div className="small fw-semibold">{event.date || event.eventDate}</div>
                                <div className="text-muted small">{event.time}</div>
                              </td>
                              <td>
                                <span className={`badge ${event.isFree ? "bg-success-subtle text-success" : "bg-primary-subtle text-primary"}`}>
                                  {event.isFree ? "Free Entry" : event.price}
                                </span>
                              </td>
                              <td>
                                <div className="small fw-semibold">{event.organizerName}</div>
                                <div className="text-muted small">{event.organizerEmail}</div>
                              </td>
                              <td>
                                <span className="badge bg-warning text-dark">Pending</span>
                              </td>
                              <td className="text-end">
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-success fw-semibold" onClick={() => handleApprove(event.id)}>
                                    <i className="fa-solid fa-check me-1"></i> Approve
                                  </button>
                                  <button className="btn btn-outline-danger" onClick={() => handleReject(event.id)}>
                                    <i className="fa-solid fa-xmark me-1"></i> Reject
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
                      <h5 className="fw-bold mb-1">Master Events Directory</h5>
                      <p className="text-muted small mb-0">Search, edit, toggle featured status, or delete listings.</p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-sm btn-outline-success rounded-pill fw-semibold" onClick={exportEventsCsv}>
                        <i className="fa-solid fa-file-csv me-1"></i> Export CSV Report
                      </button>
                      <div className="position-relative" style={{ minWidth: "220px" }}>
                        <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted small"></i>
                        <input
                          type="text"
                          className="form-control form-control-sm rounded-pill ps-5"
                          placeholder="Search title, city, category..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>Category</th>
                          <th>Location</th>
                          <th>Schedule</th>
                          <th>Price / Cap</th>
                          <th>RSVPs</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents.map(event => (
                          <tr key={event.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded-3 overflow-hidden bg-light border flex-shrink-0" style={{ width: "36px", height: "36px" }}>
                                  <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100"} alt="" className="w-100 h-100 object-fit-cover" />
                                </div>
                                <div className="text-truncate" style={{ maxWidth: "200px" }}>
                                  <Link href={`/events/${event.slug}`} className="fw-bold text-dark text-decoration-none hover-primary">
                                    {event.title}
                                  </Link>
                                  {event.featured && (
                                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle ms-1 small">
                                      <i className="fa-solid fa-star me-1"></i>Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark border">{event.category}</span>
                            </td>
                            <td>
                              <div className="small fw-semibold">{event.city}</div>
                              <div className="text-muted small text-truncate" style={{ maxWidth: "140px" }}>{event.venue || event.venueName}</div>
                            </td>
                            <td className="small text-muted">{event.date || event.eventDate}</td>
                            <td>
                              <div className="small fw-semibold">{event.isFree ? "Free" : event.price}</div>
                              <div className="text-muted small">Cap: {event.capacity || 500}</div>
                            </td>
                            <td>
                              <span className="badge bg-success-subtle text-success border border-success-subtle">
                                <i className="fa-solid fa-ticket me-1"></i> {event.rsvpCount || 0}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${event.status === "approved" ? "bg-success" : event.status === "pending" ? "bg-warning text-dark" : "bg-danger"}`}>
                                {event.status || "approved"}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  title="Edit Event Details"
                                  onClick={() => openEditEventModal(event)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className={`btn ${event.featured ? "btn-warning" : "btn-outline-warning"}`}
                                  title={event.featured ? "Remove from Featured" : "Mark as Featured"}
                                  onClick={() => handleToggleFeatured(event.id)}
                                >
                                  <i className="fa-solid fa-star"></i>
                                </button>
                                <Link href={`/events/${event.slug}`} className="btn btn-outline-secondary" title="View Public Page">
                                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                </Link>
                                <button className="btn btn-outline-danger" title="Delete Listing" onClick={() => handleDeleteEvent(event.id)}>
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Category Management */}
              {activeTab === "categories" && (
                <div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">Categories Management</h5>
                      <p className="text-muted small mb-0">Create, customize icons & branding colors, and organize Pakistani event domains.</p>
                    </div>

                    <button className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold" onClick={openAddCategoryModal}>
                      <i className="fa-solid fa-plus me-1"></i> Add New Category
                    </button>
                  </div>

                  {/* Category Cards Overview */}
                  <div className="row g-3 mb-4">
                    {categories.map(cat => (
                      <div className="col-md-6 col-lg-4" key={cat.slug || cat.id}>
                        <div className="card border rounded-4 p-3 h-100 shadow-sm position-relative overflow-hidden">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                style={{ width: "36px", height: "36px", backgroundColor: cat.color || "#059669" }}
                              >
                                <i className={`fa-solid ${cat.icon || "fa-layer-group"}`}></i>
                              </div>
                              <h6 className="fw-bold mb-0 text-dark">{cat.name}</h6>
                            </div>
                            <span className="badge bg-light text-muted border small">
                              {cat.eventCount || 0} events
                            </span>
                          </div>
                          <p className="small text-muted mb-3 text-truncate-2" style={{ minHeight: "38px" }}>
                            {cat.description || `Explore ${cat.name} across Pakistan.`}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                            <span className="small text-muted font-monospace">{cat.slug}</span>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-secondary btn-sm" title="Edit Category" onClick={() => openEditCategoryModal(cat)}>
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm" title="Delete Category" onClick={() => handleDeleteCategory(cat)}>
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Registered Accounts */}
              {activeTab === "users" && (
                <div>
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Community Members & Organizers</h5>
                      <p className="text-muted small mb-0">Search users, toggle administrative roles, and manage account statuses.</p>
                    </div>

                    <div className="position-relative" style={{ minWidth: "220px" }}>
                      <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted small"></i>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-pill ps-5"
                        placeholder="Search name, email, city..."
                        value={userSearchTerm}
                        onChange={e => setUserSearchTerm(e.target.value)}
                      />
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
                          <th className="text-end">Account Controls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle bg-light border d-flex align-items-center justify-content-center fw-bold text-primary"
                                  style={{ width: "36px", height: "36px" }}
                                >
                                  {u.name?.charAt(0) || "U"}
                                </div>
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
                            <td>
                              <span className={`badge ${u.status === "suspended" ? "bg-danger text-white" : "bg-success-subtle text-success border border-success-subtle"}`}>
                                {u.status === "suspended" ? "Suspended" : "Active"}
                              </span>
                            </td>
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-secondary"
                                  title={u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                  onClick={() => handleToggleUserRole(u)}
                                >
                                  <i className="fa-solid fa-user-shield me-1"></i>
                                  {u.role === "admin" ? "Demote" : "Promote"}
                                </button>
                                <button
                                  className={`btn ${u.status === "suspended" ? "btn-outline-success" : "btn-outline-warning"}`}
                                  title={u.status === "suspended" ? "Activate Account" : "Suspend Account"}
                                  onClick={() => handleToggleUserStatus(u)}
                                >
                                  <i className={`fa-solid ${u.status === "suspended" ? "fa-user-check" : "fa-user-lock"}`}></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  title="Delete User"
                                  onClick={() => handleDeleteUser(u)}
                                >
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: Review Moderation */}
              {activeTab === "reviews" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">Community Reviews Moderation</h5>
                      <p className="text-muted small mb-0">Inspect attendee feedback, ratings, and remove inappropriate testimonials.</p>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table-modern">
                      <thead>
                        <tr>
                          <th>Reviewer</th>
                          <th>Target Event</th>
                          <th>Rating</th>
                          <th>Feedback Comment</th>
                          <th>Date</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-5 text-muted">
                              <i className="fa-regular fa-comments fa-3x mb-3 d-block opacity-50"></i>
                              <div className="fw-bold fs-6">No Community Reviews Yet</div>
                              <p className="small mb-0">Reviews submitted on event detail pages will display here for moderation.</p>
                            </td>
                          </tr>
                        ) : (
                          reviews.map(rev => (
                            <tr key={`${rev.eventId}-${rev.id}`}>
                              <td>
                                <div className="fw-bold text-dark">{rev.userName}</div>
                              </td>
                              <td>
                                <Link href={`/events/${rev.eventSlug}`} className="fw-semibold text-primary text-decoration-none hover-primary">
                                  {rev.eventTitle}
                                </Link>
                              </td>
                              <td>
                                <div className="text-warning small text-nowrap">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <i key={i} className={`fa-solid fa-star ${i < rev.rating ? "text-warning" : "text-muted opacity-25"}`}></i>
                                  ))}
                                  <span className="ms-1 fw-bold text-dark">{rev.rating}.0</span>
                                </div>
                              </td>
                              <td>
                                <div className="text-muted small text-truncate" style={{ maxWidth: "350px" }}>
                                  {rev.comment}
                                </div>
                              </td>
                              <td className="small text-muted">{rev.createdAt || "Recent"}</td>
                              <td className="text-end">
                                <button
                                  className="btn btn-sm btn-outline-danger rounded-pill"
                                  title="Delete Review"
                                  onClick={() => handleDeleteReview(rev)}
                                >
                                  <i className="fa-solid fa-trash-can me-1"></i> Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: Edit Event */}
      {editingEvent && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-pen-to-square me-2 text-primary"></i> Edit Event Listing
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEditingEvent(null)}></button>
              </div>
              <form onSubmit={handleSaveEventEdits}>
                <div className="modal-body p-4 bg-white">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Event Title</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={eventFormData.title}
                        onChange={e => setEventFormData({ ...eventFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Category</label>
                      <select
                        className="form-select rounded-3"
                        value={eventFormData.category}
                        onChange={e => setEventFormData({ ...eventFormData, category: e.target.value })}
                      >
                        {categories.map(c => (
                          <option key={c.slug} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">City</label>
                      <select
                        className="form-select rounded-3"
                        value={eventFormData.city}
                        onChange={e => setEventFormData({ ...eventFormData, city: e.target.value })}
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
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Venue Name / Address</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={eventFormData.venue}
                        onChange={e => setEventFormData({ ...eventFormData, venue: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Event Date</label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        value={eventFormData.date}
                        onChange={e => setEventFormData({ ...eventFormData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Time (PKT)</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="18:00 to 22:00 PKT"
                        value={eventFormData.time}
                        onChange={e => setEventFormData({ ...eventFormData, time: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Seating Capacity</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control rounded-3"
                        value={eventFormData.capacity}
                        onChange={e => setEventFormData({ ...eventFormData, capacity: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Access Pricing</label>
                      <div className="d-flex align-items-center gap-3 mt-1">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="editIsFree"
                            checked={eventFormData.isFree}
                            onChange={e => setEventFormData({ ...eventFormData, isFree: e.target.checked, price: e.target.checked ? "Free Entry" : eventFormData.price })}
                          />
                          <label className="form-check-label small" htmlFor="editIsFree">Free Entry</label>
                        </div>
                        {!eventFormData.isFree && (
                          <input
                            type="text"
                            className="form-control form-control-sm rounded-3"
                            placeholder="Rs. 1,500"
                            value={eventFormData.price}
                            onChange={e => setEventFormData({ ...eventFormData, price: e.target.value })}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setEditingEvent(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">
                    <i className="fa-solid fa-check me-1"></i> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Category */}
      {isCategoryModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title fw-bold">
                  <i className="fa-solid fa-layer-group me-2 text-success"></i>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsCategoryModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSaveCategory}>
                <div className="modal-body p-4 bg-white">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Category Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Startup Pitch Nights"
                        value={categoryFormData.name}
                        onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">FontAwesome Icon Class</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="fa-rocket"
                        value={categoryFormData.icon}
                        onChange={e => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted">Brand Color (Hex)</label>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="color"
                          className="form-control form-control-color rounded-3"
                          value={categoryFormData.color}
                          onChange={e => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                        />
                        <input
                          type="text"
                          className="form-control rounded-3 font-monospace"
                          value={categoryFormData.color}
                          onChange={e => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-muted">Description</label>
                      <textarea
                        className="form-control rounded-3"
                        rows={2}
                        placeholder="Describe events falling into this category..."
                        value={categoryFormData.description}
                        onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setIsCategoryModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                    <i className="fa-solid fa-check me-1"></i> {editingCategory ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
