import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  organizationJsonLd,
  websiteJsonLd,
} from "./seo";

describe("seo", () => {
  it("jsonLdString không để lọt '<'", () => {
    expect(jsonLdString({ a: "</script><b>" })).not.toContain("<");
  });

  it("absoluteUrl bỏ dấu / thừa", () => {
    expect(absoluteUrl("https://x.vn/", "/san-pham")).toBe("https://x.vn/san-pham");
    expect(absoluteUrl("https://x.vn", "san-pham")).toBe("https://x.vn/san-pham");
  });

  it("WebSite có SearchAction trỏ tới /tim-kiem", () => {
    const data = websiteJsonLd("https://x.vn", "Lamora") as { potentialAction: { target: string } };
    expect(data.potentialAction.target).toBe("https://x.vn/tim-kiem?q={search_term_string}");
  });

  it("Organization bỏ sameAs khi rỗng", () => {
    const data = organizationJsonLd("https://x.vn", {
      name: "L",
      description: "d",
      phone: "1",
      email: "e",
      sameAs: [],
    });
    expect(data.sameAs).toBeUndefined();
  });

  it("BreadcrumbList đánh số từ 1, mục cuối không có địa chỉ", () => {
    const data = breadcrumbJsonLd("https://x.vn", [
      { label: "Trang chủ", href: "/" },
      { label: "Bình hoa" },
    ]) as { itemListElement: { position: number; item?: string }[] };
    expect(data.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(data.itemListElement[0]?.item).toBe("https://x.vn/");
    expect(data.itemListElement[1]?.item).toBeUndefined();
  });
});
