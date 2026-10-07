"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GIFT_MESSAGE_MAX, GIFT_WRAP_FEE } from "@/config/shipping";
import { formatVnd } from "@/lib/money";
import { setCardMessage, setCardWrap, useCardNote } from "../card-store";

/** Thiệp lời nhắn và gói quà riêng cho một sản phẩm. Tùy chọn; gập lại khi chưa dùng. */
export function LineCardEditor({ variantId, name }: { variantId: string; name: string }) {
  const note = useCardNote(variantId);
  const [open, setOpen] = useState(false);
  const filled = note.message !== "" || note.wrap;
  const shown = open || filled;
  if (!shown) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="type-small mt-1 self-start text-stone-500 underline underline-offset-4 hover:text-ink-900"
      >
        + Thêm thiệp / gói quà<span className="sr-only"> cho {name}</span>
      </button>
    );
  }
  return (
    <div className="mt-3 flex flex-col gap-3 border border-sand-200 p-3">
      <Textarea
        label="Lời nhắn trên thiệp"
        rows={2}
        maxLength={GIFT_MESSAGE_MAX}
        value={note.message}
        hint={`Tùy chọn · ${note.message.length}/${GIFT_MESSAGE_MAX} ký tự. Shop viết tay vào thiệp kèm sản phẩm này.`}
        onChange={(event) => setCardMessage(variantId, event.target.value)}
      />
      <Switch
        checked={note.wrap}
        onChange={(wrap) => setCardWrap(variantId, wrap)}
        label={`Gói quà (+${formatVnd(GIFT_WRAP_FEE)})`}
      />
    </div>
  );
}
