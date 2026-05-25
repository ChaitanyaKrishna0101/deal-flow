# FSV Capital — Complete Replit Build Prompt
## Copy this entire prompt and paste it into Replit AI Agent

---

## PROMPT START

Build a full-stack web application called **"FSV Capital — Startup Funding Application"** for a venture capital firm. This is a deal intake system where startup founders apply for funding and investors review applications on a dashboard.

---

## TECH STACK (all free, all runs on Replit)

- **Frontend**: React + Tailwind CSS (via CDN)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (free tier — I will provide the connection string)
- **File Upload**: Cloudinary (free tier — I will provide credentials)
- **Email**: Resend (free tier — I will provide API key)
- **PDF Generation**: PDFKit (npm package)
- **Deployment**: Replit (single deployment link)

Use a **monorepo structure** — both frontend and backend in one Replit project.

---

## PROJECT STRUCTURE

```
fsv-capital/
├── server/
│   ├── index.js              (Express entry point)
│   ├── routes/
│   │   ├── applications.js   (POST submit, GET all, GET by ID)
│   │   └── export.js         (GET CSV export)
│   ├── models/
│   │   └── Application.js    (Mongoose schema)
│   ├── services/
│   │   ├── scoring.js        (Deal score calculator)
│   │   ├── pdfGenerator.js   (Confirmation + deal brief PDFs)
│   │   ├── emailService.js   (Resend email triggers)
│   │   └── cloudinary.js     (File upload handler)
│   └── middleware/
│       └── upload.js         (Multer config for file handling)
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── MultiStepForm.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── SuccessPage.jsx
│   │   │   └── InvestorDashboard.jsx
│   │   └── steps/
│   │       ├── Step1_BasicInfo.jsx
│   │       ├── Step2_Overview.jsx
│   │       ├── Step3_Product.jsx
│   │       ├── Step4_Market.jsx
│   │       ├── Step5_Traction.jsx
│   │       ├── Step6_Financials.jsx
│   │       ├── Step7_Funding.jsx
│   │       ├── Step8_Team.jsx
│   │       ├── Step9_StrategicFit.jsx
│   │       ├── Step10_Documents.jsx
│   │       └── Step11_Compliance.jsx
├── package.json
└── .env
```

---

## DETAILED FEATURE REQUIREMENTS

### 1. LANDING PAGE (`LandingPage.jsx`)

Show a premium landing page with:
- FSV Capital logo (text-based, styled)
- Headline: "Capital Startup Funding Application"
- Subheadline: "Fueling DeepTech, Fintech & Future Innovation"
- Three benefit icons with text: "Structured Review", "Fast Screening", "Expert Mentorship"
- What to prepare section: Pitch Deck PDF, Financial projections, Team info
- Estimated time: 10 minutes
- Big CTA button: "Apply for Funding →"
- Small link at bottom: "Investor Login →" (goes to dashboard)

---

### 2. MULTI-STEP FORM (`MultiStepForm.jsx`)

- 11 steps total, one section per screen
- Progress bar at top showing current step (e.g. "Step 3 of 11")
- Step title displayed clearly
- "Next →" and "← Back" navigation buttons
- Save to localStorage on every step so data is not lost on refresh
- Validate required fields before allowing "Next"
- Show inline error messages in red under invalid fields
- On step 11 completion → show Review screen → then Submit

**Review Screen** (before final submit):
- Show all filled data grouped by section
- "Edit" button next to each section that jumps back to that step
- Consent checkbox (required)
- "Submit Application" button

---

### 3. FORM SECTIONS — All fields

**Step 1 — Basic Information**
- Startup Name (text, required)
- Website URL (url input)
- Founder Name(s) (text, required)
- Contact Email (email, required)
- Contact Number (tel)
- LinkedIn Profile — Founder (url)
- LinkedIn Profile — Company (url)
- Headquarters City (text)
- Headquarters Country (text)
- Year of Incorporation (number, 4 digits)

**Step 2 — Startup Overview**
- Problem Statement (textarea, required, min 50 chars)
- Solution Overview (textarea, required, min 50 chars)
- Industry/Sector (dropdown: Fintech, AI/ML, Blockchain, DeepTech, SaaS, HealthTech, EdTech, Other)
- Business Model (dropdown: B2B, B2C, B2B2C, Marketplace, SaaS, Other)
- Current Stage (radio: Idea, MVP, Early Revenue, Growth Stage, Scaling)

**Step 3 — Product & Technology**
- Core Product Description (textarea)
- Technology Stack (checkboxes: AI/ML, Blockchain, Cloud, APIs, Mobile, IoT, Other)
- Unique Value Proposition (textarea, required)
- IP/Patents — do you have any? (radio: Yes/No) — if Yes, show text field
- Demo Link (url)
- Product Video Link (url)

**Step 4 — Market Opportunity**
- TAM — Total Addressable Market (text, e.g. "$2 Billion")
- SAM — Serviceable Addressable Market (text)
- SOM — Serviceable Obtainable Market (text)
- Customer Segment (textarea)
- Key Competitors (textarea)
- Your Competitive Advantage (textarea)

**Step 5 — Traction & Metrics**
- Current Monthly Revenue (number, in USD)
- Current Annual Revenue (number, in USD)
- Growth Rate % (number)
- Number of Customers/Users (number)
- Key Partnerships (textarea)
- Notable Achievements/Awards (textarea)

**Step 6 — Financials**
- Funding Raised Till Date (number, in USD)
- Previous Investors (textarea)
- Monthly Burn Rate (number, in USD)
- Runway in Months (number)
- Revenue Projection Year 1 (number)
- Revenue Projection Year 2 (number)
- Revenue Projection Year 3 (number)

**Step 7 — Funding Requirement**
- Amount Raising (number, required)
- Currency (dropdown: USD, INR)
- Funding Stage (dropdown: Pre-seed, Seed, Series A, Series B, Growth)
- Equity Offered % (number, 0–100)
- Use of Funds (checkboxes: Product Development, Go-to-Market, Hiring, Expansion, R&D, Operations)
- Use of Funds detail (textarea)

**Step 8 — Team**
- Founder Background — Education (textarea)
- Founder Background — Work Experience (textarea)
- Number of Core Team Members (number)
- Core Team Members (dynamic list — add up to 5 members, each with: Name, Role, LinkedIn)
- Advisors/Mentors (textarea)

**Step 9 — Strategic Fit**
- Why FSV Capital? (textarea, required, min 100 chars)
- How can FSV Capital add value beyond funding? (textarea)
- Open to mentorship/cohort programs? (radio: Yes / No)

**Step 10 — Documents Upload**
- Pitch Deck PDF (file upload, PDF only, required, max 10MB)
- Financial Model (file upload, PDF/Excel, optional)
- Product Screenshots (file upload, images, optional, up to 3)
- Additional Documents (file upload, optional)

**Step 11 — Compliance**
- Is company registered? (radio: Yes / No)
- Any legal issues? (radio: Yes / No) — if Yes, show explanation textarea
- Consent to share data with FSV Capital partners (checkbox, required)
- Privacy policy link shown (dummy link ok)

---

### 4. SCREENING FILTER (run before API call)

Before submitting to backend, run these checks on the frontend:

```javascript
function screenApplication(data) {
  const allowedSectors = ['Fintech', 'AI/ML', 'Blockchain', 'DeepTech', 'SaaS'];
  const minFundingUSD = 50000;
  const maxFundingUSD = 10000000;

  if (!allowedSectors.includes(data.sector)) {
    return { passed: false, reason: "We currently focus on Fintech, AI, Blockchain, DeepTech, and SaaS." };
  }
  if (data.stage === 'Idea' && data.monthlyRevenue > 0) {
    return { passed: false, reason: "Stage and revenue data appears inconsistent." };
  }
  if (data.amountRaising < minFundingUSD || data.amountRaising > maxFundingUSD) {
    return { passed: false, reason: "Funding ask is outside our current investment range ($50K–$10M)." };
  }
  return { passed: true };
}
```

If screening fails → show a polite rejection page with reason. Do NOT submit to backend.

---

### 5. BACKEND API (`server/index.js`)

**Endpoints:**

```
POST /api/applications          — Submit new application
GET  /api/applications          — Get all applications (investor dashboard)
GET  /api/applications/:id      — Get single application detail
GET  /api/applications/:id/pdf/confirmation  — Download confirmation PDF
GET  /api/applications/:id/pdf/brief         — Download deal brief PDF
GET  /api/export/csv            — Export all applications as CSV
```

**POST /api/applications flow:**
1. Receive multipart form data (fields + files)
2. Upload files to Cloudinary, get back URLs
3. Run scoring engine on the data
4. Save full application + score + cloudinary URLs to MongoDB
5. Send confirmation email to founder (Resend)
6. Send alert email to FSV team (Resend)
7. Return: `{ success: true, applicationId, score, confirmationPdfUrl }`

---

### 6. MONGODB SCHEMA (`models/Application.js`)

```javascript
const ApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, unique: true },  // auto-generated: FSV-2026-XXXXX
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Under Review', enum: ['Under Review', 'Shortlisted', 'Rejected', 'Funded'] },

  // Section 1
  startupName: String,
  websiteUrl: String,
  founderNames: String,
  contactEmail: String,
  contactNumber: String,
  linkedinFounder: String,
  linkedinCompany: String,
  headquarters: String,
  yearOfIncorporation: Number,

  // Section 2
  problemStatement: String,
  solutionOverview: String,
  sector: String,
  businessModel: String,
  stage: String,

  // Section 3
  coreProduct: String,
  techStack: [String],
  usp: String,
  hasPatents: Boolean,
  patentDetails: String,
  demoLink: String,

  // Section 4
  tam: String,
  sam: String,
  som: String,
  customerSegment: String,
  competitors: String,
  competitiveAdvantage: String,

  // Section 5
  monthlyRevenue: Number,
  annualRevenue: Number,
  growthRate: Number,
  customerCount: Number,
  partnerships: String,
  achievements: String,

  // Section 6
  fundingRaised: Number,
  previousInvestors: String,
  burnRate: Number,
  runway: Number,
  projectionY1: Number,
  projectionY2: Number,
  projectionY3: Number,

  // Section 7
  amountRaising: Number,
  currency: String,
  fundingStage: String,
  equityOffered: Number,
  useOfFunds: [String],
  useOfFundsDetail: String,

  // Section 8
  founderEducation: String,
  founderExperience: String,
  teamSize: Number,
  coreTeam: [{ name: String, role: String, linkedin: String }],
  advisors: String,

  // Section 9
  whyFSV: String,
  fsvValueAdd: String,
  openToMentorship: Boolean,

  // Section 10 — Cloudinary URLs
  pitchDeckUrl: String,
  financialModelUrl: String,
  screenshotUrls: [String],

  // Section 11
  isRegistered: Boolean,
  hasLegalIssues: Boolean,
  legalExplanation: String,
  consentGiven: Boolean,

  // Computed
  dealScore: Number,
  scoreBreakdown: {
    marketSize: Number,
    revenueStage: Number,
    teamStrength: Number,
    traction: Number,
    innovation: Number
  }
}, { timestamps: true });
```

---

### 7. SCORING ENGINE (`services/scoring.js`)

```javascript
function calculateDealScore(data) {
  let score = 0;
  const breakdown = {};

  // Market size (max 25)
  const tamStr = (data.tam || '').toLowerCase();
  if (tamStr.includes('billion') || tamStr.includes('$1b') || tamStr.includes('$2b')) {
    breakdown.marketSize = 25;
  } else if (tamStr.includes('million') && parseInt(tamStr) > 500) {
    breakdown.marketSize = 18;
  } else if (tamStr.includes('million')) {
    breakdown.marketSize = 10;
  } else {
    breakdown.marketSize = 5;
  }

  // Revenue stage (max 25)
  const stageMap = { 'Scaling': 25, 'Growth Stage': 20, 'Early Revenue': 15, 'MVP': 8, 'Idea': 2 };
  breakdown.revenueStage = stageMap[data.stage] || 0;

  // Team strength (max 20)
  let teamScore = 0;
  if (data.teamSize >= 3) teamScore += 8;
  else if (data.teamSize >= 2) teamScore += 5;
  if (data.advisors && data.advisors.length > 10) teamScore += 6;
  if (data.founderExperience && data.founderExperience.length > 50) teamScore += 6;
  breakdown.teamStrength = Math.min(teamScore, 20);

  // Traction (max 20)
  let tractionScore = 0;
  if (data.monthlyRevenue > 50000) tractionScore += 10;
  else if (data.monthlyRevenue > 10000) tractionScore += 7;
  else if (data.monthlyRevenue > 0) tractionScore += 4;
  if (data.customerCount > 500) tractionScore += 5;
  else if (data.customerCount > 100) tractionScore += 3;
  if (data.growthRate > 30) tractionScore += 5;
  else if (data.growthRate > 15) tractionScore += 3;
  breakdown.traction = Math.min(tractionScore, 20);

  // Innovation (max 10)
  let innovScore = 0;
  if (data.hasPatents) innovScore += 5;
  if (['AI/ML', 'Blockchain', 'DeepTech'].includes(data.sector)) innovScore += 5;
  breakdown.innovation = Math.min(innovScore, 10);

  score = breakdown.marketSize + breakdown.revenueStage + breakdown.teamStrength + breakdown.traction + breakdown.innovation;

  return { dealScore: Math.min(score, 100), scoreBreakdown: breakdown };
}

module.exports = { calculateDealScore };
```

---

### 8. PDF GENERATION (`services/pdfGenerator.js`)

Use **PDFKit** npm package.

**Confirmation PDF** (for founder) — generate and return as buffer:
```
FSV CAPITAL
━━━━━━━━━━━━━━━━━━━━━━━━━

APPLICATION RECEIVED

Application ID:    FSV-2026-XXXXX
Submitted:         [date]

STARTUP DETAILS
Name:              [startupName]
Sector:            [sector]
Stage:             [stage]
Funding Ask:       [amountRaising] [currency]
Headquarters:      [headquarters]

FOUNDER
Name:              [founderNames]
Email:             [contactEmail]

WHAT HAPPENS NEXT
→ Our team reviews your application within 5–7 business days
→ Shortlisted startups will be contacted for a call
→ Questions: contact@fsvcapital.com

━━━━━━━━━━━━━━━━━━━━━━━━━
FSV Capital | Fueling DeepTech, Fintech & Future Innovation
```

**Deal Brief PDF** (for investor) — generate and return as buffer:
```
FSV CAPITAL — DEAL BRIEF
━━━━━━━━━━━━━━━━━━━━━━━━━

[startupName]                          DEAL SCORE: [score]/100

Sector: [sector]   Stage: [stage]   Ask: [amount]   Equity: [equity]%

PROBLEM
[problemStatement — first 200 chars]

SOLUTION
[solutionOverview — first 200 chars]

MARKET
TAM: [tam]   SAM: [sam]   SOM: [som]

TRACTION
Revenue: $[monthlyRevenue]/mo   Customers: [customerCount]   Growth: [growthRate]%/mo

TEAM
[founderNames] — [founderExperience — first 100 chars]
Team size: [teamSize]

SCORE BREAKDOWN
Market size       [marketSize]/25
Revenue stage     [revenueStage]/25
Team strength     [teamStrength]/20
Traction          [traction]/20
Innovation        [innovation]/10

Pitch Deck: [pitchDeckUrl]
Demo: [demoLink]

━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: [date]   ID: [applicationId]
FSV Capital — Confidential
```

---

### 9. EMAIL SERVICE (`services/emailService.js`)

Use **Resend** npm package.

**Email 1 — Founder Confirmation:**
- To: founder's email
- Subject: "Application Received — FSV Capital [ApplicationID]"
- Body: HTML email with application ID, startup name, next steps, contact info

**Email 2 — Internal Alert to FSV Team:**
- To: admin@fsvcapital.com (hardcode this for now)
- Subject: "New Application: [startupName] — Score: [score]/100"
- Body: HTML email with key metrics — startup name, sector, stage, funding ask, deal score, link to dashboard

---

### 10. INVESTOR DASHBOARD (`InvestorDashboard.jsx`)

Accessed via `/dashboard` route. No login required for prototype (add a note: "Login to be added in production").

**Dashboard shows:**
- Header: "FSV Capital — Deal Pipeline"
- Stats row at top: Total Applications | Average Score | Shortlisted | This Month
- Filter bar: by Sector dropdown, by Stage dropdown, by Score range slider
- Sort by: Score (default), Date, Funding Ask
- Deal cards list — each card shows:
  - Startup name + sector badge
  - Stage badge (color-coded: Idea=gray, MVP=blue, Early Revenue=green, Growth=teal, Scaling=purple)
  - Deal Score as a circular score badge (color: <40 red, 40-65 amber, 65+ green)
  - Funding ask
  - Submitted date
  - Status dropdown (Under Review / Shortlisted / Rejected / Funded)
  - "View Details →" button
  - "Download Brief PDF" button

**Deal Detail Modal** (opens on "View Details"):
- All 11 sections displayed cleanly
- Score breakdown bar chart (simple CSS bars)
- Pitch deck link (opens in new tab)
- Status update dropdown
- "Download Brief PDF" button
- "Close" button

**Export button** at top right: "Export CSV" — downloads all deals as CSV

---

### 11. SUCCESS PAGE (`SuccessPage.jsx`)

After successful submission:
- Large checkmark icon
- "Application Submitted Successfully!"
- Application ID displayed prominently
- Deal score shown (or say "Score calculated internally")
- "Download Confirmation PDF" button (calls GET /api/applications/:id/pdf/confirmation)
- Timeline: "What happens next" with 3 steps
- "Return to Home" button

---

### 12. UI DESIGN REQUIREMENTS

**Color palette (use CSS variables):**
```css
:root {
  --primary: #0A0A0A;
  --accent: #6366F1;        /* indigo */
  --accent-light: #EEF2FF;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --bg: #FAFAFA;
  --surface: #FFFFFF;
  --border: #E5E7EB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
}
```

**Typography:**
- Use Google Fonts: `Instrument Serif` for headings + `Inter` for body (import in index.html)
- Headings: Instrument Serif, dark, clean
- Body: Inter, 15px, regular

**Form design rules:**
- White card container with subtle shadow for each form step
- Input fields: full width, 44px height, 1px border, rounded-lg, focus ring in accent color
- Labels above inputs, 13px, medium weight, text-secondary color
- Required fields marked with a small red asterisk
- Error messages: 12px, red, below the field
- Next/Back buttons: Next is solid accent color, Back is ghost/outline
- Progress bar: thin, accent color, animated fill

**Dashboard design rules:**
- Clean white background
- Stat cards: light gray background, large number, small label
- Deal cards: white with border, hover shadow
- Score badge: circular, 48px, colored by score range
- Sector badges: pill shape, colored by sector type
- Status dropdown: inline, minimal styling

**General rules:**
- No dark backgrounds (keep it clean and light)
- Generous padding and whitespace
- Consistent 8px border radius everywhere
- Subtle shadows only (no heavy drop shadows)
- Mobile responsive — stack columns on small screens

---

### 13. ENVIRONMENT VARIABLES (`.env`)

```
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_api_key
FSV_ADMIN_EMAIL=admin@fsvcapital.com
PORT=3000
```

---

### 14. PACKAGE.JSON

```json
{
  "name": "fsv-capital-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.0",
    "multer": "^1.4.5",
    "cloudinary": "^1.41.0",
    "pdfkit": "^0.14.0",
    "resend": "^2.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "json2csv": "^6.0.0-alpha.2"
  }
}
```

React + Tailwind run via CDN in `client/index.html` — no build step needed. Use Babel standalone for JSX transpilation in browser so Replit can serve it directly without webpack or vite.

---

### 15. REPLIT SETUP INSTRUCTIONS

In `.replit` file:
```
run = "npm start"
```

Serve the React frontend as static files from Express:
```javascript
app.use(express.static('client'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});
```

This way one Replit deployment URL serves both the form (founder) and the dashboard (investor).

Routes:
- `/` → Landing page
- `/apply` → Multi-step form
- `/dashboard` → Investor dashboard
- `/api/*` → Backend API

---

### 16. WHAT THE DEMO SHOWS

When the Replit link is opened:
1. **Landing page** loads first — premium design, "Apply for Funding" CTA
2. Founder clicks → fills form step by step (progress bar visible)
3. Uploads pitch deck PDF on step 10
4. Reviews all data on review screen → submits
5. Success page shows with Application ID + download PDF button
6. Investor goes to `/dashboard` → sees the submission as a deal card with score
7. Clicks "View Details" → sees full breakdown
8. Clicks "Export CSV" → downloads all deals

---

## IMPORTANT BUILD NOTES

- Keep all files small and focused — one responsibility per file
- Add comments at the top of each file explaining what it does
- Use async/await throughout, no callbacks
- Wrap all API calls in try/catch with proper error responses
- Return clear JSON errors: `{ success: false, error: "message" }`
- Test with dummy data first before wiring real env vars
- The scoring engine runs on the backend, not frontend
- localStorage save/restore on form must work on browser refresh

## PROMPT END
