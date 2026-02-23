"use client";

import React, { useState, useEffect } from "react";

interface AuthSwitchProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "recruiter";
  }) => void;
  loading?: boolean;
  className?: string;
}

export default function AuthSwitch({
  onSubmit,
  loading = false,
  className,
}: AuthSwitchProps) {
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const container = document.getElementById("auth-container");
    if (!container) return;
    if (isRecruiter) container.classList.add("recruiter-mode");
    else container.classList.remove("recruiter-mode");
  }, [isRecruiter]);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...formData, role: "student" });
  };

  const handleRecruiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...formData, role: "recruiter" });
  };

  return (
    <>
      <style>{`
        .auth-container {
          position: relative;
          width: 100%;
          max-width: 930px;
          height: 580px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.18),
            0 0 0 1px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        /* ── Sliding circle ── */
        .auth-container::before {
          content: "";
          position: absolute;
          height: 2200px;
          width: 2200px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, #3b82f6 0%, #6366f1 50%, #1e1b4b 100%);
          transition: 1.8s cubic-bezier(0.65, 0, 0.35, 1);
          border-radius: 50%;
          z-index: 6;
        }

        .auth-container.recruiter-mode::before {
          transform: translate(100%, -50%);
          right: 52%;
          background: linear-gradient(-45deg, #f97316 0%, #ea580c 50%, #1c1917 100%);
        }

        /* ── Forms area ── */
        .forms-area {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .form-slider {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .auth-container.recruiter-mode .form-slider {
          left: 25%;
        }

        .auth-form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 3rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .student-form {
          z-index: 2;
        }

        .recruiter-form {
          opacity: 0;
          z-index: 1;
        }

        .auth-container.recruiter-mode .student-form {
          opacity: 0;
          z-index: 1;
        }

        .auth-container.recruiter-mode .recruiter-form {
          opacity: 1;
          z-index: 2;
        }

        /* ── Form title ── */
        .form-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .form-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 24px;
          font-weight: 400;
        }

        /* ── Input field ── */
        .input-field {
          max-width: 380px;
          width: 100%;
          background: #ffffff;
          margin: 7px 0;
          height: 52px;
          border-radius: 14px;
          display: grid;
          grid-template-columns: 48px 1fr;
          padding: 0 6px;
          position: relative;
          transition: all 0.3s ease;
          border: 1.5px solid #e2e8f0;
        }

        .input-field:focus-within {
          background: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .input-field.orange-focus:focus-within {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .input-field i {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: 0.3s;
          font-size: 1.1rem;
          font-style: normal;
        }

        .input-field:focus-within i {
          color: #3b82f6;
        }

        .input-field.orange-focus:focus-within i {
          color: #f97316;
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 0.9rem;
          color: #1e293b;
          width: 100%;
          font-family: inherit;
        }

        .input-field input::placeholder {
          color: #94a3b8;
          font-weight: 400;
          font-size: 0.85rem;
        }

        /* ── Submit button ── */
        .submit-btn {
          max-width: 380px;
          width: 100%;
          height: 50px;
          border-radius: 14px;
          border: none;
          outline: none;
          color: #fff;
          text-transform: uppercase;
          font-weight: 700;
          margin: 16px 0 0;
          cursor: pointer;
          transition: all 0.4s ease;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .submit-btn.blue {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .submit-btn.blue:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.45);
        }

        .submit-btn.orange {
          background: linear-gradient(135deg, #f97316, #ea580c);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.3);
        }

        .submit-btn.orange:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(249, 115, 22, 0.45);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none !important;
        }

        /* ── Spinner ── */
        .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, 0.25);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Social section ── */
        .social-text {
          padding: 14px 0 8px;
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 400;
        }

        .social-row {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .social-btn {
          height: 44px;
          width: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          color: #64748b;
          transition: all 0.3s ease;
          cursor: pointer;
          background: #ffffff;
          text-decoration: none;
        }

        .social-btn:hover {
          border-color: #cbd5e1;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          background: #f8fafc;
        }

        /* ── Overlay panels ── */
        .panels-area {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 15% 2rem 10%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 10% 2rem 15%;
        }

        .panel .panel-content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .panel h3 {
          font-weight: 700;
          line-height: 1.2;
          font-size: 1.65rem;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .panel p {
          font-size: 0.88rem;
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.5;
        }

        .switch-btn {
          margin-top: 8px;
          background: none;
          border: 2px solid rgba(255, 255, 255, 0.35);
          width: 160px;
          height: 46px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.82rem;
          color: white;
          cursor: pointer;
          transition: all 0.4s ease;
          font-family: inherit;
          letter-spacing: 0.02em;
        }

        .switch-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.55);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .right-panel .panel-content {
          transform: translateX(800px);
        }

        .auth-container.recruiter-mode .left-panel .panel-content {
          transform: translateX(-800px);
        }

        .auth-container.recruiter-mode .right-panel .panel-content {
          transform: translateX(0%);
        }

        .auth-container.recruiter-mode .left-panel {
          pointer-events: none;
        }

        .auth-container.recruiter-mode .right-panel {
          pointer-events: all;
        }

        /* ── Panel icon ── */
        .panel-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.08);
        }

        /* ── Responsive ── */
        @media (max-width: 870px) {
          .auth-container {
            min-height: 800px;
            height: 100vh;
            border-radius: 0;
          }
          .form-slider {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }
          .form-slider,
          .auth-container.recruiter-mode .form-slider {
            left: 50%;
          }
          .panels-area {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }
          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }
          .right-panel {
            grid-row: 3 / 4;
          }
          .left-panel {
            grid-row: 1 / 2;
          }
          .panel .panel-content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }
          .panel h3 {
            font-size: 1.2rem;
          }
          .panel p {
            font-size: 0.7rem;
          }
          .switch-btn {
            width: 120px;
            height: 38px;
            font-size: 0.7rem;
          }
          .auth-container::before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }
          .auth-container.recruiter-mode::before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }
          .auth-container.recruiter-mode .left-panel .panel-content {
            transform: translateY(-300px);
          }
          .auth-container.recruiter-mode .right-panel .panel-content {
            transform: translateY(0px);
          }
          .right-panel .panel-content {
            transform: translateY(300px);
          }
          .auth-container.recruiter-mode .form-slider {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          .auth-form {
            padding: 0 1.5rem;
          }
          .panel .panel-content {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>

      <div id="auth-container" className={`auth-container ${className || ""}`}>
        <div className="forms-area">
          <div className="form-slider">
            {/* ── Student Form ── */}
            <form className="auth-form student-form" onSubmit={handleStudentSubmit}>
              <h2 className="form-title">Student Sign Up</h2>
              <p className="form-subtitle">
                Find verified internships and build your future
              </p>
              <div className="input-field">
                <i>👤</i>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-field">
                <i>📧</i>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-field">
                <i>🔒</i>
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-btn blue"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : "Create Account"}
              </button>
              <p className="social-text">Or sign up with</p>
              <div className="social-row">
                <SocialIcons />
              </div>
            </form>

            {/* ── Recruiter Form ── */}
            <form className="auth-form recruiter-form" onSubmit={handleRecruiterSubmit}>
              <h2 className="form-title">Recruiter Sign Up</h2>
              <p className="form-subtitle">
                Access top talent and manage your hiring
              </p>
              <div className="input-field orange-focus">
                <i>👤</i>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-field orange-focus">
                <i>📧</i>
                <input
                  type="email"
                  placeholder="Work Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-field orange-focus">
                <i>🔒</i>
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-btn orange"
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : "Create Account"}
              </button>
              <p className="social-text">Or sign up with</p>
              <div className="social-row">
                <SocialIcons />
              </div>
            </form>
          </div>
        </div>

        {/* ── Overlay Panels ── */}
        <div className="panels-area">
          <div className="panel left-panel">
            <div className="panel-content">
              <div className="panel-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3>Are you a Recruiter?</h3>
              <p>
                Access top student talent and streamline your hiring pipeline
                with ease.
              </p>
              <button
                className="switch-btn"
                onClick={() => setIsRecruiter(true)}
              >
                Sign up as Recruiter
              </button>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="panel-content">
              <div className="panel-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <h3>Are you a Student?</h3>
              <p>
                Find verified internships and kickstart your professional career
                today.
              </p>
              <button
                className="switch-btn"
                onClick={() => setIsRecruiter(false)}
              >
                Sign up as Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Social Icons ── */
function SocialIcons() {
  return (
    <>
      <a href="#" className="social-btn" aria-label="Google">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      </a>
      <a href="#" className="social-btn" aria-label="GitHub">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-slate-300"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
      <a href="#" className="social-btn" aria-label="LinkedIn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </>
  );
}
