export type SubscriptionTier = 'FREE' | 'PRO' | 'AGENCY';
export type ProposalStatus = 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'ARCHIVED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  subscriptionTier: SubscriptionTier;
  agencyName?: string;
  emailVerified?: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  subscriptionTier: SubscriptionTier;
  agencyName: string;
  emailVerified?: boolean;
  message?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  budget: string;
  duration: string;
  summary: string;
  technologies: string[];
}

export interface CompanyProfile {
  id?: number;
  agencyName: string;
  tagline?: string;
  website?: string;
  coreCompetencies?: string;
  teamBios?: string;
  caseStudies: CaseStudy[];
}

export interface ProposalContent {
  executiveSummary: string;
  proposedMethodology: string;
  teamQualifications: string;
  timeline: string;
  pricingStructure: string;
  complianceAndStandards: string;
}

export interface Proposal {
  id: number;
  tenderTitle: string;
  clientName: string;
  country?: string;
  submissionDeadline?: string;
  rawTenderText: string;
  generatedContent: ProposalContent;
  status: ProposalStatus;
  selectedCaseStudies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProposalRequest {
  tenderTitle: string;
  clientName: string;
  country?: string;
  submissionDeadline?: string;
  rawTenderText: string;
  selectedCaseStudyIds: string[];
  customInstructions?: string;
}

export interface DashboardStats {
  totalProposals: number;
  completedProposals: number;
  draftProposals: number;
  currentTier: SubscriptionTier;
  agencyName: string;
  caseStudiesCount: number;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  planTier: string;
  amountCents: number;
  currency: string;
}
