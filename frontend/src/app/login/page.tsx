import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="d-flex flex-column flex-grow-1 bg-light">
      {/* Title Header */}
      <div className="bg-dark text-white py-4 border-bottom border-dark">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 small text-muted">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Account Sign In</li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="h2 fw-bold mb-1">Welcome Back to EventDiscovery 🇵🇰</h1>
              <p className="text-muted small mb-0">Sign in to manage your digital event passes, favorites, and community interactions.</p>
            </div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
              <i className="fa-solid fa-shield-halved me-1"></i> Verified Local Session
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-5 flex-grow-1 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center align-items-stretch g-4">
            {/* Left Column: Perks */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-white position-relative overflow-hidden h-100 d-flex flex-column justify-content-between" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
                <div>
                  <div className="mb-4">
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-bold mb-3">
                      <i className="fa-solid fa-bolt me-1"></i> Pakistan Community Network
                    </span>
                    <h3 className="fw-bold mb-2">Connect with What&apos;s Happening in Your City</h3>
                    <p className="text-muted small">Access exclusive community passes for events in Lahore, Karachi, Islamabad, Peshawar and beyond.</p>
                  </div>

                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="d-flex align-items-center gap-3 p-3 bg-dark rounded-3 border border-dark">
                      <div className="brand-icon" style={{ width: "40px", height: "40px", fontSize: "1rem", flexShrink: 0 }}>
                        <i className="fa-solid fa-qrcode"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-white small">Digital Pass Wallet</div>
                        <div className="text-muted small">Instant QR ticket passes for smooth venue admission</div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 p-3 bg-dark rounded-3 border border-dark">
                      <div className="brand-icon" style={{ width: "40px", height: "40px", fontSize: "1rem", flexShrink: 0 }}>
                        <i className="fa-solid fa-map-location-dot"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-white small">Interactive Geo-Map</div>
                        <div className="text-muted small">Discover concerts, hackathons, and cultural fests near you</div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 p-3 bg-dark rounded-3 border border-dark">
                      <div className="brand-icon" style={{ width: "40px", height: "40px", fontSize: "1rem", flexShrink: 0 }}>
                        <i className="fa-solid fa-heart"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-white small">Bookmarks &amp; Alerts</div>
                        <div className="text-muted small">Save your favorite events and stay updated on schedule changes</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top border-dark small text-muted">
                  New to EventDiscovery? <Link href="/register" className="text-primary text-decoration-none fw-semibold">Create Free Account <i className="fa-solid fa-arrow-right ms-1"></i></Link>
                </div>
              </div>
            </div>

            {/* Right Column: Sign In Form */}
            <div className="col-lg-6 col-md-10">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100">
                <div className="mb-4">
                  <h3 className="fw-bold text-dark mb-1">Sign In to Your Account</h3>
                  <p className="text-muted small mb-0">Enter your registered email and password to access your dashboard.</p>
                </div>
                <Suspense fallback={<div className="p-4 text-center text-muted"><i className="fa-solid fa-spinner fa-spin me-2"></i> Loading sign in...</div>}>
                  <LoginForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
