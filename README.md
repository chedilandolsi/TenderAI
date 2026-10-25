# TenderAI — Automated European Tender & Commercial Proposal Generator

[![Backend CI](https://github.com/tenderai/tenderai/actions/workflows/deploy.yml/badge.svg)](https://github.com/tenderai/tenderai/actions/workflows/deploy.yml)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17%20Standalone-red.svg)](https://angular.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Executive%20Design-blue.svg)](https://tailwindcss.com)
[![European Standards](https://img.shields.io/badge/Compliance-Directive%202014%2F24%2FEU%20%7C%20NIS2%20%7C%20GDPR-indigo.svg)](https://european-union.europa.eu)

**TenderAI** is a SaaS web application built for European digital agencies, IT consultancies, and bid directors competing for EU institutional tenders (TED / Tenders Electronic Daily notices, European Commission DG DIGIT, national ministries, and regional public sector authorities).

---

## 🏛️ Executive Features & Capabilities

- **Executive UI/UX Aesthetic**: Clean, minimalist design inspired by Stripe and Linear with an executive slate palette, deep indigo accents, Inter typography, collapsible sidebar, and micro-interactions.
- **Apache PDFBox Document Parser**: Extracts tender scopes, technical criteria, and administrative conditions directly from uploaded procurement PDFs.
- **Spring AI Proposal Generation**: Structured prompt architecture integrating agency profile competencies, verified case studies, and tender specifications into a formal commercial proposal:
  1. *Executive Summary & Value Proposition*
  2. *Proposed Methodology & Work Packages (EU PM² & Agile)*
  3. *Team Qualifications & Key Personnel (EU Security Clearance)*
  4. *Implementation Timeline & Milestones (M1 to Mn)*
  5. *Commercial Offer & Firm-Fixed EUR Pricing Structure*
  6. *European Standards (Directive 2014/24/EU, GDPR Article 32, NIS2, ISO 27001, WCAG 2.1 AA)*
- **Interactive Proposal Editor**: Tabbed live editor with real-time draft updates.
- **Official Exports**:
  - **Export to PDF** (OpenPDF with executive layout, headers, dividers, and typography).
  - **Export to Word (.docx)** (Apache POI styled document for final commercial submission).
- **Stripe Billing Integration**:
  - **Free Starter**: €0/mo (3 proposals, community support).
  - **Pro Agency**: €49/mo (Unlimited proposals, PDFBox parser, PDF/DOCX downloads, 10 case study profiles).
  - **Enterprise Agency**: €149/mo (Consortium team seats, custom procurement bid templates, advisor hotline).
  - Webhook listener handling `checkout.session.completed` and subscription lifecycle events.
- **PostgreSQL & Flyway Migrations**: Clean versioned SQL migrations (`V1__init_schema.sql`, `V2__seed_demo_data.sql`).

---

## 🚀 Quickstart & Local Setup

### 1. Run with Docker Compose (Recommended)

Start the entire stack (PostgreSQL database, Spring Boot backend, and Angular frontend):

```bash
docker compose up --build
```

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

---

### 2. Run Manually (Local Development)

#### Backend (Spring Boot 3.2 + Java 17)
```bash
cd backend
mvn clean spring-boot:run
```
*(By default, connects to local PostgreSQL on port 5432 or can be launched with `-Dspring-boot.run.profiles=dev-h2` for zero-configuration in-memory H2).*

#### Frontend (Angular 17 + Tailwind CSS)
```bash
cd frontend
npm install
npm start
```
The Angular development server starts at `http://localhost:4200` with automated proxy forwarding of all `/api/**` calls to `http://localhost:8080`.

---

## 🔑 Demo Account Credentials

A verified European digital agency profile and sample proposals are pre-seeded in the database:

- **Email**: `demo@tenderai.eu`
- **Password**: `Password123!`
- *(Or click the **"Fill Demo"** button on the login screen for instant 1-click access)*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new agency account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET`  | `/api/auth/me` | Fetch authenticated user info |
| `GET`  | `/api/profile` | Retrieve agency profile & verified case studies |
| `PUT`  | `/api/profile` | Update agency core competencies & team bios |
| `POST` | `/api/profile/case-studies` | Add a past performance record |
| `DELETE`| `/api/profile/case-studies/{id}` | Delete a case study |
| `POST` | `/api/proposals/parse-pdf` | Parse uploaded PDF using Apache PDFBox |
| `POST` | `/api/proposals/generate` | Generate structured proposal with AI |
| `GET`  | `/api/proposals` | List all user proposals |
| `GET`  | `/api/proposals/{id}` | Retrieve proposal by ID |
| `PUT`  | `/api/proposals/{id}` | Update proposal content in interactive editor |
| `DELETE`| `/api/proposals/{id}` | Delete proposal |
| `GET`  | `/api/proposals/{id}/export/pdf` | Download official formatted PDF |
| `GET`  | `/api/proposals/{id}/export/docx` | Download official Word document (.docx) |
| `GET`  | `/api/proposals/stats` | Dashboard KPIs (counts, active tier) |
| `POST` | `/api/billing/checkout` | Create Stripe checkout session for €49/€149 |
| `POST` | `/api/billing/webhook` | Stripe webhook listener |
| `POST` | `/api/billing/simulate-upgrade` | Instant tier upgrade simulation for demos |

---

## 🚢 CI/CD & Deployment Configuration

- **Vercel (`vercel.json`)**: Configured for Angular SPA routing, API rewrites, and security headers.
- **Render (`backend/Dockerfile`)**: Containerized JVM runtime with multi-stage builds.
- **GitHub Actions (`.github/workflows/deploy.yml`)**: Automated CI pipeline running Maven unit tests, building the Angular bundle, and deploying to Render & Vercel on push to `main`.
