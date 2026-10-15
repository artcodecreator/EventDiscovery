"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto border-top border-dark-subtle">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Col 1: Platform Overview */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 fw-bold fs-5 mb-3">
              <div className="brand-icon">
                <i className="fa-solid fa-bolt-lightning"></i>
              </div>
              <span>
                Event<span className="text-primary-gradient">Discovery</span>{" "}
                <span className="badge bg-success-subtle text-success small">PK 🇵🇰</span>
              </span>
            </div>
            <p className="text-muted small pe-lg-3">
              Pakistan&apos;s premier event discovery and community engagement network connecting attendees with live Sufi concerts, AI hackathons, Karachi Eat food fests, marathon runs, and Lok Virsa cultural expos.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="social-link" title="Twitter/X"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" className="social-link" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="social-link" title="Facebook"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" className="social-link" title="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
            </div>
          </div>

          {/* Col 2: Top Pakistani Cities */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-uppercase fw-bold text-light mb-3 letter-spacing-1">Top Cities</h6>
            <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
              <li><Link href="/events?city=lahore" className="footer-link text-decoration-none text-muted">Lahore Events</Link></li>
              <li><Link href="/events?city=karachi" className="footer-link text-decoration-none text-muted">Karachi Events</Link></li>
              <li><Link href="/events?city=islamabad" className="footer-link text-decoration-none text-muted">Islamabad Events</Link></li>
              <li><Link href="/events?city=rawalpindi" className="footer-link text-decoration-none text-muted">Rawalpindi Events</Link></li>
              <li><Link href="/events?city=peshawar" className="footer-link text-decoration-none text-muted">Peshawar Events</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-uppercase fw-bold text-light mb-3 letter-spacing-1">Categories</h6>
            <ul className="list-unstyled text-muted small mb-0 d-flex flex-column gap-2">
              <li><Link href="/events?category=technology" className="footer-link text-decoration-none text-muted">Tech &amp; Hackathons</Link></li>
              <li><Link href="/events?category=music" className="footer-link text-decoration-none text-muted">Sufi &amp; Music Nights</Link></li>
              <li><Link href="/events?category=sports" className="footer-link text-decoration-none text-muted">Sports &amp; Marathons</Link></li>
              <li><Link href="/events?category=food-drink" className="footer-link text-decoration-none text-muted">Food Street &amp; Chai</Link></li>
              <li><Link href="/events?category=art-culture" className="footer-link text-decoration-none text-muted">Culture &amp; Heritage</Link></li>
            </ul>
          </div>

          {/* Col 4: Stay Updated */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase fw-bold text-light mb-3 letter-spacing-1">Stay Updated</h6>
            <p className="text-muted small">
              Get weekly digests of top upcoming concerts, tech conferences, community meetups, and festivals across Pakistan.
            </p>
            <form className="d-flex gap-2 mb-3 flex-column flex-sm-row" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to EventDiscovery Pakistan alerts! 🇵🇰'); }}>
              <input
                type="email"
                className="form-control form-control-sm bg-dark text-light border-secondary rounded-pill px-3"
                placeholder="Enter your email address..."
                required
              />
              <button type="submit" className="btn btn-primary-gradient btn-sm rounded-pill px-3 fw-semibold text-nowrap">
                Subscribe
              </button>
            </form>
            <div className="small text-muted d-flex align-items-center gap-2">
              <i className="fa-solid fa-shield-halved text-success"></i> <span>No spam, guaranteed. Unsubscribe anytime.</span>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center small text-muted">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            &copy; 2026 <strong>EventDiscovery Pakistan</strong>. All rights reserved. &bull; Timezone: Asia/Karachi (PKT) 🇵🇰
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link href="/events" className="text-muted text-decoration-none me-3 hover-white">Explore Events</Link>
            <Link href="/categories" className="text-muted text-decoration-none me-3 hover-white">Categories</Link>
            <Link href="/events?view=split" className="text-muted text-decoration-none hover-white">Live Geo-Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
