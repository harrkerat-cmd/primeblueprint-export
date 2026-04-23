"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, MoveLeft, MoveRight, RotateCcw, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ReportCategory } from "@prisma/client";
import { Button } from "@/components/shared/button";
import { getCategoryByValue } from "@/config/site";
import { ProgressBar } from "@/components/questionnaire/progress-bar";
import { QuestionField } from "@/components/questionnaire/question-field";
import { Container } from "@/components/shared/container";
import { getVisibleQuestions } from "@/lib/questions";
import {
  addIgnoredDraftId,
  clearQuestionnaireSession,
  clearLegacyQuestionnaireDraft,
  getQuestionnaireDraftStorageKey,
  readIgnoredDraftIds,
  removeIgnoredDraftId,
  setActiveQuestionnaireRequest
} from "@/lib/questionnaire-session";
import type { QuestionnaireValues } from "@/lib/types";
import { questionnaireStorageSchema, validateQuestion } from "@/lib/validations/questionnaire";

const transition = { duration: 0.4, ease: "easeOut" as const };

type ReportRequestPayload = {
  id: string;
  answersJson?: QuestionnaireValues;
  updatedAt?: string;
  userName?: string | null;
  email?: string | null;
  lastSavedStep?: string | null;
  paymentStatus?: string;
  category?: ReportCategory;
};

export function QuestionnaireClient({ category }: { category: ReportCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryMeta = getCategoryByValue(category);
  const categorySlug = categoryMeta?.slug ?? "";
  const initialRequestId = searchParams?.get("requestId") ?? null;

  const [requestId, setRequestId] = useState<string | null>(initialRequestId);
  const [stepIndex, setStepIndex] = useState(0);
  const [screenState, setScreenState] = useState<"loading" | "choice" | "form">(initialRequestId ? "form" : "loading");
  const [saveState, setSaveState] = useState(initialRequestId ? "Checking your draft..." : "Preparing your private draft...");
  const [resumeDraft, setResumeDraft] = useState<ReportRequestPayload | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireStorageSchema),
    defaultValues: {}
  });

  const watchedValues = form.watch();
  const storageKey = requestId ? getQuestionnaireDraftStorageKey(category, requestId) : null;
  const visibleQuestions = useMemo(() => getVisibleQuestions(category, watchedValues), [category, watchedValues]);
  const currentQuestion = visibleQuestions[stepIndex];
  const progress = Math.max(8, Math.round(((stepIndex + 1) / Math.max(visibleQuestions.length, 1)) * 100));

  const readJson = useCallback(async <T,>(response: Response) => {
    try {
      return (await response.json()) as T;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    clearLegacyQuestionnaireDraft(category);
  }, [category]);

  const createFreshRequest = useCallback(
    async (ignoredRequestId?: string | null) => {
      if (ignoredRequestId) {
        await fetch(`/api/report-requests/${ignoredRequestId}`, {
          method: "DELETE"
        });
        addIgnoredDraftId(category, ignoredRequestId);
        clearQuestionnaireSession(category, ignoredRequestId);
      }

      setScreenState("loading");
      setResumeDraft(null);
      setSaveState("Preparing your fresh draft...");
      setStepIndex(0);
      form.reset({});

      const response = await fetch("/api/report-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      });

      if (!response.ok) {
        setSaveState("We could not create your draft yet.");
        return;
      }

      const data = await readJson<{ id?: string }>(response);
      if (!data?.id) {
        setSaveState("We could not create your draft yet.");
        return;
      }

      removeIgnoredDraftId(category, data.id);
      setActiveQuestionnaireRequest(category, data.id);
      setRequestId(data.id);
      setScreenState("form");
      setSaveState("Fresh draft ready");
      router.replace(`/questionnaire/${categorySlug}?requestId=${data.id}`);
    },
    [category, categorySlug, form, readJson, router]
  );

  useEffect(() => {
    if (initialRequestId) {
      setRequestId(initialRequestId);
      setScreenState("form");
      return;
    }

    let cancelled = false;

    async function loadDraftChoice() {
      setScreenState("loading");
      const response = await fetch(`/api/report-requests?category=${category}`, { cache: "no-store" });
      const data = response.ok ? await readJson<{ draft?: ReportRequestPayload | null }>(response) : null;
      const draft = data?.draft ?? null;
      const ignoredDraftIds = readIgnoredDraftIds(category);

      if (cancelled) {
        return;
      }

      if (draft && !ignoredDraftIds.includes(draft.id)) {
        setResumeDraft(draft);
        setScreenState("choice");
        setSaveState("Unfinished draft found");
        return;
      }

      await createFreshRequest();
    }

    void loadDraftChoice();

    return () => {
      cancelled = true;
    };
  }, [category, createFreshRequest, initialRequestId, readJson]);

  useEffect(() => {
    async function hydrateCurrentRequest() {
      if (!requestId || screenState !== "form") {
        return;
      }

      setSaveState("Loading your draft...");

      let localValues: QuestionnaireValues = {};
      if (storageKey) {
        const localDraft = window.localStorage.getItem(storageKey);
        if (localDraft) {
          try {
            const parsed = questionnaireStorageSchema.safeParse(JSON.parse(localDraft));
            if (parsed.success) {
              localValues = parsed.data;
            } else {
              window.localStorage.removeItem(storageKey);
            }
          } catch {
            window.localStorage.removeItem(storageKey);
          }
        }
      }

      const response = await fetch(`/api/report-requests/${requestId}`, { cache: "no-store" });
      if (!response.ok) {
        setSaveState("This draft could not be loaded.");
        return;
      }

      const data = await readJson<ReportRequestPayload>(response);
      if (!data) {
        setSaveState("This draft could not be loaded.");
        return;
      }

      if (data.paymentStatus && data.paymentStatus !== "DRAFT") {
        clearQuestionnaireSession(category, requestId);
        await createFreshRequest(requestId);
        return;
      }

      const serverValues = questionnaireStorageSchema.safeParse(data.answersJson ?? {});
      const mergedValues = {
        ...(serverValues.success ? serverValues.data : {}),
        ...localValues
      };

      form.reset(mergedValues);
      if (storageKey) {
        window.localStorage.setItem(storageKey, JSON.stringify(mergedValues));
      }

      const mergedQuestions = getVisibleQuestions(category, mergedValues);
      const savedStepIndex = data.lastSavedStep
        ? Math.max(
            mergedQuestions.findIndex((question) => question.id === data.lastSavedStep),
            0
          )
        : 0;
      setStepIndex(savedStepIndex);
      setSaveState(Object.keys(mergedValues).length > 0 ? "Draft restored" : "Fresh draft ready");
      setActiveQuestionnaireRequest(category, requestId);
    }

    void hydrateCurrentRequest();
  }, [category, createFreshRequest, form, readJson, requestId, screenState, storageKey]);

  useEffect(() => {
    if (!requestId || !storageKey || screenState !== "form") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(watchedValues));
  }, [requestId, screenState, storageKey, watchedValues]);

  useEffect(() => {
    if (stepIndex > visibleQuestions.length - 1) {
      setStepIndex(Math.max(visibleQuestions.length - 1, 0));
    }
  }, [stepIndex, visibleQuestions.length]);

  useEffect(() => {
    if (!requestId || screenState !== "form") {
      return;
    }

    const timer = window.setTimeout(async () => {
      setSaveState("Saving draft...");
      const response = await fetch(`/api/report-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          answers: watchedValues,
          lastSavedStep: currentQuestion?.id
        })
      });

      setSaveState(response.ok ? "Draft saved" : "Save failed - working locally");
    }, 500);

    return () => window.clearTimeout(timer);
  }, [category, currentQuestion?.id, requestId, screenState, watchedValues]);

  const handleResumeDraft = useCallback(() => {
    if (!resumeDraft?.id) {
      return;
    }

    removeIgnoredDraftId(category, resumeDraft.id);
    setActiveQuestionnaireRequest(category, resumeDraft.id);
    setRequestId(resumeDraft.id);
    setScreenState("form");
    setSaveState("Loading your saved draft...");
    router.replace(`/questionnaire/${categorySlug}?requestId=${resumeDraft.id}`);
  }, [category, categorySlug, resumeDraft?.id, router]);

  const handleStartFresh = useCallback(async () => {
    setShowResetConfirm(false);
    await createFreshRequest(requestId ?? resumeDraft?.id ?? null);
  }, [createFreshRequest, requestId, resumeDraft?.id]);

  const handleNext = async () => {
    if (!currentQuestion) {
      return;
    }

    const result = validateQuestion(currentQuestion, watchedValues[currentQuestion.id]);
    if (!result.success) {
      form.setError(currentQuestion.id, { message: result.message });
      return;
    }

    form.clearErrors(currentQuestion.id);

    if (stepIndex === visibleQuestions.length - 1) {
      startTransition(() => {
        router.push(`/preview/${requestId}`);
      });
      return;
    }

    setStepIndex((previous) => Math.min(previous + 1, visibleQuestions.length - 1));
  };

  const handleBack = () => {
    setStepIndex((previous) => Math.max(previous - 1, 0));
  };

  if (screenState === "loading") {
    const isLaunchError = saveState.includes("could not");
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="flex items-center gap-3 text-slate-500">
            {isLaunchError ? <AlertTriangle className="h-5 w-5 text-amber-700" /> : <Loader2 className="h-5 w-5 animate-spin" />}
            {saveState}
          </div>
          {isLaunchError ? (
            <div className="mt-6">
              <Button
                onClick={() => {
                  void createFreshRequest();
                }}
              >
                Retry fresh draft
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    );
  }

  if (screenState === "choice") {
    return (
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-premium sm:p-10">
          <BadgeLine label="Saved draft found" />
          <h1 className="mt-5 font-display text-4xl tracking-tight text-navy-950 sm:text-5xl">
            Resume your previous draft or start fresh
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            We found an unfinished {categoryMeta?.title?.toLowerCase()} report draft. Choose whether you want to continue from where you left off or start again with a clean blank form.
          </p>

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            <p className="font-semibold text-navy-950">Draft details</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Name</p>
                <p className="mt-2 text-sm text-slate-700">{resumeDraft?.userName ?? 'Not added yet'}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Last saved step</p>
                <p className="mt-2 text-sm text-slate-700">{resumeDraft?.lastSavedStep ?? 'Earlier in the flow'}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button onClick={handleResumeDraft}>Resume previous draft</Button>
            <Button variant="secondary" onClick={() => setShowResetConfirm(true)}>
              Start a fresh report
            </Button>
          </div>
        </div>

        {showResetConfirm ? (
          <ConfirmResetModal
            onCancel={() => setShowResetConfirm(false)}
            onConfirm={() => {
              void handleStartFresh();
            }}
          />
        ) : null}
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-8 shadow-soft">
          <div className="flex items-center gap-3 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-semibold">We could not restore this draft cleanly.</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-amber-800">
            To keep the launch flow safe, we recommend starting a fresh report instead of using a broken draft state.
          </p>
          <Button className="mt-6" onClick={() => setShowResetConfirm(true)}>
            Start a fresh report
          </Button>
        </div>
        {showResetConfirm ? (
          <ConfirmResetModal
            onCancel={() => setShowResetConfirm(false)}
            onConfirm={() => {
              void handleStartFresh();
            }}
          />
        ) : null}
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.33fr_0.67fr]">
        <aside className="h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft lg:sticky lg:top-28">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Questionnaire</p>
          <h1 className="mt-4 font-display text-4xl text-navy-950">{categoryMeta?.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            One clear step at a time. This draft only belongs to the current report attempt.
          </p>
          <div className="mt-8">
            <ProgressBar value={progress} />
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <Save className="h-4 w-4" />
            {saveState}
          </div>
          <div className="mt-6">
            <Button variant="ghost" className="w-full justify-center" onClick={() => setShowResetConfirm(true)}>
              <RotateCcw className="h-4 w-4" />
              Start a fresh report
            </Button>
          </div>
        </aside>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-premium sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={transition}
            >
              <QuestionField question={currentQuestion} form={form} />
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button variant="secondary" onClick={handleBack} disabled={stepIndex === 0}>
              <MoveLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={isPending}>
              {stepIndex === visibleQuestions.length - 1 ? "Continue to preview" : "Next question"}
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoveRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {showResetConfirm ? (
        <ConfirmResetModal
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={() => {
            void handleStartFresh();
          }}
        />
      ) : null}
    </Container>
  );
}

function BadgeLine({ label }: { label: string }) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
      {label}
    </div>
  );
}

function ConfirmResetModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/45 px-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-premium">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Confirm reset</p>
        <h2 className="mt-4 font-display text-3xl text-navy-950">Start a fresh report?</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          This will open a new blank questionnaire for this category and stop using the current saved draft in this browser.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel}>
            Keep current draft
          </Button>
          <Button onClick={onConfirm}>Start fresh</Button>
        </div>
      </div>
    </div>
  );
}
