import type { CartWarning } from "../types";

/** Danh sách cảnh báo từ server (hết hàng, không đủ hàng…). */
export function CartWarnings({ warnings }: { warnings: CartWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <ul role="alert" className="flex flex-col gap-1 border border-warning-700 px-4 py-3">
      {warnings.map((warning) => (
        <li key={`${warning.variantId}-${warning.code}`} className="type-small text-warning-700">
          {warning.message}
        </li>
      ))}
    </ul>
  );
}
