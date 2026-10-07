import { Button } from "@/components/ui/button";
import type { AvailableColor } from "../shop-types";
import { PRICE_RANGES, priceRangeValue, SORT_OPTIONS, type ShopListState } from "../shop-url";

type Props = {
  basePath: string;
  state: ShopListState;
  colors: AvailableColor[];
  /** Tiền tố id để dùng form ở hai nơi (cột bên máy tính, bảng trượt điện thoại) mà không trùng id. */
  idPrefix: string;
};

function ColorOption({
  color,
  checked,
  id,
}: {
  color: AvailableColor;
  checked: boolean;
  id: string;
}) {
  return (
    <label htmlFor={id} className="type-small flex min-h-11 cursor-pointer items-center gap-3">
      <input
        id={id}
        type="checkbox"
        name="mau"
        value={color.name}
        defaultChecked={checked}
        className="peer sr-only"
      />
      <span
        aria-hidden
        style={{ backgroundColor: color.hex }}
        className="block size-6 shrink-0 rounded-full border border-sand-200 peer-checked:ring-1 peer-checked:ring-ink-900 peer-checked:ring-offset-[3px] peer-checked:ring-offset-ivory-50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-900"
      />
      {color.name}
    </label>
  );
}

function PriceOption({
  value,
  label,
  checked,
  id,
}: {
  value: string;
  label: string;
  checked: boolean;
  id: string;
}) {
  return (
    <label htmlFor={id} className="type-small flex min-h-11 cursor-pointer items-center gap-3">
      <input
        id={id}
        type="radio"
        name="gia"
        value={value}
        defaultChecked={checked}
        className="size-4 accent-ink-900"
      />
      {label}
    </label>
  );
}

/** Form GET: dùng được cả khi chưa tải xong JavaScript. Gửi form là địa chỉ trang đổi theo bộ lọc. */
export function ShopFilterForm({ basePath, state, colors, idPrefix }: Props) {
  const price = priceRangeValue(state);
  const sort = SORT_OPTIONS.find((option) => option.value === state.sort);
  return (
    <form method="get" action={basePath} className="flex flex-col gap-6">
      {state.q && <input type="hidden" name="q" value={state.q} />}
      {sort && state.sort !== "newest" && <input type="hidden" name="sap-xep" value={sort.param} />}
      {colors.length > 0 && (
        <fieldset>
          <legend className="type-eyebrow mb-2">Màu sắc</legend>
          {colors.map((color) => (
            <ColorOption
              key={color.name}
              color={color}
              checked={state.colors.includes(color.name)}
              id={`${idPrefix}-mau-${color.name}`}
            />
          ))}
        </fieldset>
      )}
      <fieldset>
        <legend className="type-eyebrow mb-2">Khoảng giá</legend>
        <PriceOption
          value=""
          label="Tất cả mức giá"
          checked={price === ""}
          id={`${idPrefix}-gia-all`}
        />
        {PRICE_RANGES.map((range) => (
          <PriceOption
            key={range.value}
            value={range.value}
            label={range.label}
            checked={price === range.value}
            id={`${idPrefix}-gia-${range.value}`}
          />
        ))}
      </fieldset>
      <Button type="submit" fullWidth>
        Áp dụng
      </Button>
    </form>
  );
}
