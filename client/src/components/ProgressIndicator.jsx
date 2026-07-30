import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const MESSAGES = [
  "Uploading media...",
  "Scanning for artifacts...",
  "Analyzing facial landmarks...",
  "Generating report...",
];

const CYCLE_MS = 2000;

export default function ProgressIndicator() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through messages
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  // Animate progress bar smoothly
  useEffect(() => {
    const start = Date.now();
    const duration = MESSAGES.length * CYCLE_MS; // total estimated time
    let frame;
    const tick = () => {
      const elapsed = Date.now() - start;
      // Ease-out curve so it slows down toward the end (never reaches 100 — the API resolving handles that)
      const raw = Math.min(elapsed / duration, 0.92);
      const eased = 1 - Math.pow(1 - raw, 2.5);
      setProgress(eased * 100);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Spinner + message */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Loader2
          size={20}
          className="text-purple-400 flex-shrink-0"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <div className="h-6 overflow-hidden relative w-56">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-gray-300 font-medium absolute inset-0 flex items-center"
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bar track */}
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255, 255, 255, 0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #7c3aed, #3b82f6)",
            boxShadow: "0 0 12px rgba(124, 58, 237, 0.4)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "linear" }}
        />
      </div>

      {/* Percentage */}
      <p className="text-xs text-gray-500 text-center mt-3">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
