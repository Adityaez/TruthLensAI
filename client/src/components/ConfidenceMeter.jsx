import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function ConfidenceMeter({ confidence = 91 }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(59,130,246,0.12))",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            <Activity size={15} className="text-indigo-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">Model Confidence</span>
        </div>
        <span className="text-sm font-bold text-white tabular-nums">{confidence}%</span>
      </div>

      {/* Track */}
      <div className="w-full h-2 rounded-full overflow-hidden bg-white/[0.04]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #6366f1, #3b82f6)",
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.15 }}
        />
      </div>
    </div>
  );
}
