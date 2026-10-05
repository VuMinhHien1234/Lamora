import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { ChangePasswordForm, requireAdminPage } from "@/features/auth";

export const metadata: Metadata = { title: "Tài khoản" };

type PageProps = { searchParams: Promise<{ "bat-buoc"?: string }> };

export default async function AccountPage({ searchParams }: PageProps) {
  const admin = await requireAdminPage();
  const forced = (await searchParams)["bat-buoc"] !== undefined || admin.mustChangePassword;
  return (
    <>
      <AdminPageHeader title="Tài khoản" />
      {forced && (
        <p
          role="status"
          className="type-small mb-6 border-l-2 border-rose-400 bg-blush-100 px-4 py-3 text-rose-700"
        >
          Bạn đang dùng mật khẩu ban đầu. Vui lòng đổi mật khẩu trước khi sử dụng các trang khác.
        </p>
      )}
      <section className="mb-10 border border-sand-200 bg-ivory-50 p-5 lg:p-8">
        <h2 className="type-h3 mb-4">Thông tin</h2>
        <dl className="type-body grid gap-1 sm:grid-cols-[8rem_1fr]">
          <dt className="text-stone-500">Tên</dt>
          <dd>{admin.name}</dd>
          <dt className="text-stone-500">Email</dt>
          <dd>{admin.email}</dd>
        </dl>
      </section>
      <section className="border border-sand-200 bg-ivory-50 p-5 lg:p-8">
        <h2 className="type-h3 mb-1">Đổi mật khẩu</h2>
        <p className="type-small mb-6 text-stone-500">
          Sau khi đổi, các thiết bị khác đang đăng nhập sẽ bị đăng xuất.
        </p>
        <ChangePasswordForm />
      </section>
    </>
  );
}
