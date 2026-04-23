import type { ReportCategory } from '@prisma/client';

function buildPrefix(category: ReportCategory) {
  return `primeblueprint:${category}`;
}

export function getQuestionnaireDraftStorageKey(category: ReportCategory, requestId: string) {
  return `${buildPrefix(category)}:draft:${requestId}`;
}

export function getQuestionnaireActiveRequestKey(category: ReportCategory) {
  return `${buildPrefix(category)}:active-request`;
}

export function getQuestionnaireIgnoredDraftsKey(category: ReportCategory) {
  return `${buildPrefix(category)}:ignored-drafts`;
}

export function readIgnoredDraftIds(category: ReportCategory) {
  if (typeof window === 'undefined') {
    return [] as string[];
  }

  try {
    const raw = window.localStorage.getItem(getQuestionnaireIgnoredDraftsKey(category));
    if (!raw) {
      return [] as string[];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [] as string[];
  }
}

export function addIgnoredDraftId(category: ReportCategory, requestId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const ids = new Set(readIgnoredDraftIds(category));
  ids.add(requestId);
  window.localStorage.setItem(getQuestionnaireIgnoredDraftsKey(category), JSON.stringify([...ids]));
}

export function removeIgnoredDraftId(category: ReportCategory, requestId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const ids = readIgnoredDraftIds(category).filter((value) => value !== requestId);
  if (ids.length === 0) {
    window.localStorage.removeItem(getQuestionnaireIgnoredDraftsKey(category));
    return;
  }

  window.localStorage.setItem(getQuestionnaireIgnoredDraftsKey(category), JSON.stringify(ids));
}

export function setActiveQuestionnaireRequest(category: ReportCategory, requestId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(getQuestionnaireActiveRequestKey(category), requestId);
  window.sessionStorage.setItem(getQuestionnaireActiveRequestKey(category), requestId);
}

export function clearQuestionnaireSession(category: ReportCategory, requestId?: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (requestId) {
    window.localStorage.removeItem(getQuestionnaireDraftStorageKey(category, requestId));
    window.sessionStorage.removeItem(getQuestionnaireDraftStorageKey(category, requestId));
    removeIgnoredDraftId(category, requestId);
  }

  const activeKey = getQuestionnaireActiveRequestKey(category);
  const activeRequestId = window.localStorage.getItem(activeKey);
  if (!requestId || activeRequestId === requestId) {
    window.localStorage.removeItem(activeKey);
    window.sessionStorage.removeItem(activeKey);
  }
}

export function clearLegacyQuestionnaireDraft(category: ReportCategory) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(`${buildPrefix(category)}:draft`);
  window.sessionStorage.removeItem(`${buildPrefix(category)}:draft`);
}
