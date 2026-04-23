import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  EmailStatus,
  GenerationStatus,
  PackageTier,
  PaymentStatus,
  Prisma,
  type ReportCategory
} from "@prisma/client";
import { getCategoryByValue } from "@/config/site";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import type { GeneratedReportContent, QuestionnaireValues } from "@/lib/types";

type StoredReportRequest = {
  id: string;
  createdAt: string;
  updatedAt: string;
  category: ReportCategory;
  selectedPackage: PackageTier | null;
  userName: string | null;
  email: string | null;
  ageRange: string | null;
  country: string | null;
  optionalGender: string | null;
  mainGoal: string | null;
  previewTitle: string | null;
  draftCompletedAt: string | null;
  paymentStatus: PaymentStatus;
  generationStatus: GenerationStatus;
  emailStatus: EmailStatus;
  answersJson: QuestionnaireValues;
  lastSavedStep: string | null;
  checkoutUrl: string | null;
  stripeSessionId: string | null;
};

type StoredPayment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  reportRequestId: string;
  packageTier: PackageTier;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerEmail: string | null;
  webhookProcessedAt: string | null;
};

type StoredGeneratedReport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  reportRequestId: string;
  title: string;
  contentJson: GeneratedReportContent | StoredGeneratedReportSummary | Record<string, never>;
  pdfBase64: string | null;
  pdfUrl: string | null;
  generationStatus: GenerationStatus;
  generationError: string | null;
  generatedAt: string | null;
};

type StoredEmailLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  reportRequestId: string;
  recipient: string;
  subject: string;
  provider: string;
  status: EmailStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
};

type StoredLeadInterest = {
  id: string;
  createdAt: string;
  updatedAt: string;
  reportRequestId: string;
  planId: string;
  planName: string;
  price: number;
  status: string;
  paymentStatus: PaymentStatus;
  stripeSessionId: string | null;
  checkoutUrl: string | null;
  activatedAt: string | null;
  deliveryMethod: string;
  userName: string | null;
  email: string | null;
  notes: string | null;
};

type LocalStore = {
  reportRequests: StoredReportRequest[];
  payments: StoredPayment[];
  generatedReports: StoredGeneratedReport[];
  emailLogs: StoredEmailLog[];
  constructionLeadInterests: StoredLeadInterest[];
};

type StoredGeneratedReportSummary = {
  title: string;
  categoryLabel: string;
  packageName: string;
  preparedFor: string;
  goal: string;
  pageCount: number;
  generatedAtLabel: string;
};

const emptyStore: LocalStore = {
  reportRequests: [],
  payments: [],
  generatedReports: [],
  emailLogs: [],
  constructionLeadInterests: []
};
const storePath = path.join(process.cwd(), ".primeblueprint", "store.json");
const canUseLocalFilesystem = process.env.NODE_ENV !== "production";
let memoryStore: LocalStore = structuredClone(emptyStore);

function createProductionPersistenceError(action: string, cause?: unknown) {
  return new Error(
    `[report-store] ${action} requires database-backed persistence in production. Local filesystem fallback is disabled.`,
    cause === undefined ? undefined : { cause }
  );
}

function throwIfProductionFallback(action: string, cause?: unknown) {
  if (!canUseLocalFilesystem) {
    throw createProductionPersistenceError(action, cause);
  }
}

function logDatabaseFallback(action: string, error: unknown) {
  console.warn(`[report-store] Falling back to local store for ${action}.`, error);
}

async function ensureLocalStore() {
  if (!canUseLocalFilesystem) {
    return memoryStore;
  }

  const directory = path.dirname(storePath);
  await mkdir(directory, { recursive: true });

  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    await writeFile(storePath, JSON.stringify(emptyStore, null, 2), "utf8");
    return structuredClone(emptyStore);
  }
}

async function saveLocalStore(store: LocalStore) {
  if (!canUseLocalFilesystem) {
    memoryStore = store;
    return;
  }

  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

async function updateLocalStore<T>(updater: (store: LocalStore) => T | Promise<T>) {
  const store = await ensureLocalStore();
  const result = await updater(store);
  await saveLocalStore(store);
  return result;
}

function nowIso() {
  return new Date().toISOString();
}

function buildStoredGeneratedReportSummary(content: GeneratedReportContent): StoredGeneratedReportSummary {
  return {
    title: content.title,
    categoryLabel: content.categoryLabel,
    packageName: content.packageName,
    preparedFor: content.preparedFor,
    goal: content.goal,
    pageCount: content.pages.length,
    generatedAtLabel: content.createdAtLabel
  };
}

function buildPreviewTitle(category: ReportCategory, userName?: string | null) {
  const base = getCategoryByValue(category)?.reportTitle ?? "Personalized Report";
  return `${base} for ${userName || "You"}`;
}

function assembleLocalRequest(store: LocalStore, requestId: string) {
  const reportRequest = store.reportRequests.find((item) => item.id === requestId);
  if (!reportRequest) {
    return null;
  }

  const payments = store.payments
    .filter((item) => item.reportRequestId === requestId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const emailLogs = store.emailLogs
    .filter((item) => item.reportRequestId === requestId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const constructionLeads = store.constructionLeadInterests.filter((item) => item.reportRequestId === requestId);
  const report = store.generatedReports.find((item) => item.reportRequestId === requestId) ?? null;

  return {
    ...reportRequest,
    payments,
    emailLogs,
    constructionLeads,
    report
  };
}

export async function createReportRequest(category: ReportCategory) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.reportRequest.create({
        data: {
          category,
          previewTitle: buildPreviewTitle(category)
        }
      });
    } catch (error) {
      throwIfProductionFallback("createReportRequest", error);
      logDatabaseFallback("createReportRequest", error);
    }
  }

  throwIfProductionFallback("createReportRequest");

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const record: StoredReportRequest = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      category,
      selectedPackage: null,
      userName: null,
      email: null,
      ageRange: null,
      country: null,
      optionalGender: null,
      mainGoal: null,
      previewTitle: buildPreviewTitle(category),
      draftCompletedAt: null,
      paymentStatus: PaymentStatus.DRAFT,
      generationStatus: GenerationStatus.NOT_STARTED,
      emailStatus: EmailStatus.PENDING,
      answersJson: {},
      lastSavedStep: null,
      checkoutUrl: null,
      stripeSessionId: null
    };

    store.reportRequests.push(record);
    return record;
  });
}

export async function saveDraftReportRequest({
  requestId,
  answers,
  category,
  lastSavedStep
}: {
  requestId: string;
  answers: QuestionnaireValues;
  category: ReportCategory;
  lastSavedStep?: string;
}) {
  const db = prisma;

  if (isDatabaseConfigured && db) {
    try {
      const answerEntries = Object.entries(answers).filter(([, value]) => value !== undefined);
      const previewName = typeof answers.fullName === "string" ? answers.fullName : "You";

      await db.$transaction([
        db.reportRequest.update({
          where: { id: requestId },
          data: {
            category,
            answersJson: answers as Prisma.InputJsonValue,
            userName: typeof answers.fullName === "string" ? answers.fullName : undefined,
            email: typeof answers.email === "string" ? answers.email : undefined,
            country: typeof answers.country === "string" ? answers.country : undefined,
            ageRange: typeof answers.ageRange === "string" ? answers.ageRange : undefined,
            optionalGender: typeof answers.optionalGender === "string" ? answers.optionalGender : undefined,
            mainGoal: typeof answers.mainGoal === "string" ? answers.mainGoal : undefined,
            lastSavedStep,
            previewTitle: buildPreviewTitle(category, previewName),
            draftCompletedAt: answerEntries.length > 5 ? new Date() : undefined
          }
        }),
        ...answerEntries.map(([questionKey, value]) =>
          db.answer.upsert({
            where: {
              reportRequestId_questionKey: {
                reportRequestId: requestId,
                questionKey
              }
            },
            update: {
              value: value as Prisma.InputJsonValue,
              category
            },
            create: {
              reportRequestId: requestId,
              questionKey,
              value: value as Prisma.InputJsonValue,
              category
            }
          })
        )
      ]);

      return db.reportRequest.findUnique({
        where: { id: requestId },
        include: {
          report: true,
          payments: true,
          emailLogs: true,
          constructionLeads: true
        }
      });
    } catch (error) {
      throwIfProductionFallback("saveDraftReportRequest", error);
      logDatabaseFallback("saveDraftReportRequest", error);
    }
  }

  throwIfProductionFallback("saveDraftReportRequest");

  return updateLocalStore((store) => {
    const record = store.reportRequests.find((item) => item.id === requestId);
    if (!record) {
      return null;
    }

    const timestamp = nowIso();
    record.updatedAt = timestamp;
    record.category = category;
    record.answersJson = answers;
    record.userName = typeof answers.fullName === "string" ? answers.fullName : null;
    record.email = typeof answers.email === "string" ? answers.email : null;
    record.country = typeof answers.country === "string" ? answers.country : null;
    record.ageRange = typeof answers.ageRange === "string" ? answers.ageRange : null;
    record.optionalGender = typeof answers.optionalGender === "string" ? answers.optionalGender : null;
    record.mainGoal = typeof answers.mainGoal === "string" ? answers.mainGoal : null;
    record.lastSavedStep = lastSavedStep ?? null;
    record.previewTitle = buildPreviewTitle(category, record.userName);
    record.draftCompletedAt = Object.keys(answers).length > 5 ? timestamp : record.draftCompletedAt;

    return assembleLocalRequest(store, requestId);
  });
}

export async function clearDraftReportRequest(requestId: string) {
  if (isDatabaseConfigured && prisma) {
    try {
      const existing = await prisma.reportRequest.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          category: true,
          paymentStatus: true
        }
      });

      if (!existing || existing.paymentStatus !== PaymentStatus.DRAFT) {
        return existing;
      }

      await prisma.$transaction([
        prisma.answer.deleteMany({
          where: { reportRequestId: requestId }
        }),
        prisma.reportRequest.update({
          where: { id: requestId },
          data: {
            selectedPackage: null,
            userName: null,
            email: null,
            ageRange: null,
            country: null,
            optionalGender: null,
            mainGoal: null,
            previewTitle: buildPreviewTitle(existing.category),
            draftCompletedAt: null,
            answersJson: {} as Prisma.InputJsonValue,
            lastSavedStep: null,
            checkoutUrl: null,
            stripeSessionId: null,
            generationStatus: GenerationStatus.NOT_STARTED,
            emailStatus: EmailStatus.PENDING
          }
        })
      ]);

      return prisma.reportRequest.findUnique({
        where: { id: requestId },
        include: {
          report: true,
          payments: {
            orderBy: { createdAt: "desc" }
          },
          emailLogs: {
            orderBy: { createdAt: "desc" }
          },
          constructionLeads: {
            orderBy: { createdAt: "desc" }
          }
        }
      });
    } catch (error) {
      throwIfProductionFallback("clearDraftReportRequest", error);
      logDatabaseFallback("clearDraftReportRequest", error);
    }
  }

  throwIfProductionFallback("clearDraftReportRequest");

  return updateLocalStore((store) => {
    const record = store.reportRequests.find((item) => item.id === requestId);
    if (!record || record.paymentStatus !== PaymentStatus.DRAFT) {
      return record ?? null;
    }

    record.updatedAt = nowIso();
    record.selectedPackage = null;
    record.userName = null;
    record.email = null;
    record.ageRange = null;
    record.country = null;
    record.optionalGender = null;
    record.mainGoal = null;
    record.previewTitle = buildPreviewTitle(record.category);
    record.draftCompletedAt = null;
    record.answersJson = {};
    record.lastSavedStep = null;
    record.checkoutUrl = null;
    record.stripeSessionId = null;
    record.generationStatus = GenerationStatus.NOT_STARTED;
    record.emailStatus = EmailStatus.PENDING;

    store.generatedReports = store.generatedReports.filter((item) => item.reportRequestId !== requestId);
    store.payments = store.payments.filter((item) => item.reportRequestId !== requestId);

    return assembleLocalRequest(store, requestId);
  });
}

export async function getReportRequest(requestId: string) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.reportRequest.findUnique({
        where: { id: requestId },
        include: {
          report: true,
          payments: {
            orderBy: { createdAt: "desc" }
          },
          emailLogs: {
            orderBy: { createdAt: "desc" }
          },
          constructionLeads: {
            orderBy: { createdAt: "desc" }
          }
        }
      });
    } catch (error) {
      throwIfProductionFallback("getReportRequest", error);
      logDatabaseFallback("getReportRequest", error);
    }
  }

  throwIfProductionFallback("getReportRequest");

  const store = await ensureLocalStore();
  return assembleLocalRequest(store, requestId);
}

function hasDraftProgress(
  reportRequest:
    | {
        answersJson?: unknown;
        userName?: string | null;
        email?: string | null;
        lastSavedStep?: string | null;
      }
    | null
) {
  if (!reportRequest) {
    return false;
  }

  const answers =
    reportRequest.answersJson && typeof reportRequest.answersJson === "object" && !Array.isArray(reportRequest.answersJson)
      ? reportRequest.answersJson
      : {};
  return (
    Object.keys(answers).length > 0 ||
    Boolean(reportRequest.userName) ||
    Boolean(reportRequest.email) ||
    Boolean(reportRequest.lastSavedStep)
  );
}

export async function getLatestResumableReportRequest(category: ReportCategory) {
  if (isDatabaseConfigured && prisma) {
    try {
      const candidates = await prisma.reportRequest.findMany({
        where: {
          category,
          paymentStatus: PaymentStatus.DRAFT
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 10,
        include: {
          report: true,
          payments: {
            orderBy: { createdAt: "desc" }
          },
          emailLogs: {
            orderBy: { createdAt: "desc" }
          },
          constructionLeads: {
            orderBy: { createdAt: "desc" }
          }
        }
      });

      return candidates.find((candidate) => hasDraftProgress(candidate)) ?? null;
    } catch (error) {
      throwIfProductionFallback("getLatestResumableReportRequest", error);
      logDatabaseFallback("getLatestResumableReportRequest", error);
    }
  }

  throwIfProductionFallback("getLatestResumableReportRequest");

  const store = await ensureLocalStore();
  const candidates = [...store.reportRequests]
    .filter((item) => item.category === category && item.paymentStatus === PaymentStatus.DRAFT)
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  for (const candidate of candidates) {
    if (!hasDraftProgress(candidate)) {
      continue;
    }

    return assembleLocalRequest(store, candidate.id);
  }

  return null;
}

export async function setCheckoutPending({
  requestId,
  packageTier,
  paymentStatus,
  checkoutUrl,
  stripeSessionId
}: {
  requestId: string;
  packageTier: PackageTier;
  paymentStatus: PaymentStatus;
  checkoutUrl?: string | null;
  stripeSessionId?: string | null;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.reportRequest.update({
      where: { id: requestId },
      data: {
        selectedPackage: packageTier,
        paymentStatus,
        checkoutUrl,
        stripeSessionId
      }
    });
  }

  return updateLocalStore((store) => {
    const record = store.reportRequests.find((item) => item.id === requestId);
    if (!record) {
      return null;
    }

    record.updatedAt = nowIso();
    record.selectedPackage = packageTier;
    record.paymentStatus = paymentStatus;
    record.checkoutUrl = checkoutUrl ?? null;
    record.stripeSessionId = stripeSessionId ?? null;
    return record;
  });
}

export async function createPendingPayment({
  requestId,
  packageTier,
  amount,
  status,
  stripeCheckoutSessionId,
  stripeCustomerEmail,
  currency = "gbp"
}: {
  requestId: string;
  packageTier: PackageTier;
  amount: number;
  status: PaymentStatus;
  stripeCheckoutSessionId?: string | null;
  stripeCustomerEmail?: string | null;
  currency?: string;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.payment.create({
      data: {
        reportRequestId: requestId,
        packageTier,
        amount,
        status,
        currency,
        stripeCheckoutSessionId,
        stripeCustomerEmail
      }
    });
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const payment: StoredPayment = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      reportRequestId: requestId,
      packageTier,
      amount,
      currency,
      status,
      stripeCheckoutSessionId: stripeCheckoutSessionId ?? null,
      stripePaymentIntentId: null,
      stripeCustomerEmail: stripeCustomerEmail ?? null,
      webhookProcessedAt: null
    };

    store.payments.push(payment);
    return payment;
  });
}

export async function upsertPaidPayment({
  requestId,
  packageTier,
  amount,
  currency,
  stripeCheckoutSessionId,
  stripePaymentIntentId,
  stripeCustomerEmail
}: {
  requestId: string;
  packageTier: PackageTier;
  amount: number;
  currency: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
  stripeCustomerEmail?: string | null;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.payment.upsert({
      where: { stripeCheckoutSessionId },
      update: {
        status: PaymentStatus.PAID,
        stripePaymentIntentId,
        stripeCustomerEmail,
        webhookProcessedAt: new Date()
      },
      create: {
        reportRequestId: requestId,
        packageTier,
        amount,
        currency,
        status: PaymentStatus.PAID,
        stripeCheckoutSessionId,
        stripePaymentIntentId,
        stripeCustomerEmail,
        webhookProcessedAt: new Date()
      }
    });
  }

  return updateLocalStore((store) => {
    const existing = store.payments.find((item) => item.stripeCheckoutSessionId === stripeCheckoutSessionId);
    const timestamp = nowIso();

    if (existing) {
      existing.updatedAt = timestamp;
      existing.status = PaymentStatus.PAID;
      existing.stripePaymentIntentId = stripePaymentIntentId ?? null;
      existing.stripeCustomerEmail = stripeCustomerEmail ?? existing.stripeCustomerEmail;
      existing.webhookProcessedAt = timestamp;
      return existing;
    }

    const created: StoredPayment = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      reportRequestId: requestId,
      packageTier,
      amount,
      currency,
      status: PaymentStatus.PAID,
      stripeCheckoutSessionId,
      stripePaymentIntentId: stripePaymentIntentId ?? null,
      stripeCustomerEmail: stripeCustomerEmail ?? null,
      webhookProcessedAt: timestamp
    };

    store.payments.push(created);
    return created;
  });
}

export async function setPaymentCompleteForRequest({
  requestId,
  packageTier,
  stripeSessionId,
  generationStatus = GenerationStatus.QUEUED
}: {
  requestId: string;
  packageTier: PackageTier;
  stripeSessionId?: string | null;
  generationStatus?: GenerationStatus;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.reportRequest.update({
      where: { id: requestId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        selectedPackage: packageTier,
        generationStatus,
        stripeSessionId,
        checkoutUrl: null
      }
    });
  }

  return updateLocalStore((store) => {
    const record = store.reportRequests.find((item) => item.id === requestId);
    if (!record) {
      return null;
    }

    record.updatedAt = nowIso();
    record.paymentStatus = PaymentStatus.PAID;
    record.selectedPackage = packageTier;
    record.generationStatus = generationStatus;
    record.stripeSessionId = stripeSessionId ?? record.stripeSessionId;
    record.checkoutUrl = null;
    return record;
  });
}

export async function markPaymentFailed(requestId: string) {
  if (isDatabaseConfigured && prisma) {
    return prisma.reportRequest.update({
      where: { id: requestId },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        checkoutUrl: null,
        stripeSessionId: null
      }
    });
  }

  return updateLocalStore((store) => {
    const record = store.reportRequests.find((item) => item.id === requestId);
    if (!record) {
      return null;
    }

    record.updatedAt = nowIso();
    record.paymentStatus = PaymentStatus.FAILED;
    record.checkoutUrl = null;
    record.stripeSessionId = null;
    return record;
  });
}

export async function setReportGenerationState(requestId: string, generationStatus: GenerationStatus) {
  if (isDatabaseConfigured && prisma) {
    return prisma.reportRequest.update({
      where: { id: requestId },
      data: { generationStatus }
    });
  }

  return updateLocalStore((store) => {
    const record = store.reportRequests.find((item) => item.id === requestId);
    if (!record) {
      return null;
    }

    record.updatedAt = nowIso();
    record.generationStatus = generationStatus;
    return record;
  });
}

export async function upsertGeneratedReportShell({ requestId, title }: { requestId: string; title: string }) {
  if (isDatabaseConfigured && prisma) {
    return prisma.generatedReport.upsert({
      where: { reportRequestId: requestId },
      update: {
        generationStatus: GenerationStatus.GENERATING,
        generationError: null
      },
      create: {
        reportRequestId: requestId,
        title,
        contentJson: {},
        generationStatus: GenerationStatus.GENERATING
      }
    });
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const existing = store.generatedReports.find((item) => item.reportRequestId === requestId);

    if (existing) {
      existing.updatedAt = timestamp;
      existing.title = title;
      existing.generationStatus = GenerationStatus.GENERATING;
      existing.generationError = null;
      return existing;
    }

    const report: StoredGeneratedReport = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      reportRequestId: requestId,
      title,
      contentJson: {},
      pdfBase64: null,
      pdfUrl: null,
      generationStatus: GenerationStatus.GENERATING,
      generationError: null,
      generatedAt: null
    };

    store.generatedReports.push(report);
    return report;
  });
}

export async function completeGeneratedReport({
  requestId,
  title,
  content,
  pdfBase64,
  pdfUrl
}: {
  requestId: string;
  title: string;
  content: GeneratedReportContent;
  pdfBase64: string;
  pdfUrl: string;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.generatedReport.update({
      where: { reportRequestId: requestId },
      data: {
        title,
        contentJson: buildStoredGeneratedReportSummary(content) as Prisma.InputJsonValue,
        pdfBase64,
        pdfUrl,
        generationStatus: GenerationStatus.COMPLETED,
        generatedAt: new Date(),
        generationError: null
      }
    });
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const report = store.generatedReports.find((item) => item.reportRequestId === requestId);
    if (!report) {
      return null;
    }

    report.updatedAt = timestamp;
    report.title = title;
    report.contentJson = buildStoredGeneratedReportSummary(content);
    report.pdfBase64 = pdfBase64;
    report.pdfUrl = pdfUrl;
    report.generationStatus = GenerationStatus.COMPLETED;
    report.generatedAt = timestamp;
    report.generationError = null;
    return report;
  });
}

export async function failGeneratedReport({ requestId, errorMessage }: { requestId: string; errorMessage: string }) {
  if (isDatabaseConfigured && prisma) {
    return prisma.generatedReport.update({
      where: { reportRequestId: requestId },
      data: {
        generationStatus: GenerationStatus.FAILED,
        generationError: errorMessage
      }
    });
  }

  return updateLocalStore((store) => {
    const report = store.generatedReports.find((item) => item.reportRequestId === requestId);
    if (!report) {
      return null;
    }

    report.updatedAt = nowIso();
    report.generationStatus = GenerationStatus.FAILED;
    report.generationError = errorMessage;
    return report;
  });
}

export async function setEmailStatusForRequest(requestId: string, emailStatus: EmailStatus) {
  if (isDatabaseConfigured && prisma) {
    return prisma.reportRequest.update({
      where: { id: requestId },
      data: { emailStatus }
    });
  }

  return updateLocalStore((store) => {
    const record = store.reportRequests.find((item) => item.id === requestId);
    if (!record) {
      return null;
    }

    record.updatedAt = nowIso();
    record.emailStatus = emailStatus;
    return record;
  });
}

export async function createEmailLog({
  requestId,
  recipient,
  subject,
  provider = "resend"
}: {
  requestId: string;
  recipient: string;
  subject: string;
  provider?: string;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.emailLog.create({
      data: {
        reportRequestId: requestId,
        recipient,
        subject,
        provider
      }
    });
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const log: StoredEmailLog = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      reportRequestId: requestId,
      recipient,
      subject,
      provider,
      status: EmailStatus.PENDING,
      providerMessageId: null,
      errorMessage: null
    };

    store.emailLogs.push(log);
    return log;
  });
}

export async function updateEmailLog({
  emailLogId,
  status,
  providerMessageId,
  errorMessage
}: {
  emailLogId: string;
  status: EmailStatus;
  providerMessageId?: string | null;
  errorMessage?: string | null;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        status,
        providerMessageId,
        errorMessage
      }
    });
  }

  return updateLocalStore((store) => {
    const log = store.emailLogs.find((item) => item.id === emailLogId);
    if (!log) {
      return null;
    }

    log.updatedAt = nowIso();
    log.status = status;
    log.providerMessageId = providerMessageId ?? null;
    log.errorMessage = errorMessage ?? null;
    return log;
  });
}

export async function createConstructionLeadInterest({
  requestId,
  planId,
  planName,
  price,
  status = "REQUESTED",
  paymentStatus = PaymentStatus.DRAFT,
  stripeSessionId,
  checkoutUrl,
  activatedAt,
  deliveryMethod = "manual_email",
  userName,
  email,
  notes
}: {
  requestId: string;
  planId: string;
  planName: string;
  price: number;
  status?: string;
  paymentStatus?: PaymentStatus;
  stripeSessionId?: string | null;
  checkoutUrl?: string | null;
  activatedAt?: Date | string | null;
  deliveryMethod?: string;
  userName?: string | null;
  email?: string | null;
  notes?: string | null;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.constructionLeadInterest.create({
      data: {
        reportRequestId: requestId,
        planId,
        planName,
        price,
        status,
        paymentStatus,
        stripeSessionId,
        checkoutUrl,
        activatedAt: activatedAt ? new Date(activatedAt) : undefined,
        deliveryMethod,
        userName,
        email,
        notes
      }
    });
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const interest: StoredLeadInterest = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      reportRequestId: requestId,
      planId,
      planName,
      price,
      status,
      paymentStatus,
      stripeSessionId: stripeSessionId ?? null,
      checkoutUrl: checkoutUrl ?? null,
      activatedAt: activatedAt ? new Date(activatedAt).toISOString() : null,
      deliveryMethod,
      userName: userName ?? null,
      email: email ?? null,
      notes: notes ?? null
    };

    store.constructionLeadInterests.push(interest);
    return interest;
  });
}

export async function getGeneratedReportByRequestId(requestId: string) {
  if (isDatabaseConfigured && prisma) {
    return prisma.generatedReport.findUnique({
      where: { reportRequestId: requestId }
    });
  }

  const store = await ensureLocalStore();
  return store.generatedReports.find((item) => item.reportRequestId === requestId) ?? null;
}

export async function getConstructionLeadInterest({
  requestId,
  planId
}: {
  requestId: string;
  planId: string;
}) {
  if (isDatabaseConfigured && prisma) {
    return prisma.constructionLeadInterest.findFirst({
      where: {
        reportRequestId: requestId,
        planId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  const store = await ensureLocalStore();
  return (
    store.constructionLeadInterests
      .filter((item) => item.reportRequestId === requestId && item.planId === planId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0] ?? null
  );
}

export async function upsertConstructionLeadCheckout({
  requestId,
  planId,
  planName,
  price,
  userName,
  email,
  checkoutUrl,
  stripeSessionId,
  paymentStatus = PaymentStatus.PENDING,
  status = "CHECKOUT_CREATED"
}: {
  requestId: string;
  planId: string;
  planName: string;
  price: number;
  userName?: string | null;
  email?: string | null;
  checkoutUrl?: string | null;
  stripeSessionId?: string | null;
  paymentStatus?: PaymentStatus;
  status?: string;
}) {
  if (isDatabaseConfigured && prisma) {
    const existing = await prisma.constructionLeadInterest.findFirst({
      where: {
        reportRequestId: requestId,
        planId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (existing) {
      return prisma.constructionLeadInterest.update({
        where: { id: existing.id },
        data: {
          planName,
          price,
          status,
          paymentStatus,
          checkoutUrl,
          stripeSessionId,
          userName,
          email
        }
      });
    }

    return createConstructionLeadInterest({
      requestId,
      planId,
      planName,
      price,
      status,
      paymentStatus,
      checkoutUrl,
      stripeSessionId,
      userName,
      email
    });
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const existing = store.constructionLeadInterests
      .filter((item) => item.reportRequestId === requestId && item.planId === planId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];

    if (existing) {
      existing.updatedAt = timestamp;
      existing.planName = planName;
      existing.price = price;
      existing.status = status;
      existing.paymentStatus = paymentStatus;
      existing.checkoutUrl = checkoutUrl ?? null;
      existing.stripeSessionId = stripeSessionId ?? null;
      existing.userName = userName ?? existing.userName;
      existing.email = email ?? existing.email;
      return existing;
    }

    const interest: StoredLeadInterest = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      reportRequestId: requestId,
      planId,
      planName,
      price,
      status,
      paymentStatus,
      stripeSessionId: stripeSessionId ?? null,
      checkoutUrl: checkoutUrl ?? null,
      activatedAt: null,
      deliveryMethod: "manual_email",
      userName: userName ?? null,
      email: email ?? null,
      notes: null
    };

    store.constructionLeadInterests.push(interest);
    return interest;
  });
}

export async function markConstructionLeadPaid({
  requestId,
  planId,
  planName,
  price,
  stripeSessionId,
  userName,
  email
}: {
  requestId: string;
  planId: string;
  planName: string;
  price: number;
  stripeSessionId?: string | null;
  userName?: string | null;
  email?: string | null;
}) {
  if (isDatabaseConfigured && prisma) {
    const existing = await prisma.constructionLeadInterest.findFirst({
      where: {
        reportRequestId: requestId,
        planId
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (existing) {
      return prisma.constructionLeadInterest.update({
        where: { id: existing.id },
        data: {
          planName,
          price,
          status: "ACTIVE",
          paymentStatus: PaymentStatus.PAID,
          stripeSessionId,
          activatedAt: new Date(),
          userName,
          email
        }
      });
    }

    return createConstructionLeadInterest({
      requestId,
      planId,
      planName,
      price,
      status: "ACTIVE",
      paymentStatus: PaymentStatus.PAID,
      stripeSessionId,
      activatedAt: new Date(),
      userName,
      email
    });
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const existing = store.constructionLeadInterests
      .filter((item) => item.reportRequestId === requestId && item.planId === planId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];

    if (existing) {
      existing.updatedAt = timestamp;
      existing.planName = planName;
      existing.price = price;
      existing.status = "ACTIVE";
      existing.paymentStatus = PaymentStatus.PAID;
      existing.stripeSessionId = stripeSessionId ?? existing.stripeSessionId;
      existing.activatedAt = timestamp;
      existing.userName = userName ?? existing.userName;
      existing.email = email ?? existing.email;
      return existing;
    }

    const interest: StoredLeadInterest = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      reportRequestId: requestId,
      planId,
      planName,
      price,
      status: "ACTIVE",
      paymentStatus: PaymentStatus.PAID,
      stripeSessionId: stripeSessionId ?? null,
      checkoutUrl: null,
      activatedAt: timestamp,
      deliveryMethod: "manual_email",
      userName: userName ?? null,
      email: email ?? null,
      notes: null
    };

    store.constructionLeadInterests.push(interest);
    return interest;
  });
}
