import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

export default function RiskBadge({ riskLevel = "Low" }) {
  let classes, Icon;

  if (riskLevel === "High") {
    classes = "text-red-400 border-red-500/20 shadow-red-500/10";
    Icon = ShieldAlert;
  } else if (riskLevel === "Medium") {
    classes = "text-amber-400 border-amber-500/20 shadow-amber-500/10";
    Icon = AlertTriangle;
  } else {
    classes = "text-emerald-400 border-emerald-500/20 shadow-emerald-500/10";
    Icon = ShieldCheck;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border shadow-md bg-white/[0.03] ${classes}`}
    >
      <Icon size={14} />
      Risk: {riskLevel}
    </span>
  );
}
