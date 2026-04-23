import { PDFDocument } from "pdf-lib";
import type { CollectionGuideContent, CollectionGuidePage } from "@/lib/collection/types";
import {
  CONTENT_WIDTH,
  MARGIN,
  NAVY,
  MUTED,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  SMALL,
  addInteriorChrome,
  drawBulletList,
  drawCalloutBox,
  drawContentsPage,
  drawCoverPage,
  drawChecklist,
  drawIntroCard,
  drawParagraph,
  drawProcessDiagram,
  drawResourceCard,
  drawSectionHeading,
  drawTable,
  embedPrimeBlueprintFonts
} from "@/lib/pdf/design-system";

const CONTENTS_PAGE_SIZE = 8;

function chunkSections<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function buildContents(content: CollectionGuideContent, contentsPageCount: number) {
  return content.pages.map((section, index) => ({
    index: index + 1,
    title: section.title,
    detail: section.subtitle,
    pageNumber: index + 2 + contentsPageCount + 1
  }));
}

function drawGuidePage({
  pdfDoc,
  fonts,
  content,
  section,
  pageNumber,
  sectionIndex
}: {
  pdfDoc: PDFDocument;
  fonts: Awaited<ReturnType<typeof embedPrimeBlueprintFonts>>;
  content: CollectionGuideContent;
  section: CollectionGuidePage;
  pageNumber: number;
  sectionIndex: number;
}) {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  addInteriorChrome({
    page,
    fonts,
    productLabel: "Growth Library",
    pageLabel: content.coverLine,
    pageNumber,
    footerLeft: content.collectionLabel,
    footerCenter: "Premium digital handbook"
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

  for (const group of section.bulletGroups ?? []) {
    y = drawBulletList({ page, fonts, title: group.title, items: group.items, y });
  }

  for (const callout of section.callouts ?? []) {
    y = drawCalloutBox({
      page,
      fonts,
      label: callout.label,
      title: callout.title,
      body: callout.body,
      y,
      tone: callout.label.toLowerCase().includes("example") ? "dark" : "light"
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

  for (const table of section.tables ?? []) {
    y = drawTable({
      page,
      fonts,
      title: table.title,
      columns: table.columns,
      rows: table.rows,
      y
    });
  }

  for (const diagram of section.diagrams ?? []) {
    y = drawProcessDiagram({
      page,
      fonts,
      title: diagram.title,
      description: diagram.description,
      steps: diagram.steps,
      y
    });
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

  if (sectionIndex === content.pages.length) {
    let disclaimerY = 104;
    if (content.disclaimers.length > 0) {
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

export async function renderCollectionPdf(content: CollectionGuideContent) {
  const pdfDoc = await PDFDocument.create();
  const fonts = await embedPrimeBlueprintFonts(pdfDoc);
  const contentsEntries = buildContents(content, Math.ceil(content.pages.length / CONTENTS_PAGE_SIZE));
  const contentsChunks = chunkSections(contentsEntries, CONTENTS_PAGE_SIZE);
  let pageNumber = 1;

  const cover = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawCoverPage({
    page: cover,
    fonts,
    eyebrow: content.collectionLabel,
    title: content.title,
    subtitle: content.subtitle,
    tagline: "Structured guidance without the noise",
    preparedLabel: content.preparedLine,
    meta: [
      { label: "Library", value: content.collectionLabel },
      { label: "Category", value: content.categoryLabel },
      { label: "Guide type", value: content.coverLine },
      { label: "Prepared", value: content.createdAtLabel },
      { label: "Brand", value: content.brandName },
      { label: "Format", value: "Premium digital handbook" }
    ],
    summaryPoints: [
      "Detailed topic coverage with clearer teaching, stronger structure, and practical progression from idea to action.",
      "Examples, mistakes, checklists, and useful frameworks designed to be revisited instead of skimmed once.",
      "A cleaner premium layout so the guide feels closer to a private handbook than a plain text download.",
      "Built to help the reader understand the topic properly and know what to do next."
    ],
    footerLine: "Premium practical guides designed to help you learn better, move smarter, and grow faster.",
    productLabel: "Growth Library handbook"
  });
  pageNumber += 1;

  contentsChunks.forEach((chunk, chunkIndex) => {
    const toc = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    drawContentsPage({
      page: toc,
      fonts,
      title: chunkIndex === 0 ? "How this handbook is structured" : `How this handbook is structured — continued`,
      subtitle:
        chunkIndex === 0
          ? "Each guide is arranged to move from foundations into examples, practical frameworks, and clear next-step guidance so the reader can use the material rather than simply read it."
          : "The handbook continues with deeper chapters, practical support pages, and guided next-step material.",
      sections: chunk,
      pageNumber,
      footerLeft: content.collectionLabel,
      footerCenter: "Premium digital handbook",
      productLabel: "Growth Library",
      pageLabel: content.coverLine
    });
    pageNumber += 1;
  });

  const orientation = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawContentsPage({
    page: orientation,
    fonts,
    title: "How to use this handbook well",
    subtitle: "This page gives the reader the right mindset before moving into the full handbook: study the topic clearly, apply one section at a time, and return to the guide as a working reference rather than a one-time read.",
    sections: [
      { index: 1, title: "Read for understanding first", detail: "Use the first chapters to understand the topic properly before rushing into action.", pageNumber: 1 },
      { index: 2, title: "Apply one section at a time", detail: "The strongest value comes from using one lesson, checklist, or routine before moving to the next.", pageNumber: 2 },
      { index: 3, title: "Review the examples and tasks", detail: "Examples, frameworks, and action prompts are there to reduce confusion and make the guide more practical.", pageNumber: 3 },
      { index: 4, title: "Return to the handbook weekly", detail: "The guide is built to be revisited as a compact handbook, not skimmed once and forgotten.", pageNumber: 4 }
    ],
    pageNumber,
    footerLeft: content.collectionLabel,
    footerCenter: "Premium digital handbook",
    productLabel: "Growth Library",
    pageLabel: content.coverLine
  });

  drawCalloutBox({
    page: orientation,
    fonts,
    label: "What to expect",
    title: "Built like a premium handbook with clearer teaching and better structure",
    body: "This guide is designed to teach properly, highlight mistakes that usually slow progress down, and leave the reader with frameworks, tasks, and next-step clarity they can actually use after the first read-through.",
    y: 286,
    tone: "dark"
  });

  drawBulletList({
    page: orientation,
    fonts,
    title: "Inside this guide",
    items: [
      "Clear breakdowns of the key ideas that matter first.",
      "Examples and comparisons that reduce confusion.",
      "Practical frameworks, checklists, and routines where useful.",
      "Closing guidance to help the reader apply the material properly."
    ],
    y: 178
  });
  pageNumber += 1;

  content.pages.forEach((section, index) => {
    drawGuidePage({
      pdfDoc,
      fonts,
      content,
      section,
      pageNumber,
      sectionIndex: index + 1
    });
    pageNumber += 1;
  });

  return Buffer.from(await pdfDoc.save());
}
