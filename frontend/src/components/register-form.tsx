"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    city: "Lahore",
    phone: "+92 300 "
  });
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setError("Please accept the terms & conditions to register.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to register account.");
        setLoading(false);
        return;
      }

      // Auto sign in
      const signRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (signRes?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error during registration.");
      setLoading(false);
    }
  };

  const fillDemoAuto = () => {
    setFormData({
      username: "Usman Tariq",
      email: "usman.tariq@gmail.com",
      password: "pakistan2026",
      city: "Karachi",
      phone: "+92 321 8899776"
    });
    setError(null);
  };

  return (
    <div>
      {/* 1-Click Demo Fill */}
      <div className="p-3 bg-light rounded-3 border mb-4 d-flex justify-content-between align-items-center">
        <div>
          <span className="fw-bold small text-dark d-block"><i className="fa-solid fa-wand-magic-sparkles text-primary me-1"></i> Quick Demo Auto-Fill</span>
          <span className="small text-muted">Prefill new Pakistani attendee details</span>
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={fillDemoAuto}>
          Auto-Fill
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
          <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
          <div className="small">{error}</div>
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label small fw-semibold text-muted">Full Name <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control rounded-3"
            placeholder="e.g. Ahmed Khan or Fatima Noor"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Email Address <span className="text-danger">*</span></label>
            <input
              type="email"
              className="form-control rounded-3"
              placeholder="name@domain.pk"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Password <span className="text-danger">*</span></label>
            <input
              type="password"
              className="form-control rounded-3"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Primary City in Pakistan <span className="text-danger">*</span></label>
            <select
              className="form-select rounded-3"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              required
            >
              <option value="Lahore">Lahore, Punjab</option>
              <option value="Karachi">Karachi, Sindh</option>
              <option value="Islamabad">Islamabad (Capital)</option>
              <option value="Rawalpindi">Rawalpindi, Punjab</option>
              <option value="Peshawar">Peshawar, KP</option>
              <option value="Multan">Multan, Punjab</option>
              <option value="Faisalabad">Faisalabad, Punjab</option>
              <option value="Quetta">Quetta, Balochistan</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted">Mobile Number</label>
            <input
              type="tel"
              className="form-control rounded-3"
              placeholder="+92 300 0000000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="termsCheck"
            checked={agreedTerms}
            onChange={e => setAgreedTerms(e.target.checked)}
          />
          <label className="form-check-label small text-muted" htmlFor="termsCheck">
            I agree to the EventDiscovery Pakistan Community Guidelines &amp; Terms
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary-gradient w-100 py-2 rounded-pill fw-bold mb-3 shadow-sm"
          disabled={loading}
        >
          {loading ? (
            <span><i className="fa-solid fa-spinner fa-spin me-2"></i> Creating Account...</span>
          ) : (
            <span><i className="fa-solid fa-user-plus me-2"></i> Create Free Account 🇵🇰</span>
          )}
        </button>

        <div className="text-center small text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary fw-bold text-decoration-none">
            Sign In Here
          </Link>
        </div>
      </form>
    </div>
  );
}
