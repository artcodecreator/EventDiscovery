# EventDiscovery Pakistan — Functional Test Cases

This document details all functional test scenarios covering core user journeys, role-based workflows, and integration points.

---

## 1. Public Discovery & Catalog Suite

### TC-PUB-001: Homepage Rendering & Hero Pakistani City Search
- **Module**: Homepage (`/`)
- **Role**: Public / Anonymous Visitor
- **Pre-conditions**: Frontend dev/prod server listening on `http://localhost:3000`.
- **Test Steps**:
  1. Navigate to `GET http://localhost:3000/`.
  2. Verify hero title, Pakistani flag badges, and city filter dropdown (*Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, Quetta*).
  3. Select City: `Karachi`, Category: `Technology & Hackathons`, and click `Search Events`.
- **Expected Result**: Page navigates to `/events?city=Karachi&category=technology` with filtered events displayed.
- **Actual Result**: PASSED. Returns HTTP 200 with responsive hero search bar.
- **Status**: ✅ PASS

### TC-PUB-002: Events Explorer Split-View & Synchronized Geo-Map
- **Module**: Events Directory (`/events`)
- **Role**: Public / Anonymous Visitor
- **Test Steps**:
  1. Open `http://localhost:3000/events`.
  2. Toggle view switch to "Map & List View".
  3. Hover cursor over the event card for "Karachi Coastal Marathon & Peace Run".
- **Expected Result**: Leaflet 1.9 map centers coordinates on Karachi (`24.8607, 67.0011`) and highlights the marker.
- **Actual Result**: PASSED. Interactive Leaflet map initializes without errors.
- **Status**: ✅ PASS

### TC-PUB-003: Category Navigation & Event Counting
- **Module**: Categories Directory (`/categories`)
- **Role**: Public / Anonymous Visitor
- **Test Steps**:
  1. Open `http://localhost:3000/categories`.
  2. Verify presence of all 7 curated categories with colored icon tiles.
  3. Click "Technology & Hackathons" card.
- **Expected Result**: Navigates to `/events?category=technology` filtering for tech conclaves.
- **Actual Result**: PASSED. Category filter activates smoothly.
- **Status**: ✅ PASS

### TC-PUB-004: Event Detail Page with Google Maps Link & RSVP Sidebar
- **Module**: Event Detail (`/events/[slug]`)
- **Role**: Public / Anonymous Visitor
- **Test Steps**:
  1. Open `http://localhost:3000/events/pakistan-tech-summit-ai-conclave-2026`.
  2. Verify title, event date, venue address, agenda, attendee counter, and Leaflet venue map.
  3. Click "Get Directions".
- **Expected Result**: Opens Google Maps navigation in a new tab with exact venue latitude/longitude.
- **Actual Result**: PASSED. Target URL points to `https://www.google.com/maps/dir/?api=1&destination=31.4759,74.3436`.
- **Status**: ✅ PASS

---

## 2. Authentication & Session Suite

### TC-AUTH-001: 1-Click Demo Credential Auto-Fill
- **Module**: Login (`/login`)
- **Role**: Guest / Visitor
- **Test Steps**:
  1. Open `http://localhost:3000/login`.
  2. Click "Attendee Demo Account" button.
  3. Verify email field populates with `ahmed.khan@eventdiscovery.pk` and password with `pakistan2026`.
  4. Click "Super Admin Demo" button.
  5. Verify email field populates with `admin@eventdiscovery.pk`.
- **Expected Result**: Form fields fill instantly without manual typing.
- **Actual Result**: PASSED. Fast testing experience verified.
- **Status**: ✅ PASS

### TC-AUTH-002: Invalid Credentials Rejection
- **Module**: Auth Callback (`/api/auth/callback/credentials`)
- **Role**: Guest
- **Test Steps**:
  1. Submit login form with `nobody@example.com` and password `wrongpass`.
- **Expected Result**: Authentication rejected, redirects back to `/login?error=CredentialsSignin`.
- **Actual Result**: PASSED. Automated test confirms session is not created.
- **Status**: ✅ PASS

### TC-AUTH-003: Valid Attendee Login & Redirect
- **Module**: Auth & Session
- **Role**: Verified Attendee
- **Test Steps**:
  1. Sign in with `ahmed.khan@eventdiscovery.pk` / `pakistan2026`.
- **Expected Result**: Session cookie set; user role is `user`. Session profile displays in navigation bar.
- **Actual Result**: PASSED. NextAuth session token securely created.
- **Status**: ✅ PASS

### TC-AUTH-004: Valid Super Admin Login & Portal Access
- **Module**: Auth & Session
- **Role**: Super Administrator
- **Test Steps**:
  1. Sign in with `admin@eventdiscovery.pk` / `pakistan2026`.
- **Expected Result**: Session role is `admin`; navigation bar reveals "Admin Portal" link.
- **Actual Result**: PASSED. Super Admin permissions granted.
- **Status**: ✅ PASS

---

## 3. User Dashboard & Digital Ticket Pass Suite

### TC-DASH-001: Access Control on Dashboard
- **Module**: User Dashboard (`/dashboard`)
- **Role**: Anonymous Visitor
- **Test Steps**:
  1. Attempt `GET http://localhost:3000/dashboard` without session cookie.
- **Expected Result**: HTTP 307 redirect to `/login?next=/dashboard`.
- **Actual Result**: PASSED. Protected route enforces authentication.
- **Status**: ✅ PASS

### TC-DASH-002: Digital Pass Wallet & QR Code Modal
- **Module**: User Dashboard (`/dashboard`)
- **Role**: Authenticated Attendee (`ahmed.khan@eventdiscovery.pk`)
- **Test Steps**:
  1. Log in and navigate to `/dashboard`.
  2. Switch to "My Passes (RSVP Wallet)" tab.
  3. Click "Show QR Pass" on a confirmed pass.
- **Expected Result**: Modal opens displaying Official Admission Pass with QR code, unique `PK-PASS-...` serial code, venue details, and "Print Pass" button.
- **Actual Result**: PASSED. QR Pass modal renders cleanly.
- **Status**: ✅ PASS

### TC-DASH-003: Pass Cancellation via Wallet
- **Module**: User Dashboard (`/dashboard`)
- **Role**: Authenticated Attendee
- **Test Steps**:
  1. On a booked pass card, click "Cancel Pass".
- **Expected Result**: `DELETE /api/rsvps` invoked, pass removed from wallet, event attendee count decremented.
- **Actual Result**: PASSED. Pass cancelled and removed from active list.
- **Status**: ✅ PASS

---

## 4. Event Submission & Moderation Lifecycle

### TC-MOD-001: Community Event Proposal Submission
- **Module**: Submit Event (`/submit-event`)
- **Role**: Authenticated Attendee
- **Test Steps**:
  1. Fill form with Title: "Lahore Indie Game Developers Showcase", Category: "Technology & Hackathons", City: "Lahore", Venue: "Arfa Software Technology Park", Date: "2026-12-20", Price: 0.
  2. Submit form.
- **Expected Result**: Saved with status `pending`, HTTP 200 returned.
- **Actual Result**: PASSED. Event created in moderation queue.
- **Status**: ✅ PASS

### TC-MOD-002: Pending Submission Privacy
- **Module**: Catalog & Event Detail
- **Role**: Public / Other Attendees
- **Test Steps**:
  1. Attempt to view pending event on `/events`.
  2. Attempt to open `/events/[slug]` directly as anonymous or other user.
- **Expected Result**: Pending event does not appear in public listing; direct URL returns HTTP 404.
- **Actual Result**: PASSED. Unapproved events remain strictly hidden.
- **Status**: ✅ PASS

### TC-MOD-003: Super Admin Event Approval
- **Module**: Admin Portal (`/admin/dashboard`)
- **Role**: Super Administrator
- **Test Steps**:
  1. Open `/admin/dashboard` under "Event Approval Workflow" tab.
  2. Click "Approve" button next to pending submission.
- **Expected Result**: Status transitions to `approved`. Event appears immediately on public map and catalog.
- **Actual Result**: PASSED. Approval workflow transitions status and publishes event.
- **Status**: ✅ PASS

### TC-MOD-004: Super Admin Rejection & Soft Delete
- **Module**: Admin Portal (`/admin/dashboard`)
- **Role**: Super Administrator
- **Test Steps**:
  1. Test "Reject" action: status becomes `rejected`, hidden from public.
  2. Test "Delete" action: status becomes `deleted`, removed from public and admin directory.
- **Expected Result**: Rejection and deletion permanently remove listing from public view.
- **Actual Result**: PASSED. Direct URL returns HTTP 404.
- **Status**: ✅ PASS
