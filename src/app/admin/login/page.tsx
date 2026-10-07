import type { Metadata } from "next";
import { Logo } from "@/components/layout/logo";
import { LoginForm, redirectIfLoggedIn } from "@/features/auth";

export const metadata: Metadata = { title: "Đăng nhập" };

type PageProps = { searchParams: Promise<{ next?: string }> };

/** Chỉ cho quay về đường dẫn trong /admin, tránh bị dẫn sang trang lạ. */
function safeNext(value: string | undefined): string {
  if (value && value.startsWith("/admin") && !value.startsWith("//")) return value;
  return "/admin";
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const next = safeNext((await searchParams).next);
  await redirectIfLoggedIn(next);
  return (
    <main className="grid min-h-dvh place-items-center bg-ivory-100 px-4 py-12">
      <div className="w-full max-w-sm border border-sand-200 bg-ivory-50 p-8 sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo variant="full" />
          <p className="type-small text-stone-500">Khu vực quản trị</p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
