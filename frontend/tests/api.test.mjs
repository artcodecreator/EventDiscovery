// API / functional regression tests for the standalone (in-memory) mode.
// Runs with the Node built-in test runner - no extra dependencies.
//
//   1. Start the app:  npm run dev --workspace frontend   (or `npm run start`)
//   2. Run tests:      npm run test --workspace frontend
//
// BASE_URL overrides the target (default http://localhost:3000).
// Demo credentials come from the documented demo accounts; override with
// TEST_USER_EMAIL / TEST_ADMIN_EMAIL / TEST_PASSWORD if they were changed.
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const PASSWORD = process.env.TEST_PASSWORD || "pakistan2026";
const USER_EMAIL = process.env.TEST_USER_EMAIL || "ahmed.khan@eventdiscovery.pk";
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || "admin@eventdiscovery.pk";

class Client {
  constructor() { this.jar = new Map(); }
  _store(res) {
    for (const c of res.headers.getSetCookie?.() ?? []) {
      const [pair] = c.split(";");
      const i = pair.indexOf("=");
      const name = pair.slice(0, i).trim();
      const value = pair.slice(i + 1).trim();
      if (value === "" || /expires=Thu, 01 Jan 1970/i.test(c)) this.jar.delete(name);
      else this.jar.set(name, value);
    }
  }
  async req(path, { method = "GET", json, form, headers = {}, raw } = {}) {
    const h = { ...headers };
    if (this.jar.size) h.cookie = [...this.jar].map(([k, v]) => `${k}=${v}`).join("; ");
    let body;
    if (json !== undefined) { h["content-type"] = "application/json"; body = JSON.stringify(json); }
    else if (form) { h["content-type"] = "application/x-www-form-urlencoded"; body = new URLSearchParams(form).toString(); }
    else if (raw !== undefined) { h["content-type"] = "application/json"; body = raw; }
    const res = await fetch(BASE + path, { method, headers: h, body, redirect: "manual" });
    this._store(res);
    return res;
  }
  async login(email, password) {
    const csrfRes = await this.req("/api/auth/csrf");
    const { csrfToken } = await csrfRes.json();
    const res = await this.req("/api/auth/callback/credentials", {
      method: "POST",
      form: { csrfToken, email, password, json: "true" }
    });
    const session = await (await this.req("/api/auth/session")).json();
    return { res, session };
  }
}

const anon = () => new Client();
const as = async (email) => { const c = new Client(); const { session } = await c.login(email, PASSWORD); assert.ok(session?.user, `login failed for ${email}`); return c; };
const uniq = (p) => `${p}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const validEvent = (title) => ({
  title, category: "Technology & Hackathons", city: "Lahore", venue_name: "QA Venue",
  event_date: "2026-12-20", start_time: "14:00:00", end_time: "19:00:00",
  ticket_type: "free", price: 0, capacity: 100, short_description: "QA short description",
  full_description: "QA full description", organizer_name: "QA", organizer_email: "qa@example.com"
});

describe("Public pages", () => {
  for (const path of ["/", "/events", "/categories", "/login", "/register"]) {
    test(`GET ${path} -> 200`, async () => {
      const res = await anon().req(path);
      assert.equal(res.status, 200);
      const html = await res.text();
      assert.ok(html.includes("<html"));
    });
  }
  test("unknown route -> 404", async () => {
    assert.equal((await anon().req("/this-route-does-not-exist")).status, 404);
  });
  test("unknown event slug -> 404", async () => {
    assert.equal((await anon().req("/events/no-such-event-zzz")).status, 404);
  });
  test("GET /events?search= filters server data without crashing", async () => {
    assert.equal((await anon().req("/events?search=%3Cscript%3E&city=Lahore&category=music")).status, 200);
  });
});

describe("Authentication & session", () => {
  test("wrong password is rejected", async () => {
    const c = anon();
    const { session } = await c.login(USER_EMAIL, "wrong-password-123");
    assert.ok(!session?.user);
  });
  test("unknown user is rejected", async () => {
    const { session } = await anon().login("nobody@example.com", "whatever12");
    assert.ok(!session?.user);
  });
  test("valid user login creates a session with role=user", async () => {
    const { session } = await anon().login(USER_EMAIL, PASSWORD);
    assert.equal(session.user.role, "user");
  });
  test("valid admin login creates a session with role=admin", async () => {
    const { session } = await anon().login(ADMIN_EMAIL, PASSWORD);
    assert.equal(session.user.role, "admin");
  });
  // KNOWN LIMITATION (BUG-009, Medium): the NextAuth session callback copies the upstream
  // Strapi JWT into the client-visible session. Fixing it needs a token-vault/BFF redesign of
  // every route that reads session.strapiToken, so it is tracked as `todo` rather than hidden.
  test("session does not leak the upstream token to the browser", { todo: "BUG-009: needs auth architecture change" }, async () => {
    const { session } = await anon().login(USER_EMAIL, PASSWORD);
    assert.equal(session.strapiToken, undefined);
  });
});

describe("Protected pages", () => {
  for (const path of ["/dashboard", "/admin/dashboard", "/submit-event"]) {
    test(`anonymous ${path} redirects to /login`, async () => {
      const res = await anon().req(path);
      assert.ok([302, 303, 307, 308].includes(res.status), `status ${res.status}`);
      assert.match(res.headers.get("location") || "", /\/login/);
    });
  }
  test("normal user is redirected away from /admin/dashboard", async () => {
    const res = await (await as(USER_EMAIL)).req("/admin/dashboard");
    assert.ok([302, 303, 307, 308].includes(res.status));
    assert.doesNotMatch(res.headers.get("location") || "", /\/admin/);
  });
  test("admin can open /admin/dashboard", async () => {
    assert.equal((await (await as(ADMIN_EMAIL)).req("/admin/dashboard")).status, 200);
  });
  test("admin dashboard HTML never contains account passwords", async () => {
    const html = await (await (await as(ADMIN_EMAIL)).req("/admin/dashboard")).text();
    assert.ok(!html.includes(PASSWORD), "password found in rendered admin page");
  });
});

describe("Admin API authorization (server-side RBAC)", () => {
  const calls = [
    ["GET", "/api/admin/events"], ["GET", "/api/admin/stats"], ["GET", "/api/admin/users"],
    ["POST", "/api/admin/approve"], ["POST", "/api/admin/reject"],
    ["POST", "/api/admin/feature"], ["POST", "/api/admin/delete"]
  ];
  for (const [method, path] of calls) {
    test(`anonymous ${method} ${path} -> 401`, async () => {
      const res = await anon().req(path, { method, json: method === "POST" ? { id: 1 } : undefined });
      assert.equal(res.status, 401);
    });
    test(`normal user ${method} ${path} -> 403`, async () => {
      const res = await (await as(USER_EMAIL)).req(path, { method, json: method === "POST" ? { id: 1 } : undefined });
      assert.equal(res.status, 403);
    });
  }
  test("admin GET /api/admin/users -> 200 and no password fields", async () => {
    const res = await (await as(ADMIN_EMAIL)).req("/api/admin/users");
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(!/"password"/.test(text) && !text.includes(PASSWORD));
  });
  test("admin GET /api/admin/stats -> 200 with numeric KPIs", async () => {
    const res = await (await as(ADMIN_EMAIL)).req("/api/admin/stats");
    assert.equal(res.status, 200);
    const { data } = await res.json();
    for (const k of ["totalEvents", "pendingApprovals", "totalRsvps", "estimatedRevenue"]) assert.equal(typeof data[k], "number");
  });
});

describe("Event submission -> moderation -> publication journey", () => {
  let user, admin, title, slug, id;
  before(async () => { user = await as(USER_EMAIL); admin = await as(ADMIN_EMAIL); title = uniq("QA Journey Event"); });

  test("anonymous cannot submit an event", async () => {
    assert.equal((await anon().req("/api/submit-event", { method: "POST", json: validEvent("x anon") })).status, 401);
  });
  test("submission with missing title -> 400 (not 500)", async () => {
    const res = await user.req("/api/submit-event", { method: "POST", json: { ...validEvent("t"), title: undefined } });
    assert.equal(res.status, 400);
  });
  test("submission with malformed JSON -> 400", async () => {
    assert.equal((await user.req("/api/submit-event", { method: "POST", raw: "{not json" })).status, 400);
  });
  test("submission with oversized title -> 400", async () => {
    const res = await user.req("/api/submit-event", { method: "POST", json: validEvent("A".repeat(500)) });
    assert.equal(res.status, 400);
  });
  test("valid submission is created as pending", async () => {
    const res = await user.req("/api/submit-event", { method: "POST", json: validEvent(title) });
    assert.equal(res.status, 200);
    const { data } = await res.json();
    assert.equal(data.status, "pending");
    slug = data.slug; id = data.id;
  });
  test("a submitted client cannot self-approve via payload (status/featured ignored)", async () => {
    const t = uniq("QA Spoof");
    const res = await user.req("/api/submit-event", { method: "POST", json: { ...validEvent(t), status: "approved", featured: true, isFeatured: true } });
    const { data } = await res.json();
    assert.equal(data.status, "pending");
    assert.ok(!data.featured);
  });
  test("pending event is NOT visible on the public catalog", async () => {
    const html = await (await anon().req("/events")).text();
    assert.ok(!html.includes(title));
  });
  test("pending event detail page is NOT public (404)", async () => {
    assert.equal((await anon().req(`/events/${slug}`)).status, 404);
  });
  test("pending event detail page is NOT visible to other normal users", async () => {
    const other = await as(USER_EMAIL);
    assert.equal((await other.req(`/events/${slug}`)).status, 404);
  });
  test("admin can preview the pending event", async () => {
    assert.equal((await admin.req(`/events/${slug}`)).status, 200);
  });
  test("admin approves -> event becomes public", async () => {
    const res = await admin.req("/api/admin/approve", { method: "POST", json: { id } });
    assert.equal(res.status, 200);
    assert.equal((await anon().req(`/events/${slug}`)).status, 200);
    assert.ok((await (await anon().req("/events")).text()).includes(title));
  });
  test("approve with unknown id -> 404", async () => {
    assert.equal((await admin.req("/api/admin/approve", { method: "POST", json: { id: 99999999 } })).status, 404);
  });
  test("admin toggles featured on and off", async () => {
    const a = await (await admin.req("/api/admin/feature", { method: "POST", json: { id } })).json();
    const b = await (await admin.req("/api/admin/feature", { method: "POST", json: { id } })).json();
    assert.equal(a.isFeatured, true);
    assert.equal(b.isFeatured, false);
  });
  test("admin rejects -> event disappears from public", async () => {
    await admin.req("/api/admin/reject", { method: "POST", json: { id } });
    assert.equal((await anon().req(`/events/${slug}`)).status, 404);
  });
  test("admin deletes -> event gone for everyone incl. direct URL", async () => {
    const res = await admin.req("/api/admin/delete", { method: "POST", json: { id } });
    assert.equal(res.status, 200);
    assert.equal((await anon().req(`/events/${slug}`)).status, 404);
    const list = await (await admin.req("/api/admin/events")).json();
    assert.ok(!list.data.some((e) => e.id === id), "deleted event still listed to admin");
  });
  test("admin endpoints reject missing id -> 400", async () => {
    for (const p of ["approve", "reject", "feature", "delete"]) {
      assert.equal((await admin.req(`/api/admin/${p}`, { method: "POST", json: {} })).status, 400, p);
    }
  });
});

describe("RSVP / favorites / reviews", () => {
  let user, eventId;
  before(async () => {
    user = await as(USER_EMAIL);
    const pub = await (await (await as(ADMIN_EMAIL)).req("/api/admin/events")).json();
    eventId = pub.data.find((e) => e.status === "approved").id;
  });

  test("anonymous RSVP -> 401", async () => {
    assert.equal((await anon().req("/api/rsvps", { method: "POST", json: { eventId } })).status, 401);
  });
  test("RSVP rejects invalid ticket counts", async () => {
    for (const n of [0, -3, 11, 1000, 1.5, "abc"]) {
      const res = await user.req("/api/rsvps", { method: "POST", json: { eventId, ticketsCount: n } });
      assert.equal(res.status, 400, `ticketsCount=${JSON.stringify(n)}`);
    }
  });
  test("RSVP for unknown event -> 404", async () => {
    assert.equal((await user.req("/api/rsvps", { method: "POST", json: { eventId: 987654321 } })).status, 404);
  });
  test("RSVP malformed JSON -> 400", async () => {
    assert.equal((await user.req("/api/rsvps", { method: "POST", raw: "{oops" })).status, 400);
  });
  test("DELETE /api/rsvps on a non-booked event does NOT create a booking", async () => {
    const fresh = await as(USER_EMAIL);
    await fresh.req("/api/rsvps", { method: "DELETE", json: { eventId } }); // ensure eventId is not booked
    const before = (await (await fresh.req("/api/rsvps/me")).json()).data;
    assert.ok(!before.some((p) => String(p.event?.id) === String(eventId)));
    await fresh.req("/api/rsvps", { method: "DELETE", json: { eventId } });
    const after = (await (await fresh.req("/api/rsvps/me")).json()).data;
    assert.equal(after.length, before.length);
    assert.ok(!after.some((p) => String(p.event?.id) === String(eventId)));
  });
  test("RSVP book -> appears in wallet -> cancel via DELETE removes it", async () => {
    const c = await as(USER_EMAIL);
    await c.req("/api/rsvps", { method: "DELETE", json: { eventId } });
    const book = await c.req("/api/rsvps", { method: "POST", json: { eventId, ticketsCount: 2 } });
    assert.equal(book.status, 200);
    assert.equal((await book.json()).data.active, true);
    let me = (await (await c.req("/api/rsvps/me")).json()).data;
    assert.ok(me.some((p) => String(p.event?.id) === String(eventId) && p.ticketsCount === 2));
    const del = await c.req("/api/rsvps", { method: "DELETE", json: { eventId } });
    assert.equal((await del.json()).data.active, false);
    me = (await (await c.req("/api/rsvps/me")).json()).data;
    assert.ok(!me.some((p) => String(p.event?.id) === String(eventId)));
  });
  test("POST /api/rsvps keeps its documented toggle behaviour (second POST cancels)", async () => {
    const c = await as(USER_EMAIL);
    await c.req("/api/rsvps", { method: "DELETE", json: { eventId } });
    const first = await (await c.req("/api/rsvps", { method: "POST", json: { eventId } })).json();
    const second = await (await c.req("/api/rsvps", { method: "POST", json: { eventId } })).json();
    assert.equal(first.data.active, true);
    assert.equal(second.data.active, false);
    const me = (await (await c.req("/api/rsvps/me")).json()).data;
    assert.ok(!me.some((p) => String(p.event?.id) === String(eventId)));
  });
  test("RSVP data is isolated per user", async () => {
    const u = await as(USER_EMAIL);
    const a = await as(ADMIN_EMAIL);
    await u.req("/api/rsvps", { method: "POST", json: { eventId } });
    const adminPasses = (await (await a.req("/api/rsvps/me")).json()).data;
    assert.ok(!adminPasses.some((p) => String(p.event?.id) === String(eventId)));
    await u.req("/api/rsvps", { method: "DELETE", json: { eventId } });
  });
  test("anonymous favorites -> 401", async () => {
    assert.equal((await anon().req("/api/favorites", { method: "POST", json: { eventId } })).status, 401);
    assert.equal((await anon().req("/api/favorites/me")).status, 401);
  });
  test("favorite toggles on and off", async () => {
    const c = await as(USER_EMAIL);
    // ensure clean state for eventId first
    let curr = (await (await c.req("/api/favorites/me")).json()).data;
    if (curr.some((f) => String(f.event?.id) === String(eventId))) {
      await c.req("/api/favorites", { method: "POST", json: { eventId } });
    }
    const on = await (await c.req("/api/favorites", { method: "POST", json: { eventId } })).json();
    assert.equal(on.data.bookmarked, true);
    let favs = (await (await c.req("/api/favorites/me")).json()).data;
    assert.ok(favs.some((f) => String(f.event?.id) === String(eventId)));
    const off = await (await c.req("/api/favorites", { method: "POST", json: { eventId } })).json();
    assert.equal(off.data.bookmarked, false);
    favs = (await (await c.req("/api/favorites/me")).json()).data;
    assert.ok(!favs.some((f) => String(f.event?.id) === String(eventId)));
  });
  test("favorite for unknown event -> 404", async () => {
    assert.equal((await user.req("/api/favorites", { method: "POST", json: { eventId: 987654321 } })).status, 404);
  });
  test("anonymous review -> 401", async () => {
    assert.equal((await anon().req("/api/reviews", { method: "POST", json: { eventId, rating: 5, comment: "great" } })).status, 401);
  });
  test("review rejects invalid ratings and empty/oversized comments", async () => {
    for (const rating of [0, 6, -1, 2.5, "abc", null]) {
      assert.equal((await user.req("/api/reviews", { method: "POST", json: { eventId, rating, comment: "ok" } })).status, 400, `rating=${rating}`);
    }
    assert.equal((await user.req("/api/reviews", { method: "POST", json: { eventId, rating: 5, comment: "   " } })).status, 400);
    assert.equal((await user.req("/api/reviews", { method: "POST", json: { eventId, rating: 5, comment: "x".repeat(5000) } })).status, 400);
  });
  test("valid review is stored; HTML in comment is returned as data (escaped by React at render)", async () => {
    const res = await user.req("/api/reviews", { method: "POST", json: { eventId, rating: 5, comment: "Great <b>event</b>" } });
    assert.equal(res.status, 200);
  });
  test("review for unknown event -> 404", async () => {
    assert.equal((await user.req("/api/reviews", { method: "POST", json: { eventId: 987654321, rating: 4, comment: "hi" } })).status, 404);
  });
});

describe("Registration / account endpoints", () => {
  test("register with invalid body -> 400 (or 503 when account service is not configured)", async () => {
    const res = await anon().req("/api/register", { method: "POST", json: { email: "bad", password: "1" } });
    assert.ok([400, 503].includes(res.status));
  });
  test("profile/password require sign-in", async () => {
    assert.equal((await anon().req("/api/profile", { method: "PATCH", json: {} })).status, 401);
    assert.equal((await anon().req("/api/profile/password", { method: "POST", json: {} })).status, 401);
  });
  test("categories endpoint requires sign-in", async () => {
    assert.equal((await anon().req("/api/categories")).status, 401);
  });
});

describe("Security headers & information disclosure", () => {
  test("responses do not expose X-Powered-By", async () => {
    const res = await anon().req("/");
    assert.equal(res.headers.get("x-powered-by"), null);
  });
  test("pages send basic hardening headers", async () => {
    const res = await anon().req("/");
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.ok(res.headers.get("x-frame-options") || /frame-ancestors/.test(res.headers.get("content-security-policy") || ""));
    assert.ok(res.headers.get("referrer-policy"));
  });
  test("API errors do not leak stack traces", async () => {
    const res = await (await as(USER_EMAIL)).req("/api/submit-event", { method: "POST", raw: "{bad" });
    const t = await res.text();
    assert.ok(!/at .*\.(ts|js):\d+/.test(t) && !/node_modules/.test(t));
  });
});

