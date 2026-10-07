"use client";

import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GIFT_MESSAGE_MAX, GIFT_WRAP_FEE } from "@/config/shipping";
import { formatVnd } from "@/lib/money";
import { useCardNote } from "../card-store";

/** Ô soạn lời nhắn thiệp và chọn gói quà ngay ở giỏ hàng. Tùy chọn, điền sẵn sang trang thanh toán. */
export function CardNoteBox() {
  const note = useCardNote();
  return (
    <section className="mt-6 flex flex-col gap-4 border border-sand-200 p-5">
      <h2 className="type-eyebrow">Thiệp &amp; lời nhắn</h2>
      <Textarea
        label="Lời nhắn trên thiệp"
        rows={3}
        maxLength={GIFT_MESSAGE_MAX}
        value={note.message}
        hint={`Tùy chọn · ${note.message.length}/${GIFT_MESSAGE_MAX} ký tự. Shop sẽ viết tay vào thiệp kèm theo hoa.`}
        onChange={(event) => note.setMessage(event.target.value)}
      />
      <Switch
        checked={note.wrap}
        onChange={note.setWrap}
        label={`Gói quà (+${formatVnd(GIFT_WRAP_FEE)})`}
      />
    </section>
  );
}
