/**
 * POST /api/analyze — sends an image file for deepfake analysis.
 * Returns parsed JSON response or throws on failure.
 * Uses AbortController with 20s timeout per techstack.md §5.
 */
export async function analyzeImage(file) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const formData = new FormData();
    formData.append("file", file);

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
 * Reads resolution by loading the image into an Image element.
 * Per techstack.md §10 — these fields don't need the server.
 */
export function extractClientMetadata(file) {
  return new Promise((resolve) => {
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
      });
    };
    img.onerror = () => {
      // Still resolve with what we have if image can't be decoded
      resolve({
        fileName: file.name,
        fileType: "image",
        fileSizeBytes: file.size,
        resolution: "Unknown",
        uploadTimestamp: new Date().toISOString(),
        thumbnailUrl: url,
      });
    };
    img.src = url;
  });
}
