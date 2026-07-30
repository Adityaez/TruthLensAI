# TruthLens AI — Implementation Plan (4-Hour Hackathon)

> **Time Budget:** 4 hours (240 minutes)  
> **Start:** ~10:30 AM IST → **Hard Deadline:** ~2:30 PM IST  
> **Core Principle:** A demoable app exists at ALL times. Never break the working flow chasing a feature.

---

## High-Level Phase Breakdown

| Phase | What | Time Budget | Cumulative |
|-------|------|-------------|------------|
| **Phase 0** | Scaffolding + Mock API + Verify | 20 min | 0:20 |
| **Phase 1** | Landing Page (P0) | 30 min | 0:50 |
| **Phase 2** | Upload Page (P0) | 35 min | 1:25 |
| **Phase 3** | Result Page (P0) | 45 min | 2:10 |
| **Phase 4** | Real API Integration (HF + LLM) | 30 min | 2:40 |
| **Phase 5** | Polish + Responsive Pass | 20 min | 3:00 |
| **Phase 6** | P1 Features (Auth UI, Dashboard, History) | 45 min | 3:45 |
| **Phase 7** | Final QA + Demo Dry Run | 15 min | 4:00 |

> [!IMPORTANT]
> **If Phase 4 (real API) takes longer than 30 min or APIs are flaky, STOP and keep the mock.** A polished app with mock data beats a broken app with real AI every time. Judges see UX first.

---

## Phase 0 — Scaffolding + Mock API (20 min)

**Goal:** Both servers running, mock `/api/analyze` returns valid JSON, Vite proxies requests correctly.

### Backend Setup

#### [NEW] [package.json](file:///c:/TruthLensAI/server/package.json)
- `npm init -y` in `server/`
- Install: `express`, `cors`, `multer`, `dotenv`
- Add `"dev"` script using `node --watch index.js` (Node 18+) or `nodemon`

#### [NEW] [index.js](file:///c:/TruthLensAI/server/index.js)
- Express app, CORS enabled, listen on `PORT` from env (default 5000)
- Mount `/api` routes

#### [NEW] [routes/analyze.js](file:///c:/TruthLensAI/server/routes/analyze.js)
- `POST /api/analyze` — multer memory storage, returns hardcoded mock response per techstack.md §11
- This mock stays in place until Phase 4

#### [NEW] [.env.example](file:///c:/TruthLensAI/server/.env.example)
- Template with `HF_API_TOKEN`, `OPENAI_API_KEY`, `PORT=5000`

#### [NEW] [.env](file:///c:/TruthLensAI/server/.env)
- Real keys (user must supply), gitignored

### Frontend Setup

#### [NEW] Vite React app in `client/`
- `npm create vite@latest . -- --template react` inside `client/`
- Install: `react-router-dom`, `framer-motion`, `lucide-react`
- Install dev: `tailwindcss`, `postcss`, `autoprefixer`
- Run `npx tailwindcss init -p`

#### [MODIFY] [vite.config.js](file:///c:/TruthLensAI/client/vite.config.js)
- Add proxy: `"/api" → "http://localhost:5000"`

#### [MODIFY] [tailwind.config.js](file:///c:/TruthLensAI/client/tailwind.config.js)
- Configure `content` paths, extend theme with custom colors (dark slate bg, purple-blue gradient palette)

#### [MODIFY] [index.css](file:///c:/TruthLensAI/client/src/index.css)
- Tailwind directives (`@tailwind base/components/utilities`)
- `.glass` utility class (glassmorphism: `rgba(255,255,255,0.06)`, `backdrop-filter: blur(12px)`, subtle border)
- Dark body background (`#0a0a12`)
- Import Google Font (Inter or Outfit)

#### [NEW] [store/analysisStore.js](file:///c:/TruthLensAI/client/src/store/analysisStore.js)
- React Context: `AnalysisProvider` wrapping `history` state (array of `AnalysisResult`)
- Exports: `addResult(result)`, `getResult(id)`, `history`

#### [NEW] [lib/api.js](file:///c:/TruthLensAI/client/src/lib/api.js)
- `analyzeImage(file)` — `POST /api/analyze` as `multipart/form-data`, with 20s `AbortController` timeout
- Returns parsed JSON or throws

#### [MODIFY] [main.jsx](file:///c:/TruthLensAI/client/src/main.jsx)
- Wrap `<App />` in `<BrowserRouter>` and `<AnalysisProvider>`

#### [MODIFY] [App.jsx](file:///c:/TruthLensAI/client/src/App.jsx)
- Set up all routes per PRD §2 (P0 routes first, P1 routes as lazy additions later)

### ✅ Checkpoint
- `npm run dev` in both terminals → no errors
- `curl -X POST http://localhost:5000/api/analyze` returns mock JSON
- Vite serves on `:5173`, proxy works

---

## Phase 1 — Landing Page [P0] (30 min)

**Goal:** A judge lands on `/` and thinks "this looks like a real funded product."

### Components

#### [NEW] [components/Navbar.jsx](file:///c:/TruthLensAI/client/src/components/Navbar.jsx)
- Logo/wordmark "TruthLens AI" with gradient text
- Nav links: Features, How It Works (anchor scroll)
- "Try It Now" CTA button → `/upload`
- Mobile hamburger menu (responsive)

#### [NEW] [components/Footer.jsx](file:///c:/TruthLensAI/client/src/components/Footer.jsx)
- Logo, copyright line, placeholder links

#### [NEW] [components/GlassCard.jsx](file:///c:/TruthLensAI/client/src/components/GlassCard.jsx)
- Reusable wrapper: `.glass` styles + `rounded-2xl` + padding
- Accepts `className` prop for overrides

### Page

#### [NEW] [pages/Landing.jsx](file:///c:/TruthLensAI/client/src/pages/Landing.jsx)
Sections in order:
1. **Hero** — Large headline ("Know What's Real."), subheadline, two CTAs (Upload Media → `/upload`, How It Works → `#how-it-works`), animated SVG graphic built from shapes/gradients (concentric circles with scanning animation via CSS keyframes)
2. **Features** — 4 `GlassCard`s in a responsive grid with Lucide icons:
   - Shield icon → "Instant Analysis"
   - Brain icon → "Explainable AI"  
   - Video icon → "Image & Video Support" (with "Coming Soon" badge on video)
   - Lock icon → "Privacy First"
3. **How It Works** (`id="how-it-works"`) — 3 numbered steps with icons: Upload → Analyze → Get Verdict
4. Footer

**Visual:** Dark background, purple-blue gradient accents on buttons, glassmorphism cards, subtle entrance animations (Framer Motion `motion.div` with `initial`/`animate` for fade+slide-up on scroll-into-view).

### ✅ Checkpoint
- Page looks premium and professional at both desktop and mobile widths
- "Upload Media" and "Try It Now" navigate to `/upload`
- "How It Works" smooth-scrolls to the section
- Zero console errors

---

## Phase 2 — Upload Page [P0] (35 min)

**Goal:** User drags an image, sees a preview, hits Analyze, sees a progress animation, then lands on the Result page.

### Components

#### [NEW] [components/Dropzone.jsx](file:///c:/TruthLensAI/client/src/components/Dropzone.jsx)
- Drag-and-drop zone with `onDragOver`/`onDrop` handlers + hidden `<input type="file">`
- Accepts `.jpg`, `.jpeg`, `.png` (validates on select, shows error for invalid types)
- Visual states: default (dashed border), drag-over (glowing purple border), file-selected (shows preview)
- On file select: `URL.createObjectURL()` for preview, "✕" button to clear

#### [NEW] [components/ProgressIndicator.jsx](file:///c:/TruthLensAI/client/src/components/ProgressIndicator.jsx)
- Animated progress bar with rotating status messages on a 2s timer:
  - "Uploading media..." → "Scanning for artifacts..." → "Analyzing facial landmarks..." → "Generating report..."
- Framer Motion for smooth bar fill + text fade transitions

### Page

#### [NEW] [pages/Upload.jsx](file:///c:/TruthLensAI/client/src/pages/Upload.jsx)
- States: `idle` → `preview` → `analyzing` → `error`
- Dropzone component for file selection
- "Analyze" button (disabled until valid file present, gradient style matching landing CTA)
- On Analyze click:
  1. Show `ProgressIndicator`
  2. Call `extractClientMetadata(file)` (from lib/api.js) to get fileName, fileSize, resolution, thumbnailUrl
  3. Call `analyzeImage(file)` API
  4. Merge client metadata + server response into `AnalysisResult` object
  5. Call `addResult(result)` from context
  6. Navigate to `/result/${result.id}`
- Error state: inline error card with "Try Again" button (resets to preview state)

### ✅ Checkpoint
- Drag an image → preview appears → hit Analyze → progress animation plays → lands on `/result/:id`
- Invalid file type shows error message
- API failure shows inline error with retry
- The full flow works against the mock endpoint

---

## Phase 3 — Result Page [P0] (45 min)

**Goal:** The payoff screen — judges stare at this the longest. Animated gauge, dynamic explanation, real metadata.

### Components

#### [NEW] [components/ScoreGauge.jsx](file:///c:/TruthLensAI/client/src/components/ScoreGauge.jsx)
- SVG circular progress ring (`<circle>` with `stroke-dasharray`/`stroke-dashoffset`)
- Framer Motion animates from 0 to final score over ~1s on mount
- Color-coded: green/teal (≥70), amber (40–69), red (<40)
- Center: large percentage number, below: verdict text

#### [NEW] [components/ConfidenceMeter.jsx](file:///c:/TruthLensAI/client/src/components/ConfidenceMeter.jsx)
- Horizontal bar that fills to the confidence %, animated on mount
- Label: "Model Confidence: X%"

#### [NEW] [components/RiskBadge.jsx](file:///c:/TruthLensAI/client/src/components/RiskBadge.jsx)
- Pill badge: Low (green), Medium (amber), High (red)

#### [NEW] [components/ExplanationCard.jsx](file:///c:/TruthLensAI/client/src/components/ExplanationCard.jsx)
- GlassCard wrapper with "AI Analysis" header
- Renders the `explanation` text from the API response
- Typing/fade-in animation for premium feel

#### [NEW] [components/MetadataPanel.jsx](file:///c:/TruthLensAI/client/src/components/MetadataPanel.jsx)
- Small grid/table: File Name, File Size (formatted to KB/MB), Resolution, File Type, Upload Time
- Only shows Duration/FPS row if `fileType === "video"` (omit for images)

#### [NEW] [components/HeatmapPlaceholder.jsx](file:///c:/TruthLensAI/client/src/components/HeatmapPlaceholder.jsx)
- GlassCard with shield/check icon: "No suspicious regions detected."

### Page

#### [NEW] [pages/Result.jsx](file:///c:/TruthLensAI/client/src/pages/Result.jsx)
- Layout: 2-column grid on desktop (media + score on left, details on right), stacks on mobile
- Reads result via `getResult(id)` from context using URL param `:id`
- If no result found: redirect to `/upload` or show "No analysis found" with link back
- Components arranged top to bottom:
  1. Image thumbnail (from `thumbnailUrl`)
  2. `ScoreGauge` (large, prominent)
  3. `ConfidenceMeter`
  4. `RiskBadge`
  5. `ExplanationCard`
  6. `MetadataPanel`
  7. `HeatmapPlaceholder`
  8. Actions: "Analyze Another" → `/upload`

### ✅ Checkpoint
- Score ring animates smoothly from 0 to value
- All metadata is real (file size, resolution, type from the actual file)
- Different scores show different colors/verdicts
- Direct navigation to `/result/xxx` without prior upload shows graceful fallback
- **At this point, the ENTIRE P0 flow is demoable end-to-end with mock data**

---

## Phase 4 — Real API Integration (30 min)

> [!WARNING]  
> **Hard time-box: 30 minutes MAX.** If HuggingFace or LLM APIs are flaky/slow/erroring after 15 min of debugging, STOP and keep the mock. Add randomization to the mock instead (random score 20–95, pick verdict/risk accordingly, use a few hardcoded explanation variants). A polished demo with fake data > a broken demo with real AI.

### Backend Services

#### [NEW] [services/huggingface.js](file:///c:/TruthLensAI/server/services/huggingface.js)
- `classifyImage(fileBuffer)` — calls HF Inference API with `prithivMLmods/Deep-Fake-Detector-v2-Model`
- Fallback to `dima806/deepfake_vs_real_image_detection` if primary fails
- Returns `[{ label, score }, ...]`

#### [NEW] [services/explanation.js](file:///c:/TruthLensAI/server/services/explanation.js)
- `generateExplanation({ authenticityScore, verdict, riskLevel })` — calls OpenAI `gpt-4o-mini` (or Gemini if that key is available) with the forensic analyst prompt from techstack.md §9
- Returns the explanation string

#### [MODIFY] [routes/analyze.js](file:///c:/TruthLensAI/server/routes/analyze.js)
- Replace mock stub with real pipeline:
  1. Receive file buffer
  2. Call `classifyImage(buffer)` → get HF response
  3. Apply `mapToResult()` score mapping (techstack.md §8)
  4. Call `generateExplanation(mapped)` → get explanation text
  5. Assemble and return full response JSON
- Keep the mock code commented out (easy rollback)
- Add try/catch: if any API fails, return a 500 with the error JSON shape from techstack.md §5

### Verification
- Test with 2–3 real images (one real photo, one known AI-generated)
- Verify scores differ and explanations read differently
- Confirm the full UI flow still works end-to-end

### ✅ Checkpoint
- Real images produce real, varying scores and explanations
- Error handling works (disconnect wifi → error state appears, retry works)

---

## Phase 5 — Polish + Responsive Pass (20 min)

**Goal:** Make it bulletproof for the demo.

- **Responsive check:** Test all 3 P0 pages at 375px (mobile), 768px (tablet), 1440px (desktop)
- **Animation polish:** Ensure gauge, progress bar, page transitions feel smooth
- **Console errors:** Open DevTools, navigate the full flow, fix any warnings/errors
- **Loading states:** Verify the progress indicator text cycling works and feels natural
- **Edge cases:** Empty file, very large file (>5MB — show a friendly size limit message if needed), network timeout
- **Typography:** Verify font (Inter/Outfit) loads correctly
- **Spacing:** Check for cramped cards or overflowing text at any breakpoint

### ✅ Checkpoint
- **P0 Definition of Done (PRD §6) is fully satisfied:**
  1. ✅ Judge lands on `/`, understands product in <10s, clicks through
  2. ✅ Drag image → Analyze → progress state feels real
  3. ✅ Result page: animated gauge, verdict, confidence, dynamic explanation
  4. ✅ Zero errors, zero hangs, zero broken states on happy path

> [!IMPORTANT]
> **If you are running behind schedule, STOP HERE.** Everything from Phase 0–5 is the demo. P1 features are bonus points only.

---

## Phase 6 — P1 Features (45 min, only if ahead of schedule)

> Only begin this phase if Phases 0–5 are fully complete and verified.

### 6A. Auth Screens (15 min)

#### [NEW] [pages/Login.jsx](file:///c:/TruthLensAI/client/src/pages/Login.jsx)
- Centered glassmorphism card on gradient background
- Email + password fields, "Log In" button → navigates to `/dashboard`
- Links to Signup and Forgot Password

#### [NEW] [pages/Signup.jsx](file:///c:/TruthLensAI/client/src/pages/Signup.jsx)
- Name + email + password fields, "Create Account" → navigates to `/dashboard`

#### [NEW] [pages/ForgotPassword.jsx](file:///c:/TruthLensAI/client/src/pages/ForgotPassword.jsx)
- Email field, "Send Reset Link" → shows success toast/message

**No real auth.** No JWT, no hashing. Submit = navigate.

---

### 6B. Dashboard + Sidebar (15 min)

#### [NEW] [components/Sidebar.jsx](file:///c:/TruthLensAI/client/src/components/Sidebar.jsx)
- Vertical nav: Dashboard, Upload Media, Analysis History, Reports (disabled), Settings (disabled)
- Collapsible on mobile

#### [NEW] [pages/Dashboard.jsx](file:///c:/TruthLensAI/client/src/pages/Dashboard.jsx)
- Sidebar layout wrapper
- Main area: "Welcome back" header, recent analyses list (from context `history`), "New Analysis" CTA → `/upload`
- If no history: show empty state "No analyses yet"

---

### 6C. Analysis History (15 min)

#### [NEW] [pages/History.jsx](file:///c:/TruthLensAI/client/src/pages/History.jsx)
- Grid/list of past analyses from context `history` array
- Each card: thumbnail, filename, authenticity %, date, verdict badge
- Filter tabs: All / Images / Videos / Real / Fake (client-side filter)
- Click → navigate to `/result/:id`
- Empty state if no history

---

## Phase 7 — Final QA + Demo Dry Run (15 min)

1. **Full happy-path walkthrough:** `/` → click "Upload Media" → drag image → Analyze → see result → "Analyze Another" → try a different image
2. **Judge simulation:** Time the flow. Can someone understand the product in 10 seconds on the landing page?
3. **Console check:** Zero errors, zero warnings
4. **Network check:** What happens if the API is slow? Does the progress indicator cover the wait gracefully?
5. **One-liner prep:** Have ready:
   - Why no auth: "Time-boxed for hackathon; designed for plug-in auth via JWT middleware"
   - Why no DB: "In-memory store by design for the demo; MongoDB integration is a config change"
   - Why no real PDF: "Print-to-PDF via browser covers this; a library integration is the next step"

---

## Proposed Changes Summary

### Component/File Count

| Layer | P0 Files | P1 Files | Total |
|-------|----------|----------|-------|
| Backend (server/) | 5 | 2 | 7 |
| Frontend Pages | 3 | 5 | 8 |
| Frontend Components | 10 | 1 | 11 |
| Frontend Store/Lib | 2 | 0 | 2 |
| Config files | 5 | 0 | 5 |
| **Total** | **25** | **8** | **33** |

### Tech Stack Confirmed

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+ (Vite), React Router, Framer Motion, Lucide React, Tailwind CSS |
| Backend | Node.js + Express, Multer (memory storage), CORS |
| AI - Image | HuggingFace Inference API (`prithivMLmods/Deep-Fake-Detector-v2-Model`) |
| AI - Text | OpenAI GPT-4o-mini (or Gemini) for explanation generation |
| State | React Context (in-memory array, no DB) |
| Styling | Tailwind CSS + custom glassmorphism utilities, dark theme |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| HuggingFace model unavailable/slow | Mock fallback already built in Phase 0. Keep it. Add score randomization. |
| OpenAI/Gemini API key issues | Hardcode 3–4 explanation variants that rotate based on score bands. |
| Tailwind setup issues | Fall back to vanilla CSS in `index.css` — the `.glass` class is already plain CSS. |
| Running over time on any phase | Each phase has a checkpoint. If behind by Phase 3 end, skip Phase 4 and go to Phase 5 (polish). |
| Browser compatibility | Test only in Chrome. Don't spend time on Safari/Firefox edge cases during the hackathon. |

---

## Open Questions

> [!IMPORTANT]
> **API Keys Required:** Do you have the following ready? These are needed for Phase 4 (real AI integration):
> 1. **HuggingFace API Token** — free account token works for inference API
> 2. **OpenAI API Key** (for GPT-4o-mini) **OR** a **Gemini API Key** — which do you have?

> [!NOTE]
> If you don't have these keys, no problem — the mock fallback will still produce a fully demoable app. We can add randomized scores and pre-written explanation variants to make it feel dynamic.

---

## Verification Plan

### Automated Tests
- Not building unit tests for a 4-hour hackathon (explicitly out of scope per time constraint)

### Manual Verification
1. Full click-through: Landing → Upload → Analyze → Result → Analyze Another (2 images minimum)
2. Error path: Invalid file type rejection, API failure error state
3. Responsive: Check all pages at 375px, 768px, 1440px widths
4. Console: Zero errors in DevTools
5. Edge case: Direct navigation to `/result/nonexistent` → graceful fallback
6. Performance: Page loads feel instant, gauge animation is smooth 60fps
