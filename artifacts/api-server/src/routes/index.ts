import { Router, type IRouter } from "express";
import type { Request, Response } from "express";
import healthRouter from "./health.js";
import applicationsRouter, { csvExportHandler } from "./applications.js";
import dashboardRouter from "./dashboard.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/applications", applicationsRouter);
router.use("/dashboard", dashboardRouter);
router.get("/export/csv", (req: Request, res: Response) => csvExportHandler(req, res));

export default router;
