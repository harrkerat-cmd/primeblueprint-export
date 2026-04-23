import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export const PAGE_WIDTH = 595.28;
export const PAGE_HEIGHT = 841.89;
export const MARGIN = 42;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
export const BODY = 10.8;
export const SMALL = 8.8;
export const OFF_WHITE = rgb(0.985, 0.982, 0.972);
export const WHITE = rgb(1, 1, 1);
export const NAVY = rgb(0.06, 0.12, 0.24);
export const NAVY_SOFT = rgb(0.13, 0.22, 0.39);
export const SLATE = rgb(0.29, 0.33, 0.39);
export const MUTED = rgb(0.47, 0.5, 0.56);
export const GOLD = rgb(0.75, 0.64, 0.39);
export const GOLD_SOFT = rgb(0.93, 0.9, 0.79);
export const LINE = rgb(0.87, 0.88, 0.9);
export const PANEL = rgb(0.97, 0.968, 0.958);
export const PANEL_STRONG = rgb(0.94, 0.93, 0.89);
export const NAVY_PANEL = rgb(0.09, 0.14, 0.25);

export type PrimeBlueprintFonts = {
  display: PDFFont;
  body: PDFFont;
  bodyBold: PDFFont;
};

export async function embedPrimeBlueprintFonts(pdfDoc: PDFDocument): Promise<PrimeBlueprintFonts> {
  return {
    display: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
    body: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bodyBold: await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  };
}

export function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

export function drawLines({
  page,
  lines,
  x,
  y,
  font,
  size,
  color,
  lineGap = 4
}: {
  page: PDFPage;
  lines: string[];
  x: number;
  y: number;
  font: PDFFont;
  size: number;
  color: ReturnType<typeof rgb>;
  lineGap?: number;
}) {
  let cursorY = y;

  for (const line of lines) {
    page.drawText(line, { x, y: cursorY, font, size, color });
    cursorY -= size + lineGap;
  }

  return cursorY;
}

export function drawParagraph({
  page,
  text,
  x,
  y,
  font,
  size,
  maxWidth,
  color = SLATE,
  lineGap = 5
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  font: PDFFont;
  size: number;
  maxWidth: number;
  color?: ReturnType<typeof rgb>;
  lineGap?: number;
}) {
  return drawLines({
    page,
    lines: wrapText(text, font, size, maxWidth),
    x,
    y,
    font,
    size,
    color,
    lineGap
  });
}

export function measureParagraphHeight(text: string, font: PDFFont, size: number, maxWidth: number, lineGap = 5) {
  const lines = wrapText(text, font, size, maxWidth);
  return lines.length * size + Math.max(0, lines.length - 1) * lineGap;
}

export function drawPageBackground(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: OFF_WHITE });
}

export function addInteriorChrome({
  page,
  fonts,
  productLabel,
  pageLabel,
  pageNumber,
  footerLeft,
  footerCenter
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  productLabel: string;
  pageLabel: string;
  pageNumber: number;
  footerLeft: string;
  footerCenter: string;
}) {
  drawPageBackground(page);

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 56, width: PAGE_WIDTH, height: 56, color: NAVY });
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 62, width: PAGE_WIDTH, height: 6, color: GOLD });

  page.drawText("PrimeBlueprint", {
    x: MARGIN,
    y: PAGE_HEIGHT - 36,
    size: 10,
    font: fonts.bodyBold,
    color: WHITE
  });

  page.drawText(productLabel.toUpperCase(), {
    x: MARGIN,
    y: PAGE_HEIGHT - 50,
    size: 7.8,
    font: fonts.body,
    color: GOLD_SOFT
  });

  const pageLabelWidth = fonts.body.widthOfTextAtSize(pageLabel, 8.5);
  page.drawText(pageLabel, {
    x: PAGE_WIDTH - MARGIN - pageLabelWidth,
    y: PAGE_HEIGHT - 38,
    size: 8.5,
    font: fonts.body,
    color: WHITE
  });

  page.drawLine({
    start: { x: MARGIN, y: 48 },
    end: { x: PAGE_WIDTH - MARGIN, y: 48 },
    thickness: 0.9,
    color: LINE
  });

  page.drawText(footerLeft, {
    x: MARGIN,
    y: 30,
    size: 8.2,
    font: fonts.body,
    color: MUTED
  });

  const footerCenterWidth = fonts.body.widthOfTextAtSize(footerCenter, 8.2);
  page.drawText(footerCenter, {
    x: PAGE_WIDTH / 2 - footerCenterWidth / 2,
    y: 30,
    size: 8.2,
    font: fonts.body,
    color: MUTED
  });

  const pageNumberLabel = `Page ${pageNumber}`;
  const pageNumberWidth = fonts.body.widthOfTextAtSize(pageNumberLabel, 8.2);
  page.drawText(pageNumberLabel, {
    x: PAGE_WIDTH - MARGIN - pageNumberWidth,
    y: 30,
    size: 8.2,
    font: fonts.body,
    color: MUTED
  });
}

export function drawCoverPage({
  page,
  fonts,
  eyebrow,
  title,
  subtitle,
  tagline,
  meta,
  preparedLabel,
  summaryPoints,
  footerLine,
  productLabel
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  eyebrow: string;
  title: string;
  subtitle: string;
  tagline: string;
  meta: Array<{ label: string; value: string }>;
  preparedLabel?: string;
  summaryPoints: string[];
  footerLine: string;
  productLabel: string;
}) {
  drawPageBackground(page);

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 360, width: PAGE_WIDTH, height: 360, color: NAVY_PANEL });
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 368, width: PAGE_WIDTH, height: 8, color: GOLD });
  page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - 126,
    width: 168,
    height: 28,
    color: rgb(0.16, 0.2, 0.31),
    borderColor: rgb(0.3, 0.35, 0.47),
    borderWidth: 1
  });

  page.drawText("PrimeBlueprint", {
    x: MARGIN + 14,
    y: PAGE_HEIGHT - 108,
    size: 11,
    font: fonts.bodyBold,
    color: WHITE
  });

  page.drawText(eyebrow.toUpperCase(), {
    x: MARGIN,
    y: PAGE_HEIGHT - 146,
    size: 8.5,
    font: fonts.bodyBold,
    color: GOLD_SOFT
  });

  let coverY = PAGE_HEIGHT - 188;
  coverY = drawParagraph({
    page,
    text: title,
    x: MARGIN,
    y: coverY,
    font: fonts.display,
    size: 31,
    maxWidth: CONTENT_WIDTH,
    color: WHITE,
    lineGap: 10
  });

  coverY = drawParagraph({
    page,
    text: subtitle,
    x: MARGIN,
    y: coverY - 10,
    font: fonts.body,
    size: 12,
    maxWidth: CONTENT_WIDTH,
    color: rgb(0.92, 0.94, 0.97),
    lineGap: 5
  });

  page.drawLine({
    start: { x: MARGIN, y: coverY - 12 },
    end: { x: MARGIN + 176, y: coverY - 12 },
    thickness: 1.5,
    color: GOLD
  });

  if (preparedLabel) {
    page.drawRectangle({
      x: MARGIN,
      y: coverY - 110,
      width: CONTENT_WIDTH,
      height: 76,
      color: rgb(0.14, 0.18, 0.29),
      borderColor: rgb(0.3, 0.35, 0.47),
      borderWidth: 1
    });

    page.drawText(productLabel.toUpperCase(), {
      x: MARGIN + 16,
      y: coverY - 54,
      size: 7.8,
      font: fonts.bodyBold,
      color: GOLD_SOFT
    });

    drawParagraph({
      page,
      text: preparedLabel,
      x: MARGIN + 16,
      y: coverY - 72,
      font: fonts.bodyBold,
      size: 12,
      maxWidth: CONTENT_WIDTH - 32,
      color: WHITE,
      lineGap: 4
    });
  }

  const metaY = 338;
  const metaHeight = 126;
  page.drawRectangle({ x: MARGIN, y: metaY, width: CONTENT_WIDTH, height: metaHeight, color: WHITE, borderColor: PANEL_STRONG, borderWidth: 1 });
  page.drawText(tagline.toUpperCase(), {
    x: MARGIN + 16,
    y: metaY + metaHeight - 24,
    size: 8,
    font: fonts.bodyBold,
    color: GOLD
  });

  const metaColumns = 2;
  const metaGap = 18;
  const metaColumnWidth = (CONTENT_WIDTH - metaGap) / metaColumns;
  meta.forEach((item, index) => {
    const column = index % metaColumns;
    const row = Math.floor(index / metaColumns);
    const x = MARGIN + 16 + column * (metaColumnWidth + metaGap);
    const y = metaY + metaHeight - 50 - row * 34;
    page.drawText(item.label.toUpperCase(), {
      x,
      y,
      size: 7.2,
      font: fonts.bodyBold,
      color: MUTED
    });
    drawParagraph({
      page,
      text: item.value,
      x,
      y: y - 12,
      font: fonts.body,
      size: 9.6,
      maxWidth: metaColumnWidth,
      color: NAVY,
      lineGap: 3
    });
  });

  const summaryY = 160;
  page.drawRectangle({ x: MARGIN, y: summaryY, width: CONTENT_WIDTH, height: 118, color: PANEL, borderColor: LINE, borderWidth: 1 });
  page.drawText("What this document is designed to do", {
    x: MARGIN + 16,
    y: summaryY + 92,
    size: 10,
    font: fonts.bodyBold,
    color: NAVY
  });

  let listY = summaryY + 70;
  for (const point of summaryPoints.slice(0, 4)) {
    page.drawRectangle({ x: MARGIN + 16, y: listY + 2, width: 8, height: 8, color: GOLD, borderColor: GOLD, borderWidth: 1 });
    listY = drawParagraph({
      page,
      text: point,
      x: MARGIN + 32,
      y: listY,
      font: fonts.body,
      size: 10,
      maxWidth: CONTENT_WIDTH - 48,
      color: SLATE,
      lineGap: 4
    }) - 3;
  }

  page.drawLine({
    start: { x: MARGIN, y: 76 },
    end: { x: PAGE_WIDTH - MARGIN, y: 76 },
    thickness: 0.9,
    color: rgb(0.33, 0.39, 0.51)
  });

  page.drawText("PrimeBlueprint", {
    x: MARGIN,
    y: 58,
    size: 9,
    font: fonts.bodyBold,
    color: WHITE
  });

  page.drawText(footerLine, {
    x: MARGIN,
    y: 44,
    size: 8.5,
    font: fonts.body,
    color: rgb(0.82, 0.86, 0.91)
  });
}

export function drawContentsPage({
  page,
  fonts,
  title,
  subtitle,
  sections,
  pageNumber,
  footerLeft,
  footerCenter,
  productLabel,
  pageLabel
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  title: string;
  subtitle: string;
  sections: Array<{ index: number; title: string; detail?: string; pageNumber: number }>;
  pageNumber: number;
  footerLeft: string;
  footerCenter: string;
  productLabel: string;
  pageLabel: string;
}) {
  addInteriorChrome({ page, fonts, productLabel, pageLabel, pageNumber, footerLeft, footerCenter });

  page.drawText("Section index", {
    x: MARGIN,
    y: PAGE_HEIGHT - 116,
    size: 8,
    font: fonts.bodyBold,
    color: GOLD
  });

  drawParagraph({
    page,
    text: title,
    x: MARGIN,
    y: PAGE_HEIGHT - 146,
    font: fonts.display,
    size: 25,
    maxWidth: CONTENT_WIDTH,
    color: NAVY,
    lineGap: 7
  });

  let subtitleBottom = drawParagraph({
    page,
    text: subtitle,
    x: MARGIN,
    y: PAGE_HEIGHT - 186,
    font: fonts.body,
    size: 10.2,
    maxWidth: CONTENT_WIDTH,
    color: SLATE,
    lineGap: 4
  });

  let y = subtitleBottom - 18;
  sections.forEach((section, index) => {
    const detailHeight = section.detail
      ? measureParagraphHeight(section.detail, fonts.body, 8.6, CONTENT_WIDTH - 132, 3)
      : 0;
    const boxHeight = Math.max(section.detail ? 58 : 42, 22 + detailHeight);
    const boxY = y - boxHeight + 10;
    page.drawRectangle({ x: MARGIN, y: boxY, width: CONTENT_WIDTH, height: boxHeight, color: index % 2 === 0 ? WHITE : PANEL, borderColor: LINE, borderWidth: 1 });
    page.drawRectangle({ x: MARGIN + 14, y: y - 10, width: 22, height: 22, color: GOLD_SOFT, borderColor: PANEL_STRONG, borderWidth: 1 });
    page.drawText(String(section.index).padStart(2, "0"), {
      x: MARGIN + 18,
      y: y - 4,
      size: 8,
      font: fonts.bodyBold,
      color: NAVY
    });
    page.drawText(section.title, {
      x: MARGIN + 48,
      y: y,
      size: 10.2,
      font: fonts.bodyBold,
      color: NAVY
    });

    if (section.detail) {
      drawParagraph({
        page,
        text: section.detail,
        x: MARGIN + 48,
        y: y - 14,
        font: fonts.body,
        size: 8.6,
        maxWidth: CONTENT_WIDTH - 120,
        color: SLATE,
        lineGap: 3
      });
    }

    const pageText = String(section.pageNumber);
    const pageWidth = fonts.bodyBold.widthOfTextAtSize(pageText, 10);
    page.drawText(pageText, {
      x: PAGE_WIDTH - MARGIN - 18 - pageWidth,
      y: y - 2,
      size: 10,
      font: fonts.bodyBold,
      color: NAVY_SOFT
    });
    y -= boxHeight + 12;
  });

  return y;
}

export function drawSectionHeading({
  page,
  fonts,
  index,
  title,
  subtitle
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  index: number;
  title: string;
  subtitle?: string;
}) {
  page.drawText(String(index).padStart(2, "0"), {
    x: MARGIN,
    y: PAGE_HEIGHT - 110,
    size: 11,
    font: fonts.bodyBold,
    color: GOLD
  });

  page.drawLine({
    start: { x: MARGIN + 26, y: PAGE_HEIGHT - 102 },
    end: { x: MARGIN + 88, y: PAGE_HEIGHT - 102 },
    thickness: 1.2,
    color: GOLD
  });

  let y = drawParagraph({
    page,
    text: title,
    x: MARGIN,
    y: PAGE_HEIGHT - 142,
    font: fonts.display,
    size: 24,
    maxWidth: CONTENT_WIDTH,
    color: NAVY,
    lineGap: 8
  });

  if (subtitle) {
    y = drawParagraph({
      page,
      text: subtitle,
      x: MARGIN,
      y: y - 4,
      font: fonts.body,
      size: 11.2,
      maxWidth: CONTENT_WIDTH,
      color: SLATE,
      lineGap: 4
    });
  }

  return y - 10;
}

export function drawIntroCard({
  page,
  fonts,
  text,
  y
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  text: string;
  y: number;
}) {
  const height = measureParagraphHeight(text, fonts.body, 9.8, CONTENT_WIDTH - 32, 4) + 28;
  const boxY = y - height + 10;
  page.drawRectangle({ x: MARGIN, y: boxY, width: CONTENT_WIDTH, height, color: PANEL, borderColor: PANEL_STRONG, borderWidth: 1 });
  page.drawRectangle({ x: MARGIN, y: boxY, width: 6, height, color: GOLD });
  page.drawText("PRIMEBLUEPRINT NOTE", {
    x: MARGIN + 16,
    y: y - 12,
    size: 7.8,
    font: fonts.bodyBold,
    color: MUTED
  });
  return drawParagraph({
    page,
    text,
    x: MARGIN + 16,
    y: y - 28,
    font: fonts.body,
    size: 9.8,
    maxWidth: CONTENT_WIDTH - 28,
    color: NAVY_SOFT,
    lineGap: 4
  }) - 12;
}

export function drawBulletList({
  page,
  fonts,
  title,
  items,
  y
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  title: string;
  items: string[];
  y: number;
}) {
  page.drawText(title, {
    x: MARGIN,
    y,
    size: 11,
    font: fonts.bodyBold,
    color: NAVY
  });

  let cursorY = y - 18;
  for (const item of items) {
    page.drawRectangle({ x: MARGIN, y: cursorY + 2, width: 7, height: 7, color: GOLD, borderColor: GOLD, borderWidth: 1 });
    cursorY = drawParagraph({
      page,
      text: item,
      x: MARGIN + 18,
      y: cursorY,
      font: fonts.body,
      size: BODY,
      maxWidth: CONTENT_WIDTH - 18,
      color: SLATE,
      lineGap: 4
    }) - 4;
  }

  return cursorY - 4;
}

export function drawCalloutBox({
  page,
  fonts,
  label,
  title,
  body,
  y,
  tone = "light"
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  label: string;
  title: string;
  body: string;
  y: number;
  tone?: "light" | "dark";
}) {
  const maxWidth = CONTENT_WIDTH - 30;
  const titleHeight = measureParagraphHeight(title, fonts.bodyBold, 12, maxWidth, 4);
  const bodyHeight = measureParagraphHeight(body, fonts.body, BODY, maxWidth, 4);
  const height = 30 + titleHeight + bodyHeight;
  const boxY = y - height + 10;
  const fill = tone === "dark" ? NAVY_PANEL : PANEL;
  const titleColor = tone === "dark" ? WHITE : NAVY;
  const bodyColor = tone === "dark" ? rgb(0.91, 0.93, 0.96) : SLATE;
  const labelColor = tone === "dark" ? GOLD_SOFT : MUTED;
  const accentColor = tone === "dark" ? GOLD : PANEL_STRONG;

  page.drawRectangle({ x: MARGIN, y: boxY, width: CONTENT_WIDTH, height, color: fill, borderColor: accentColor, borderWidth: 1 });
  page.drawRectangle({ x: MARGIN, y: boxY, width: 6, height, color: GOLD });
  page.drawText(label.toUpperCase(), {
    x: MARGIN + 16,
    y: y - 12,
    size: 7.8,
    font: fonts.bodyBold,
    color: labelColor
  });

  let cursorY = drawParagraph({ page, text: title, x: MARGIN + 16, y: y - 28, font: fonts.bodyBold, size: 12, maxWidth, color: titleColor, lineGap: 4 });
  cursorY = drawParagraph({ page, text: body, x: MARGIN + 16, y: cursorY - 4, font: fonts.body, size: BODY, maxWidth, color: bodyColor, lineGap: 4 });
  return cursorY - 10;
}

export function drawInfoGrid({
  page,
  fonts,
  title,
  items,
  y,
  columns = 2
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  title: string;
  items: Array<{ label: string; value: string }>;
  y: number;
  columns?: number;
}) {
  page.drawText(title, {
    x: MARGIN,
    y,
    size: 11,
    font: fonts.bodyBold,
    color: NAVY
  });

  const gap = 14;
  const columnWidth = (CONTENT_WIDTH - gap * (columns - 1)) / columns;
  const baseY = y - 18;
  let bottomY = baseY;

  items.forEach((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = MARGIN + column * (columnWidth + gap);
    const cardY = baseY - row * 70;
    page.drawRectangle({ x, y: cardY - 52, width: columnWidth, height: 56, color: WHITE, borderColor: LINE, borderWidth: 1 });
    page.drawText(item.label.toUpperCase(), {
      x: x + 12,
      y: cardY - 14,
      size: 7.4,
      font: fonts.bodyBold,
      color: MUTED
    });
    drawParagraph({
      page,
      text: item.value,
      x: x + 12,
      y: cardY - 28,
      font: fonts.body,
      size: 9.5,
      maxWidth: columnWidth - 24,
      color: NAVY,
      lineGap: 3
    });
    bottomY = Math.min(bottomY, cardY - 58);
  });

  return bottomY - 4;
}

export function drawChecklist({
  page,
  fonts,
  title,
  items,
  y
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  title: string;
  items: string[];
  y: number;
}) {
  page.drawText(title, { x: MARGIN, y, size: 11, font: fonts.bodyBold, color: NAVY });
  let cursorY = y - 18;

  items.forEach((item, index) => {
    page.drawRectangle({ x: MARGIN, y: cursorY - 2, width: 16, height: 16, color: GOLD_SOFT, borderColor: PANEL_STRONG, borderWidth: 1 });
    page.drawText(String(index + 1), {
      x: MARGIN + 5,
      y: cursorY + 2,
      size: 8,
      font: fonts.bodyBold,
      color: NAVY
    });
    cursorY = drawParagraph({ page, text: item, x: MARGIN + 24, y: cursorY + 2, font: fonts.body, size: BODY, maxWidth: CONTENT_WIDTH - 24, color: SLATE, lineGap: 4 }) - 2;
  });

  return cursorY - 6;
}

export function drawTable({
  page,
  fonts,
  title,
  columns,
  rows,
  y
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  title: string;
  columns: string[];
  rows: string[][];
  y: number;
}) {
  page.drawText(title, { x: MARGIN, y, size: 11, font: fonts.bodyBold, color: NAVY });
  let cursorY = y - 18;
  const totalColumns = Math.max(columns.length, 1);
  const columnWidth = CONTENT_WIDTH / totalColumns;
  const headerHeight = 26;

  page.drawRectangle({ x: MARGIN, y: cursorY - headerHeight + 8, width: CONTENT_WIDTH, height: headerHeight, color: NAVY_PANEL, borderColor: NAVY_PANEL, borderWidth: 1 });
  columns.forEach((column, index) => {
    drawParagraph({ page, text: column, x: MARGIN + 10 + columnWidth * index, y: cursorY - 1, font: fonts.bodyBold, size: 8.3, maxWidth: columnWidth - 16, color: WHITE, lineGap: 2 });
  });

  cursorY -= headerHeight;

  rows.forEach((row, rowIndex) => {
    const cellHeights = row.map((cell, index) => measureParagraphHeight(cell, fonts.body, 8.9, columnWidth - 16, 3) + 16);
    const rowHeight = Math.max(28, ...cellHeights);
    page.drawRectangle({ x: MARGIN, y: cursorY - rowHeight + 8, width: CONTENT_WIDTH, height: rowHeight, color: rowIndex % 2 === 0 ? WHITE : PANEL, borderColor: LINE, borderWidth: 1 });
    row.forEach((cell, index) => {
      drawParagraph({ page, text: cell, x: MARGIN + 10 + columnWidth * index, y: cursorY - 1, font: fonts.body, size: 8.9, maxWidth: columnWidth - 16, color: SLATE, lineGap: 3 });
    });
    cursorY -= rowHeight;
  });

  return cursorY - 8;
}

export function drawProcessDiagram({
  page,
  fonts,
  title,
  description,
  steps,
  y
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  title: string;
  description?: string;
  steps: string[];
  y: number;
}) {
  page.drawText(title, { x: MARGIN, y, size: 11, font: fonts.bodyBold, color: NAVY });
  let cursorY = y - 18;

  if (description) {
    cursorY = drawParagraph({ page, text: description, x: MARGIN, y: cursorY, font: fonts.body, size: SMALL, maxWidth: CONTENT_WIDTH, color: SLATE, lineGap: 3 }) - 8;
  }

  steps.forEach((step, index) => {
    page.drawRectangle({ x: MARGIN, y: cursorY - 24, width: CONTENT_WIDTH, height: 32, color: index % 2 === 0 ? WHITE : PANEL, borderColor: LINE, borderWidth: 1 });
    page.drawRectangle({ x: MARGIN + 8, y: cursorY - 18, width: 18, height: 18, color: GOLD_SOFT, borderColor: PANEL_STRONG, borderWidth: 1 });
    page.drawText(String(index + 1), { x: MARGIN + 14, y: cursorY - 13, size: 8, font: fonts.bodyBold, color: NAVY });
    drawParagraph({ page, text: step, x: MARGIN + 34, y: cursorY - 8, font: fonts.body, size: 9.4, maxWidth: CONTENT_WIDTH - 44, color: SLATE, lineGap: 2 });
    cursorY -= 40;
  });

  return cursorY - 6;
}

export function drawResourceCard({
  page,
  fonts,
  name,
  description,
  referenceLabel,
  y
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  name: string;
  description: string;
  referenceLabel?: string;
  y: number;
}) {
  const titleHeight = measureParagraphHeight(name, fonts.bodyBold, 10.6, CONTENT_WIDTH - 30, 4);
  const descHeight = measureParagraphHeight(description, fonts.body, BODY, CONTENT_WIDTH - 30, 4);
  const refHeight = referenceLabel ? measureParagraphHeight(referenceLabel, fonts.body, SMALL, CONTENT_WIDTH - 30, 3) : 0;
  const height = 22 + titleHeight + descHeight + refHeight;
  const boxY = y - height + 10;

  page.drawRectangle({ x: MARGIN, y: boxY, width: CONTENT_WIDTH, height, color: WHITE, borderColor: LINE, borderWidth: 1 });
  page.drawRectangle({ x: MARGIN, y: boxY, width: 6, height, color: GOLD });
  let cursorY = drawParagraph({ page, text: name, x: MARGIN + 16, y: y - 10, font: fonts.bodyBold, size: 10.6, maxWidth: CONTENT_WIDTH - 28, color: NAVY, lineGap: 4 });
  cursorY = drawParagraph({ page, text: description, x: MARGIN + 16, y: cursorY - 4, font: fonts.body, size: BODY, maxWidth: CONTENT_WIDTH - 28, color: SLATE, lineGap: 4 });
  if (referenceLabel) {
    cursorY = drawParagraph({ page, text: referenceLabel, x: MARGIN + 16, y: cursorY - 4, font: fonts.body, size: SMALL, maxWidth: CONTENT_WIDTH - 28, color: MUTED, lineGap: 3 });
  }
  return cursorY - 8;
}

export function drawRoutineColumns({
  page,
  fonts,
  title,
  entries,
  y
}: {
  page: PDFPage;
  fonts: PrimeBlueprintFonts;
  title: string;
  entries: Array<{ day: string; focus: string; actions: string[] }>;
  y: number;
}) {
  page.drawText(title, { x: MARGIN, y, size: 11, font: fonts.bodyBold, color: NAVY });
  const columns = 2;
  const gap = 16;
  const columnWidth = (CONTENT_WIDTH - gap) / columns;
  const splitIndex = Math.ceil(entries.length / columns);
  const groups = [entries.slice(0, splitIndex), entries.slice(splitIndex)];
  const startY = y - 18;

  groups.forEach((columnEntries, columnIndex) => {
    const x = MARGIN + columnIndex * (columnWidth + gap);
    let cursorY = startY;

    columnEntries.forEach((entry) => {
      const actionsText = entry.actions.map((action) => `• ${action}`).join(" ");
      const focusHeight = measureParagraphHeight(entry.focus, fonts.bodyBold, 9.8, columnWidth - 20, 3);
      const actionHeight = measureParagraphHeight(actionsText, fonts.body, 8.4, columnWidth - 20, 3);
      const cardHeight = 28 + focusHeight + actionHeight;
      const boxY = cursorY - cardHeight + 8;

      page.drawRectangle({ x, y: boxY, width: columnWidth, height: cardHeight, color: WHITE, borderColor: LINE, borderWidth: 1 });
      page.drawText(entry.day.toUpperCase(), { x: x + 10, y: cursorY - 8, size: 7.3, font: fonts.bodyBold, color: MUTED });
      let innerY = drawParagraph({ page, text: entry.focus, x: x + 10, y: cursorY - 20, font: fonts.bodyBold, size: 9.8, maxWidth: columnWidth - 20, color: NAVY, lineGap: 3 });
      innerY = drawParagraph({ page, text: actionsText, x: x + 10, y: innerY - 4, font: fonts.body, size: 8.4, maxWidth: columnWidth - 20, color: SLATE, lineGap: 3 });
      cursorY = Math.min(innerY - 8, boxY - 8);
    });
  });

  return 78;
}
