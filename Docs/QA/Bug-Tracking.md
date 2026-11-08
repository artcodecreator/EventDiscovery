# EventDiscovery Pakistan — Bug Tracking & Defect Lifecycle

This document logs all defects discovered, analyzed, categorized, and resolved during the end-to-end QA process.

---

## Defect Summary Table

| Defect ID | Severity | Module / Component | Defect Summary | Resolution Status |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | **Critical** | Frontend Toolchain | Missing FontAwesome `webfonts` directory causing Next.js build failure on `fa-brands-400.woff2` | 🟢 Resolved |
| **BUG-002** | **Critical** | Security / Admin APIs | Administrative routes lacked server-side authorization check (anyone could approve/delete events) | 🟢 Resolved |
| **BUG-003** | **High** | Security / Admin Users | `/api/admin/users` was returning plain-text demo passwords in JSON responses | 🟢 Resolved |
| **BUG-004** | **High** | Event Moderation | Submitting an event allowed client to self-approve and mark as featured via request payload | 🟢 Resolved |
| **BUG-005** | **High** | Event Discovery | Direct URL to pending/unapproved events (`/events/[slug]`) was accessible to anonymous visitors | 🟢 Resolved |
| **BUG-006** | **Medium** | RSVP Pass Management | `DELETE /api/rsvps` was using toggle logic, causing repeated deletes to create bookings | 🟢 Resolved |
| **BUG-007** | **Medium** | Security Configuration | Next.js exposed `X-Powered-By: Next.js` and lacked clickjacking/MIME security headers | 🟢 Resolved |
| **BUG-008** | **High** | TypeScript / Build | Route handler exported `initialUsers` causing TS2344, plus missing NextAuth v5 ambient declarations | 🟢 Resolved |
| **BUG-009** | **Medium** | Auth Architecture | NextAuth session callback exposes `strapiToken` to client (tracked as documented limitation) | 🟡 Documented |

---

## Detailed Defect Reports

### BUG-001: Missing FontAwesome Webfonts Directory
- **Severity**: Critical (P1)
- **Module**: `frontend/node_modules/@fortawesome/fontawesome-free`
- **Root Cause**: Incomplete npm installation left `@fortawesome/fontawesome-free` without its `webfonts/` directory. Webpack compilation failed on `../webfonts/fa-brands-400.woff2`.
- **Fix Applied**: Cleaned corrupted package directory and reinstalled FontAwesome. Verified all 8 `.woff2` and `.ttf` font files restored. Cleared `.next` build cache.
- **Verification**: `GET /` compiled cleanly with HTTP 200.

### BUG-002: Missing Server-Side RBAC on Admin APIs
- **Severity**: Critical (P1)
- **Module**: `src/app/api/admin/*`
- **Root Cause**: Endpoints (`approve`, `reject`, `feature`, `delete`, `events`, `stats`, `users`) lacked server-side session and role validation.
- **Fix Applied**: Created `frontend/src/lib/api-guards.ts` with `requireAdmin()` helper:
  ```typescript
  export async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return { response: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
    if (session.user.role !== "admin") return { response: NextResponse.json({ error: "Administrator access required." }, { status: 403 }) };
    return { session };
  }
  ```
- **Verification**: 14 automated test assertions verifying anonymous (401) and normal user (403) rejection pass cleanly.

### BUG-003: Credential Disclosure on Admin Accounts Route
- **Severity**: High (P2)
- **Module**: `src/app/api/admin/users/route.ts`
- **Root Cause**: Directly spread `DEMO_USERS` array containing `password: "pakistan2026"`.
- **Fix Applied**: Created sanitized projection `PublicUser` in `src/lib/users.ts` mapping only safe public fields (`id`, `name`, `email`, `role`, `city`, `phone`, `bio`). Passwords are never sent over the wire.
- **Verification**: Automated test `admin GET /api/admin/users -> 200 and no password fields` passes.

### BUG-004: Client Parameter Tampering on Event Submission
- **Severity**: High (P2)
- **Module**: `src/app/api/submit-event/route.ts`
- **Root Cause**: Raw request body passed directly to store. A malicious user could submit `{ "status": "approved", "featured": true }`.
- **Fix Applied**: Added Zod whitelist validation `eventSubmissionSchema` in `api-guards.ts`. Client-supplied status and featured values are discarded; `status: "pending"` is strictly enforced.
- **Verification**: Automated test `a submitted client cannot self-approve via payload` passes.

### BUG-005: Unapproved Events Accessible via Direct URL
- **Severity**: High (P2)
- **Module**: `src/app/events/[slug]/page.tsx`
- **Root Cause**: The dynamic page resolved any event by slug without checking whether `status === "approved"`.
- **Fix Applied**: Added server-side role check:
  ```typescript
  if ((event.status ?? "approved") !== "approved") {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      notFound();
    }
  }
  ```
- **Verification**: Direct request to pending event URL returns HTTP 404 for anonymous users and regular attendees; returns HTTP 200 for Super Admins.

### BUG-006: RSVP Inversion on Repeated DELETE Requests
- **Severity**: Medium (P3)
- **Module**: `src/app/api/rsvps/route.ts` & `src/lib/events.ts`
- **Root Cause**: `DELETE` route delegated to `toggleRsvp()`.
- **Fix Applied**: Created dedicated `cancelRsvp()` method that only performs cancellation. If a pass does not exist, it safely returns `{ cancelled: false }` without creating a booking.
- **Verification**: Automated test `DELETE /api/rsvps on a non-booked event does NOT create a booking` passes.

### BUG-007: Missing Security Headers & Framework Fingerprinting
- **Severity**: Medium (P3)
- **Module**: `frontend/next.config.ts`
- **Root Cause**: Default Next.js configuration included `X-Powered-By` header and lacked standard clickjacking/sniffing guards.
- **Fix Applied**: Added `poweredByHeader: false` and custom security headers in `next.config.ts`.
- **Verification**: Automated tests `responses do not expose X-Powered-By` and `pages send basic hardening headers` pass.

### BUG-008: Next.js Route Export Conflict & TypeScript Ambient Types
- **Severity**: High (P2)
- **Module**: `src/app/api/admin/users/route.ts`, `src/types/next-auth.d.ts`
- **Root Cause**: Next.js App Router rules disallow non-standard exports (`initialUsers`) from `route.ts`. Additionally, missing `.d.ts` files in `next-auth` beta package caused TS7016 errors during `tsc --noEmit`.
- **Fix Applied**:
  1. Extracted `initialUsers` to `src/lib/users.ts`.
  2. Created clean ambient type declarations for `next-auth`, `next-auth/react`, and `next-auth/jwt` in `src/types/next-auth.d.ts`.
- **Verification**: Both `npx tsc --noEmit` and `npx next build --webpack` succeed with 0 errors.
