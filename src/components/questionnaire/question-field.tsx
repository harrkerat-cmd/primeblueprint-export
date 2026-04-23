"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Check } from "lucide-react";
import type { QuestionConfig, QuestionnaireValues } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuestionField({
  question,
  form
}: {
  question: QuestionConfig;
  form: UseFormReturn<QuestionnaireValues>;
}) {
  const error = form.formState.errors[question.id]?.message;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="font-display text-4xl tracking-tight text-navy-950 sm:text-5xl">{question.label}</h2>
        {question.helper ? <p className="text-sm leading-7 text-slate-500">{question.helper}</p> : null}
      </div>

      <Controller
        control={form.control}
        name={question.id}
        render={({ field }) => {
          if (question.type === "text") {
            return (
              <input
                {...field}
                value={typeof field.value === "string" ? field.value : ""}
                placeholder={question.placeholder}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-base text-navy-950 outline-none transition focus:border-navy-900"
              />
            );
          }

          if (question.type === "textarea") {
            return (
              <textarea
                {...field}
                rows={6}
                value={typeof field.value === "string" ? field.value : ""}
                placeholder={question.placeholder}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-base text-navy-950 outline-none transition focus:border-navy-900"
              />
            );
          }

          if (question.type === "select") {
            return (
              <select
                {...field}
                value={typeof field.value === "string" ? field.value : ""}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-base text-navy-950 outline-none transition focus:border-navy-900"
              >
                <option value="">Select one</option>
                {question.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          if (question.type === "slider") {
            return (
              <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{question.min}</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 font-semibold text-navy-950">
                    {field.value ?? question.min}
                    {question.suffix ? ` ${question.suffix}` : ""}
                  </span>
                  <span>{question.max}</span>
                </div>
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  step={question.step ?? 1}
                  value={typeof field.value === "number" ? field.value : question.min}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  className="w-full accent-[#10233b]"
                />
              </div>
            );
          }

          if (question.type === "toggle") {
            return (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false }
                ].map((option) => {
                  const selected = field.value === option.value;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "rounded-[24px] border p-5 text-left transition",
                        selected
                          ? "border-navy-950 bg-navy-950 text-white shadow-soft"
                          : "border-slate-200 bg-white text-slate-600"
                      )}
                    >
                      <div className="font-semibold">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            );
          }

          if (question.type === "multi") {
            const currentValues = Array.isArray(field.value) ? field.value : [];
            const selectionLimit = question.maxSelections ?? 6;

            return (
              <div className="space-y-4">
                <div className="text-sm text-slate-500">
                  {currentValues.length} selected{selectionLimit ? ` • up to ${selectionLimit}` : ""}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {question.options?.map((option) => {
                    const selected = currentValues.includes(option.value);
                    const limitReached = !selected && currentValues.length >= selectionLimit;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          if (selected) {
                            field.onChange(currentValues.filter((item) => item !== option.value));
                            return;
                          }

                          if (!limitReached) {
                            field.onChange([...currentValues, option.value]);
                          }
                        }}
                        disabled={limitReached}
                        className={cn(
                          "rounded-[24px] border p-5 text-left transition duration-300",
                          selected
                            ? "border-navy-950 bg-navy-950 text-white shadow-soft"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                          limitReached && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{option.label}</p>
                            {option.description ? (
                              <p className={cn("mt-2 text-sm", selected ? "text-white/75" : "text-slate-500")}>
                                {option.description}
                              </p>
                            ) : null}
                          </div>
                          {selected ? <Check className="h-4 w-4" /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isCompact = question.type === "pill";
          return (
            <div className={cn("grid gap-4", isCompact ? "sm:grid-cols-2" : "") }>
              {question.options?.map((option) => {
                const selected = field.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "rounded-[24px] border p-5 text-left transition duration-300",
                      selected
                        ? "border-navy-950 bg-navy-950 text-white shadow-soft"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <p className="font-semibold">{option.label}</p>
                    {option.description ? (
                      <p className={cn("mt-2 text-sm", selected ? "text-white/75" : "text-slate-500")}>
                        {option.description}
                      </p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          );
        }}
      />

      {error ? <p className="text-sm font-medium text-red-600">{String(error)}</p> : null}
    </div>
  );
}
