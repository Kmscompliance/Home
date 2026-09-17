export type DocumentStatus = "available" | "preview" | "coming-soon";

export interface DocumentDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  /** Price in GBP. Edit this to change what a document sells for — no code change needed elsewhere. */
  priceGBP: number;
  status: DocumentStatus;
}

/**
 * The full FCA Authorisation Toolkit catalogue.
 * Prices are placeholders — Matt sets the real prices himself.
 * Only the first document is "available" until the rest are drafted (Build Order step 4).
 */
export const documents: DocumentDefinition[] = [
  {
    slug: "risk-management-framework",
    title: "Risk Management Framework",
    shortDescription:
      "Sets out how your firm identifies, assesses, manages and reports on risk — a core requirement of your FCA application.",
    priceGBP: 49,
    status: "preview",
  },
  {
    slug: "risk-register",
    title: "Risk Register",
    shortDescription:
      "A structured log for tracking identified risks, their likelihood and impact, and the controls you have in place.",
    priceGBP: 29,
    status: "coming-soon",
  },
  {
    slug: "smf-statement-of-responsibilities",
    title: "SMF Statement of Responsibilities",
    shortDescription:
      "A template for documenting the responsibilities held by each Senior Management Function holder in your firm.",
    priceGBP: 39,
    status: "coming-soon",
  },
  {
    slug: "fit-and-proper-questionnaire",
    title: "Fit and Proper Questionnaire",
    shortDescription:
      "A questionnaire for assessing whether prospective SMF holders and key staff meet the FCA's fit and proper standards.",
    priceGBP: 29,
    status: "coming-soon",
  },
  {
    slug: "customer-due-diligence-policy",
    title: "Customer Due Diligence Policy",
    shortDescription:
      "Sets out how your firm verifies customer identity and assesses risk before and during a business relationship.",
    priceGBP: 39,
    status: "coming-soon",
  },
  {
    slug: "customer-due-diligence-checklist",
    title: "Customer Due Diligence Checklist",
    shortDescription:
      "A step-by-step checklist your team can follow when onboarding a new customer, to evidence consistent CDD practice.",
    priceGBP: 25,
    status: "coming-soon",
  },
  {
    slug: "anti-money-laundering-policy",
    title: "Anti-Money Laundering Policy",
    shortDescription:
      "Your firm's approach to preventing, detecting and reporting money laundering, in line with the Money Laundering Regulations.",
    priceGBP: 49,
    status: "coming-soon",
  },
  {
    slug: "aml-incident-register",
    title: "AML Incident Register",
    shortDescription:
      "A log for recording suspicious activity, internal reports and the actions taken in response.",
    priceGBP: 25,
    status: "coming-soon",
  },
  {
    slug: "complaints-policy",
    title: "Complaints Policy",
    shortDescription:
      "How your firm receives, investigates and resolves customer complaints in line with FCA DISP rules.",
    priceGBP: 35,
    status: "coming-soon",
  },
  {
    slug: "vulnerability-management-policy",
    title: "Vulnerability Management Policy",
    shortDescription:
      "Sets out how your firm identifies and supports customers in vulnerable circumstances, reflecting the Consumer Duty.",
    priceGBP: 35,
    status: "coming-soon",
  },
  {
    slug: "compliance-monitoring-programme-policy",
    title: "Compliance Monitoring Programme Policy",
    shortDescription:
      "Your firm's policy for how it structures and governs ongoing compliance monitoring, reviewing and testing that it continues to meet its regulatory obligations.",
    priceGBP: 39,
    status: "coming-soon",
  },
  {
    slug: "compliance-monitoring-plan",
    title: "Compliance Monitoring Plan",
    shortDescription:
      "The practical, scheduled plan of monitoring activity that puts your Compliance Monitoring Programme Policy into action.",
    priceGBP: 29,
    status: "coming-soon",
  },
  {
    slug: "financial-promotions-policy",
    title: "Financial Promotions Policy",
    shortDescription:
      "How your firm approves, records and reviews financial promotions to keep them fair, clear and not misleading.",
    priceGBP: 35,
    status: "coming-soon",
  },
  {
    slug: "data-processing-policy",
    title: "Data Processing Policy",
    shortDescription:
      "Sets out how your firm collects, uses, stores and protects personal data in line with UK GDPR.",
    priceGBP: 35,
    status: "coming-soon",
  },
];

export function getDocumentBySlug(slug: string): DocumentDefinition | undefined {
  return documents.find((doc) => doc.slug === slug);
}

export const bundlePriceGBP = 349;
