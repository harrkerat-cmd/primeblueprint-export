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
  MUTED
} from "@/lib/pdf/design-system";

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

export async function renderReportPdf({
  content
}: {
  content: GeneratedReportContent;
  category: string;
  packageId: string;
  userName: string;
  createdAt: Date;
}) {
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
