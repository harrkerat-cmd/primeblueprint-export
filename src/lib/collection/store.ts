import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { EmailStatus, GenerationStatus, PaymentStatus } from '@prisma/client';
import { prisma, isDatabaseConfigured } from '@/lib/prisma';

export type StoredCollectionPurchase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  productSlug: string;
  productTitle: string;
  productCategory: string;
  customerName: string | null;
  email: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  generationStatus: GenerationStatus;
  emailStatus: EmailStatus;
  stripeSessionId: string | null;
  checkoutUrl: string | null;
  pdfBase64: string | null;
  pdfUrl: string | null;
  generatedAt: string | null;
  productVersion: string;
};

export type StoredCollectionEmailLog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  collectionPurchaseId: string;
  recipient: string;
  subject: string;
  provider: string;
  status: EmailStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
};

type LocalStore = {
  purchases: StoredCollectionPurchase[];
  emailLogs: StoredCollectionEmailLog[];
};

const storePath = path.join(process.cwd(), '.primeblueprint', 'collection-store.json');
const emptyStore: LocalStore = { purchases: [], emailLogs: [] };

function logDatabaseFallback(action: string, error: unknown) {
  console.warn(`[collection-store] Falling back to local store for ${action}.`, error);
}

function nowIso() {
  return new Date().toISOString();
}

async function ensureLocalStore() {
  await mkdir(path.dirname(storePath), { recursive: true });
  try {
    return JSON.parse(await readFile(storePath, 'utf8')) as LocalStore;
  } catch {
    await writeFile(storePath, JSON.stringify(emptyStore, null, 2), 'utf8');
    return structuredClone(emptyStore);
  }
}

async function saveLocalStore(store: LocalStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), 'utf8');
}

async function updateLocalStore<T>(updater: (store: LocalStore) => T | Promise<T>) {
  const store = await ensureLocalStore();
  const result = await updater(store);
  await saveLocalStore(store);
  return result;
}

function assemblePurchase(store: LocalStore, purchaseId: string) {
  const purchase = store.purchases.find((item) => item.id === purchaseId);
  if (!purchase) return null;
  const emailLogs = store.emailLogs
    .filter((item) => item.collectionPurchaseId === purchaseId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  return { ...purchase, emailLogs };
}

export async function createCollectionPurchaseShell({
  productSlug,
  productTitle,
  productCategory,
  email,
  customerName,
  amount,
  productVersion
}: {
  productSlug: string;
  productTitle: string;
  productCategory: string;
  email: string;
  customerName?: string;
  amount: number;
  productVersion: string;
}) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.create({
        data: {
          productSlug,
          productTitle,
          productCategory,
          email,
          customerName,
          amount,
          productVersion,
          paymentStatus: PaymentStatus.DRAFT,
          generationStatus: GenerationStatus.NOT_STARTED,
          emailStatus: EmailStatus.PENDING
        }
      });
    } catch (error) {
      logDatabaseFallback('createCollectionPurchaseShell', error);
    }
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const record: StoredCollectionPurchase = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      productSlug,
      productTitle,
      productCategory,
      customerName: customerName ?? null,
      email,
      amount,
      currency: 'gbp',
      paymentStatus: PaymentStatus.DRAFT,
      generationStatus: GenerationStatus.NOT_STARTED,
      emailStatus: EmailStatus.PENDING,
      stripeSessionId: null,
      checkoutUrl: null,
      pdfBase64: null,
      pdfUrl: null,
      generatedAt: null,
      productVersion
    };
    store.purchases.push(record);
    return record;
  });
}

export async function getCollectionPurchase(purchaseId: string) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.findUnique({
        where: { id: purchaseId },
        include: { emailLogs: { orderBy: { createdAt: 'desc' } } }
      });
    } catch (error) {
      logDatabaseFallback('getCollectionPurchase', error);
    }
  }

  const store = await ensureLocalStore();
  return assemblePurchase(store, purchaseId);
}

export async function setCollectionCheckoutPending({
  purchaseId,
  paymentStatus,
  checkoutUrl,
  stripeSessionId
}: {
  purchaseId: string;
  paymentStatus: PaymentStatus;
  checkoutUrl?: string | null;
  stripeSessionId?: string | null;
}) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.update({
        where: { id: purchaseId },
        data: { paymentStatus, checkoutUrl, stripeSessionId }
      });
    } catch (error) {
      logDatabaseFallback('setCollectionCheckoutPending', error);
    }
  }

  return updateLocalStore((store) => {
    const record = store.purchases.find((item) => item.id === purchaseId);
    if (!record) return null;
    record.updatedAt = nowIso();
    record.paymentStatus = paymentStatus;
    record.checkoutUrl = checkoutUrl ?? record.checkoutUrl;
    record.stripeSessionId = stripeSessionId ?? record.stripeSessionId;
    return record;
  });
}

export async function markCollectionPaymentComplete({
  purchaseId,
  stripeSessionId,
  generationStatus = GenerationStatus.QUEUED
}: {
  purchaseId: string;
  stripeSessionId?: string | null;
  generationStatus?: GenerationStatus;
}) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.update({
        where: { id: purchaseId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          stripeSessionId,
          generationStatus,
          checkoutUrl: null
        }
      });
    } catch (error) {
      logDatabaseFallback('markCollectionPaymentComplete', error);
    }
  }

  return updateLocalStore((store) => {
    const record = store.purchases.find((item) => item.id === purchaseId);
    if (!record) return null;
    record.updatedAt = nowIso();
    record.paymentStatus = PaymentStatus.PAID;
    record.stripeSessionId = stripeSessionId ?? record.stripeSessionId;
    record.generationStatus = generationStatus;
    record.checkoutUrl = null;
    return record;
  });
}

export async function markCollectionPaymentFailed(purchaseId: string) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.update({
        where: { id: purchaseId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
          checkoutUrl: null,
          stripeSessionId: null
        }
      });
    } catch (error) {
      logDatabaseFallback('markCollectionPaymentFailed', error);
    }
  }

  return updateLocalStore((store) => {
    const record = store.purchases.find((item) => item.id === purchaseId);
    if (!record) return null;
    record.updatedAt = nowIso();
    record.paymentStatus = PaymentStatus.FAILED;
    record.checkoutUrl = null;
    record.stripeSessionId = null;
    return record;
  });
}

export async function setCollectionGenerationState(purchaseId: string, generationStatus: GenerationStatus) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.update({ where: { id: purchaseId }, data: { generationStatus } });
    } catch (error) {
      logDatabaseFallback('setCollectionGenerationState', error);
    }
  }

  return updateLocalStore((store) => {
    const record = store.purchases.find((item) => item.id === purchaseId);
    if (!record) return null;
    record.updatedAt = nowIso();
    record.generationStatus = generationStatus;
    return record;
  });
}

export async function completeCollectionPurchase({
  purchaseId,
  pdfBase64,
  pdfUrl
}: {
  purchaseId: string;
  pdfBase64: string;
  pdfUrl: string;
}) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.update({
        where: { id: purchaseId },
        data: {
          pdfBase64,
          pdfUrl,
          generatedAt: new Date(),
          generationStatus: GenerationStatus.COMPLETED
        }
      });
    } catch (error) {
      logDatabaseFallback('completeCollectionPurchase', error);
    }
  }

  return updateLocalStore((store) => {
    const record = store.purchases.find((item) => item.id === purchaseId);
    if (!record) return null;
    record.updatedAt = nowIso();
    record.pdfBase64 = pdfBase64;
    record.pdfUrl = pdfUrl;
    record.generatedAt = nowIso();
    record.generationStatus = GenerationStatus.COMPLETED;
    return record;
  });
}

export async function failCollectionPurchase({ purchaseId }: { purchaseId: string }) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.update({
        where: { id: purchaseId },
        data: { generationStatus: GenerationStatus.FAILED }
      });
    } catch (error) {
      logDatabaseFallback('failCollectionPurchase', error);
    }
  }

  return updateLocalStore((store) => {
    const record = store.purchases.find((item) => item.id === purchaseId);
    if (!record) return null;
    record.updatedAt = nowIso();
    record.generationStatus = GenerationStatus.FAILED;
    return record;
  });
}

export async function createCollectionEmailLog({
  purchaseId,
  recipient,
  subject
}: {
  purchaseId: string;
  recipient: string;
  subject: string;
}) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionEmailLog.create({
        data: {
          collectionPurchaseId: purchaseId,
          recipient,
          subject
        }
      });
    } catch (error) {
      logDatabaseFallback('createCollectionEmailLog', error);
    }
  }

  return updateLocalStore((store) => {
    const timestamp = nowIso();
    const log: StoredCollectionEmailLog = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      collectionPurchaseId: purchaseId,
      recipient,
      subject,
      provider: 'resend',
      status: EmailStatus.PENDING,
      providerMessageId: null,
      errorMessage: null
    };
    store.emailLogs.push(log);
    return log;
  });
}

export async function updateCollectionEmailLog({
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
    try {
      return await prisma.collectionEmailLog.update({
        where: { id: emailLogId },
        data: { status, providerMessageId, errorMessage }
      });
    } catch (error) {
      logDatabaseFallback('updateCollectionEmailLog', error);
    }
  }

  return updateLocalStore((store) => {
    const log = store.emailLogs.find((item) => item.id === emailLogId);
    if (!log) return null;
    log.updatedAt = nowIso();
    log.status = status;
    log.providerMessageId = providerMessageId ?? log.providerMessageId;
    log.errorMessage = errorMessage ?? log.errorMessage;
    return log;
  });
}

export async function setCollectionEmailStatus(purchaseId: string, emailStatus: EmailStatus) {
  if (isDatabaseConfigured && prisma) {
    try {
      return await prisma.collectionPurchase.update({ where: { id: purchaseId }, data: { emailStatus } });
    } catch (error) {
      logDatabaseFallback('setCollectionEmailStatus', error);
    }
  }

  return updateLocalStore((store) => {
    const record = store.purchases.find((item) => item.id === purchaseId);
    if (!record) return null;
    record.updatedAt = nowIso();
    record.emailStatus = emailStatus;
    return record;
  });
}
