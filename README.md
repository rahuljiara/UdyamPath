# UdyamPath (उद्यमपथ)
> **From Campus to Career** — A modern, Tier-1 College Placement Operating System.

---

## 1. Project Overview

**UdyamPath** bridges education and employment for universities, colleges, students, and recruiters. The name draws from the Sanskrit root *Udyam* (उद्यम: effort, initiative, purposeful action) and *Path* (journey, trajectory).

The core philosophy:
$$\text{Effort} \longrightarrow \text{Direction} \longrightarrow \text{Opportunity} \longrightarrow \text{Career}$$

UdyamPath replaces fragmented spreadsheets, documents, emails, and manual tracking with a centralized, data-dense, real-time placement management platform.

---

## 2. Key Features

- **TPO Dashboard**: Real-time KPI cards, monthly placement velocity charts, recruitment funnel, active drives tracker, and upcoming interview schedules.
- **Student Profile & Portfolio Management**: Academic information, verified CGPA, backlogs, skills, verified links (GitHub, LinkedIn, Resume), and stage-by-stage application tracking.
- **Company & Recruiter Relations**: Tiered company directories, contact coordination, past placement records, and active job postings.
- **Placement Drive Lifecycle**: Custom eligibility filters (CGPA, backlogs, branches, batches), multiple assessment rounds, automated shortlisting, and candidate tracking.
- **Interview & Assessment Scheduler**: Calendar-friendly scheduling for online/offline rounds with interviewer assignment and feedback logging.
- **Offer & Placement Tracking**: CTC breakups, offer letter distribution, acceptance tracking, and university accreditation reports (NIRF/NAAC compliant).

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla Tailwind CSS v3 with customized SaaS design tokens
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios (API-ready architecture)

### Backend (Phase 5+)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & bcryptjs
- **Security**: Helmet, CORS, Rate Limiting, Input Validation

---

## 4. Design System & Palette

| Token | Hex | Usage |
|---|---|---|
| **Primary** | `#2F8F78` | Key CTAs, active navigation, selected states |
| **Primary Hover** | `#24715F` | Button & link hover states |
| **Primary Soft** | `#E8F5F1` | Subtle badges, active link backgrounds |
| **Background** | `#F8FAFC` | App background |
| **Surface** | `#FFFFFF` | Cards, modals, tables |
| **Text Primary** | `#0F172A` | High-contrast headings & data |
| **Text Muted** | `#64748B` | Secondary labels & timestamps |
| **Border** | `#E2E8F0` | Subtle clean card and table dividers |

---

## 5. Folder Structure

```
project/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/         # StatCard, Table, Badge, Button, Avatar, Modal, etc.
│   │   │   ├── layout/         # AppLayout, Sidebar, Header
│   │   │   ├── dashboard/      # Placement charts, funnel, live drives, interviews
│   │   │   ├── students/       # Student management components
│   │   │   ├── companies/      # Company directories & profiles
│   │   │   ├── drives/         # Placement drive workflows
│   │   │   └── applications/   # Application stage trackers
│   │   ├── pages/              # Route page containers
│   │   ├── routes/             # paths.js & AppRoutes.jsx
│   │   ├── services/           # API-ready service layer (mock -> Express)
│   │   ├── data/               # Realistic Indian college mock JSON datasets
│   │   ├── utils/              # Formatting & helper utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Backend API (Node/Express/Mongo)
├── .gitignore
├── README.md
└── package.json
```

---

## 6. Getting Started

### Prerequisites
- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later)

### Installation

1. **Clone and Install Root Dependencies**:
   ```bash
   npm install
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MONGO_URI and JWT_SECRET
   ```

4. **Seed MongoDB with Demo Placement Data**:
   ```bash
   npm run seed
   ```

5. **Start Backend Server**:
   ```bash
   npm run server
   ```

---

## 7. Backend Architecture & Credentials

### Environment Variables (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/udyampath
JWT_SECRET=udyampath_jwt_secret_super_secure_key_2025
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Pre-configured Demo Accounts
| Role | Email | Password | Access Level |
|---|---|---|---|
| **ADMIN / TPO** | `admin@udyampath.com` / `tpo.director@college.edu.in` | `password123` | Institute-wide management |
| **HOD** | `hod.cse@college.edu.in` | `password123` | Department candidate review & analytics |
| **STUDENT** | `rahul.sharma21@college.edu.in` | `password123` | Profile, drive eligibility & applications |
| **RECRUITER** | `recruiter@microsoft.com` | `password123` | Drive postings & applicant shortlisting |

### Database Models
- `User` — Authentication, role authorization, and persona profile
- `Department` — Branches, branch codes, HOD references, and intake counts
- `Student` — Academic credentials, CGPA, backlogs, skills, and portfolio
- `Company` — Tiered recruiter directories, contacts, and hiring track records
- `PlacementDrive` — Recruitment postings, strict eligibility criteria, and selection rounds
- `Application` — Compound unique `{ student, drive }` candidate workflows
- `Interview` — Online/Offline interview round scheduler and panel feedback
- `Offer` — CTC packages, breakups, offer letters, and acceptance states
- `Placement` — Final confirmed placement records with NIRF/NAAC reporting compliance

---

## 8. Development Roadmap

- [x] **Phase 1**: Design System, AppLayout, Sidebar, Header, Common UI Components, API-Ready Services, and Main TPO Dashboard.
- [x] **Phase 2**: Frontend Students, Companies, Placement Drives, Applications, Interviews, Offers, and Analytics Views.
- [x] **Phase 3**: Node.js + Express.js + MongoDB backend foundation with Helmet, CORS, and centralized error handling.
- [x] **Phase 4**: Mongoose Models with compound unique indexes and validations.
- [x] **Phase 5**: JWT Authentication, bcryptjs hashing, auth middleware, and role-based access control (`ADMIN`, `TPO`, `HOD`, `STUDENT`, `RECRUITER`).
- [x] **Phase 6**: Complete REST API Controllers & Routes for Students, Companies, Departments, Drives, Applications, Interviews, Offers, Placements, Analytics, and Reports.
- [x] **Phase 7**: Automated database seeding script (`npm run seed`) mapping frontend datasets into relational MongoDB collections.
- [x] **Phase 8**: Production-ready API documentation (`API.md`).
