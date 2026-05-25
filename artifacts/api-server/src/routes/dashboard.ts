// Dashboard routes — aggregate stats for investor overview

import { Router } from "express";
import type { Request, Response } from "express";
import { getAllApplications } from "../services/storage.js";

const router = Router();

// GET /api/dashboard/stats
router.get("/stats", (req: Request, res: Response) => {
  try {
    const apps = getAllApplications();

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = apps.length;
    const averageScore =
      total > 0 ? Math.round(apps.reduce((sum, a) => sum + ((a.dealScore as number) || 0), 0) / total) : 0;
    const shortlisted = apps.filter((a) => a.status === "Shortlisted").length;
    const thisMonth = apps.filter((a) => new Date(a.submittedAt) >= thisMonthStart).length;

    const bySector: Record<string, number> = {};
    const byStage: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const app of apps) {
      const sector = (app.sector as string) || "Unknown";
      const stage = (app.stage as string) || "Unknown";
      const status = (app.status as string) || "Unknown";
      bySector[sector] = (bySector[sector] || 0) + 1;
      byStage[stage] = (byStage[stage] || 0) + 1;
      byStatus[status] = (byStatus[status] || 0) + 1;
    }

    res.json({ total, averageScore, shortlisted, thisMonth, bySector, byStage, byStatus });
  } catch (err) {
    req.log.error({ err }, "Error getting dashboard stats");
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
