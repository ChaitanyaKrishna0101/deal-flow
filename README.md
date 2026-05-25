# FSV Capital — Startup Funding Application

> A full-stack web platform where startup founders apply for funding and investors review every deal in one clean dashboard.

**Live Demo → [deal-flow-fsv-capital.vercel.app](https://deal-flow-fsv-capital.vercel.app)**

---

## The Problem

Every day, FSV Capital gets emails from startups asking for investment.

Some send PDFs. Some send WhatsApp messages. Some just call.

There is no structure. No way to compare. No way to decide who to call first.

This platform fixes that.

---

## What It Does

```
Founder fills a form  →  Backend scores the application  →  Investor reviews on dashboard
```

**Two people use this:**

| Person | What they do |
|--------|-------------|
| 🚀 Startup Founder | Fills an 11-step form, uploads pitch deck, submits |
| 💼 FSV Investor | Opens dashboard, sees all applications with scores, filters and exports |

---

## Snapshots

<table>
  <tr>
    <th align="center">🏠 User Interface</th>
    <th align="center">📊 Dealers View</th>
  </tr>
  <tr>
    <td align="center">
      <img width="580" alt="User Interface" src="https://github.com/user-attachments/assets/6d67bc6b-c150-4de2-a222-5239f4f5d0f7" />
    </td>
    <td align="center">
      <img width="580" alt="Dealers View" src="https://github.com/user-attachments/assets/067b7bf3-1000-4103-8cd4-3d765ad3277d" />
    </td>
  </tr>
  <tr>
    <th align="center">📋 Application Form</th>
    <th align="center">🔍 Application Details & Score</th>
  </tr>
  <tr>
    <td align="center">
      <img width="580" alt="Application Form" src="https://github.com/user-attachments/assets/516eadfd-3c7f-4093-9373-80b2bf22a838"/>
    </td>
    <td align="center">
      <img width="580" alt="Application Details and Score" src="https://github.com/user-attachments/assets/62585a11-9023-41fd-8d6c-cb0855292630" />
    </td>
  </tr>
</table>

---
<div align="center">

<b>📋 Application Form — Fill, Submit & Instantly See Your Score</b>

<br/>
<sub>Founder fills the application form → submits → instantly sees deal score, improvements and full application details</sub>
<br/><br/>

<video src="https://github.com/user-attachments/assets/8cc300a7-c9f1-40c2-bb2b-2028f184b71e" controls width="75%"></video>

</div>
---

## How It Works — Step by Step

```
1. Founder opens the website
         ↓
2. Fills 11-section form (name, product, market, funding ask, team...)
         ↓
3. Uploads pitch deck PDF
         ↓
4. Clicks Submit
         ↓
   Screening filter runs:
   ✓ Is sector allowed?  (Fintech, AI, Blockchain, DeepTech, SaaS)
   ✓ Is funding ask between $50K–$10M?
   ✓ Is stage + revenue data consistent?
         ↓
   If PASS → sent to backend
   If FAIL → polite rejection shown, nothing stored
         ↓
5. Backend automatically:
   - Saves data to MongoDB
   - Calculates deal score out of 100
   - Uploads pitch deck to Cloudinary
   - Sends confirmation email to founder
   - Sends alert email to FSV team
         ↓
6. Investor opens /dashboard
         ↓
7. Sees all deals with scores, filters, exports to CSV
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      ONE URL                            │
│                                                         │
│   FRONTEND (React + Tailwind)                           │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │ Landing (/) │  │ Form /apply  │  │ Dashboard    │  │
│   └─────────────┘  └──────────────┘  │ /dashboard   │  │
│                                      └──────────────┘  │
│                        │ HTTP                           │
│   BACKEND (Node.js + Express)                           │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │   Routes    │  │   Scoring    │  │     PDF      │  │
│   │   /api/*    │  │   Engine     │  │   Generator  │  │
│   └─────────────┘  └──────────────┘  └──────────────┘  │
│          │                │                  │          │
│   ┌──────▼──────┐  ┌──────▼──────┐  ┌───────▼──────┐   │
│   │  MongoDB    │  │ Cloudinary  │  │    Resend    │   │
│   │ (Database)  │  │  (Files)    │  │   (Emails)   │   │
│   └─────────────┘  └─────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Deal Scoring System

Every application gets a score out of 100, calculated automatically.

```
Market Size        → up to 25 points
Revenue & Stage    → up to 25 points
Team Strength      → up to 20 points
Traction           → up to 20 points
Innovation         → up to 10 points
─────────────────────────────────────
Total              → 100 points
```

Score colors on dashboard:
- 🔴 Below 40 — needs work
- 🟡 40–65 — promising
- 🟢 65+ — strong deal

---

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | React + Tailwind CSS | Fast UI, clean components |
| Backend | Node.js + Express | Simple, fast API server |
| Database | MongoDB Atlas | Stores all applications |
| File Storage | Cloudinary | Stores uploaded pitch decks |
| Emails | Resend | Sends confirmation + alert emails |
| PDF | PDFKit | Generates confirmation + deal brief PDFs |
| Deployment | Vercel | Frontend live in one click |

---

## Project Structure

```
fsv-capital/
│
├── server/
│   ├── index.js                  ← Server entry point
│   ├── routes/
│   │   ├── applications.js       ← Submit, get all, get one
│   │   └── export.js             ← CSV download
│   ├── models/
│   │   └── Application.js        ← MongoDB schema
│   └── services/
│       ├── scoring.js            ← Score calculator
│       ├── pdfGenerator.js       ← PDF maker
│       ├── emailService.js       ← Email sender
│       └── cloudinary.js         ← File uploader
│
├── client/
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── LandingPage.jsx
│       │   ├── MultiStepForm.jsx
│       │   ├── SuccessPage.jsx
│       │   └── InvestorDashboard.jsx
│       └── steps/
│           ├── Step1_BasicInfo.jsx
│           ├── Step2_Overview.jsx
│           ├── Step3_Product.jsx
│           ├── Step4_Market.jsx
│           ├── Step5_Traction.jsx
│           ├── Step6_Financials.jsx
│           ├── Step7_Funding.jsx
│           ├── Step8_Team.jsx
│           ├── Step9_StrategicFit.jsx
│           ├── Step10_Documents.jsx
│           └── Step11_Compliance.jsx
│
├── package.json
└── .env
```

---

## API Endpoints

```
POST   /api/applications              Submit a new application
GET    /api/applications              Get all applications
GET    /api/applications/:id          Get one application
GET    /api/applications/:id/pdf/confirmation   Download confirmation PDF
GET    /api/applications/:id/pdf/brief          Download deal brief PDF
PATCH  /api/applications/:id/status   Update deal status
GET    /api/export/csv                Export all deals as CSV
```

---

## Pages

| Route | Who uses it | What they see |
|-------|-------------|---------------|
| `/` | Everyone | Landing page with Apply button |
| `/apply` | Founders | 11-step application form |
| `/success` | Founders | Confirmation + Application ID |
| `/dashboard` | Investors | All deals, scores, filters, export |

---

## Local Setup

**1. Clone the repo**
```bash
git clone https://github.com/ChaitanyaKrishna0101/deal-flow.git
cd deal-flow
```

**2. Install dependencies**
```bash
npm install
```

**3. Add environment variables**

Create a `.env` file:
```
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
FSV_ADMIN_EMAIL=admin@fsvcapital.com
PORT=3000
```

**4. Run the app**
```bash
npm run dev
```

Open `http://localhost:3000`

---

## What You Need Before Running

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — free account, get connection string
- [Cloudinary](https://cloudinary.com) — free account, get API credentials
- [Resend](https://resend.com) — free account, get API key

All three are free tiers. No credit card needed.

---

## What This Project Demonstrates

- Building a complete full-stack web application from scratch
- Handling file uploads (PDF storage with Cloudinary)
- Working with a real database (MongoDB)
- Building an admin dashboard with filters and export
- Automatic email triggers (Resend)
- PDF generation on the backend (PDFKit)
- Auto-scoring logic based on form data

---

## Status

| Feature | Status |
|---------|--------|
| Landing page | ✅ Done |
| 11-step form | ✅ Done |
| Screening filter | ✅ Done |
| Deal scoring | ✅ Done |
| MongoDB storage | ✅ Done |
| Cloudinary upload | ✅ Done |
| Email notifications | ✅ Done |
| PDF generation | ✅ Done |
| Investor dashboard | ✅ Done |
| CSV export | ✅ Done |
| Auth for dashboard | 🔜 Planned |

---

## Built By

**Chaitanya Krishna** — [GitHub](https://github.com/ChaitanyaKrishna0101)

Built as a real-world full-stack project for FSV Capital, an investment firm focused on DeepTech, Fintech, and frontier innovation.
