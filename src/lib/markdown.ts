// Bộ đọc Markdown rất nhỏ cho mô tả sản phẩm. Chỉ tạo cấu trúc dữ liệu, KHÔNG sinh HTML:
// giao diện dựng bằng React nên chữ nhập vào luôn được escape (docs/08, AGENTS 5.4).

export type InlineNode = { type: "text" | "strong" | "em"; text: string };

export type Block =
  | { type: "paragraph"; inline: InlineNode[] }
  | { type: "heading"; inline: InlineNode[] }
  | { type: "list"; ordered: boolean; items: InlineNode[][] };

const INLINE_PATTERN = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
const BULLET = /^\s*[-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const HEADING = /^#{1,6}\s+(.*)$/;

export function parseInline(text: string): InlineNode[] {
  return text
    .split(INLINE_PATTERN)
    .filter((part) => part !== "")
    .map((part): InlineNode => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return { type: "strong", text: part.slice(2, -2) };
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return { type: "em", text: part.slice(1, -1) };
      }
      return { type: "text", text: part };
    });
}

function listKind(line: string): "bullet" | "numbered" | null {
  if (BULLET.test(line)) return "bullet";
  return NUMBERED.test(line) ? "numbered" : null;
}

function parseList(lines: string[]): Block {
  const ordered = listKind(lines[0] ?? "") === "numbered";
  const items = lines.map((line) =>
    parseInline((BULLET.exec(line) ?? NUMBERED.exec(line))?.[1] ?? line),
  );
  return { type: "list", ordered, items };
}

function parseChunk(chunk: string[]): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  const flushParagraph = (): void => {
    if (paragraph.length)
      blocks.push({ type: "paragraph", inline: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };
  const flushList = (): void => {
    if (list.length) blocks.push(parseList(list));
    list = [];
  };
  for (const line of chunk) {
    const heading = HEADING.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", inline: parseInline(heading[1] ?? "") });
    } else if (listKind(line)) {
      flushParagraph();
      list.push(line);
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

/** Tách văn bản thành đoạn, tiêu đề, danh sách. Dòng trống ngăn cách các khối. */
export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const chunks: string[][] = [[]];
  for (const line of lines) {
    if (line.trim() === "") chunks.push([]);
    else chunks[chunks.length - 1]?.push(line);
  }
  return chunks.filter((chunk) => chunk.length > 0).flatMap(parseChunk);
}
