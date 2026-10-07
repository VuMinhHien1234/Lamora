import type { ReactNode } from "react";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Divider } from "@/components/ui/divider";
import { Markdown } from "@/components/ui/markdown";

type Props = { title: string; body: string; children?: ReactNode };

/** Khung chung cho trang tĩnh (S11): đường dẫn, tiêu đề, nội dung Markdown và phần bổ sung (nếu có). */
export function StaticPageLayout({ title, body, children }: Props) {
  const crumbs = [{ label: "Trang chủ", href: "/" }, { label: title }];
  return (
    <article className="page-container max-w-3xl py-8 lg:py-12">
      <Breadcrumb items={crumbs} />
      <BreadcrumbJsonLd items={crumbs} />
      <header className="mt-4 mb-8 flex flex-col gap-4">
        <h1 className="type-h1">{title}</h1>
        <Divider variant="ornament" className="justify-start" />
      </header>
      {body && <Markdown source={body} variant="article" />}
      {children}
    </article>
  );
}
