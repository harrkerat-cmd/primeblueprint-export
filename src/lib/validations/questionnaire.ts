import { z } from "zod";
import type { QuestionConfig, QuestionType } from "@/lib/types";

const emailSchema = z.string().email("Please enter a valid email address.");

function schemaForType(type: QuestionType, question: QuestionConfig) {
  switch (type) {
    case "toggle":
      return z.boolean({ required_error: "Please choose an option." });
    case "slider":
    case "number":
      return z.number({ required_error: "Please choose a value." });
    case "multi":
      return z
        .array(z.string())
        .min(1, "Please choose at least one option.")
        .max(question.maxSelections ?? 6, `Please choose up to ${question.maxSelections ?? 6} options.`);
    default:
      return z.string().min(1, "Please complete this step.");
  }
}

export function validateQuestion(question: QuestionConfig, value: unknown) {
  const isEmptyArray = Array.isArray(value) && value.length === 0;

  if (!question.required && (value === undefined || value === null || value === "" || isEmptyArray)) {
    return { success: true } as const;
  }

  const baseSchema = question.id === "email" ? emailSchema : schemaForType(question.type, question);
  const result = baseSchema.safeParse(value);

  if (result.success) {
    return { success: true } as const;
  }

  return {
    success: false as const,
    message: result.error.issues[0]?.message ?? "Please complete this step."
  };
}

export const questionnaireStorageSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()])
);
