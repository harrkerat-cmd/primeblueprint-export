export type CollectionDisclaimerType =
  | 'general'
  | 'financial'
  | 'medical'
  | 'relationship'
  | 'parenting'
  | 'construction';

export type CollectionCategory = {
  slug: string;
  title: string;
  description: string;
  accent: string;
  shortLabel: string;
};

export type CollectionChapter = {
  title: string;
  subtitle: string;
  summary: string;
  bullets: string[];
  example: string;
  action: string;
};

export type CollectionProduct = {
  slug: string;
  title: string;
  categorySlug: string;
  price: number;
  valueProp: string;
  description: string;
  coverStyle: string;
  coverAsset?: string | null;
  pageTarget: number;
  disclaimerType: CollectionDisclaimerType;
  emailTemplateKey: string;
  fileVersion: string;
  downloadFileKey?: string | null;
  searchTerms: string[];
  whatInside: string[];
  chapters: CollectionChapter[];
  commonMistakes: string[];
  frameworkTitle: string;
  frameworkSteps: string[];
  checklist: string[];
  resources: string[];
  deliveryNote: string;
};

export type CollectionGuidePage = {
  id: string;
  title: string;
  subtitle?: string;
  intro?: string;
  paragraphs?: string[];
  bulletGroups?: Array<{ title: string; items: string[] }>;
  callouts?: Array<{ label: string; title: string; body: string }>;
  checklist?: string[];
  tables?: Array<{ title: string; columns: string[]; rows: string[][] }>;
  diagrams?: Array<{ title: string; description?: string; steps: string[] }>;
  resources?: Array<{ name: string; description: string; referenceLabel?: string }>;
  note?: string;
};

export type CollectionGuideContent = {
  brandName: string;
  collectionLabel: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  preparedLine: string;
  coverLine: string;
  createdAtLabel: string;
  pages: CollectionGuidePage[];
  supportLine: string;
  closingMessage: string;
  disclaimers: string[];
};
