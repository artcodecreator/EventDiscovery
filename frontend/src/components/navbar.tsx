"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky-top modern-header bg-dark-glass">
      <nav className="navbar navbar-expand-lg navbar-dark py-2 py-lg-2.5">
        <div className="container">
          {/* Brand Logo */}
          <Link
            className="navbar-brand d-flex align-items-center gap-2 fw-bold me-2 me-lg-3"
            href="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="brand-icon">
              <i className="fa-solid fa-bolt-lightning"></i>
            </div>
            <span className="brand-text text-white">
              Event<span className="text-primary-gradient">Discovery</span>
            </span>
          </Link>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            aria-controls="navbarMain"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links & Actions */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`} id="navbarMain">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-2 ms-xl-3 gap-lg-1">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/events") ? "active" : ""}`}
                  href="/events"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-regular fa-compass me-1 text-primary-gradient"></i> Explore Events
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/categories") ? "active" : ""}`}
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-layer-group me-1 text-primary-gradient"></i> Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/events" && typeof window !== "undefined" && window.location.search.includes("view=split") ? "active" : ""}`}
                  href="/events?view=split"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-map-location-dot me-1 text-primary-gradient"></i> Live Geo-Map
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/submit-event") ? "active" : ""}`}
                  href="/submit-event"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-calendar-plus me-1 text-primary-gradient"></i> Submit Event
                </Link>
              </li>
            </ul>

            {/* Fast Search Bar */}
            <form
              className="d-flex me-lg-2 me-xl-3 my-2 my-lg-0 search-form-nav"
              action="/events"
              method="GET"
              role="search"
              onSubmit={() => setMobileMenuOpen(false)}
            >
              <div className="nav-search-wrapper position-relative">
                <i className="fa-solid fa-magnifying-glass nav-search-icon"></i>
                <input
                  className="form-control nav-search-input"
                  type="search"
                  name="search"
                  placeholder="Search events, cities..."
                  aria-label="Search events"
                />
              </div>
            </form>

            {/* Auth Actions Area */}
            <div className="d-flex align-items-center gap-1 gap-xl-2 mt-2 mt-lg-0 flex-wrap flex-lg-nowrap">
              {session?.user ? (
                <div className="d-flex align-items-center gap-1 gap-xl-2 flex-wrap flex-lg-nowrap">
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className={`btn btn-sm ${isActive("/admin/dashboard") ? "btn-danger" : "btn-outline-danger"} rounded-pill px-2.5 px-xl-3 fw-semibold`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fa-solid fa-shield-halved me-1"></i> Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className={`btn btn-sm ${isActive("/dashboard") ? "btn-light" : "btn-outline-light"} rounded-pill px-2.5 px-xl-3 fw-semibold`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fa-solid fa-user me-1 text-primary"></i> {session.user.name?.split(" ")[0] || "Dashboard"}
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary-gradient rounded-pill px-2.5 px-xl-3 fw-semibold"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <i className="fa-solid fa-right-from-bracket me-1"></i> Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 gap-xl-2 flex-nowrap">
                  <Link
                    href="/login"
                    className="btn btn-sm btn-outline-light rounded-pill px-2.5 px-xl-3 fw-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-sm btn-primary-gradient rounded-pill px-2.5 px-xl-3 fw-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
