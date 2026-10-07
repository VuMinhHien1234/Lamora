import { describe, expect, it } from "vitest";
import { parseInline, parseMarkdown } from "./markdown";

describe("parseInline", () => {
  it("nhận in đậm và in nghiêng", () => {
    expect(parseInline("Hoa **lụa** rất *đẹp*")).toEqual([
      { type: "text", text: "Hoa " },
      { type: "strong", text: "lụa" },
      { type: "text", text: " rất " },
      { type: "em", text: "đẹp" },
    ]);
  });

  it("giữ nguyên thẻ HTML như chữ thường (không bao giờ thành HTML)", () => {
    expect(parseInline("<script>alert(1)</script>")).toEqual([
      { type: "text", text: "<script>alert(1)</script>" },
    ]);
  });
});

describe("parseMarkdown", () => {
  it("tách đoạn theo dòng trống và nối các dòng liền nhau", () => {
    const blocks = parseMarkdown("Dòng một\ndòng hai\n\nĐoạn hai");
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatchObject({ type: "paragraph" });
  });

  it("nhận danh sách gạch đầu dòng và danh sách số", () => {
    const blocks = parseMarkdown("- Cành cao 60cm\n- Lá lụa\n\n1. Bước một\n2. Bước hai");
    expect(blocks[0]).toMatchObject({ type: "list", ordered: false });
    expect(blocks[1]).toMatchObject({ type: "list", ordered: true });
    expect(blocks[0] && blocks[0].type === "list" && blocks[0].items).toHaveLength(2);
  });

  it("nhận tiêu đề và chịu được văn bản rỗng", () => {
    expect(parseMarkdown("## Chất liệu")[0]).toMatchObject({ type: "heading" });
    expect(parseMarkdown("  \n\n")).toEqual([]);
  });
});
