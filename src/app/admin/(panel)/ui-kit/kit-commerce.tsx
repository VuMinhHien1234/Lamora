"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { EmptyState } from "@/components/ui/empty-state";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { SizeOption } from "@/components/ui/size-option";
import { ButtonLink } from "@/components/ui/button";
import { KitRow, KitSection } from "./kit-section";

const COLORS = [
  { name: "Hồng phấn", hex: "#E8B4B8", soldOut: false },
  { name: "Trắng ngà", hex: "#F3EBDD", soldOut: false },
  { name: "Champagne", hex: "#E7D3B5", soldOut: true },
  { name: "Đỏ rượu", hex: "#8E2F3C", soldOut: false },
];

function VariantPickers() {
  const [color, setColor] = useState("Hồng phấn");
  const [size, setSize] = useState("Vừa (45cm)");
  const [quantity, setQuantity] = useState(1);
  return (
    <>
      <KitRow label={`Màu: ${color}`}>
        {COLORS.map((item) => (
          <ColorSwatch
            key={item.name}
            {...item}
            selected={color === item.name}
            onClick={() => setColor(item.name)}
          />
        ))}
      </KitRow>
      <KitRow label={`Kích cỡ: ${size}`}>
        {["Nhỏ (30cm)", "Vừa (45cm)", "Lớn (60cm)"].map((item) => (
          <SizeOption
            key={item}
            selected={size === item}
            disabled={item === "Lớn (60cm)"}
            onClick={() => setSize(item)}
          >
            {item}
          </SizeOption>
        ))}
      </KitRow>
      <KitRow label="Số lượng">
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </KitRow>
    </>
  );
}

function ImageBadges() {
  return (
    <KitRow label="Nhãn trên ảnh (tỉ lệ 4:5) và khối đang tải">
      <div className="relative aspect-[4/5] w-40 bg-ivory-100">
        <Badge className="absolute top-3 left-3">Mới</Badge>
      </div>
      <div className="relative aspect-[4/5] w-40 bg-ivory-100">
        <Badge tone="outline" className="absolute top-3 left-3">
          Hết hàng
        </Badge>
      </div>
      <div className="flex w-40 flex-col gap-3">
        <Skeleton className="aspect-[4/5] w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </KitRow>
  );
}

export function KitCommerce() {
  return (
    <KitSection
      id="thuong-mai"
      title="Thành phần bán hàng"
      note="Ô màu tròn là ngoại lệ duy nhất được bo tròn."
    >
      <KitRow label="Giá">
        <Price price={650000} />
        <Price price={650000} compareAtPrice={720000} />
        <Price price={450000} from />
      </KitRow>
      <VariantPickers />
      <ImageBadges />
      <EmptyState
        title="Giỏ hàng của bạn đang trống"
        description="Dạo một vòng bộ sưu tập nhé."
        action={
          <ButtonLink href="/" variant="secondary">
            Xem bộ sưu tập
          </ButtonLink>
        }
      />
    </KitSection>
  );
}
