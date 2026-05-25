// CSV export service — converts applications array to CSV string

import type { StoredApplication } from "./storage.js";

const COLUMNS = [
  "applicationId",
  "submittedAt",
  "status",
  "startupName",
  "founderNames",
  "contactEmail",
  "sector",
  "stage",
  "amountRaising",
  "currency",
  "fundingStage",
  "equityOffered",
  "monthlyRevenue",
  "annualRevenue",
  "growthRate",
  "customerCount",
  "tam",
  "sam",
  "som",
  "teamSize",
  "dealScore",
  "headquarters",
  "websiteUrl",
  "demoLink",
];

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCsv(applications: StoredApplication[]): string {
  const header = COLUMNS.join(",");
  const rows = applications.map((app) =>
    COLUMNS.map((col) => escapeCell(app[col])).join(",")
  );
  return [header, ...rows].join("\n");
}
