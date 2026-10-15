"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (res?.error) {
      setError("Invalid credentials. Please verify your email and password or use a 1-click Demo account below.");
      setLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div>
      {/* 1-Click Demo Accounts Box */}
      <div className="p-3 bg-light rounded-3 border mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold small text-dark"><i className="fa-solid fa-flask text-primary me-1"></i> Quick 1-Click Demo Accounts</span>
          <span className="badge bg-secondary-subtle text-secondary small">Demo</span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm rounded-pill px-3"
            onClick={() => fillDemoAccount("ahmed.khan@eventdiscovery.pk", "pakistan2026")}
          >
            <i className="fa-solid fa-user me-1"></i> User: Ahmed Khan
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-pill px-3"
            onClick={() => fillDemoAccount("admin@eventdiscovery.pk", "pakistan2026")}
          >
            <i className="fa-solid fa-shield-halved me-1"></i> Admin: Portal
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
          <div className="small">{error}</div>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label small fw-semibold text-muted">Email Address <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-regular fa-envelope"></i></span>
            <input
              type="email"
              className="form-control border-start-0 ps-0"
              placeholder="e.g. ahmed.khan@eventdiscovery.pk"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold text-muted">Password <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-lock"></i></span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="input-group-text bg-light border-start-0 text-muted"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
            <label className="form-check-label small text-muted" htmlFor="rememberMe">Remember me</label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary-gradient w-100 py-2 rounded-pill fw-bold mb-3 shadow-sm"
          disabled={loading}
        >
          {loading ? (
            <span><i className="fa-solid fa-spinner fa-spin me-2"></i> Signing In...</span>
          ) : (
            <span><i className="fa-solid fa-right-to-bracket me-2"></i> Sign In to Account</span>
          )}
        </button>

        <div className="text-center small text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary fw-bold text-decoration-none">
            Create Free Account
          </Link>
        </div>
      </form>
    </div>
  );
}
