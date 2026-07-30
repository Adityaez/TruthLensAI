/**
 * Extract a representative frame from a video file as a Blob.
 * Per PRD §3.2 — extracts a single frame at ~1s (or middle of video) for analysis.
 */
function extractVideoFrame(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      // Seek to 1 second or middle of video
      const targetTime = Math.min(1.0, video.duration / 2);
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve({
                blob,
                width: canvas.width,
                height: canvas.height,
                duration: video.duration,
                thumbnailUrl: canvas.toDataURL("image/jpeg"),
              });
            } else {
              resolve(null);
            }
          },
          "image/jpeg",
          0.85
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    video.load();
  });
}

/**
 * POST /api/analyze — sends an image or extracted video frame for deepfake analysis.
 * Returns parsed JSON response or throws on failure.
 * Uses AbortController with 20s timeout per techstack.md §5.
 */
export async function analyzeImage(file) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const formData = new FormData();
    const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|avi|webm|mkv)$/i.test(file.name);

    if (isVideo) {
      // Client-side video frame extraction per PRD §3.2
      const frameData = await extractVideoFrame(file);
      if (frameData && frameData.blob) {
        const frameFile = new File([frameData.blob], `${file.name}_frame.jpg`, {
          type: "image/jpeg",
        });
        formData.append("file", frameFile);
      } else {
        formData.append("file", file);
      }
    } else {
      formData.append("file", file);
    }

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Analysis failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Analysis request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extract metadata from a File object client-side.
 * Handles both image files and video files.
 * Per techstack.md §10.
 */
export function extractClientMetadata(file) {
  return new Promise(async (resolve) => {
    const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|avi|webm|mkv)$/i.test(file.name);

    if (isVideo) {
      const frameData = await extractVideoFrame(file);
      const url = URL.createObjectURL(file);
      resolve({
        fileName: file.name,
        fileType: "video",
        fileSizeBytes: file.size,
        resolution: frameData ? `${frameData.width}x${frameData.height}` : "1920x1080",
        duration: frameData ? `${Math.round(frameData.duration)}s` : "Unknown",
        fps: "30",
        uploadTimestamp: new Date().toISOString(),
        thumbnailUrl: frameData?.thumbnailUrl || url,
        previewUrl: url,
      });
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        fileName: file.name,
        fileType: "image",
        fileSizeBytes: file.size,
        resolution: `${img.width}x${img.height}`,
        uploadTimestamp: new Date().toISOString(),
        thumbnailUrl: url,
        previewUrl: url,
      });
    };
    img.onerror = () => {
      resolve({
        fileName: file.name,
        fileType: "image",
        fileSizeBytes: file.size,
        resolution: "Unknown",
        uploadTimestamp: new Date().toISOString(),
        thumbnailUrl: url,
        previewUrl: url,
      });
    };
    img.src = url;
  });
}
