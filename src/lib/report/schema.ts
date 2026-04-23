export const reportJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "brandName",
    "brandTagline",
    "title",
    "subtitle",
    "coverLine",
    "categoryLabel",
    "packageName",
    "packageSummary",
    "preparedFor",
    "goal",
    "createdAtLabel",
    "snapshot",
    "pages",
    "closingMessage",
    "supportLine",
    "disclaimers"
  ],
  properties: {
    brandName: { type: "string" },
    brandTagline: { type: "string" },
    title: { type: "string" },
    subtitle: { type: "string" },
    coverLine: { type: "string" },
    categoryLabel: { type: "string" },
    packageName: { type: "string" },
    packageSummary: { type: "string" },
    preparedFor: { type: "string" },
    goal: { type: "string" },
    createdAtLabel: { type: "string" },
    snapshot: {
      type: "object",
      additionalProperties: false,
      required: ["name", "category", "goal", "currentSituation", "mainChallenge", "focusTimeline", "packageName"],
      properties: {
        name: { type: "string" },
        category: { type: "string" },
        goal: { type: "string" },
        currentSituation: { type: "string" },
        mainChallenge: { type: "string" },
        focusTimeline: { type: "string" },
        packageName: { type: "string" }
      }
    },
    pages: {
      type: "array",
      minItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          subtitle: { type: "string" },
          intro: { type: "string" },
          note: { type: "string" },
          paragraphs: { type: "array", items: { type: "string" } },
          checklist: { type: "array", items: { type: "string" } },
          bulletGroups: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["title", "items"],
              properties: {
                title: { type: "string" },
                items: { type: "array", items: { type: "string" } }
              }
            }
          },
          callouts: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "title", "body"],
              properties: {
                label: { type: "string" },
                title: { type: "string" },
                body: { type: "string" }
              }
            }
          },
          resources: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["name", "description"],
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                referenceLabel: { type: "string" }
              }
            }
          },
          routineEntries: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["day", "focus", "actions"],
              properties: {
                day: { type: "string" },
                focus: { type: "string" },
                actions: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    },
    closingMessage: { type: "string" },
    supportLine: { type: "string" },
    disclaimers: { type: "array", items: { type: "string" } },
    reviewedReferenceStamp: { type: "string" }
  }
} as const;
