import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <EmptyState
      title="Giỏ hàng của bạn đang trống"
      description="Hãy chọn vài bông hoa lụa để mang vẻ đẹp về nhà."
      action={
        <ButtonLink href="/san-pham" variant="secondary" onClick={onNavigate}>
          Tiếp tục mua sắm
        </ButtonLink>
      }
    />
  );
}
