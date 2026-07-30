# TruthLens AI — Tech Stack & Implementation Spec
### Companion to prd.md — read that first for feature scope/tiers

This file is written for an AI coding agent to implement directly: exact folder structure, exact packages, exact API contracts, exact model names, and exact code patterns. Anywhere a choice was made for hackathon speed over "correctness," the reasoning is stated so the agent doesn't second-guess it mid-build.

---

## 1. High-Level Architecture

```
[React SPA] --POST /api/analyze (multipart file)--> [Express server]
                                                          |
                                                          ├─> HuggingFace Inference API (image classification)
                                                          |
                                                          └─> OpenAI/Gemini API (text generation for explanation)
                                                          |
                                                       returns JSON --> [React renders Result page]
```

No database. No auth server. State lives in the browser only (React state / Context / a small in-memory store — see §6). This is deliberate — see prd.md §4.

---

## 2. Repo / Folder Structure

```
truthlens-ai/
├── client/                          # React (Vite) app
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                  # React Router routes
│   │   ├── index.css                # Tailwind entry
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── GlassCard.jsx         # reusable glassmorphism card wrapper
│   │   │   ├── Dropzone.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   ├── ScoreGauge.jsx        # circular animated gauge
│   │   │   ├── ConfidenceMeter.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── ExplanationCard.jsx
│   │   │   ├── MetadataPanel.jsx
│   │   │   ├── HeatmapPlaceholder.jsx
│   │   │   └── Sidebar.jsx           # P1
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Result.jsx
│   │   │   ├── Login.jsx             # P1
│   │   │   ├── Signup.jsx            # P1
│   │   │   ├── ForgotPassword.jsx    # P1
│   │   │   ├── Dashboard.jsx         # P1
│   │   │   └── History.jsx           # P1
│   │   ├── store/
│   │   │   └── analysisStore.js      # in-memory results store, see §6
│   │   └── lib/
│   │       └── api.js                # fetch wrapper for POST /api/analyze
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── index.js                      # Express app entry
│   ├── routes/
│   │   └── analyze.js                # POST /api/analyze
│   ├── services/
│   │   ├── huggingface.js            # calls HF Inference API
│   │   └── explanation.js            # calls OpenAI/Gemini for the text
│   ├── .env                          # API keys, gitignored
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 3. Frontend Packages

```bash
cd client
npm create vite@latest . -- --template react
npm install react-router-dom framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- `react-router-dom` — routing across the pages listed in prd.md §2
- `framer-motion` — used sparingly: gauge fill animation, page-enter fades, hover states. Do not animate everything.
- `lucide-react` — icons throughout
- No chart library needed — build `ScoreGauge.jsx` as a hand-rolled SVG (`<circle>` with `stroke-dasharray`/`stroke-dashoffset` animated via Framer Motion or CSS transition). A dedicated gauge library is unnecessary weight for one component.
- No state management library needed for P0 (React state + Context is enough). If P1 History is built, a plain React Context wrapping an array is sufficient — do not add Redux/Zustand for a 4-hour build.

### Tailwind theme notes
- Dark background: something like `bg-slate-950` / `bg-[#0a0a12]`
- Gradient accents: `from-purple-600 to-blue-500` used on buttons, borders, glows
- Glassmorphism utility class (add to `index.css` or use inline):
  ```css
  .glass {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  ```

---

## 4. Backend Packages

```bash
cd server
npm init -y
npm install express cors multer dotenv node-fetch
```

- `express` — server framework
- `cors` — the client (Vite dev server, typically `localhost:5173`) needs to call the API (typically `localhost:5000` or similar) in dev
- `multer` — handle the multipart file upload. **Use memory storage, not disk storage:**
  ```js
  const multer = require("multer");
  const upload = multer({ storage: multer.memoryStorage() });
  ```
  This avoids any file cleanup logic — the buffer lives only for the duration of the request.
- `dotenv` — load `HF_API_TOKEN` and `OPENAI_API_KEY` (or `GEMINI_API_KEY`) from `.env`
- `node-fetch` — if using an older Node version without native `fetch`; skip this if Node 18+ is confirmed available (native `fetch` works fine)

---

## 5. API Contract

### `POST /api/analyze`

**Request:** `multipart/form-data`
- field name: `file`
- the image file (jpg/png/jpeg for P0)

**Response (200):**
```json
{
  "id": "1730236800000",
  "fileName": "photo.jpg",
  "fileType": "image",
  "authenticityScore": 87,
  "confidence": 91,
  "verdict": "Likely Real",
  "riskLevel": "Low",
  "explanation": "The uploaded media appears largely authentic. Lighting remains consistent across the frame and facial proportions show no signs of warping typically seen in synthetic generation. Minor compression artifacts are present but are consistent with normal image compression rather than GAN-based manipulation. Overall confidence in this assessment is high.",
  "suspiciousRegionsDetected": false
}
```

**Response (4xx/5xx) — error case:**
```json
{
  "error": "Could not process this file. Please try a different image."
}
```
The frontend must handle this and show the inline error state described in prd.md §3.2 — never let a failed request hang the UI indefinitely. Add a client-side timeout (e.g. abort the fetch after ~20s) in case the HF or LLM call stalls.

**Server-side logic for this route, in order:**
1. Receive file buffer via multer
2. Send buffer to HuggingFace Inference API (§7) → get raw classification (label + score)
3. Map the raw classification into `authenticityScore` (0–100), `verdict`, `riskLevel` (see §8 mapping rules)
4. Send the score + verdict to the LLM (§9) with the explanation prompt template → get back explanation text
5. Assemble and return the JSON shape above
6. `fileName`, `fileType`, `fileSizeBytes`, `resolution`, `uploadTimestamp` are actually populated **client-side** from the raw `File` object (these don't need the server at all — see §10) and merged into the `AnalysisResult` object in the frontend, not returned by this endpoint. Keep the server response focused on what only the server/AI can produce: score, confidence, verdict, risk, explanation.

---

## 6. Frontend State (`analysisStore.js`)

No backend persistence, so the frontend needs a lightweight way to pass the result from Upload → Result page, and (P1) accumulate a history list.

```js
// store/analysisStore.js
import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [history, setHistory] = useState([]); // array of AnalysisResult

  const addResult = (result) => setHistory((prev) => [result, ...prev]);
  const getResult = (id) => history.find((r) => r.id === id);

  return (
    <AnalysisContext.Provider value={{ history, addResult, getResult }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export const useAnalysis = () => useContext(AnalysisContext);
```

Wrap `<App />` in `<AnalysisProvider>` in `main.jsx`. The Upload page calls `addResult(result)` after a successful API call, then navigates to `/result/${result.id}`. The Result page reads via `getResult(id)` (fall back to `useLocation().state` if navigating directly with router state instead — either mechanism is fine, pick one and use it consistently).

This same array is exactly what powers the P1 History page — no separate data layer needed.

---

## 7. HuggingFace Model Choice

**Do not train anything.** Call an existing pre-trained image classification model via the HF Inference API.

**Primary recommendation:** `prithivMLmods/Deep-Fake-Detector-v2-Model` — a Vision Transformer fine-tuned specifically for real-vs-deepfake binary classification, returns `Realism` / `Deepfake` labels with confidence scores.

**Fallback option** (if the primary model isn't available on the free serverless Inference API at build time — availability of specific models on the free tier changes, so verify it responds before building the rest of the pipeline around it): `dima806/deepfake_vs_real_image_detection`. Note: its model card states it was trained on older data and may be biased toward flagging modern AI images as real — if using it, consider lowering the "fake" threshold as its own documentation suggests, or just note this caveat in the demo pitch.

**Calling the Inference API:**
```js
// server/services/huggingface.js
const HF_MODEL = "prithivMLmods/Deep-Fake-Detector-v2-Model";

async function classifyImage(fileBuffer) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: fileBuffer,
    }
  );
  if (!response.ok) throw new Error(`HF API error: ${response.status}`);
  return response.json();
  // Expected shape: [{ label: "Realism", score: 0.91 }, { label: "Deepfake", score: 0.09 }]
}

module.exports = { classifyImage };
```

**IMPORTANT — first thing to do in the build, before writing any UI:** confirm this API call actually returns a valid response with your `HF_API_TOKEN` (free HF account tokens work for most serverless inference calls, but the very first call to a model can be slow while it "cold starts," and some models may be rate-limited or gated). Test this in isolation (e.g. `curl` or a tiny script) before wiring it into the full pipeline. If it fails or is too slow, fall back to the mock response strategy in §11 immediately rather than losing time debugging it mid-hackathon.

---

## 8. Score Mapping Rules

Convert the raw HF classification into the fields the frontend needs:

```js
function mapToResult(hfResponse) {
  const realEntry = hfResponse.find(r => r.label.toLowerCase().includes("real"));
  const authenticityScore = Math.round((realEntry?.score ?? 0.5) * 100);

  let verdict, riskLevel;
  if (authenticityScore >= 70) { verdict = "Likely Real"; riskLevel = "Low"; }
  else if (authenticityScore >= 40) { verdict = "Uncertain"; riskLevel = "Medium"; }
  else { verdict = "Likely Fake"; riskLevel = "High"; }

  // Confidence: how far the top score is from a 50/50 guess, rescaled to 0-100
  const confidence = Math.round(Math.abs(authenticityScore - 50) * 2);

  return { authenticityScore, verdict, riskLevel, confidence };
}
```
This is a reasonable, defensible heuristic for a hackathon — it doesn't need to be more sophisticated than this. Don't over-engineer the confidence calculation.

---

## 9. LLM Explanation Prompt (OpenAI or Gemini)

**Use whichever API key is available** — the prompt is provider-agnostic. Example with OpenAI:

```js
// server/services/explanation.js
async function generateExplanation({ authenticityScore, verdict, riskLevel }) {
  const prompt = `You are an AI forensic analyst. A media authenticity model returned:
- Authenticity score: ${authenticityScore}/100
- Verdict: ${verdict}
- Risk level: ${riskLevel}

Write a 3-4 sentence explanation for a non-technical user, in the style of a forensic report. Reference plausible visual signal categories such as lighting consistency, facial landmark stability, GAN/compression artifacts, or lip-sync where relevant to the verdict. Do not repeat the raw numbers verbatim in prose form more than once. Vary the phrasing based on whether the verdict is "Likely Real," "Uncertain," or "Likely Fake" — a low-score result should sound appropriately cautious, not falsely reassuring.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

module.exports = { generateExplanation };
```

This is the piece prd.md §3.3 requires to vary per-image rather than being a hardcoded paragraph — the prompt explicitly conditions on the actual score/verdict so a 92% and a 35% result read differently.

---

## 10. Client-Side Metadata (no server round-trip needed)

Populate these directly from the browser `File` object at upload time — do not send them to or expect them from the backend:

```js
function extractClientMetadata(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        fileName: file.name,
        fileSizeBytes: file.size,
        resolution: `${img.width}x${img.height}`,
        uploadTimestamp: new Date().toISOString(),
        thumbnailUrl: url,
      });
    };
    img.src = url;
  });
}
```
Merge this with the server's response to build the final `AnalysisResult` object described in prd.md §5.

---

## 11. Mock Fallback Strategy (build this FIRST)

Before wiring any real API, stub `POST /api/analyze` to return a hardcoded response instantly:

```js
// temporary stub in routes/analyze.js
router.post("/analyze", upload.single("file"), (req, res) => {
  res.json({
    id: Date.now().toString(),
    authenticityScore: 87,
    confidence: 91,
    verdict: "Likely Real",
    riskLevel: "Low",
    explanation: "The uploaded media appears authentic. Lighting remains consistent and facial landmarks are stable, with no obvious artifacts detected. Overall confidence in this result is high.",
    suspiciousRegionsDetected: false,
  });
});
```

Build and polish the entire Upload → Result click-through against this stub first. Only after that full flow works should the stub be replaced with the real HF + LLM calls from §7–§9. This guarantees a demoable app exists at all times during the build, per prd.md's Definition of Done.

---

## 12. Environment Variables

```
# server/.env
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
# or, if using Gemini instead of OpenAI:
# GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxx
PORT=5000
```
Commit a `server/.env.example` with the same keys and no real values. Never commit the real `.env`.

---

## 13. Local Dev — Running Both Servers

```bash
# terminal 1
cd server && npm run dev     # e.g. nodemon index.js, on PORT 5000

# terminal 2
cd client && npm run dev     # Vite dev server, typically on 5173
```
In `client/vite.config.js`, add a proxy so the frontend can call `/api/analyze` without hardcoding the backend host:
```js
export default {
  server: {
    proxy: { "/api": "http://localhost:5000" }
  }
}
```

---

## 14. Build Order Checklist (do these in sequence)

1. Scaffold `client/` and `server/` folder structure (§2)
2. Stand up Express with the **mocked** `/api/analyze` route (§11) — confirm it responds
3. Build Landing page (prd.md §3.1) — static, no API calls
4. Build Upload page (§3.2) wired to the mocked endpoint — confirm full click-through to Result page
5. Build Result page (§3.3) rendering the mocked data — gauge animation, explanation card, metadata, heatmap placeholder
6. Once the full mocked flow works end-to-end with zero errors: swap in the real HF call (§7) and real LLM call (§9), test with 2–3 real sample images
7. Only after step 6 is confirmed working: move to P1 items (auth screens, dashboard, history) in priority order per prd.md, time permitting
8. Final pass: responsive check, console-error check, run through the Definition of Done in prd.md §6 exactly as a judge would experience it
