"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, MoveLeft, MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ReportCategory } from "@prisma/client";
import { Button } from "@/components/shared/button";
import { getCategoryByValue } from "@/config/site";
import { ProgressBar } from "@/components/questionnaire/progress-bar";
import { QuestionField } from "@/components/questionnaire/question-field";
import { Container } from "@/components/shared/container";
import { getVisibleQuestions } from "@/lib/questions";
import { clearLegacyQuestionnaireDraft } from "@/lib/questionnaire-session";
import type { QuestionnaireValues } from "@/lib/types";
import { questionnaireStorageSchema, validateQuestion } from "@/lib/validations/questionnaire";

const transition = { duration: 0.4, ease: "easeOut" as const };

type ReportRequestPayload = {
  id: string;
  answersJson?: QuestionnaireValues;
  lastSavedStep?: string | null;
  paymentStatus?: string;
};

export function QuestionnaireClient({ category }: { category: ReportCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryMeta = getCategoryByValue(category);
  const categorySlug = categoryMeta?.slug ?? "";
  const initialRequestId = searchParams?.get("requestId") ?? null;

  const [requestId, setRequestId] = useState<string | null>(initialRequestId);
  const [stepIndex, setStepIndex] = useState(0);
  const [screenState, setScreenState] = useState<"loading" | "form">("loading");
  const [statusMessage, setStatusMessage] = useState("Preparing your questionnaire...");
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireStorageSchema),
    defaultValues: {}
  });

  const watchedValues = form.watch();
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
    async (replacedRequestId?: string | null) => {
      setScreenState("loading");
      setLaunchError(null);
      setStatusMessage("Preparing your questionnaire...");
      setStepIndex(0);
      form.reset({});

      if (replacedRequestId) {
        await fetch(`/api/report-requests/${replacedRequestId}`, {
          method: "DELETE"
        });
      }

      const response = await fetch("/api/report-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      });

      if (!response.ok) {
        setLaunchError("We could not start your questionnaire yet.");
        return;
      }

      const data = await readJson<{ id?: string }>(response);
      if (!data?.id) {
        setLaunchError("We could not start your questionnaire yet.");
        return;
      }

      setRequestId(data.id);
      setScreenState("form");
      setStatusMessage("Questionnaire ready");
      router.replace(`/questionnaire/${categorySlug}?requestId=${data.id}`);
    },
    [category, categorySlug, form, readJson, router]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadQuestionnaire() {
      if (!initialRequestId) {
        await createFreshRequest();
        return;
      }

      setScreenState("loading");
      setLaunchError(null);
      setStatusMessage("Loading your questionnaire...");
      setRequestId(initialRequestId);

      const response = await fetch(`/api/report-requests/${initialRequestId}`, { cache: "no-store" });

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        await createFreshRequest(initialRequestId);
        return;
      }

      const data = await readJson<ReportRequestPayload>(response);

      if (cancelled) {
        return;
      }

      if (!data) {
        await createFreshRequest(initialRequestId);
        return;
      }

      if (data.paymentStatus && data.paymentStatus !== "DRAFT") {
        await createFreshRequest(initialRequestId);
        return;
      }

      const serverValues = questionnaireStorageSchema.safeParse(data.answersJson ?? {});
      const hydratedValues = serverValues.success ? serverValues.data : {};
      form.reset(hydratedValues);

      const hydratedQuestions = getVisibleQuestions(category, hydratedValues);
      const savedStepIndex = data.lastSavedStep
        ? Math.max(
            hydratedQuestions.findIndex((question) => question.id === data.lastSavedStep),
            0
          )
        : 0;

      setStepIndex(savedStepIndex);
      setScreenState("form");
      setStatusMessage("Questionnaire ready");
    }

    void loadQuestionnaire();

    return () => {
      cancelled = true;
    };
  }, [category, createFreshRequest, form, initialRequestId, readJson]);

  useEffect(() => {
    if (stepIndex > visibleQuestions.length - 1) {
      setStepIndex(Math.max(visibleQuestions.length - 1, 0));
    }
  }, [stepIndex, visibleQuestions.length]);

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
      if (!requestId) {
        setLaunchError("We could not prepare your preview. Please start again.");
        setScreenState("loading");
        return;
      }

      setStatusMessage("Preparing your preview...");
      const response = await fetch(`/api/report-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          answers: watchedValues,
          lastSavedStep: currentQuestion.id
        })
      });

      if (!response.ok) {
        setStatusMessage("Questionnaire ready");
        setLaunchError("We could not prepare your preview. Please try again.");
        setScreenState("loading");
        return;
      }

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
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="flex items-center gap-3 text-slate-500">
            {launchError ? <AlertTriangle className="h-5 w-5 text-amber-700" /> : <Loader2 className="h-5 w-5 animate-spin" />}
            {launchError ?? statusMessage}
          </div>
          {launchError ? (
            <div className="mt-6">
              <Button
                onClick={() => {
                  void createFreshRequest();
                }}
              >
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container className="py-20">
        <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-8 shadow-soft">
          <div className="flex items-center gap-3 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-semibold">We could not load this questionnaire cleanly.</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-amber-800">
            To keep the report flow safe, we recommend starting again with a clean blank questionnaire.
          </p>
          <Button className="mt-6" onClick={() => void createFreshRequest(requestId)}>
            Start again
          </Button>
        </div>
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
            One clear step at a time. Every new report starts from a blank questionnaire.
          </p>
          <div className="mt-8">
            <ProgressBar value={progress} />
          </div>
          <p className="mt-6 text-sm text-slate-500">{statusMessage}</p>
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
    </Container>
  );
}
