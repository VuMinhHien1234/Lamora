"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { KitSection } from "./kit-section";

export function KitForms() {
  const [on, setOn] = useState(true);
  return (
    <KitSection
      id="form"
      title="Ô nhập"
      note="Cao 48px, bo 2px, viền sand-200; focus đổi viền ink-900. Luôn có nhãn hiển thị."
    >
      <div className="grid max-w-3xl gap-6 md:grid-cols-2">
        <Input label="Họ tên" placeholder="Nguyễn Thu Hà" required />
        <Input
          label="Số điện thoại"
          placeholder="0900 000 000"
          hint="Shop sẽ gọi xác nhận đơn qua số này"
        />
        <Input
          label="Email"
          type="email"
          defaultValue="sai-dinh-dang"
          error="Email chưa đúng định dạng"
        />
        <Input label="Đã khóa" defaultValue="Không sửa được" disabled />
        <Select label="Tỉnh / thành" defaultValue="">
          <option value="" disabled>
            Chọn tỉnh / thành
          </option>
          <option>Hà Nội</option>
          <option>Hồ Chí Minh</option>
        </Select>
        <Textarea label="Lời nhắn thiệp" hint="Tối đa 300 ký tự" rows={3} />
        <Switch checked={on} onChange={setOn} label="Hiển thị trên website" />
      </div>
    </KitSection>
  );
}
