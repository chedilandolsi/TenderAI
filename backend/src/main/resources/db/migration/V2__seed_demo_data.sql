-- V2__seed_demo_data.sql
-- Seed initial European agency profile and demo data

INSERT INTO users (id, email, password_hash, full_name, subscription_tier, stripe_customer_id, created_at, updated_at)
VALUES (
    1,
    'demo@tenderai.eu',
    '$2a$10$e88yL2XG7yV6F.E0zX2FvO4g3XQzWc8vW5xP.K.z51rV0jVz4fU6S', -- Password123!
    'Jean-Luc Moreau',
    'PRO',
    'cus_test_tenderai_demo',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

INSERT INTO company_profiles (id, user_id, agency_name, tagline, website, core_competencies, team_bios, case_studies, updated_at)
VALUES (
    1,
    1,
    'Aethelgard Digital Europe',
    'Architects of sovereign European public sector digital infrastructure',
    'https://aethelgard.eu',
    'Enterprise Cloud Architecture (EU Sovereign Cloud, Gaia-X), Open Source Modernization, GDPR & NIS2 Compliance Security Audits, Public Sector Procurement Compliance, AI-Assisted Citizen Portals',
    'Dr. Elena Vance (Head of Enterprise Architecture, 15+ yrs European Commission digital projects); Marc Dubois (Chief Security Officer, CISSP, NIS2 lead auditor); Sophia Lindqvist (Public Sector Delivery Director, former advisor to Nordic Digital Council).',
    '[
        {
            "id": "cs-1",
            "title": "Digital Identity & Sovereign Citizen Portal for Wallonia Region",
            "client": "Public Service of Wallonia (SPW), Belgium",
            "budget": "€1,850,000",
            "duration": "14 months",
            "summary": "Engineered eIDAS-compliant citizen verification and automated social assistance claim verification. Handled over 1.2M citizens with 99.98% uptime and zero GDPR data leaks.",
            "technologies": ["Angular", "Spring Boot", "OpenID Connect / eIDAS", "PostgreSQL", "Kubernetes"]
        },
        {
            "id": "cs-2",
            "title": "Cross-Border Healthcare Data Exchange Framework",
            "client": "DG SANTE, European Commission",
            "budget": "€2,400,000",
            "duration": "18 months",
            "summary": "Designed interoperable FHIR-based patient summary exchange protocol between healthcare providers across 6 EU member states, complying with EHDS (European Health Data Space).",
            "technologies": ["HL7 FHIR", "Java 17", "Spring Cloud", "Keycloak", "Terraform"]
        },
        {
            "id": "cs-3",
            "title": "Public Procurement AI Compliance Screener",
            "client": "Federal Ministry of Digitalization, Austria",
            "budget": "€950,000",
            "duration": "9 months",
            "summary": "Built automated RFP audit pipeline scanning vendor submissions against European public procurement directives (Directive 2014/24/EU) and green procurement mandates.",
            "technologies": ["Spring AI", "Python FastApi", "PostgreSQL", "Docker", "Angular"]
        }
    ]',
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

INSERT INTO proposals (id, user_id, tender_title, client_name, country, submission_deadline, raw_tender_text, generated_content, status, selected_case_studies, created_at, updated_at)
VALUES (
    1,
    1,
    'TED Tender 2026/S 045-102938: Modernization of Pan-European Maritime Logistics Platform',
    'European Maritime Safety Agency (EMSA)',
    'Portugal / EU',
    '2026-11-30',
    'EMSA invites tenders for technical architecture, cybersecurity hardening, and full-stack cloud application delivery for the next-generation SafeSeaNet maritime surveillance portal. Requirements include strict adherence to EU sovereign hosting, GDPR, ISO 27001, and 24/7 high-availability operational SLAs.',
    '{
        "executiveSummary": "Aethelgard Digital Europe is pleased to submit this comprehensive commercial and technical proposal to the European Maritime Safety Agency (EMSA). As a pan-European digital engineering consultancy with verified track records in EU institution deliveries (DG SANTE, Wallonia Region, Austrian Federal Ministries), our proposed consortium guarantees sovereign, NIS2-compliant platform modernization for SafeSeaNet with zero vendor lock-in.",
        "proposedMethodology": "Our delivery framework is structured around the EU PM² project management methodology combined with Agile Scrum sprints. Phase 1 (Months 1-3): Architecture Discovery & Sovereign Cloud Security Hardening. Phase 2 (Months 4-10): Microservices Migration & Maritime Data Pipeline Streamlining. Phase 3 (Months 11-14): eIDAS Single Sign-On Integration, User Acceptance Testing, and Disaster Recovery Simulation.",
        "teamQualifications": "Led by Dr. Elena Vance (Lead Architect, ex-EC digital advisor) and Marc Dubois (CISSP Security Lead), our dedicated squad consists of 8 senior European cloud engineers with EU Security Clearance. Combined, our key personnel have delivered 14 institutional procurement projects on time and within budget.",
        "timeline": "Milestone M1 (Month 2): Architecture Blueprint & Security Baseline. Milestone M2 (Month 6): Alpha Release of Maritime Stream Processor. Milestone M3 (Month 10): Beta Integration & Security Penetration Testing. Milestone M4 (Month 14): Production Cutover, EMSA Staff Knowledge Transfer, and 24/7 Warranty Period.",
        "pricingStructure": "Total Firm-Fixed Price: €1,480,000 EUR (excl. VAT). Breakdown: Discovery & Architecture (€210,000), Core Development & Security Hardening (€860,000), Quality Assurance & Penetration Testing (€230,000), EMSA Training & Handover (€180,000). Optional SLA Tier 1 Maintenance: €12,500/month.",
        "complianceAndStandards": "Full compliance with Directive 2014/24/EU, GDPR Article 32 security measures, NIS2 Directive standards, ISO/IEC 27001, and WCAG 2.1 AA accessibility standards for public portals."
    }',
    'COMPLETED',
    '["cs-1", "cs-2"]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Reset sequence values
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('company_profiles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM company_profiles));
SELECT setval('proposals_id_seq', (SELECT COALESCE(MAX(id), 1) FROM proposals));
