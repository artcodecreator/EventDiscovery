import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="d-flex flex-column flex-grow-1 bg-light">
      {/* Title Header */}
      <div className="bg-dark text-white py-4 border-bottom border-dark">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 small text-muted">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Create Account</li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="h2 fw-bold mb-1">Join EventDiscovery Pakistan 🇵🇰</h1>
              <p className="text-muted small mb-0">Create your community profile to RSVP for free passes, save favorite events, and submit listings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-5 flex-grow-1 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-10">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                <div className="mb-4">
                  <h3 className="fw-bold text-dark mb-1">Create Your Account</h3>
                  <p className="text-muted small mb-0">Free registration for community members and event attendees in Pakistan.</p>
                </div>
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
