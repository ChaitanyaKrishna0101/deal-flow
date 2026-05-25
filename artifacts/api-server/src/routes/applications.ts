// Applications routes — submit, list, get, update status, AI analyze

import { Router } from "express";
import type { Request, Response } from "express";
import { screenApplication } from "../services/screening.js";
import { calculateDealScore } from "../services/scoring.js";
import {
  getAllApplications,
  getApplicationById,
  saveApplication,
  updateApplication,
  generateApplicationId,
} from "../services/storage.js";
import { analyzeWithGemini } from "../services/gemini.js";
import { generateCsv } from "../services/csvExport.js";

const router = Router();

// POST /api/applications — submit a new application
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body as Record<string, unknown>;

    // Run frontend-equivalent screening on backend too
    const screen = screenApplication(data);
    if (!screen.passed) {
      res.status(400).json({ success: false, error: "Application screened out", reason: screen.reason });
      return;
    }

    // Calculate deal score
    const { dealScore, scoreBreakdown } = calculateDealScore(data);

    const applicationId = generateApplicationId();
    const app = {
      ...data,
      id: applicationId,
      applicationId,
      submittedAt: new Date().toISOString(),
      status: "Under Review",
      dealScore,
      scoreBreakdown,
      aiAnalysis: null,
    };

    saveApplication(app as Parameters<typeof saveApplication>[0]);

    res.status(201).json({ success: true, applicationId, score: dealScore, scoreBreakdown });
  } catch (err) {
    req.log.error({ err }, "Error submitting application");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/applications — list all applications with optional filters
router.get("/", (req: Request, res: Response) => {
  try {
    let apps = getAllApplications();

    const { sector, stage, status, sortBy } = req.query as Record<string, string>;

    if (sector) apps = apps.filter((a) => a.sector === sector);
    if (stage) apps = apps.filter((a) => a.stage === stage);
    if (status) apps = apps.filter((a) => a.status === status);

    if (sortBy === "score") {
      apps = apps.sort((a, b) => ((b.dealScore as number) || 0) - ((a.dealScore as number) || 0));
    } else if (sortBy === "date") {
      apps = apps.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } else if (sortBy === "funding") {
      apps = apps.sort((a, b) => ((b.amountRaising as number) || 0) - ((a.amountRaising as number) || 0));
    } else {
      // Default: by score descending
      apps = apps.sort((a, b) => ((b.dealScore as number) || 0) - ((a.dealScore as number) || 0));
    }

    res.json(apps);
  } catch (err) {
    req.log.error({ err }, "Error listing applications");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/applications/:id — single application
router.get("/:id", (req: Request, res: Response) => {
  try {
    const app = getApplicationById(req.params.id);
    if (!app) {
      res.status(404).json({ success: false, error: "Application not found" });
      return;
    }
    res.json(app);
  } catch (err) {
    req.log.error({ err }, "Error getting application");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PATCH /api/applications/:id — update status
router.patch("/:id", (req: Request, res: Response) => {
  try {
    const { status } = req.body as { status: string };
    const validStatuses = ["Under Review", "Shortlisted", "Rejected", "Funded"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: "Invalid status" });
      return;
    }
    const updated = updateApplication(req.params.id, { status });
    if (!updated) {
      res.status(404).json({ success: false, error: "Application not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Error updating application");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/applications/:id/analyze — Gemini AI analysis
router.post("/:id/analyze", async (req: Request, res: Response) => {
  try {
    const app = getApplicationById(req.params.id);
    if (!app) {
      res.status(404).json({ success: false, error: "Application not found" });
      return;
    }

    const analysis = await analyzeWithGemini(app as Record<string, unknown>);

    // Cache the analysis on the application
    updateApplication(req.params.id, { aiAnalysis: analysis.analysis });

    res.json({ applicationId: req.params.id, ...analysis });
  } catch (err) {
    req.log.error({ err }, "Error analyzing application");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /api/export/csv — CSV export (mounted separately but defined here for convenience)
export function csvExportHandler(req: Request, res: Response) {
  try {
    const apps = getAllApplications();
    const csv = generateCsv(apps);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="fsv-applications-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: "Export failed" });
  }
}

export default router;
