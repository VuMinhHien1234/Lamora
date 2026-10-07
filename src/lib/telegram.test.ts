import { afterEach, describe, expect, it, vi } from "vitest";

const env = { TELEGRAM_ENABLED: false, TELEGRAM_BOT_TOKEN: "tok", TELEGRAM_CHAT_ID: "42" };
vi.mock("./env", () => ({ getEnv: () => env }));
const { formatAdminLoginMessage, sendTelegram } = await import("./telegram");

afterEach(() => {
  vi.unstubAllGlobals();
  env.TELEGRAM_ENABLED = false;
});

describe("sendTelegram", () => {
  it("tắt (TELEGRAM_ENABLED=false) thì không gọi mạng", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await sendTelegram("xin chào");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bật thì gửi HTML tới đúng chat", async () => {
    env.TELEGRAM_ENABLED = true;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    await sendTelegram("xin chào");
    const [url, init] = fetchMock.mock.calls[0] as [string, { body: string }];
    expect(url).toBe("https://api.telegram.org/bottok/sendMessage");
    expect(JSON.parse(init.body)).toMatchObject({
      chat_id: "42",
      text: "xin chào",
      parse_mode: "HTML",
    });
  });

  it("lỗi mạng hoặc Telegram trả lỗi không làm hỏng (không ném)", async () => {
    env.TELEGRAM_ENABLED = true;
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    await expect(sendTelegram("x")).resolves.toBeUndefined();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(sendTelegram("x")).resolves.toBeUndefined();
  });
});

describe("formatAdminLoginMessage", () => {
  it("tin đăng nhập admin theo giờ Việt Nam", () => {
    const text = formatAdminLoginMessage(new Date("2026-10-05T15:41:00Z"), "abcdef0123456789");
    expect(text).toContain("22:41");
    expect(text).toContain("05/10/2026");
    expect(text).toContain("abcdef01");
  });
});
