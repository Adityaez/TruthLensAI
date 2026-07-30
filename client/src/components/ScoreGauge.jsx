import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScoreGauge({ score = 87, verdict = "Likely Real" }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Color mapping based on score bands
  let strokeColor, glowColor, verdictColor, bgFrom;
  if (score >= 70) {
    strokeColor = "#34d399";
    glowColor = "rgba(52, 211, 153, 0.35)";
    verdictColor = "#34d399";
    bgFrom = "rgba(52, 211, 153, 0.06)";
  } else if (score >= 40) {
    strokeColor = "#fbbf24";
    glowColor = "rgba(251, 191, 36, 0.35)";
    verdictColor = "#fbbf24";
    bgFrom = "rgba(251, 191, 36, 0.06)";
  } else {
    strokeColor = "#f87171";
    glowColor = "rgba(248, 113, 113, 0.35)";
    verdictColor = "#f87171";
    bgFrom = "rgba(248, 113, 113, 0.06)";
  }

  const radius = 82;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;

  // Count-up for the displayed number
  useEffect(() => {
    let frame;
    const duration = 1000;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div
      className="relative flex flex-col items-center justify-center p-8 rounded-2xl border border-white/[0.06]"
      style={{ background: `radial-gradient(circle at 50% 40%, ${bgFrom}, transparent 70%)` }}
    >
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated score arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-white tracking-tight leading-none">
            {displayScore}
            <span className="text-2xl font-semibold text-gray-400">%</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold mt-1.5">
            Authenticity
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-5 text-center">
        <span
          className="text-lg font-bold tracking-wide"
          style={{ color: verdictColor }}
        >
          {verdict}
        </span>
      </div>
    </div>
  );
}
