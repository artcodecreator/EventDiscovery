import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5 bg-light min-vh-100">
      <div className="container text-center py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="error-code-glow mb-2 display-1 fw-extrabold text-primary-gradient">404</div>
            <div className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
              <i className="fa-solid fa-triangle-exclamation me-1"></i> Page Not Found
            </div>
            <h2 className="fw-bold mb-3">Oops! This Event or Page Doesn&apos;t Exist</h2>
            <p className="text-muted lead mb-4 mx-auto" style={{ maxWidth: "540px" }}>
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable in Pakistan.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <Link href="/" className="btn btn-primary-gradient rounded-pill px-4 py-2 fw-semibold">
                <i className="fa-solid fa-house me-2"></i> Return to Homepage
              </Link>
              <Link href="/events" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold">
                <i className="fa-solid fa-compass me-2"></i> Browse All Events
              </Link>
              <Link href="/categories" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold">
                <i className="fa-solid fa-layer-group me-2"></i> View Categories
              </Link>
            </div>

            {/* Quick Search Box */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mx-auto" style={{ maxWidth: "520px" }}>
              <h6 className="fw-bold text-muted small text-uppercase mb-3">Looking for a specific event?</h6>
              <form action="/events" method="GET" className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input
                    type="search"
                    name="search"
                    className="form-control bg-light border-start-0"
                    placeholder="Search Lahore AI, Sufi Night, Marathon..."
                  />
                </div>
                <button type="submit" className="btn btn-primary-gradient px-3 rounded-3 fw-semibold">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
