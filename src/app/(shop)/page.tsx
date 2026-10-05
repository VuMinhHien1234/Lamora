import { Logo } from "@/components/layout/logo";
import { GoldRule } from "@/components/ui/divider";

// Trang tạm: trang chủ thật làm ở bước F8 (docs/05).
export default function HomePage() {
  return (
    <section className="page-container flex min-h-[60dvh] flex-col items-center justify-center gap-6 py-20 text-center">
      <Logo variant="full" className="scale-125" />
      <GoldRule className="mt-6" />
      <p className="type-lead max-w-md text-stone-500">
        Những đóa hoa lụa dịu dàng và bền lâu. Website đang được hoàn thiện.
      </p>
    </section>
  );
}
