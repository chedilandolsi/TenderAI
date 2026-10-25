import { Injectable, signal, computed } from '@angular/core';

export type LanguageCode = 'en' | 'fr' | 'de' | 'es' | 'it';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

export const DEFAULT_EN_TRANSLATIONS: Record<string, any> = {
  brand: {
    name: "TenderAI",
    tagline: "EU Procurement AI",
    compliance: "EU Sovereign Compliance",
    complianceDesc: "Strict alignment with Directive 2014/24/EU, NIS2, and GDPR Art. 32."
  },
  nav: {
    dashboard: "Dashboard",
    wizard: "Proposal Wizard",
    newProposal: "New AI Proposal",
    allProposals: "All Proposals",
    agencyProfile: "Agency & Case Studies",
    billing: "Billing & Tiers",
    signOut: "Sign out",
    plan: "Plan"
  },
  dashboard: {
    badge: "EU Procurement AI Active",
    heroTitle: "Pan-European Tender Intelligence",
    heroSubtitle: "Generate fully compliant, winning public procurement bids adhering to Directive 2014/24/EU, EU PM² methodology, and sovereign cybersecurity standards.",
    launchWizard: "Launch Wizard",
    totalProposals: "Total Proposals",
    totalProposalsSub: "Generated tender bids",
    completedOffers: "Completed Offers",
    completedOffersSub: "Ready for submission",
    verifiedCaseStudies: "Verified Case Studies",
    verifiedCaseStudiesSub: "Institutional track records",
    subscriptionTier: "Subscription Tier",
    subscriptionTierSub: "Unlimited tender exports",
    recentProposals: "Recent Tender Proposals",
    recentProposalsSub: "All submissions generated across European institutions",
    viewAll: "View All",
    noProposals: "No proposals generated yet",
    noProposalsSub: "Upload your first European tender PDF or RFP notice to generate an automated commercial proposal.",
    startWizard: "Start Proposal Wizard",
    editOffer: "Edit Offer",
    client: "Client",
    region: "Region",
    exportPdf: "Export PDF"
  },
  status: {
    DRAFT: "Draft",
    GENERATING: "Generating",
    COMPLETED: "Ready",
    SUBMITTED: "Submitted",
    AWARDED: "Awarded"
  },
  profile: {
    title: "Agency Profile & Track Records",
    subtitle: "Context used by TenderAI to tailor technical qualifications and commercial proposals",
    saveBtn: "Save Profile",
    saving: "Saving Changes...",
    saveSuccess: "Agency profile and case studies updated successfully.",
    coreTitle: "Core Agency Credentials",
    agencyName: "Agency / Company Name",
    agencyNamePlaceholder: "e.g. Nordic Sovereign Consulting A/S",
    website: "Website URL",
    websitePlaceholder: "https://agency.eu",
    tagline: "Executive Tagline / Value Proposition",
    taglinePlaceholder: "e.g. Architects of sovereign European public sector digital infrastructure",
    coreCompetencies: "Core Competencies & Institutional Specialties",
    coreCompetenciesPlaceholder: "e.g. Gaia-X sovereign cloud, eIDAS verification, NIS2 compliance, Spring Boot & Angular architecture...",
    teamBios: "Key Personnel & Team Qualifications",
    teamBiosPlaceholder: "e.g. Dr. Elena Vance (Lead Architect, 15 yrs EC advisory); Marc Dubois (CISSP Security Auditor)...",
    caseStudiesTitle: "Verified Past Performance (Case Studies)",
    caseStudiesSubtitle: "Selected during tender proposal generation to prove technical capacity",
    addCaseStudy: "Add Case Study",
    noCaseStudies: "No case studies added yet. Add past institutional projects to strengthen your tender qualification score.",
    modalTitle: "New Institutional Case Study",
    projectTitle: "Project Title",
    projectTitlePlaceholder: "e.g. Cloud Transformation for European Health Agency",
    clientName: "Client / Contracting Authority",
    clientNamePlaceholder: "e.g. European Medicines Agency (EMA)",
    contractValue: "Contract Value",
    contractValuePlaceholder: "e.g. €1,250,000",
    year: "Year of Execution",
    yearPlaceholder: "e.g. 2023",
    description: "Project Overview & Institutional Scope",
    descriptionPlaceholder: "Detail the project scope, technical context, and client objectives...",
    outcomes: "Key Deliverables & Documented Impact",
    outcomesPlaceholder: "e.g. 99.99% uptime achieved, NIS2 audit passed without findings...",
    technologies: "Technologies & Standards Applied",
    technologiesPlaceholder: "e.g. Spring Boot, PostgreSQL, Docker, OpenID Connect",
    cancel: "Cancel",
    saveCaseStudy: "Save Case Study",
    delete: "Delete",
    edit: "Edit"
  },
  wizard: {
    step1: "1. Tender Spec",
    step2: "2. Match Track Records",
    step3: "3. AI Synthesis",
    step4: "4. Proposal & Export",
    step1Title: "Step 1: Tender Scope & Specifications",
    step1Subtitle: "Upload the contracting authority's tender document or paste the RFP specifications",
    prefillSample: "Pre-fill Sample EU Tender",
    uploadPdf: "Upload Tender PDF",
    orDrag: "or drag & drop tender documents",
    pdfboxNotice: "Apache PDFBox parses TED procurement notices, specifications, and criteria automatically.",
    parsingPdf: "Parsing PDF text with PDFBox...",
    tenderTitle: "Tender / RFP Title",
    tenderTitlePlaceholder: "e.g. EC-DIGIT-2026: Sovereign Cloud Application Modernization",
    clientName: "Contracting Authority / Client",
    clientNamePlaceholder: "e.g. European Commission - DG DIGIT",
    country: "Jurisdiction / Member State",
    countryPlaceholder: "e.g. European Union (Belgium)",
    deadline: "Submission Deadline",
    specs: "Tender Specifications & Scope of Work",
    specsPlaceholder: "Paste the complete technical requirements, qualification criteria, and lot specifications here...",
    nextStep2: "Next: Select Case Studies",
    step2Title: "Step 2: Match Past Performance & Case Studies",
    step2Subtitle: "Select the institutional track records that will be cited in the proposal to fulfill technical qualification criteria",
    noCaseStudiesFound: "No case studies found in your profile.",
    manageProfile: "Manage agency profile to add references",
    strategicDirectives: "Strategic Bid Directives (Optional)",
    directivesPlaceholder: "e.g. Emphasize open-source sovereign stack, ISO 27001 certifications, and zero-trust architecture...",
    back: "Back",
    synthesizeBtn: "Synthesize Proposal with AI",
    synthesizingTitle: "Synthesizing European Tender Proposal",
    synthesizingSub: "Applying Directive 2014/24/EU standards, EU PM² methodology, and sovereign cybersecurity protocols.",
    analyzingSpecs: "Analyzing tender requirements & lots",
    aligningDirectives: "Aligning with EU Directive 2014/24/EU & PM²",
    matchingExperience: "Synthesizing past institutional performance",
    generatingProposal: "Drafting 5-section commercial & technical offer",
    ready: "PROPOSAL READY",
    readyStatus: "Ready for Submission",
    tabExecSummary: "Executive Summary",
    tabTechSolution: "Technical Solution",
    tabImplementation: "Implementation Plan",
    tabCompliance: "Compliance & Governance",
    tabCommercial: "Commercial Terms",
    saveDraft: "Save Draft",
    saving: "Saving...",
    exportPdf: "Export PDF",
    exportDocx: "Export Word (.docx)",
    anotherProposal: "Start Another Proposal",
    toArchive: "Go to Proposal Archive"
  },
  billing: {
    title: "European Subscription Tiers",
    subtitle: "Simple monthly pricing tailored for European digital agencies, IT consultancies, and bid managers.",
    successPayment: "Your subscription has been activated successfully! All premium tender generation features are unlocked.",
    cancelPayment: "Checkout was cancelled. Your current plan remains unchanged.",
    freeTitle: "Free Starter",
    freePrice: "€0",
    freeForever: "Free forever",
    freeDesc: "Explore European tender extraction and test basic proposal drafting.",
    freeFeat1: "Up to 3 AI Proposal drafts",
    freeFeat2: "Basic PDF text extraction",
    freeFeat3: "Standard EU template",
    proTitle: "Pro Agency",
    proPrice: "€49",
    proMonth: "/ month",
    proStripeNotice: "Billed monthly with Stripe",
    proDesc: "For active European agencies submitting monthly TED bids and government tenders.",
    proFeat1: "Unlimited AI Proposal Generation",
    proFeat2: "Full Apache PDFBox document parsing",
    proFeat3: "PDF & Word (.docx) sovereign exports",
    proFeat4: "Verified Case Study matching engine",
    agencyTitle: "Enterprise Agency",
    agencyPrice: "€149",
    agencyMonth: "/ month",
    agencyStripeNotice: "Billed monthly with Stripe",
    agencyDesc: "Consortiums and large consultancies competing for multi-million Euro institutional framework contracts.",
    agencyFeat1: "Everything in Pro included",
    agencyFeat2: "Consortium multi-agency collaboration",
    agencyFeat3: "Custom EU PM² bid templates",
    agencyFeat4: "Dedicated sovereign SLA & priority AI queue",
    mostPopular: "Most Popular",
    currentPlan: "Current Plan",
    active: "Active",
    activePlan: "Active Plan",
    freeTier: "Free Tier",
    upgradePro: "Upgrade to Pro (€49/mo)",
    upgradeAgency: "Upgrade to Agency (€149/mo)",
    processing: "Redirecting to Stripe...",
    securityNote: "All transactions are encrypted and processed by Stripe. Compliant with EU GDPR Art. 32 and PCI-DSS Level 1 standards."
  },
  proposals: {
    archiveTitle: "European Proposal Archive",
    archiveSubtitle: "Manage and export all generated commercial bids and RFP responses",
    generateNew: "Generate New Proposal",
    searchPlaceholder: "Search by tender title or contracting authority...",
    loading: "Loading proposals...",
    emptyTitle: "No proposals found",
    emptySubtitle: "Try a different search or create a new proposal.",
    client: "Client",
    jurisdiction: "Jurisdiction",
    created: "Created",
    status: "Status",
    actions: "Actions",
    openEditor: "Open Editor",
    downloadPdf: "Download PDF",
    downloadDocx: "Download Word (.docx)",
    delete: "Delete",
    backToArchive: "Back to Proposals",
    saveChanges: "Save Changes",
    savedSuccess: "Proposal saved successfully."
  },
  auth: {
    signInTitle: "Sign in to TenderAI",
    signInSubtitle: "European Public Procurement & Tender Proposal Generator",
    quickDemo: "Quick Demo Access",
    quickDemoDesc: "Pre-loaded European Agency Profile & Proposals",
    fillDemo: "Fill Demo",
    orGoogle: "Or continue with Google",
    workEmail: "Work Email",
    password: "Password",
    signingIn: "Signing in...",
    signIn: "Sign in",
    noAccount: "Don't have an account?",
    createAgency: "Create agency account",
    registerTitle: "Create Agency Account",
    registerSubtitle: "Start generating compliant European tender proposals with AI",
    fullName: "Full Name",
    agencyName: "Agency / Consultancy Name",
    creatingAccount: "Creating account...",
    createAccount: "Create Account",
    hasAccount: "Already have an account?",
    verifyNotice: "A verification link has been sent to your email. Please click it to verify your account.",
    emailVerifiedNotice: "Your email address has been verified! You can now log in.",
    verifyingEmail: "Verifying your email address...",
    verifySuccess: "Email Verified Successfully!",
    verifySuccessDesc: "Your account has been activated. Redirecting to login...",
    verifyFailed: "Verification Failed",
    verifyFailedDesc: "The verification token is invalid or has expired.",
    goToLogin: "Go to Login"
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'tenderai_lang';

  readonly languages: LanguageOption[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' }
  ];

  private cache = new Map<LanguageCode, Record<string, any>>();
  private fallbackCache: Record<string, any> = DEFAULT_EN_TRANSLATIONS;

  currentLang = signal<LanguageCode>(this.getInitialLanguage());
  // Pre-seed with default translations so keys are NEVER raw on initial render
  translations = signal<Record<string, any>>(DEFAULT_EN_TRANSLATIONS);
  isLoaded = signal<boolean>(true);

  currentLanguageOption = computed(() => {
    return this.languages.find(l => l.code === this.currentLang()) || this.languages[0];
  });

  constructor() {
    this.cache.set('en', DEFAULT_EN_TRANSLATIONS);
    const initial = this.currentLang();
    if (initial !== 'en') {
      this.loadLanguage(initial);
    }
    this.preloadOtherLanguages(initial);
  }

  private preloadOtherLanguages(current: LanguageCode): void {
    const others = this.languages.map(l => l.code).filter(c => c !== current && c !== 'en');
    for (const code of others) {
      this.fetchLanguage(code).then(data => {
        if (data) {
          this.cache.set(code, data);
        }
      }).catch(() => {});
    }
  }

  async setLanguage(lang: LanguageCode): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }

    this.currentLang.set(lang);

    if (this.cache.has(lang)) {
      this.translations.set(this.cache.get(lang)!);
      return;
    }

    await this.loadLanguage(lang);
  }

  private async fetchLanguage(lang: LanguageCode): Promise<Record<string, any>> {
    // Standard browser fetch: zero Angular DI dependencies or interceptors
    const res = await fetch(`/assets/i18n/${lang}.json?v=${Date.now()}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} loading /assets/i18n/${lang}.json`);
    }
    return await res.json();
  }

  async loadLanguage(lang: LanguageCode): Promise<void> {
    try {
      const data = await this.fetchLanguage(lang);
      this.cache.set(lang, data);
      if (this.currentLang() === lang) {
        this.translations.set(data);
      }
    } catch (e) {
      console.warn(`Could not load translations for ${lang}, using English fallback`, e);
      if (this.currentLang() === lang) {
        this.translations.set(this.fallbackCache);
      }
    }
  }

  t(path: string, fallback?: string): string {
    const keys = path.split('.');
    let current: any = this.translations();

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = null;
        break;
      }
    }

    if (typeof current === 'string' && current.length > 0) {
      return current;
    }

    // Secondary fallback to embedded English dictionary
    let fb: any = this.fallbackCache;
    for (const key of keys) {
      if (fb && typeof fb === 'object' && key in fb) {
        fb = fb[key];
      } else {
        fb = null;
        break;
      }
    }

    if (typeof fb === 'string' && fb.length > 0) {
      return fb;
    }

    return fallback || path;
  }

  private getInitialLanguage(): LanguageCode {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as LanguageCode;
      if (saved && ['en', 'fr', 'de', 'es', 'it'].includes(saved)) {
        return saved;
      }
    }

    if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.language || 'en').substring(0, 2).toLowerCase();
      if (['en', 'fr', 'de', 'es', 'it'].includes(browserLang)) {
        return browserLang as LanguageCode;
      }
    }

    return 'en';
  }
}
