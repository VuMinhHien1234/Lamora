import Link from "next/link";
import type { ServerProblem } from "./use-checkout-form";

/** Lỗi từ server khi đặt hàng: câu chung, kèm danh sách dòng lỗi nếu giỏ không đặt được. */
export function CartProblem({ problem }: { problem: ServerProblem }) {
  const lines = Object.entries(problem.cartLines);
  return (
    <div role="alert" className="flex flex-col gap-2 border border-error-700 px-4 py-3">
      <p className="type-small text-error-700">{problem.message}</p>
      {lines.length > 0 && (
        <ul className="type-small flex flex-col gap-1 text-error-700">
          {lines.map(([variantId, message]) => (
            <li key={variantId}>{message}</li>
          ))}
        </ul>
      )}
      {lines.length > 0 && (
        <Link href="/gio-hang" className="type-small underline underline-offset-4">
          Quay lại giỏ hàng để chỉnh sửa
        </Link>
      )}
    </div>
  );
}
