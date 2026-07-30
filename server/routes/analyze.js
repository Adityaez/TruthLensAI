const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/analyze
// Phase 0: Mock response — returns hardcoded data per techstack.md §11
// Phase 4 will replace this with real HF + LLM calls
router.post("/analyze", upload.single("file"), (req, res) => {
  res.json({
    id: Date.now().toString(),
    authenticityScore: 87,
    confidence: 91,
    verdict: "Likely Real",
    riskLevel: "Low",
    explanation:
      "The uploaded media appears authentic. Lighting remains consistent and facial landmarks are stable, with no obvious artifacts detected. Overall confidence in this result is high.",
    suspiciousRegionsDetected: false,
  });
});

module.exports = router;
