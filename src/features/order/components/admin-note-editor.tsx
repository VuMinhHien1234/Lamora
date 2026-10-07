"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { updateAdminNote } from "../admin-actions";

type Status = "idle" | "saving" | "saved" | "error";

const HINT: Record<Status, string> = {
  idle: "Chỉ chủ shop thấy ghi chú này. Tự lưu khi bạn bấm ra ngoài ô.",
  saving: "Đang lưu…",
  saved: "Đã lưu",
  error: "Chưa lưu được, bạn thử lại nhé.",
};

/** Ghi chú nội bộ, tự lưu khi rời ô nhập. */
export function AdminNoteEditor({ orderId, initial }: { orderId: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");

  async function save(): Promise<void> {
    if (value === saved) return;
    setStatus("saving");
    const result = await updateAdminNote({ id: orderId, adminNote: value });
    if (result.ok) setSaved(value);
    setStatus(result.ok ? "saved" : "error");
  }

  return (
    <Textarea
      label="Ghi chú nội bộ"
      rows={4}
      maxLength={1000}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => void save()}
      hint={HINT[status]}
    />
  );
}
