import type { PackageId } from "@/config/packages";
import type { CategoryValue } from "@/config/site";

export type QuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "pill"
  | "select"
  | "slider"
  | "toggle"
  | "number"
  | "multi";

export type AnswerValue = string | number | boolean | string[] | null;

export type QuestionCondition = {
  field: string;
  equals?: string | string[];
  notEquals?: string | string[];
};

export type QuestionOption = {
  label: string;
  value: string;
  description?: string;
};

export type QuestionConfig = {
  id: string;
  category: CategoryValue;
  label: string;
  helper?: string;
  placeholder?: string;
  type: QuestionType;
  required?: boolean;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  visibleIf?: QuestionCondition[];
  maxSelections?: number;
};

export type QuestionnaireValues = Record<string, AnswerValue>;

export type ClientSnapshot = {
  name: string;
  category: string;
  goal: string;
  currentSituation: string;
  mainChallenge: string;
  focusTimeline: string;
  packageName: string;
};

export type ReportBulletGroup = {
  title: string;
  items: string[];
};

export type ReportCallout = {
  label: string;
  title: string;
  body: string;
};

export type ReportResource = {
  name: string;
  description: string;
  referenceLabel?: string;
};

export type RoutineEntry = {
  day: string;
  focus: string;
  actions: string[];
};

export type ReportPage = {
  id: string;
  title: string;
  subtitle?: string;
  intro?: string;
  paragraphs?: string[];
  bulletGroups?: ReportBulletGroup[];
  callouts?: ReportCallout[];
  checklist?: string[];
  resources?: ReportResource[];
  routineEntries?: RoutineEntry[];
  note?: string;
};

export type GeneratedReportContent = {
  brandName: string;
  brandTagline: string;
  title: string;
  subtitle: string;
  coverLine: string;
  categoryLabel: string;
  packageName: string;
  packageSummary: string;
  preparedFor: string;
  goal: string;
  createdAtLabel: string;
  snapshot: ClientSnapshot;
  pages: ReportPage[];
  closingMessage: string;
  supportLine: string;
  disclaimers: string[];
  reviewedReferenceStamp?: string;
};

export type CheckoutPayload = {
  requestId: string;
  packageId: PackageId;
};
