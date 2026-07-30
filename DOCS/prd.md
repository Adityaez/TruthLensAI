# TruthLens AI — Product Requirements Document
### Deepfake Detection & Verification Platform — 4-Hour Hackathon Build

This document is written to be directly buildable by an AI coding agent. It specifies exact screens, components, states, data shapes, and behavior — not just goals. Where a decision was made to cut scope for time, the reasoning and exact fallback behavior are spelled out so the agent doesn't have to guess.

Companion file: `techstack.md` (exact packages, folder structure, API contracts, model choice, setup commands). Build both files together — this PRD defines *what* to build, techstack.md defines *how*.

---

## 1. Scope Tiers (read first, applies to every section below)

- **[P0]** — Must be built and fully working. This is the only thing demoed to judges.
- **[P1]** — Build only after every [P0] item works end-to-end with zero errors.
- **[CUT]** — Do not build. If the agent is tempted to add it "since it's easy," don't — time is the binding constraint, not code complexity.

Every screen and feature below is tagged with one of these.

---

## 2. Application Structure (all screens/routes)

| Route | Screen | Tier |
|---|---|---|
| `/` | Landing Page | P0 |
| `/upload` | Upload Media | P0 |
| `/result/:id` | Analysis Result | P0 |
| `/login` | Login (UI only, no real auth) | P1 |
| `/signup` | Signup (UI only, no real auth) | P1 |
| `/forgot-password` | Forgot Password (UI only) | P1 |
| `/dashboard` | Dashboard shell with sidebar | P1 |
| `/history` | Analysis History | P1 |
| `/settings` | Settings | CUT |
| `/reports` | Reports (separate from result page) | CUT |

For P1 routes: no route guards, no session persistence. Navigating to `/dashboard` directly should just render it — don't build middleware to protect routes.

---

## 3. Screen-by-Screen Specification

### 3.1 Landing Page (`/`) — [P0]

**Purpose:** First impression. Must look like a funded SaaS product, not a hackathon project.

**Sections, top to bottom:**

1. **Navbar** — Logo/wordmark ("TruthLens AI"), nav links (Features, How It Works), a "Try It Now" button (primary CTA, links to `/upload`)
2. **Hero**
   - Headline: something like "Know What's Real."
   - Subheadline: 1 sentence explaining the product (verify authenticity of images/video)
   - Primary CTA button: "Upload Media" → routes to `/upload`
   - Secondary/ghost button: "How It Works" → scrolls to section 4 (anchor link, no routing needed)
   - Visual: an animated/illustrated graphic suggesting AI + scanning/verification (can be an SVG with CSS animation — do not attempt to source or generate a custom illustration image; build it out of shapes/gradients)
3. **Features section** — 3–4 cards in a grid, each with an icon (Lucide), a title, and 1 sentence. Suggested cards:
   - "Instant Analysis" — results in seconds
   - "Explainable AI" — plain-language reasoning, not just a number
   - "Image & Video Support" *(mark video as "Coming Soon" badge if video isn't implemented — see §3.2)*
   - "Privacy First" — media isn't stored (true for P0 since there's no DB)
4. **How It Works section** — 3 numbered steps: Upload → Analyze → Get Verdict. Simple horizontal or vertical step layout, each with a short caption.
5. **Footer** — Logo, one line of copy, no real links needed (can be `#` placeholders)

**Visual requirements (apply site-wide, not just landing):**
- Dark theme by default
- Purple → blue gradient accents (buttons, glow effects, borders)
- Glassmorphism cards: semi-transparent background, backdrop blur, subtle border
- Rounded corners (large radius, e.g. `rounded-2xl`)
- Generous spacing/padding — this is a big part of "looking premium"

**Acceptance criteria:**
- Clicking "Upload Media" or "Try It Now" navigates to `/upload`
- Page is fully responsive (test at mobile width, don't just build desktop)
- No console errors

---

### 3.2 Upload Page (`/upload`) — [P0]

**Purpose:** Let the user submit an image and trigger analysis.

**Components:**
1. **Dropzone** — drag-and-drop area, also clickable to open a file picker
   - Accepts: `.jpg`, `.jpeg`, `.png` for P0. Video (`.mp4`, `.mov`, `.avi`) is [P1] — see below.
   - Show accepted format text under the dropzone: "Supported formats: JPG, PNG"
   - On drag-over, show a visual state change (border color/glow change)
2. **Preview** — once a file is selected, replace/overlay the dropzone with an image preview (use `URL.createObjectURL`) and a "Change file" or "×" button to reset
3. **Analyze button**
   - Disabled until a file is selected
   - On click: show a progress/loading state (see below) and call the backend
4. **Progress indicator** — while the request is in flight, show:
   - A progress bar or spinner with rotating status text, e.g. cycling through "Uploading...", "Scanning for artifacts...", "Analyzing facial landmarks...", "Generating report..." (these are cosmetic UI states — the real work is one API call; the text can advance on a timer to feel more "alive" while the request resolves in the background)
5. **Error state** — if the API call fails, show an inline error message with a "Try Again" button. Do not let the app crash or hang silently.

**[P1] Video support:** If time remains, accept video files, extract a single representative frame client-side (e.g. via an off-screen `<video>` + `<canvas>` at ~1s timestamp) and send that frame through the exact same image analysis pipeline. Do not build real video/frame-sequence analysis — one frame is the entire "video analysis" for this build.

**On successful analysis:** navigate to `/result/:id` and pass the result data (via React Router state or a simple in-memory store — see techstack.md for exact mechanism). No need for the `:id` to correspond to a real persisted record for P0; it can be a locally generated UUID/timestamp used only for the URL and React key.

**Acceptance criteria:**
- Selecting an invalid file type shows a clear error, doesn't crash
- Analyze button is unusable until a valid file is present
- A full round trip (select file → analyze → land on result page with real data) works without a page reload

---

### 3.3 Analysis Result Page (`/result/:id`) — [P0]

**Purpose:** The payoff screen — this is what judges will actually look at the longest.

**Layout, top to bottom or in a 2-column grid:**

1. **Media thumbnail** — the uploaded image, shown small (not full-size) alongside the results
2. **Authenticity Score — circular animated gauge**
   - Large circular progress ring, animates from 0 to the final score on mount (not instant — animate over ~800ms–1.2s)
   - Center of the ring: the percentage number, large font
   - Below/beside the ring: verdict label, e.g. **"Likely Real"** or **"Likely Fake"**
   - Color-code the ring: green/teal range for high authenticity, amber for uncertain, red for likely-fake — pick 2–3 thresholds (e.g. ≥70 = real/green, 40–69 = uncertain/amber, <40 = fake/red)
3. **Confidence meter** — a second, smaller meter/bar showing the model's confidence % (separate metric from the authenticity score itself — confidence is "how sure is the model," authenticity is "what does it think")
4. **Risk Level badge** — a simple Low / Medium / High badge derived from the same score bands as the ring color
5. **AI Explanation panel**
   - A card containing 2–4 sentences of natural-language explanation generated by the LLM call (see techstack.md for the exact prompt)
   - Should read like the example in the original brief: mentions specific signal categories such as lighting consistency, facial landmark stability, GAN artifacts, lip-sync — but must be generated dynamically per-image by the LLM, not hardcoded verbatim for every result (see prompt template in techstack.md — vary content based on the actual score, don't return the exact same paragraph every time)
6. **Media Metadata panel** — small table/list:
   - File size, resolution, file type, upload time (all of these ARE available client-side from the file object with zero extra work — populate them for real, don't fake them)
   - Duration, FPS — only relevant for video; omit this row entirely for image uploads rather than showing a fake value
7. **Heatmap placeholder** — [P0, but as a placeholder only] Since no real heatmap model is integrated, display a small card stating **"No suspicious regions detected."** — this exact fallback is specified in the original brief, so it's not a shortcut being hidden from the user, it's an intended state
8. **Actions row**:
   - "Analyze Another" button → routes back to `/upload`
   - "Download Report" button — [P1] see below

**[P1] Download Report:** Instead of building a real PDF-generation pipeline, render a clean print-optimized view of the same result data and trigger the browser's native print-to-PDF (`window.print()` with a print stylesheet). This satisfies "downloadable report" without a PDF library. If time truly remains and this feels worth doing properly, a lightweight client-side library (e.g. one that renders HTML to PDF in-browser) is acceptable — but the print-to-PDF approach should be the default plan.

**Acceptance criteria:**
- Score ring animates on mount, doesn't just snap to the final value
- Explanation text is clearly tied to the actual score (a 92% result and a 35% result should read differently)
- Metadata shown (file size, resolution, type) is real, pulled from the actual uploaded file
- Page doesn't error if a user navigates here directly without having uploaded anything (handle the missing-data case: redirect to `/upload` or show a friendly "no analysis found" state)

---

### 3.4 Auth Screens (`/login`, `/signup`, `/forgot-password`) — [P1, UI only]

Build these only if P0 is fully done. These exist purely for visual completeness / the pitch narrative ("we've designed for multi-user support").

- Standard centered card form on the gradient background, consistent with the rest of the app's visual language
- Login: email + password fields, "Log In" button, link to signup, link to forgot-password
- Signup: name + email + password fields, "Create Account" button
- Forgot Password: email field, "Send Reset Link" button
- **Behavior:** On submit, do not call any real backend auth endpoint. Simply navigate to `/dashboard` (or show a success toast/message for forgot-password). No validation beyond basic required-field checks needed. Explicitly do not implement JWT, hashing, or a users collection — see techstack.md.

---

### 3.5 Dashboard Shell (`/dashboard`) — [P1]

A layout with:
- **Sidebar** — links: Dashboard, Upload Media, Analysis History, Reports (can be inert/disabled), Settings (can be inert/disabled)
- **Main area** — can simply show recent activity (reuse the History component from §3.6, or a placeholder "Recent Analyses" list) plus a "New Analysis" CTA that routes to `/upload`

Keep this thin. It exists to make the app feel like a full product during the demo, not to add new logic.

---

### 3.6 Analysis History (`/history`) — [P1]

- List/grid of past analyses: thumbnail, filename, authenticity %, date, verdict badge
- Filter controls: All / Images / Videos / Fake / Real (client-side filter over whatever's in state)
- **Data source:** in-memory/local state populated during the current session only (e.g. a simple array in a React context or Zustand store — see techstack.md). Do **not** wire up MongoDB or any persistence layer for this. If the browser refreshes, it's fine for history to reset — say so plainly if asked, don't try to fake persistence.
- Clicking a history item routes to that result's `/result/:id` view (reusing the same result page component with that item's stored data)

---

## 4. Explicitly Cut Features — [CUT]

Do not build any of the following. If asked to reconsider mid-build, the answer is still no unless P0 and all listed P1 items are complete with significant time still on the clock:

- Real authentication (JWT issuance/verification, password hashing, session/cookie management)
- MongoDB or any database — everything lives in frontend memory/state for this build
- Real PDF-generation library/pipeline
- A real ML heatmap/suspicious-region overlay model
- Settings page, standalone Reports page, Share Report, Delete History actions
- Server-side video frame-sequence analysis (multi-frame temporal analysis)
- Any user account system, multi-user data isolation, or role-based access

---

## 5. Data Model (shape only — see techstack.md for the actual API contract)

A single **AnalysisResult** object flows through the app:

```
AnalysisResult {
  id: string                     // client-generated (uuid or timestamp), not a DB id
  fileName: string
  fileType: "image" | "video"
  fileSizeBytes: number
  resolution: string              // e.g. "1920x1080", read from the actual file
  uploadTimestamp: string         // ISO string
  thumbnailUrl: string            // object URL, in-memory only — do not persist
  authenticityScore: number       // 0–100
  confidence: number              // 0–100
  verdict: "Likely Real" | "Uncertain" | "Likely Fake"
  riskLevel: "Low" | "Medium" | "High"
  explanation: string              // LLM-generated paragraph
  suspiciousRegionsDetected: boolean  // always false for this build — drives the heatmap placeholder copy
}
```

This object is created once per analysis and held in whatever app-level state mechanism techstack.md specifies (used for both the immediate result page render and, if P1 history is built, the history list).

---

## 6. Definition of Done for the Hackathon Demo

The build is demo-ready when, live and without a page reload:

1. A judge can land on `/`, understand the product in under 10 seconds, and click through to upload
2. They can drag in a real image, hit Analyze, and see a progress state that doesn't feel instant/fake
3. They land on a Result page with an animating score ring, a verdict, a confidence meter, and an explanation paragraph that's clearly generated from that specific image's score
4. Nothing errors, nothing hangs, nothing shows a broken/empty state on the happy path
5. You can articulate — in one sentence each — why auth, DB, and PDF export aren't wired up ("time-boxed for the hackathon; here's how it'd plug in")
