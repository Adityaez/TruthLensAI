import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ScanSearch, AlertTriangle, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";
import Dropzone from "../components/Dropzone";
import ProgressIndicator from "../components/ProgressIndicator";
import { analyzeImage, extractClientMetadata } from "../lib/api";
import { useAnalysis } from "../store/analysisStore.jsx";

export default function Upload() {
  const navigate = useNavigate();
  const { addResult } = useAnalysis();

  // States: idle | preview | analyzing | error
  const [file, setFile] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | analyzing | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileSelect = useCallback((f) => {
    setFile(f);
    setPhase("idle");
    setErrorMsg("");
  }, []);

  const handleClear = useCallback(() => {
    setFile(null);
    setPhase("idle");
    setErrorMsg("");
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file || phase === "analyzing") return;

    setPhase("analyzing");
    setErrorMsg("");

    try {
      // Extract client-side metadata and call API in parallel
      const [metadata, apiResponse] = await Promise.all([
        extractClientMetadata(file),
        analyzeImage(file),
      ]);

      // Merge into a single AnalysisResult
      const result = {
        ...apiResponse,
        ...metadata,
        // Ensure id exists (API returns it, but safeguard)
        id: apiResponse.id || Date.now().toString(),
      };

      addResult(result);
      navigate(`/result/${result.id}`);
    } catch (err) {
      setPhase("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }, [file, phase, addResult, navigate]);

  const handleRetry = useCallback(() => {
    setPhase("idle");
    setErrorMsg("");
  }, []);

  const hasFile = file !== null;
  const isVideo = file ? file.type.startsWith("video/") || /\.(mp4|mov|avi|webm|mkv)$/i.test(file.name) : false;

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] -right-[15%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-28 pb-16 lg:pt-32">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200 mb-8"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            Analyze Media
          </h1>
          <p className="text-gray-400 text-base">
            Upload an image or video to check for deepfake manipulation.
          </p>
        </motion.div>

        {/* Main content area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {phase === "analyzing" ? (
              /* ── Analyzing State ── */
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-8 sm:p-12"
              >
                <div className="flex flex-col items-center py-8">
                  {/* Small thumbnail during analysis */}
                  {file && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden mb-8 ring-2 ring-purple-500/20 bg-black/40 flex items-center justify-center">
                      {isVideo ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  <ProgressIndicator />
                </div>
              </motion.div>
            ) : (
              /* ── Dropzone + Actions ── */
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <Dropzone
                  file={file}
                  onFileSelect={handleFileSelect}
                  onClear={handleClear}
                />

                {/* Error card */}
                <AnimatePresence>
                  {phase === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="glass rounded-2xl p-5 mt-5 flex items-start gap-4"
                      style={{
                        borderColor: "rgba(239, 68, 68, 0.15)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                        }}
                      >
                        <AlertTriangle size={18} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-red-300 font-medium mb-1">
                          Analysis failed
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          {errorMsg || "Please try again."}
                        </p>
                        <button
                          onClick={handleRetry}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-none"
                        >
                          <RotateCcw size={13} />
                          Try Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Analyze button */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <button
                    onClick={handleAnalyze}
                    disabled={!hasFile || phase === "analyzing"}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 cursor-pointer border-none disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      background:
                        hasFile
                          ? "linear-gradient(135deg, #7c3aed, #2563eb)"
                          : "rgba(255,255,255,0.06)",
                      boxShadow:
                        hasFile
                          ? "0 4px 20px rgba(124, 58, 237, 0.25)"
                          : "none",
                    }}
                  >
                    <ScanSearch size={17} />
                    {isVideo ? "Analyze Video" : "Analyze Media"}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-gray-600 mt-10"
        >
          Your media files are processed in real-time and never permanently stored.
        </motion.p>
      </div>
    </div>
  );
}
