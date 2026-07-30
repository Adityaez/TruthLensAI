import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, FileImage, FileVideo, AlertCircle } from "lucide-react";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "video/avi",
  "video/mkv",
];

const ACCEPTED_EXT = ".jpg, .jpeg, .png, .mp4, .mov, .avi, .webm, .mkv";

function isVideoFile(f) {
  if (!f) return false;
  return (
    f.type.startsWith("video/") ||
    /\.(mp4|mov|avi|webm|mkv)$/i.test(f.name)
  );
}

function isImageFile(f) {
  if (!f) return false;
  return (
    f.type.startsWith("image/") ||
    /\.(jpg|jpeg|png)$/i.test(f.name)
  );
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Dropzone({ file, onFileSelect, onClear }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validate = useCallback((f) => {
    if (!f) return;
    const isImg = isImageFile(f);
    const isVid = isVideoFile(f);

    if (!isImg && !isVid) {
      setError("Only JPG, PNG, MP4, MOV, AVI, and WEBM files are supported.");
      return;
    }
    setError(null);
    onFileSelect(f);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    validate(f);
  }, [validate]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const f = e.target.files?.[0];
    validate(f);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }, [validate]);

  const handleClear = useCallback(() => {
    setError(null);
    onClear();
  }, [onClear]);

  const previewUrl = file ? URL.createObjectURL(file) : null;
  const isVideo = file ? isVideoFile(file) : false;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {file ? (
          /* ── Preview State ── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="glass rounded-2xl overflow-hidden relative group"
          >
            {/* Media Preview (Image or Video) */}
            <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black/40 flex items-center justify-center overflow-hidden">
              {isVideo ? (
                <video
                  src={previewUrl}
                  controls
                  playsInline
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            {/* File info bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/5">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(124, 58, 237, 0.12)",
                  }}
                >
                  {isVideo ? (
                    <FileVideo size={16} className="text-purple-400" />
                  ) : (
                    <FileImage size={16} className="text-purple-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatSize(file.size)} • {isVideo ? "Video" : "Image"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer bg-transparent border-none flex-shrink-0"
                aria-label="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── Dropzone State ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className="relative rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden"
            style={{
              border: dragOver
                ? "2px solid rgba(124, 58, 237, 0.7)"
                : "2px dashed rgba(255, 255, 255, 0.1)",
              background: dragOver
                ? "rgba(124, 58, 237, 0.06)"
                : "rgba(255, 255, 255, 0.02)",
            }}
          >
            {/* Hover / drag glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: dragOver ? 1 : undefined,
                background:
                  "radial-gradient(600px circle at 50% 50%, rgba(124, 58, 237, 0.08), transparent 50%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center py-16 sm:py-20 px-6">
              <motion.div
                animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(37, 99, 235, 0.12))",
                  border: "1px solid rgba(124, 58, 237, 0.15)",
                }}
              >
                <UploadCloud
                  size={28}
                  className="text-purple-400"
                />
              </motion.div>

              <p className="text-base text-gray-300 font-medium mb-1.5">
                {dragOver ? "Drop your image or video here" : "Drag & drop your image or video here"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or{" "}
                <span className="text-purple-400 group-hover:text-purple-300 transition-colors font-medium">
                  click to browse
                </span>
              </p>
              <p className="text-xs text-gray-600">
                Supported formats: JPG, PNG, MP4, MOV, AVI, WEBM
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXT}
              onChange={handleInputChange}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 mt-4 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              color: "#fca5a5",
            }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
