import { describe, expect, it } from "vitest";
import { transferContent } from "./transfer-content";

describe("transferContent", () => {
  it("bỏ dấu gạch", () => {
    expect(transferContent("LMR-261005-K7QF")).toBe("LMR261005K7QF");
  });
});
