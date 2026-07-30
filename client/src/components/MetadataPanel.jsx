import { FileText, Image as ImageIcon, Video, Calendar, Maximize, HardDrive, Clock, Gauge } from "lucide-react";

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTime(isoString) {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export default function MetadataPanel({ result }) {
  const isVideo = result.fileType === "video";

  const rows = [
    { icon: FileText, label: "File Name", value: result.fileName || "—" },
    { icon: HardDrive, label: "File Size", value: formatSize(result.fileSizeBytes) },
    { icon: Maximize, label: "Resolution", value: result.resolution || "—" },
    { icon: isVideo ? Video : ImageIcon, label: "File Type", value: isVideo ? "Video" : "Image" },
    { icon: Calendar, label: "Upload Time", value: formatTime(result.uploadTimestamp) },
  ];

  // Only show duration and FPS for video files
  if (isVideo) {
    rows.push({ icon: Clock, label: "Duration", value: result.duration || "—" });
    rows.push({ icon: Gauge, label: "FPS", value: result.fps || "—" });
  }

  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(37,99,235,0.12))",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <FileText size={15} className="text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Media Metadata
        </h3>
      </div>

      <div className="space-y-0 divide-y divide-white/[0.04]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2">
              <row.icon size={13} className="text-gray-500" />
              <span className="text-xs text-gray-400">{row.label}</span>
            </div>
            <span className="text-xs text-gray-200 font-medium text-right max-w-[55%] truncate">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
