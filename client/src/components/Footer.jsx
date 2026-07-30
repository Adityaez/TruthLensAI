import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(37,99,235,0.5), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + description */}
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span
                className="text-base font-bold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #c4b5fd, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TruthLens AI
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered deepfake detection and media authenticity verification.
              Know what's real.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/5">
          <p className="text-xs text-gray-600 text-center">
            © 2026 TruthLens AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
