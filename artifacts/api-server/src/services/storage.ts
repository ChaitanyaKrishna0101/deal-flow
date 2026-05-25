// Simple JSON file-based storage — no external DB required
// Data is persisted to ./data/applications.json

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "applications.json");

export interface StoredApplication {
  id: string;
  applicationId: string;
  submittedAt: string;
  status: string;
  [key: string]: unknown;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readAll(): StoredApplication[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StoredApplication[];
  } catch {
    return [];
  }
}

function writeAll(apps: StoredApplication[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), "utf-8");
}

export function getAllApplications(): StoredApplication[] {
  return readAll();
}

export function getApplicationById(id: string): StoredApplication | null {
  return readAll().find((a) => a.id === id || a.applicationId === id) || null;
}

export function saveApplication(app: StoredApplication): StoredApplication {
  const all = readAll();
  all.unshift(app);
  writeAll(all);
  return app;
}

export function updateApplication(id: string, updates: Partial<StoredApplication>): StoredApplication | null {
  const all = readAll();
  const idx = all.findIndex((a) => a.id === id || a.applicationId === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  writeAll(all);
  return all[idx];
}

export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `FSV-${year}-${random}`;
}
