import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ExplanationCard({ explanation }) {
  return (
    <div className="glass rounded-2xl p-6 border border-white/[0.06]">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(124,58,237,0.12))",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <Sparkles size={15} className="text-purple-400" />
        </div>
        <h3 className="text-sm font-semibold text-white tracking-tight">
          AI Forensic Analysis
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        <p className="text-sm text-gray-300 leading-[1.7] bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">
          {explanation}
        </p>
      </motion.div>
    </div>
  );
}
