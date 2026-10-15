# EventDiscovery Pakistan 🇵🇰
### Discover, Explore & Experience Local Community Events & Summits Across Pakistan

A modern, responsive web-based event discovery and community engagement platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS & Bootstrap 5**, **Leaflet.js 1.9 Geo-Maps**, **NextAuth.js (JWT Authentication)**, and **Strapi 5 Headless CMS**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ / v22+ (LTS recommended)
- **Git**

### 2. Running Locally

From the root directory:

```powershell
# Install all dependencies across workspace
npm install

# Start development server
npm run dev
```

If port 3000 is occupied by a background process, free it or start frontend directly:

```powershell
# To free port 3000 on Windows:
npx kill-port 3000

# Or run frontend directly on available port:
cd frontend
npm run dev
```

Open your browser at:
👉 **`http://localhost:3000`** (or **`http://localhost:3001`**)

---

## 🔑 Demo & Test Credentials

The application includes built-in credentials and **1-Click Quick Auto-Fill buttons** on the [`/login`](http://localhost:3000/login) page:

| Role | User Name | Email Address | Password | Permissions & Features |
| :--- | :--- | :--- | :--- | :--- |
| **Super Administrator** | Super Administrator | `admin@eventdiscovery.pk` | `pakistan2026` | Full access to Super Admin Portal at `/admin/dashboard`, Event Approval/Rejection workflow, Master Event Directory, Toggle Featured status, Delete listings, and User Accounts list. |
| **Verified User** | Ahmed Khan | `ahmed.khan@eventdiscovery.pk` | `pakistan2026` | Access to User Dashboard at `/dashboard`, Digital Pass Wallet, QR Admission Pass Modal, Ticket printing, RSVP passes, Bookmark favorites, Activity history, and Event proposal. |
| **Custom Attendee** | Any Custom User | Register at [`/register`](http://localhost:3000/register) | Any password (min 6 chars) | Create new account with city and phone number. |

---

## 🌟 Implemented Modules & Features

### 1. 🏠 Homepage (`/`)
- **Pakistan Community Hero**: Live search bar with keyword search, City dropdown (*Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad*), Category dropdown, and live statistics badges.
- **Explore by Category**: 7 curated categories with color badges, custom icons, and event counters.
- **Featured Events Grid**: Handpicked event cards with PKR prices and PKT timings.
- **Live Pakistan Geo-Map**: Interactive Leaflet preview map with pins across Pakistani cities.
- **Community Network Perks**: Highlights for digital passes, interactive maps, and instant alerts.

### 2. 🗺️ Events Catalog & Live Geo-Map (`/events`)
- **View Switcher**: Toggle between **Split Map & List View** and **Card Grid View**.
- **Synchronized Leaflet Geo-Map**: Hovering/clicking cards centers the map on the venue and highlights markers; clicking pins opens rich popup cards.
- **Filter Toolbar**: Real-time keyword search, City selector, Category selector, Sort selector (*Date Upcoming, Date Furthest, Popularity/RSVPs, A to Z*), and Reset filters button.
- **1-Click Card Actions**: Instant RSVP pass reservation and bookmarking.

### 3. 🎟️ Event Details & Community Reviews (`/events/[slug]`)
- **Breadcrumbs & Hierarchy**: Category, city, and attendee count badges.
- **Gallery / Cover Banner**: High-resolution image gallery.
- **Venue Location Map**: Interactive Leaflet map with **"Get Directions"** linking directly to Google Maps navigation.
- **Community Reviews & Ratings**: Star ratings list + interactive review submission form (1–5 stars + comment).
- **Sticky RSVP Sidebar**: Ticket counter (`+` / `-`), reserve pass button, save to favorites, verified host profile card, and recommended events.

### 4. 💼 User Dashboard & Pass Wallet (`/dashboard`)
- **Overview Tab**: Active passes count, saved bookmarks, home city, and the **"Digital Pass Ready" banner**.
- **My Passes (RSVP Wallet) Tab**: Digital pass cards with **"Show QR Pass"** opening the **Official Admission Pass Modal** with print feature and unique `PK-PASS-...` code, plus **"Cancel Pass"** option.
- **Saved Bookmarks Tab**: Manage bookmarked events with 1-click removal.
- **Activity History Tab**: Timeline of recent registrations and bookmarks.
- **Profile Settings Tab**: Form to update Full Name, Primary City, Phone, and Community Bio.

### 5. 🛡️ Super Admin Management Center (`/admin/dashboard`)
- **KPI Analytics Cards**: Total Events Listed, Pending Approvals, Total RSVP Registrations, and Estimated Revenue in PKR.
- **Tab 1 — Event Approval Workflow**: Submissions requiring review table with live **Approve** and **Reject** buttons.
- **Tab 2 — Master Event Directory**: Master table with live filter search, **Toggle Featured** button, View public link, and **Delete Event** action.
- **Tab 3 — Registered Accounts**: Directory of Pakistani community members and organizers.

### 6. ✍️ Submit Community Event (`/submit-event`)
- **5-Section Structured Form**:
  1. *Basic Info*: Title, Category, Capacity, Short Summary, Full Agenda.
  2. *Schedule & Pricing*: Date, Start/End Time (PKT), Free vs. Paid pass radio with PKR Price input.
  3. *Venue & Coordinates*: City dropdown with automatic coordinates for Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, Quetta, Venue Name, Address.
  4. *Banner Image*: URL input with instant preview.
  5. *Organizer Contact*: Host Name, Email, Phone.
- Form validation and automatic submission into the Admin Approval queue.

### 7. 🏷️ Categories Directory (`/categories`)
- 7 Curated category cards with upcoming event count badges and links to filtered events.
- CTA banner to open the live Geo-Map or browse all listings.

### 8. 🔐 Authentication (`/login` & `/register`)
- 1-Click quick demo account buttons for instant login.
- Community perks sidebar showcase.
- Registration with Name, Email, Password, City in Pakistan, and Phone number.

### 9. 🚫 Custom 404 Page (`/not-found`)
- Themed 404 page with return home, browse events, and quick search.

---

## 📁 Project Architecture & Directory Structure

```text
EventDiscovery/
├── frontend/                     # Next.js 16 App Router Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/dashboard/  # Super Admin Management Dashboard
│   │   │   ├── api/              # Backend API Endpoints (Admin, RSVPs, Favorites, Reviews, etc.)
│   │   │   │   ├── admin/        # Admin stats, events, approve, reject, feature, delete, users
│   │   │   │   ├── favorites/    # Bookmarking endpoints (toggle, me)
│   │   │   │   ├── profile/      # User profile update
│   │   │   │   ├── register/     # User registration
│   │   │   │   ├── reviews/      # Community reviews submission
│   │   │   │   ├── rsvps/        # RSVP pass reservations & cancellation
│   │   │   │   └── submit-event/ # Event submission endpoint
│   │   │   ├── categories/       # Category directory page
│   │   │   ├── dashboard/        # User Dashboard & Pass Wallet
│   │   │   ├── events/           # Events catalog (Grid & Split Geo-Map)
│   │   │   │   └── [slug]/       # Event Detail page
│   │   │   ├── login/            # Sign In page with 1-click demo access
│   │   │   ├── register/         # Account registration page
│   │   │   ├── submit-event/     # Event submission form
│   │   │   ├── globals.css       # Complete modern CSS design system
│   │   │   ├── layout.tsx        # Root layout with responsive Navbar & Footer
│   │   │   ├── not-found.tsx     # Custom 404 page
│   │   │   └── page.tsx          # Homepage
│   │   ├── components/           # Reusable UI & Client Components
│   │   │   ├── admin-dashboard-client.tsx # Super Admin interactive interface
│   │   │   ├── user-dashboard-client.tsx  # User Dashboard & QR modal
│   │   │   ├── events-explorer.tsx        # Split Map & List explorer
│   │   │   ├── event-detail-client.tsx    # Event details, reviews & RSVP
│   │   │   ├── submit-event-form.tsx      # 5-Section event proposal form
│   │   │   ├── event-card.tsx             # Responsive event cards
│   │   │   ├── navbar.tsx                 # Responsive header with mobile drawer
│   │   │   ├── footer.tsx                 # Standard Pakistan footer
│   │   │   ├── map-preview.tsx            # Leaflet live map component
│   │   │   ├── login-form.tsx             # Login form with demo buttons
│   │   │   └── register-form.tsx          # Registration form
│   │   ├── lib/
│   │   │   └── events.ts         # Data models, mock dataset, and storage helpers
│   │   └── auth.ts               # NextAuth credentials & Strapi JWT integration
│   └── package.json
├── cms/                          # Strapi 5 Headless CMS Backend
├── prototype/                    # HTML/CSS/JS Prototype Reference
└── README.md                     # Complete Documentation & Test Guide
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Returns KPI analytics (Total events, pending, RSVPs, revenue) | Yes (Admin) |
| `GET` | `/api/admin/events` | Returns all master events including pending and rejected | Yes (Admin) |
| `POST` | `/api/admin/approve` | Approves a pending event submission | Yes (Admin) |
| `POST` | `/api/admin/reject` | Rejects an event submission | Yes (Admin) |
| `POST` | `/api/admin/feature` | Toggles homepage featured status | Yes (Admin) |
| `DELETE` | `/api/admin/delete` | Deletes an event listing | Yes (Admin) |
| `GET` | `/api/admin/users` | Returns registered accounts list | Yes (Admin) |
| `GET` | `/api/rsvps/me` | Returns current user's registered passes | Yes |
| `POST` | `/api/rsvps` | Reserves a pass for an event | Yes |
| `DELETE` | `/api/rsvps` | Cancels an event pass | Yes |
| `GET` | `/api/favorites/me`| Returns current user's bookmarked events | Yes |
| `POST` | `/api/favorites` | Toggles bookmark status for an event | Yes |
| `POST` | `/api/reviews` | Submits a star rating and review comment | Yes |
| `POST` | `/api/submit-event`| Submits a new event proposal | Yes |
| `POST` | `/api/profile` | Updates user profile details | Yes |
| `POST` | `/api/register` | Creates a new user account | No |

---

## 🧪 Production Verification
To test the production build:

```powershell
npm run build
```

✅ **Build result**: All 22 Next.js server, client, and API routes compile with **0 errors**.
