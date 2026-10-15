import Link from "next/link";
import { getEvents, getCategories } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [allEvents, allCategories] = await Promise.all([
    getEvents({ includePending: false }),
    getCategories()
  ]);

  return (
    <main className="flex-grow-1">
      {/* Page Header */}
      <div className="bg-dark text-white py-5 border-bottom border-dark text-center">
        <div className="container">
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
            <i className="fa-solid fa-layer-group me-1"></i> Pakistan Community Hub
          </span>
          <h1 className="display-5 fw-bold mb-2">Explore Event Categories in Pakistan</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Find vibrant Pakistani communities and gatherings tailored to your passions. Choose a category below to discover upcoming events.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {allCategories.map(cat => {
              const count = allEvents.filter(e => e.categorySlug.toLowerCase() === cat.slug.toLowerCase()).length;
              return (
                <div className="col-12 col-md-6 col-lg-4" key={cat.slug}>
                  <Link
                    href={`/events?category=${cat.slug}`}
                    className="category-tile category-tile-large d-flex flex-column justify-content-between p-4 h-100 bg-white rounded-4 shadow-sm border text-decoration-none text-dark transition-all hover-lift"
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="category-icon"
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "14px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: `${cat.color}20`,
                            color: cat.color,
                            fontSize: "1.5rem"
                          }}
                        >
                          <i className={`fa-solid ${cat.icon}`}></i>
                        </span>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                          {count} {count === 1 ? "Event" : "Events"}
                        </span>
                      </div>
                      <h4 className="fw-bold mb-2">{cat.name}</h4>
                      <p className="text-secondary small mb-0">{cat.description || "Discover top gatherings in Pakistan."}</p>
                    </div>
                    <div className="d-flex align-items-center text-primary fw-semibold small mt-4 pt-3 border-top">
                      <span>Explore Category</span>
                      <i className="fa-solid fa-arrow-right ms-auto"></i>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <section className="py-5 position-relative text-white" style={{ background: "var(--primary-gradient)" }}>
        <div className="container text-center py-3">
          <h2 className="display-6 fw-bold mb-3">Ready to Discover Your Next Event?</h2>
          <p className="lead mb-4 opacity-90 mx-auto" style={{ maxWidth: "600px" }}>
            Browse all curated Pakistani events or explore the interactive Geo-Map to find what's happening near you.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link href="/events" className="btn btn-light text-primary btn-lg rounded-pill px-4 fw-bold shadow">
              <i className="fa-solid fa-compass me-1"></i> Browse All Events
            </Link>
            <Link href="/events?view=split" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-bold">
              <i className="fa-solid fa-map-location-dot me-1"></i> Open Geo-Map
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
