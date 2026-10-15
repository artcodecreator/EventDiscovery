import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCategories } from "@/lib/events";
import { SubmitEventForm } from "@/components/submit-event-form";

export const dynamic = "force-dynamic";

export default async function SubmitEventPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/submit-event");
  }

  const categories = await getCategories();

  return (
    <main className="d-flex flex-column flex-grow-1 bg-light">
      {/* Page Header */}
      <div className="bg-dark text-white py-4 border-bottom border-dark">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 small text-muted">
              <li className="breadcrumb-item"><Link href="/" className="text-muted text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/events" className="text-muted text-decoration-none">Events</Link></li>
              <li className="breadcrumb-item active text-primary" aria-current="page">Create Event</li>
            </ol>
          </nav>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h1 className="h2 fw-bold mb-1">Submit a New Event 🇵🇰</h1>
              <p className="text-muted small mb-0">Publish your community event across Pakistan with interactive venue mapping and RSVP passes.</p>
            </div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
              <i className="fa-solid fa-shield-check me-1"></i> Admin Approval Workflow Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <SubmitEventForm categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
