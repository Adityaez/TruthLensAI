import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Brain,
  Video,
  Lock,
  Upload,
  ScanSearch,
  CheckCircle2,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GlassCard from "../components/GlassCard";

/* ─────────────────────────────────────
   Animated SVG Hero Graphic
   Pure CSS + SVG — no images
   ───────────────────────────────────── */
function HeroGraphic() {
  return (
    <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] flex-shrink-0">
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="w-full h-full relative z-10"
      >
        {/* Defs — gradients and filters */}
        <defs>
          <linearGradient id="ringGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="ringGrad2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="ringGrad3" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outermost ring — slow rotate */}
        <g style={{ transformOrigin: "200px 200px", animation: "spin-slow 25s linear infinite" }}>
          <circle
            cx="200" cy="200" r="175"
            stroke="url(#ringGrad3)" strokeWidth="1"
            fill="none"
            strokeDasharray="8 12"
          />
        </g>

        {/* Middle ring — counter rotate */}
        <g style={{ transformOrigin: "200px 200px", animation: "spin-reverse 18s linear infinite" }}>
          <circle
            cx="200" cy="200" r="140"
            stroke="url(#ringGrad2)" strokeWidth="1.5"
            fill="none"
            strokeDasharray="16 8"
          />
        </g>

        {/* Inner ring — slow rotate */}
        <g style={{ transformOrigin: "200px 200px", animation: "spin-slow 15s linear infinite" }}>
          <circle
            cx="200" cy="200" r="105"
            stroke="url(#ringGrad1)" strokeWidth="2"
            fill="none"
            strokeDasharray="4 6"
          />
        </g>

        {/* Scanning sweep arc */}
        <g style={{ transformOrigin: "200px 200px", animation: "spin-scan 4s linear infinite" }}>
          <path
            d="M 200 200 L 200 40 A 160 160 0 0 1 338 120 Z"
            fill="url(#scanGrad)"
            opacity="0.07"
          />
          <line
            x1="200" y1="200" x2="200" y2="40"
            stroke="url(#scanGrad)" strokeWidth="2"
            opacity="0.6"
            filter="url(#glow)"
          />
        </g>

        {/* Pulsing orbit dots */}
        <g style={{ transformOrigin: "200px 200px", animation: "spin-slow 12s linear infinite" }}>
          <circle cx="200" cy="25" r="3" fill="#8b5cf6" opacity="0.8" filter="url(#glow)">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        <g style={{ transformOrigin: "200px 200px", animation: "spin-reverse 10s linear infinite" }}>
          <circle cx="340" cy="200" r="2.5" fill="#3b82f6" opacity="0.7" filter="url(#glow)">
            <animate attributeName="r" values="2.5;4;2.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>
        <g style={{ transformOrigin: "200px 200px", animation: "spin-slow 16s linear infinite" }}>
          <circle cx="120" cy="340" r="2" fill="#a78bfa" opacity="0.6" filter="url(#glow)">
            <animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Center core — pulsing */}
        <circle cx="200" cy="200" r="36" fill="url(#coreGrad)" opacity="0.12" filter="url(#softGlow)">
          <animate attributeName="r" values="36;42;36" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.12;0.2;0.12" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="200" r="24" fill="url(#coreGrad)" opacity="0.2" filter="url(#softGlow)">
          <animate attributeName="r" values="24;28;24" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Shield icon in center */}
        <g transform="translate(186, 186)" opacity="0.9">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </g>

        {/* Cross-hair lines */}
        <line x1="200" y1="155" x2="200" y2="170" stroke="url(#ringGrad1)" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="230" x2="200" y2="245" stroke="url(#ringGrad1)" strokeWidth="1" opacity="0.4" />
        <line x1="155" y1="200" x2="170" y2="200" stroke="url(#ringGrad1)" strokeWidth="1" opacity="0.4" />
        <line x1="230" y1="200" x2="245" y2="200" stroke="url(#ringGrad1)" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────
   Feature cards data
   ───────────────────────────────────── */
const features = [
  {
    icon: Shield,
    title: "Instant Analysis",
    desc: "Detect manipulated media in seconds with our advanced AI models.",
    badge: null,
  },
  {
    icon: Brain,
    title: "Explainable AI",
    desc: "Understand why AI reached its verdict with clear, human-readable reasoning.",
    badge: null,
  },
  {
    icon: Video,
    title: "Image & Video Support",
    desc: "Analyze both images and video for deepfake manipulation patterns.",
    badge: "Coming Soon",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Your media is never permanently stored. Analyze with confidence.",
    badge: null,
  },
];

/* ─────────────────────────────────────
   How It Works steps data
   ───────────────────────────────────── */
const steps = [
  {
    icon: Upload,
    num: "01",
    title: "Upload",
    desc: "Upload your image securely through our encrypted pipeline.",
  },
  {
    icon: ScanSearch,
    num: "02",
    title: "Analyze",
    desc: "Our AI scans for manipulation patterns, artifacts, and inconsistencies.",
  },
  {
    icon: CheckCircle2,
    num: "03",
    title: "Get Verdict",
    desc: "Receive an authenticity score with a detailed AI-generated explanation.",
  },
];

/* ─────────────────────────────────────
   Landing Page
   ───────────────────────────────────── */
export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      {/* ——— HERO ——— */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-0 lg:pb-0">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-[30%] -left-[15%] w-[700px] h-[700px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 65%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left — Text */}
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              {/* Small badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 border border-purple-500/20"
                style={{
                  background: "rgba(124, 58, 237, 0.08)",
                  color: "#c4b5fd",
                }}
              >
                <Sparkles size={13} />
                AI-Powered Deepfake Detection
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
              >
                <span className="text-white">Know What's</span>
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Real.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-base sm:text-lg text-gray-400 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
              >
                Use advanced AI to detect deepfakes and verify the authenticity
                of images in seconds. Fast, explainable, and privacy-first.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  }}
                >
                  <Upload size={16} />
                  Upload Media
                </Link>
                <button
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:bg-white/[0.06] cursor-pointer bg-transparent border border-white/10 text-gray-300 hover:text-white"
                >
                  How It Works
                  <ArrowDown size={14} />
                </button>
              </motion.div>
            </div>

            {/* Right — Animated SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex-shrink-0"
            >
              <HeroGraphic />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ——— FEATURES ——— */}
      <section id="features" className="relative py-24 lg:py-32">
        {/* Section divider glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(37,99,235,0.3), transparent)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Built for Trust
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Everything you need to verify media authenticity, powered by
              cutting-edge AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <GlassCard key={f.title} delay={i * 0.08}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.15))",
                  }}
                >
                  <f.icon
                    size={20}
                    style={{
                      stroke: "url(#iconGrad)",
                      color: "#8b5cf6",
                    }}
                  />
                </div>
                <h3 className="text-white font-semibold text-base mb-2 flex items-center gap-2">
                  {f.title}
                  {f.badge && (
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(124, 58, 237, 0.15)",
                        color: "#a78bfa",
                        border: "1px solid rgba(124, 58, 237, 0.25)",
                      }}
                    >
                      {f.badge}
                    </span>
                  )}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ——— HOW IT WORKS ——— */}
      <section id="how-it-works" className="relative py-24 lg:py-32">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(37,99,235,0.3), transparent)",
          }}
        />

        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              Three simple steps to verify any media.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Connecting line on desktop */}
            <div
              className="hidden md:block absolute top-[52px] left-[16.67%] right-[16.67%] h-px"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))",
              }}
            />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div
                  className="relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.12))",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  <s.icon size={28} className="text-purple-400" />
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed, #2563eb)",
                    }}
                  >
                    {s.num.replace("0", "")}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[240px]">
                  {s.desc}
                </p>

                {/* Arrow between steps on mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden my-6 text-gray-600">
                    <ArrowDown size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA after steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              }}
            >
              <Upload size={16} />
              Start Analyzing
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
