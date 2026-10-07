import { MessageCircle } from "lucide-react";
import { SITE } from "@/config/site";

const BUTTON_CLASS =
  "grid size-12 place-items-center rounded-full border border-sand-200 bg-ivory-50 text-ink-900 shadow-float transition-colors duration-300 hover:border-sand-300";

/** Hai nút chat nổi góc phải dưới. Chỉ hiện nút nào đã điền liên kết trong config/site.ts. */
export function ChatFloatingButtons() {
  const { zaloUrl, messengerUrl } = SITE.contact;
  if (!zaloUrl && !messengerUrl) return null;
  return (
    <div className="fixed right-4 bottom-6 z-30 flex flex-col gap-3">
      {zaloUrl && (
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo cho shop"
          className={BUTTON_CLASS}
        >
          <span className="text-[0.6875rem] font-medium tracking-wide">Zalo</span>
        </a>
      )}
      {messengerUrl && (
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Messenger cho shop"
          className={BUTTON_CLASS}
        >
          <MessageCircle aria-hidden strokeWidth={1.25} className="size-5" />
        </a>
      )}
    </div>
  );
}
