import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UploadCloud, FileImage, FileVideo } from "lucide-react";
import { useAnalysis } from "../store/analysisStore.jsx";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";
import ConfidenceMeter from "../components/ConfidenceMeter";
import RiskBadge from "../components/RiskBadge";
import ExplanationCard from "../components/ExplanationCard";
import MetadataPanel from "../components/MetadataPanel";
import HeatmapPlaceholder from "../components/HeatmapPlaceholder";

export default function Result() {
  const { id } = useParams();
  const { getResult } = useAnalysis();
  const result = getResult(id);

  // ── No result found — graceful fallback ──
  if (!result) {
    return (
      <div className="relative min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.12))",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <FileImage size={28} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">No Analysis Found</h1>
            <p className="text-gray-400 text-sm mb-8 max-w-sm">
              We couldn't find an analysis result for this ID. Upload an image to get started.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
            >
              <UploadCloud size={16} />
              Upload Media
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const isVideo = result.fileType === "video";

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[5%] -left-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[10%] -right-[10%] w-[450px] h-[450px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 lg:pt-32">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-2"
        >
          <Link
            to="/upload"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            Back to Upload
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
              Analysis Result
            </h1>
            <p className="text-gray-400 text-sm">
              Deepfake detection report for <span className="text-gray-300 font-medium">{result.fileName}</span>
            </p>
          </div>
          <RiskBadge riskLevel={result.riskLevel} />
        </motion.div>

        {/* ── 2-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT COLUMN (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass rounded-2xl overflow-hidden border border-white/[0.06]"
            >
              <div className="relative aspect-video w-full bg-black/30 flex items-center justify-center">
                {isVideo ? (
                  <video
                    src={result.previewUrl || result.thumbnailUrl}
                    controls
                    playsInline
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={result.thumbnailUrl}
                    alt={result.fileName}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
              {/* Small file label */}
              <div className="flex items-center gap-2.5 px-5 py-3 border-t border-white/[0.04]">
                {isVideo ? (
                  <FileVideo size={14} className="text-purple-400" />
                ) : (
                  <FileImage size={14} className="text-purple-400" />
                )}
                <span className="text-xs text-gray-400 truncate">{result.fileName}</span>
              </div>
            </motion.div>

            {/* Score Gauge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ScoreGauge
                score={result.authenticityScore}
                verdict={result.verdict}
              />
            </motion.div>

            {/* Confidence Meter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <ConfidenceMeter confidence={result.confidence} />
            </motion.div>

            {/* Analyze Another — Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
              >
                <UploadCloud size={16} />
                Analyze Another
              </Link>
            </motion.div>
          </div>

          {/* RIGHT COLUMN (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Explanation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <ExplanationCard explanation={result.explanation} />
            </motion.div>

            {/* Metadata Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <MetadataPanel result={result} />
            </motion.div>

            {/* Heatmap Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <HeatmapPlaceholder />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
