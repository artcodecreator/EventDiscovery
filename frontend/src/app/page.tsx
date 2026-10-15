import Link from "next/link";
import { getEvents, getCategories } from "@/lib/events";
import { EventCard } from "@/components/event-card";
import MapPreview from "@/components/map-preview";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allEvents, allCategories] = await Promise.all([
    getEvents({ includePending: false }),
    getCategories()
  ]);

  const featured = allEvents.filter(e => e.featured || e.isFeatured);
  const displayFeatured = featured.length > 0 ? featured.slice(0, 4) : allEvents.slice(0, 4);

  return (
    <main className="flex-grow-1">
      {/* Hero Section */}
      <section className="hero-section text-center position-relative py-5">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
                <i className="fa-solid fa-moon-star me-1 text-success"></i> Pakistan&apos;s Official Community Event Discovery Hub 🇵🇰
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3 tracking-tight">
                Discover, Experience &amp; Connect with <br className="d-none d-md-block" />
                <span className="text-primary-gradient">Top Events Across Pakistan</span>
              </h1>
              <p className="lead text-light opacity-75 mb-4 mx-auto" style={{ maxWidth: "680px" }}>
                From high-impact AI conclaves in Lahore and Coke Studio live nights to Karachi Sea View marathons and Lok Virsa cultural festivals — find what&apos;s happening near you.
              </p>

              {/* Fast Search Box */}
              <div className="hero-search-box mx-auto mb-4 bg-white p-2 p-md-2 p-3 rounded-4 shadow-lg" style={{ maxWidth: "840px" }}>
                <form action="/events" method="GET" className="row g-2 align-items-center">
                  <div className="col-12 col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </span>
                      <input
                        type="text"
                        name="search"
                        className="form-control border-0 shadow-none ps-2"
                        placeholder="Search events, Expo Centre, NUST..."
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-3 border-start-md border-top-mobile pt-2 pt-md-0">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="fa-solid fa-location-dot"></i>
                      </span>
                      <select name="city" className="form-select border-0 shadow-none text-secondary">
                        <option value="">All Cities</option>
                        <option value="lahore">Lahore</option>
                        <option value="karachi">Karachi</option>
                        <option value="islamabad">Islamabad</option>
                        <option value="rawalpindi">Rawalpindi</option>
                        <option value="peshawar">Peshawar</option>
                        <option value="faisalabad">Faisalabad</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-3 border-start-md border-top-mobile pt-2 pt-md-0">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="fa-solid fa-layer-group"></i>
                      </span>
                      <select name="category" className="form-select border-0 shadow-none text-secondary">
                        <option value="">All Categories</option>
                        {allCategories.map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-2 pt-1 pt-md-0">
                    <button type="submit" className="btn btn-primary-gradient w-100 py-2 rounded-3 fw-semibold">
                      <i className="fa-solid fa-compass me-1"></i> Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Stats Badges */}
              <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 gap-md-4 text-white opacity-85 small pt-2">
                <div><i className="fa-solid fa-calendar-check text-info me-1"></i> <strong>{allEvents.length}+ Verified</strong> Pakistani Events</div>
                <div><i className="fa-solid fa-tags text-warning me-1"></i> <strong>{allCategories.length} Curated</strong> Categories</div>
                <div><i className="fa-solid fa-map-pin text-danger me-1"></i> <strong>Leaflet Geo-Map</strong> Live Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="section-eyebrow text-uppercase text-primary fw-bold small">FIND YOUR CROWD</span>
              <h2 className="h1 font-heading fw-bold mt-1">Explore by category</h2>
            </div>
            <Link href="/categories" className="btn btn-outline-primary rounded-pill px-3">
              All categories <i className="fa-solid fa-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-3">
            {allCategories.map(c => {
              const count = allEvents.filter(e => e.categorySlug.toLowerCase() === c.slug.toLowerCase()).length;
              return (
                <div className="col-6 col-md-4 col-lg" key={c.slug}>
                  <Link
                    href={`/events?category=${c.slug}`}
                    className="category-tile d-flex flex-column align-items-center text-center p-3 h-100 rounded-4 border text-decoration-none text-dark transition-all hover-lift"
                  >
                    <span
                      className="category-icon mb-2"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: `${c.color}20`,
                        color: c.color,
                        fontSize: "1.25rem"
                      }}
                    >
                      <i className={`fa-solid ${c.icon}`}></i>
                    </span>
                    <strong className="small mb-1">{c.name.split("&")[0]}</strong>
                    <small className="text-secondary">{count} {count === 1 ? "event" : "events"}</small>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="section-eyebrow text-uppercase text-primary fw-bold small">HANDPICKED FOR YOU</span>
              <h2 className="h1 font-heading fw-bold mt-1">Featured events in Pakistan</h2>
            </div>
            <Link href="/events" className="btn btn-outline-primary rounded-pill px-3">
              Explore all events <i className="fa-solid fa-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-4">
            {displayFeatured.map(e => (
              <div className="col-12 col-sm-6 col-lg-3" key={e.documentId ?? e.id}>
                <EventCard event={e} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="section-eyebrow text-uppercase text-primary fw-bold small">RIGHT AROUND THE CORNER</span>
              <h2 className="display-6 font-heading fw-bold mt-2">Good things are happening all over Pakistan.</h2>
              <p className="text-secondary mb-4">
                From a night of soulful qawwali at Alhamra in Lahore to an early coastal marathon in Karachi and green Margalla hikes in Islamabad, discover events worth leaving home for.
              </p>
              <div className="d-flex gap-3 flex-column flex-sm-row">
                <Link href="/events?view=split" className="btn btn-primary-gradient rounded-pill px-4 fw-semibold text-center">
                  <i className="fa-solid fa-map-location-dot me-1"></i> Open Live Geo-Map
                </Link>
                <Link href="/events" className="btn btn-outline-secondary rounded-pill px-4 text-center">
                  Browse List
                </Link>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="map-preview home-map-preview rounded-4 overflow-hidden border shadow-sm">
                <MapPreview events={allEvents} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
