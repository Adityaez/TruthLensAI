/**
 * HuggingFace Inference — Deepfake detection service
 *
 * ROOT CAUSE OF PREVIOUS FAILURE:
 * ────────────────────────────────
 * The old code used `fetch("https://api-inference.huggingface.co/models/...")`.
 * That endpoint (api-inference.huggingface.co) has been DEPRECATED and its DNS
 * no longer resolves — hence "fetch failed" (not 404, not 503, but DNS failure).
 *
 * FIX:
 * Use the official @huggingface/inference SDK (v4+) which routes through
 * the new Inference Providers infrastructure at router.huggingface.co.
 * The SDK handles endpoint routing, retries, and auth automatically.
 *
 * COMPATIBILITY NOTE:
 * The SDK is ESM-only. This project is CommonJS. We use dynamic import()
 * inside the async classifyImage() function to bridge the gap.
 *
 * Primary model:   prithivMLmods/Deep-Fake-Detector-v2-Model
 * Fallback model:  dima806/deepfake_vs_real_image_detection
 *
 * Returns raw label+score array, same shape as before.
 */

const PRIMARY_MODEL = "prithivMLmods/Deep-Fake-Detector-v2-Model";
const FALLBACK_MODEL = "dima806/deepfake_vs_real_image_detection";

const MAX_RETRIES = 1;

// Cache the dynamically imported SDK client
let _client = null;

/**
 * Lazily create and cache the InferenceClient.
 * Uses dynamic import() because @huggingface/inference v4 is ESM-only.
 */
async function getClient() {
  if (_client) return _client;

  const token = process.env.HF_API_TOKEN;
  if (!token) throw new Error("HF_API_TOKEN not set in .env");

  const { InferenceClient } = await import("@huggingface/inference");
  _client = new InferenceClient(token);
  return _client;
}

/**
 * Call HF Inference API with a specific model using the official SDK.
 * @param {Buffer} fileBuffer - raw image bytes
 * @param {string} model - HF model ID
 * @returns {Array<{label: string, score: number}>}
 */
async function callModel(fileBuffer, model) {
  const client = await getClient();

  // The SDK's imageClassification handles routing, content-type, and auth.
  // It returns Array<{ label: string, score: number }> — same shape we need.
  // IMPORTANT: Blob must include MIME type or HF router returns 400.
  const result = await client.imageClassification({
    model,
    data: new Blob([fileBuffer], { type: "image/jpeg" }),
    provider: "hf-inference",
  });

  // The SDK may return { error: "..." } if model is loading
  if (result && result.error) {
    throw new Error(`HF model loading: ${result.error}`);
  }

  return result;
}

/**
 * Classify an image for deepfake detection.
 * Tries primary model first, then fallback, with retry logic.
 *
 * @param {Buffer} fileBuffer - raw image bytes
 * @returns {Array<{label: string, score: number}>}
 * @throws if all attempts fail
 */
async function classifyImage(fileBuffer) {
  // Try primary model
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[HF] Calling primary model (${PRIMARY_MODEL}), attempt ${attempt + 1}`
      );
      const result = await callModel(fileBuffer, PRIMARY_MODEL);
      console.log(`[HF] Primary model success:`, JSON.stringify(result));
      return result;
    } catch (err) {
      console.warn(
        `[HF] Primary model attempt ${attempt + 1} failed:`,
        err.message
      );
      if (attempt < MAX_RETRIES) {
        // Brief wait before retry (503/model loading scenarios)
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  // Try fallback model
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[HF] Calling fallback model (${FALLBACK_MODEL}), attempt ${attempt + 1}`
      );
      const result = await callModel(fileBuffer, FALLBACK_MODEL);
      console.log(`[HF] Fallback model success:`, JSON.stringify(result));
      return result;
    } catch (err) {
      console.warn(
        `[HF] Fallback model attempt ${attempt + 1} failed:`,
        err.message
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  throw new Error("All HuggingFace models failed after retries");
}

/**
 * Map raw HF classification output to normalized result fields.
 * Per techstack.md §8.
 *
 * @param {Array<{label: string, score: number}>} hfResponse
 * @returns {{ authenticityScore: number, verdict: string, riskLevel: string, confidence: number }}
 */
function mapToResult(hfResponse) {
  // Find the "real" entry — labels vary by model
  const realEntry = hfResponse.find(
    (r) =>
      r.label.toLowerCase().includes("real") ||
      r.label.toLowerCase().includes("realism")
  );

  const authenticityScore = Math.round((realEntry?.score ?? 0.5) * 100);

  let verdict, riskLevel;
  if (authenticityScore >= 70) {
    verdict = "Likely Real";
    riskLevel = "Low";
  } else if (authenticityScore >= 40) {
    verdict = "Uncertain";
    riskLevel = "Medium";
  } else {
    verdict = "Likely Fake";
    riskLevel = "High";
  }

  // Confidence: how far the top score is from a 50/50 guess, rescaled to 0–100
  const confidence = Math.min(
    100,
    Math.round(Math.abs(authenticityScore - 50) * 2)
  );

  return { authenticityScore, verdict, riskLevel, confidence };
}

module.exports = { classifyImage, mapToResult };
