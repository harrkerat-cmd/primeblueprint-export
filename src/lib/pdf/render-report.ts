import { PDFDocument } from "pdf-lib";
import type { GeneratedReportContent, ReportPage } from "@/lib/types";
import {
  CONTENT_WIDTH,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  SMALL,
  addInteriorChrome,
  drawBulletList,
  drawCalloutBox,
  drawContentsPage,
  drawCoverPage,
  drawInfoGrid,
  drawIntroCard,
  drawParagraph,
  drawResourceCard,
  drawRoutineColumns,
  drawSectionHeading,
  drawChecklist,
  embedPrimeBlueprintFonts,
  NAVY,
  NAVY_SOFT,
  SLATE,
  MUTED
} from "@/lib/pdf/design-system";
import type { ReportBulletGroup, ReportCallout, ReportResource, RoutineEntry } from "@/lib/types";

const CONTENTS_PAGE_SIZE = 8;

function chunkSections<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function getCoverSummaryPoints(content: GeneratedReportContent) {
  return [
    "A private report structure built around the client snapshot, stated priorities, and category-specific direction.",
    "Strategic interpretation of the current situation, common blind spots, and the next steps that deserve attention first.",
    "Structured pages with action priorities, frameworks, guidance notes, and practical routines where relevant.",
    "A premium PrimeBlueprint layout designed to feel like a real advisory blueprint, not a generic export."
  ];
}

function buildContents(content: GeneratedReportContent, contentsPageCount: number) {
  const firstBodyPage = 2 + contentsPageCount + 1;
  return content.pages.map((section, index) => ({
    index: index + 1,
    title: section.title,
    detail: section.subtitle,
    pageNumber: firstBodyPage + index
  }));
}

function drawReportPage({
  pdfDoc,
  fonts,
  content,
  section,
  sectionIndex,
  pageNumber
}: {
  pdfDoc: PDFDocument;
  fonts: Awaited<ReturnType<typeof embedPrimeBlueprintFonts>>;
  content: GeneratedReportContent;
  section: ReportPage;
  sectionIndex: number;
  pageNumber: number;
}) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  addInteriorChrome({
    page,
    fonts,
    productLabel: "Personalized report",
    pageLabel: content.coverLine,
    pageNumber,
    footerLeft: `Prepared for ${content.preparedFor}`,
    footerCenter: content.packageName
  });

  let y = drawSectionHeading({
    page,
    fonts,
    index: sectionIndex,
    title: section.title,
    subtitle: section.subtitle
  });

  if (section.intro) {
    y = drawIntroCard({ page, fonts, text: section.intro, y });
  }

  for (const paragraph of section.paragraphs ?? []) {
    y = drawParagraph({
      page,
      text: paragraph,
      x: MARGIN,
      y,
      font: fonts.body,
      size: 10.8,
      maxWidth: CONTENT_WIDTH,
      lineGap: 5
    }) - 12;
  }

  for (const callout of section.callouts ?? []) {
    y = drawCalloutBox({
      page,
      fonts,
      label: callout.label,
      title: callout.title,
      body: callout.body,
      y,
      tone: callout.label.toLowerCase().includes("priority") || callout.label.toLowerCase().includes("warning") ? "dark" : "light"
    });
  }

  for (const group of section.bulletGroups ?? []) {
    y = drawBulletList({ page, fonts, title: group.title, items: group.items, y });
  }

  for (const resource of section.resources ?? []) {
    y = drawResourceCard({
      page,
      fonts,
      name: resource.name,
      description: resource.description,
      referenceLabel: resource.referenceLabel,
      y
    });
  }

  if (section.routineEntries?.length) {
    y = drawRoutineColumns({
      page,
      fonts,
      title: "Routine structure",
      entries: section.routineEntries,
      y
    });
  }

  if (section.checklist?.length) {
    y = drawChecklist({
      page,
      fonts,
      title: "Action checklist",
      items: section.checklist,
      y
    });
  }

  if (section.note) {
    drawParagraph({
      page,
      text: section.note,
      x: MARGIN,
      y: Math.max(y, 88),
      font: fonts.body,
      size: SMALL,
      maxWidth: CONTENT_WIDTH,
      color: MUTED,
      lineGap: 3
    });
  }

  if (sectionIndex === content.pages.length && content.disclaimers.length > 0) {
    let disclaimerY = 102;
    page.drawText("Important notes", {
      x: MARGIN,
      y: disclaimerY,
      size: 10,
      font: fonts.bodyBold,
      color: NAVY
    });
    disclaimerY -= 18;

    for (const disclaimer of content.disclaimers) {
      disclaimerY = drawParagraph({
        page,
        text: disclaimer,
        x: MARGIN,
        y: disclaimerY,
        font: fonts.body,
        size: SMALL,
        maxWidth: CONTENT_WIDTH,
        color: MUTED,
        lineGap: 3
      }) - 6;
    }

    drawParagraph({
      page,
      text: `${content.closingMessage} ${content.supportLine}`,
      x: MARGIN,
      y: 66,
      font: fonts.body,
      size: SMALL,
      maxWidth: CONTENT_WIDTH,
      color: MUTED,
      lineGap: 3
    });
  }
}

async function renderComplexReportPdf(content: GeneratedReportContent) {
  const pdfDoc = await PDFDocument.create();
  const fonts = await embedPrimeBlueprintFonts(pdfDoc);
  const includeContentsPage = content.pages.length >= 5;
  const contentsEntries = includeContentsPage ? buildContents(content, Math.ceil(content.pages.length / CONTENTS_PAGE_SIZE)) : [];
  const contentsChunks = includeContentsPage ? chunkSections(contentsEntries, CONTENTS_PAGE_SIZE) : [];
  let pageNumber = 1;

  const cover = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawCoverPage({
    page: cover,
    fonts,
    eyebrow: content.categoryLabel,
    title: content.title,
    subtitle: content.subtitle,
    tagline: content.brandTagline,
    preparedLabel: `Prepared for ${content.preparedFor}`,
    meta: [
      { label: "Category", value: content.categoryLabel },
      { label: "Goal", value: content.goal },
      { label: "Package", value: content.packageName },
      { label: "Prepared", value: content.createdAtLabel },
      { label: "Current situation", value: content.snapshot.currentSituation },
      { label: "Main challenge", value: content.snapshot.mainChallenge }
    ],
    summaryPoints: getCoverSummaryPoints(content),
    footerLine: "Built around your goals. Written for your next move.",
    productLabel: "Private advisory blueprint"
  });
  pageNumber += 1;

  if (includeContentsPage) {
    contentsChunks.forEach((chunk, chunkIndex) => {
      const toc = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawContentsPage({
        page: toc,
        fonts,
        title: chunkIndex === 0 ? "How this report is structured" : "How this report is structured — continued",
        subtitle:
          chunkIndex === 0
            ? "The opening pages focus on diagnosis and direction. Later sections shift into frameworks, practical guidance, routines, and next-step clarity."
            : "The report continues into deeper support pages, practical routines, and extended working guidance.",
        sections: chunk,
        pageNumber,
        footerLeft: `Prepared for ${content.preparedFor}`,
        footerCenter: content.packageName,
        productLabel: "Personalized report",
        pageLabel: content.coverLine
      });
      pageNumber += 1;
    });

    const orientation = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawContentsPage({
      page: orientation,
      fonts,
      title: "How to use this report properly",
      subtitle: "This orientation page keeps the early experience clean and practical: understand the diagnosis first, then move through the report as a working blueprint rather than a one-time read.",
      sections: [
        { index: 1, title: "Read the diagnosis carefully", detail: "The first pages explain the deeper pattern, not just the visible goal.", pageNumber: 1 },
        { index: 2, title: "Protect the first focus", detail: "Use the report to identify the right first move before widening the strategy.", pageNumber: 2 },
        { index: 3, title: "Use the support pages actively", detail: "Routines, resources, and action checklists are there to be applied, not skimmed.", pageNumber: 3 },
        { index: 4, title: "Review weekly and adjust", detail: "The strongest results come from returning to the report and refining the plan with evidence.", pageNumber: 4 }
      ],
      pageNumber,
      footerLeft: `Prepared for ${content.preparedFor}`,
      footerCenter: content.packageName,
      productLabel: "Personalized report",
      pageLabel: content.coverLine
    });

    let snapshotY = 292;
    snapshotY = drawInfoGrid({
      page: orientation,
      fonts,
      title: "Client snapshot",
      items: [
        { label: "Name", value: content.snapshot.name },
        { label: "Category", value: content.snapshot.category },
        { label: "Goal", value: content.snapshot.goal },
        { label: "Current situation", value: content.snapshot.currentSituation },
        { label: "Main challenge", value: content.snapshot.mainChallenge },
        { label: "Focus timeline", value: content.snapshot.focusTimeline },
        { label: "Package", value: content.snapshot.packageName },
        { label: "Prepared", value: content.createdAtLabel }
      ],
      y: snapshotY
    });

    drawCalloutBox({
      page: orientation,
      fonts,
      label: "Orientation",
      title: "This report is built as a working blueprint",
      body: "Use the first pages to understand the diagnosis clearly, then use the later sections to turn that clarity into decisions, routines, and next actions. The strongest results will come from applying the high-priority steps first rather than trying to do everything at once.",
      y: snapshotY - 8,
      tone: "dark"
    });
    pageNumber += 1;
  }

  content.pages.forEach((section, index) => {
    drawReportPage({
      pdfDoc,
      fonts,
      content,
      section,
      sectionIndex: index + 1,
      pageNumber
    });
    pageNumber += 1;
  });

  return Buffer.from(await pdfDoc.save());
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => toText(item)).filter(Boolean) : [];
}

function normalizeBulletGroups(value: unknown): ReportBulletGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((group, index) => {
    const record = group && typeof group === "object" ? (group as Record<string, unknown>) : {};
    return {
      title: toText(record.title, `Key points ${index + 1}`),
      items: toStringArray(record.items)
    };
  });
}

function normalizeCallouts(value: unknown): ReportCallout[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((callout, index) => {
    const record = callout && typeof callout === "object" ? (callout as Record<string, unknown>) : {};
    return {
      label: toText(record.label, `Note ${index + 1}`),
      title: toText(record.title, "Important"),
      body: toText(record.body)
    };
  });
}

function normalizeResources(value: unknown): ReportResource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((resource) => {
    const record = resource && typeof resource === "object" ? (resource as Record<string, unknown>) : {};
    return {
      name: toText(record.name, "Resource"),
      description: toText(record.description),
      referenceLabel: toText(record.referenceLabel) || undefined
    };
  });
}

function normalizeRoutineEntries(value: unknown): RoutineEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry, index) => {
    const record = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
    return {
      day: toText(record.day, `Day ${index + 1}`),
      focus: toText(record.focus),
      actions: toStringArray(record.actions)
    };
  });
}

function normalizeReportContent(content: GeneratedReportContent): GeneratedReportContent {
  const snapshotRecord =
    content.snapshot && typeof content.snapshot === "object" ? (content.snapshot as Record<string, unknown>) : {};

  return {
    brandName: toText(content.brandName, "PrimeBlueprint"),
    brandTagline: toText(content.brandTagline),
    title: toText(content.title, "Personalized Report"),
    subtitle: toText(content.subtitle),
    coverLine: toText(content.coverLine),
    categoryLabel: toText(content.categoryLabel, "Personalized Report"),
    packageName: toText(content.packageName, "Premium PDF"),
    packageSummary: toText(content.packageSummary),
    preparedFor: toText(content.preparedFor, "Client"),
    goal: toText(content.goal),
    createdAtLabel: toText(content.createdAtLabel),
    snapshot: {
      name: toText(snapshotRecord.name, "Client"),
      category: toText(snapshotRecord.category),
      goal: toText(snapshotRecord.goal),
      currentSituation: toText(snapshotRecord.currentSituation),
      mainChallenge: toText(snapshotRecord.mainChallenge),
      focusTimeline: toText(snapshotRecord.focusTimeline),
      packageName: toText(snapshotRecord.packageName)
    },
    pages: Array.isArray(content.pages)
      ? content.pages.map((page, index) => {
          const record = page && typeof page === "object" ? (page as Record<string, unknown>) : {};
          return {
            id: toText(record.id, `page-${index + 1}`),
            title: toText(record.title, `Page ${index + 1}`),
            subtitle: toText(record.subtitle) || undefined,
            intro: toText(record.intro) || undefined,
            paragraphs: toStringArray(record.paragraphs),
            bulletGroups: normalizeBulletGroups(record.bulletGroups),
            callouts: normalizeCallouts(record.callouts),
            checklist: toStringArray(record.checklist),
            resources: normalizeResources(record.resources),
            routineEntries: normalizeRoutineEntries(record.routineEntries),
            note: toText(record.note) || undefined
          };
        })
      : [],
    closingMessage: toText(content.closingMessage),
    supportLine: toText(content.supportLine),
    disclaimers: toStringArray(content.disclaimers),
    reviewedReferenceStamp: toText(content.reviewedReferenceStamp) || undefined
  };
}

function logPdfInputShape(content: GeneratedReportContent) {
  const shape = {
    title: content.title,
    categoryLabel: content.categoryLabel,
    packageName: content.packageName,
    preparedFor: content.preparedFor,
    pageCount: content.pages.length,
    pageIds: content.pages.slice(0, 8).map((page) => page.id),
    paragraphCounts: content.pages.slice(0, 8).map((page) => page.paragraphs?.length ?? 0),
    bulletGroupCounts: content.pages.slice(0, 8).map((page) => page.bulletGroups?.length ?? 0),
    resourceCounts: content.pages.slice(0, 8).map((page) => page.resources?.length ?? 0),
    routineCounts: content.pages.slice(0, 8).map((page) => page.routineEntries?.length ?? 0),
    disclaimerCount: content.disclaimers.length
  };

  console.info("[pdf-build] Input shape", JSON.stringify(shape));
}

async function renderFlatFallbackPdf(content: GeneratedReportContent) {
  const pdfDoc = await PDFDocument.create();
  const fonts = await embedPrimeBlueprintFonts(pdfDoc);
  let pageNumber = 1;

  const cover = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawCoverPage({
    page: cover,
    fonts,
    eyebrow: content.categoryLabel,
    title: content.title,
    subtitle: content.subtitle,
    tagline: content.brandTagline,
    preparedLabel: `Prepared for ${content.preparedFor}`,
    meta: [
      { label: "Category", value: content.categoryLabel },
      { label: "Goal", value: content.goal },
      { label: "Package", value: content.packageName },
      { label: "Prepared", value: content.createdAtLabel }
    ],
    summaryPoints: getCoverSummaryPoints(content),
    footerLine: "Built around your goals. Written for your next move.",
    productLabel: "Private advisory blueprint"
  });
  pageNumber += 1;

  for (const [index, section] of content.pages.entries()) {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    addInteriorChrome({
      page,
      fonts,
      productLabel: "Personalized report",
      pageLabel: content.coverLine,
      pageNumber,
      footerLeft: `Prepared for ${content.preparedFor}`,
      footerCenter: content.packageName
    });

    let y = drawSectionHeading({
      page,
      fonts,
      index: index + 1,
      title: section.title,
      subtitle: section.subtitle
    });

    if (section.intro) {
      y = drawParagraph({
        page,
        text: section.intro,
        x: MARGIN,
        y,
        font: fonts.body,
        size: 10,
        maxWidth: CONTENT_WIDTH,
        color: NAVY_SOFT,
        lineGap: 4
      }) - 12;
    }

    for (const paragraph of section.paragraphs ?? []) {
      y = drawParagraph({
        page,
        text: paragraph,
        x: MARGIN,
        y,
        font: fonts.body,
        size: 10,
        maxWidth: CONTENT_WIDTH,
        color: SLATE,
        lineGap: 4
      }) - 10;
    }

    for (const group of section.bulletGroups ?? []) {
      y = drawParagraph({
        page,
        text: `${group.title}: ${(group.items ?? []).join(" | ")}`,
        x: MARGIN,
        y,
        font: fonts.body,
        size: 9.5,
        maxWidth: CONTENT_WIDTH,
        color: SLATE,
        lineGap: 4
      }) - 10;
    }

    for (const callout of section.callouts ?? []) {
      y = drawParagraph({
        page,
        text: `${callout.label}: ${callout.title}. ${callout.body}`,
        x: MARGIN,
        y,
        font: fonts.body,
        size: 9.5,
        maxWidth: CONTENT_WIDTH,
        color: NAVY_SOFT,
        lineGap: 4
      }) - 10;
    }

    for (const item of section.checklist ?? []) {
      y = drawParagraph({
        page,
        text: `Checklist: ${item}`,
        x: MARGIN,
        y,
        font: fonts.body,
        size: 9.2,
        maxWidth: CONTENT_WIDTH,
        color: SLATE,
        lineGap: 4
      }) - 8;
    }

    for (const resource of section.resources ?? []) {
      const resourceLine = [resource.name, resource.description, resource.referenceLabel].filter(Boolean).join(" — ");
      y = drawParagraph({
        page,
        text: resourceLine,
        x: MARGIN,
        y,
        font: fonts.body,
        size: 9.2,
        maxWidth: CONTENT_WIDTH,
        color: SLATE,
        lineGap: 4
      }) - 8;
    }

    for (const entry of section.routineEntries ?? []) {
      y = drawParagraph({
        page,
        text: `${entry.day}: ${entry.focus}. ${(entry.actions ?? []).join(" | ")}`,
        x: MARGIN,
        y,
        font: fonts.body,
        size: 9.2,
        maxWidth: CONTENT_WIDTH,
        color: SLATE,
        lineGap: 4
      }) - 8;
    }

    if (section.note) {
      drawParagraph({
        page,
        text: section.note,
        x: MARGIN,
        y: Math.max(y, 88),
        font: fonts.body,
        size: SMALL,
        maxWidth: CONTENT_WIDTH,
        color: MUTED,
        lineGap: 3
      });
    }

    pageNumber += 1;
  }

  return Buffer.from(await pdfDoc.save());
}

export async function renderReportPdf({
  content
}: {
  content: GeneratedReportContent;
  category: string;
  packageId: string;
  userName: string;
  createdAt: Date;
}) {
  const normalizedContent = normalizeReportContent(content);
  logPdfInputShape(normalizedContent);

  try {
    return await renderComplexReportPdf(normalizedContent);
  } catch (error) {
    console.error("[pdf-build] Complex renderer failed, falling back to flat renderer.", error);

    try {
      return await renderFlatFallbackPdf(normalizedContent);
    } catch (fallbackError) {
      const complexMessage = error instanceof Error ? error.message : "Unknown complex PDF error";
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : "Unknown fallback PDF error";
      throw new Error(`PDF rendering failed. Complex renderer: ${complexMessage}. Fallback renderer: ${fallbackMessage}.`);
    }
  }
}
