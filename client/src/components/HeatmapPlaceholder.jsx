import { ShieldCheck } from "lucide-react";

export default function HeatmapPlaceholder() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(34,197,94,0.12))",
            border: "1px solid rgba(52,211,153,0.15)",
          }}
        >
          <ShieldCheck size={15} className="text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Region Analysis
        </h3>
      </div>

      <div
        className="flex items-center gap-3 rounded-xl p-4"
        style={{
          background: "rgba(52, 211, 153, 0.04)",
          border: "1px solid rgba(52, 211, 153, 0.08)",
        }}
      >
        <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          No suspicious regions detected.
        </p>
      </div>
    </div>
  );
}
