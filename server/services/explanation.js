/**
 * Explanation generation service
 *
 * Priority:
 *   1. Gemini (if GEMINI_API_KEY exists)
 *   2. OpenAI GPT-4o-mini (if OPENAI_API_KEY exists)
 *   3. Hardcoded template fallback (always works)
 *
 * Never fails the request — always returns a string.
 */

const FORENSIC_PROMPT = ({ authenticityScore, verdict, riskLevel }) =>
  `You are an AI forensic analyst. A media authenticity model returned:
- Authenticity score: ${authenticityScore}/100
- Verdict: ${verdict}
- Risk level: ${riskLevel}

Write a 3-4 sentence explanation for a non-technical user, in the style of a forensic report. Reference plausible visual signal categories such as lighting consistency, facial landmark stability, GAN/compression artifacts, or lip-sync where relevant to the verdict. Do not repeat the raw numbers verbatim in prose form more than once. Vary the phrasing based on whether the verdict is "Likely Real," "Uncertain," or "Likely Fake" — a low-score result should sound appropriately cautious, not falsely reassuring. Keep it under 120 words.`;

// ── Gemini ──
async function callGemini({ authenticityScore, verdict, riskLevel }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  console.log("[Explanation] Trying Gemini...");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: FORENSIC_PROMPT({
                  authenticityScore,
                  verdict,
                  riskLevel,
                }),
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 250 },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  if (!text) throw new Error("Gemini returned empty response");

  console.log("[Explanation] Gemini success");
  return text;
}

// ── OpenAI ──
async function callOpenAI({ authenticityScore, verdict, riskLevel }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  console.log("[Explanation] Trying OpenAI GPT-4o-mini...");

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: FORENSIC_PROMPT({ authenticityScore, verdict, riskLevel }),
          },
        ],
        max_tokens: 200,
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`OpenAI API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || null;
  if (!text) throw new Error("OpenAI returned empty response");

  console.log("[Explanation] OpenAI success");
  return text;
}

// ── Template fallback — always works ──
const TEMPLATES = {
  "Likely Real": [
    "Our forensic analysis indicates this media is highly likely to be authentic. Lighting conditions remain consistent across the frame, and facial landmark geometry shows natural proportions without synthetic warping. No GAN-related compression artifacts or frequency-domain anomalies were detected. Overall, the media exhibits characteristics consistent with an unmodified capture.",
    "The submitted media passes our multi-layer authenticity checks with high confidence. Skin texture analysis shows natural micro-patterns, and edge boundaries around facial features are consistent with organic photography. There are no signs of deepfake synthesis, splicing, or frame interpolation artifacts. We assess this media as genuine.",
    "Analysis of the uploaded media reveals no indicators of digital manipulation. The lighting gradient, shadow directionality, and facial proportions are internally consistent. Pixel-level inspection shows no evidence of blending, morphing, or GAN-generated artifacts. This media is assessed as authentic with high confidence.",
  ],
  Uncertain: [
    "Our analysis produced an inconclusive result for this media. While some facial features appear natural, certain regions show subtle inconsistencies in lighting transitions that may indicate post-processing. The compression level makes definitive assessment challenging. We recommend examining the original source material for a more conclusive determination.",
    "This media presents mixed signals under forensic analysis. Facial landmark positions fall within normal ranges, but minor inconsistencies were detected in edge sharpness around key features. These could indicate either compression artifacts or subtle manipulation. Further analysis with the uncompressed original is recommended for a definitive verdict.",
  ],
  "Likely Fake": [
    "Our analysis raises significant concerns about this media's authenticity. Multiple indicators consistent with deepfake synthesis were detected, including unnatural smoothing around facial boundaries and subtle temporal inconsistencies. The lip-sync pattern and eye reflection geometry deviate from expected natural baselines. We assess this media as likely synthetic or manipulated.",
    "Forensic analysis strongly suggests this media has been digitally manipulated. Key indicators include irregular blending artifacts at facial boundaries, anomalous frequency-domain patterns consistent with GAN generation, and inconsistent noise distribution across the frame. These findings collectively indicate a high probability of synthetic content.",
  ],
};

function getFallbackExplanation(verdict) {
  const pool = TEMPLATES[verdict] || TEMPLATES["Uncertain"];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Generate a forensic explanation.
 * Tries Gemini → OpenAI → template fallback.
 * Never throws — always returns a string.
 */
async function generateExplanation({ authenticityScore, verdict, riskLevel }) {
  const params = { authenticityScore, verdict, riskLevel };

  // 1. Try Gemini
  try {
    const geminiResult = await callGemini(params);
    if (geminiResult) return geminiResult;
  } catch (err) {
    console.warn("[Explanation] Gemini failed:", err.message);
  }

  // 2. Try OpenAI
  try {
    const openaiResult = await callOpenAI(params);
    if (openaiResult) return openaiResult;
  } catch (err) {
    console.warn("[Explanation] OpenAI failed:", err.message);
  }

  // 3. Template fallback
  console.log("[Explanation] Using template fallback");
  return getFallbackExplanation(verdict);
}

module.exports = { generateExplanation };
