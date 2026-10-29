import Link from "next/link";
import { FOOTER_ABOUT_LINKS, FOOTER_SUPPORT_LINKS, SITE, type NavLink } from "@/config/site";
import { Logo } from "./logo";

type FooterColumn = { title: string; links?: NavLink[]; lines?: string[] };

function buildColumns(): FooterColumn[] {
  const { contact, social } = SITE;
  const socialLines = Object.entries({
    Threads: social.threads,
    Instagram: social.instagram,
    TikTok: social.tiktok,
  })
    .filter(([, url]) => url !== "")
    .map(([name]) => name);
  return [
    { title: "Về Lamora", links: FOOTER_ABOUT_LINKS },
    { title: "Hỗ trợ", links: FOOTER_SUPPORT_LINKS },
    { title: "Liên hệ", lines: [contact.phone, contact.email, contact.hours, contact.address] },
    ...(socialLines.length > 0 ? [{ title: "Mạng xã hội", lines: socialLines }] : []),
  ];
}

function ColumnBody({ column }: { column: FooterColumn }) {
  return (
    <div className="type-small flex flex-col gap-2 text-ivory-50/80">
      {column.links?.map((link) => (
        <Link key={link.href} href={link.href} className="link-underline w-fit py-1">
          {link.label}
        </Link>
      ))}
      {column.lines?.map((line) => (
        <p key={line} className="max-w-xs py-1">
          {line}
        </p>
      ))}
    </div>
  );
}

/** Footer nền ink-900: 4 cột trên máy tính, danh sách mở/đóng trên điện thoại (docs/03 mục 9.1). */
export function SiteFooter() {
  const columns = buildColumns();
  const desktopGrid = columns.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3";
  return (
    <footer className="mt-24 bg-ink-900 text-ivory-50 md:mt-28">
      <div className="page-container py-12 md:py-16">
        <div
          className={`hidden gap-10 md:mx-auto md:grid md:max-w-5xl md:justify-items-center ${desktopGrid}`}
        >
          {columns.map((column) => (
            <section key={column.title} className="w-full max-w-xs">
              <h2 className="type-eyebrow mb-5 text-gold-500">{column.title}</h2>
              <ColumnBody column={column} />
            </section>
          ))}
        </div>
        <div className="divide-y divide-ivory-50/15 border-y border-ivory-50/15 md:hidden">
          {columns.map((column) => (
            <details key={column.title} className="group">
              <summary className="type-eyebrow flex min-h-14 list-none items-center justify-between [&::-webkit-details-marker]:hidden">
                {column.title}
                <span aria-hidden className="text-gold-500 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-5">
                <ColumnBody column={column} />
              </div>
            </details>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-ivory-50/15 pt-10 text-center">
          <Logo variant="full" tone="light" />
          <p className="type-small max-w-md text-ivory-50/80">{SITE.description}</p>
          <p className="type-small text-ivory-50/60">
            © {new Date().getFullYear()} {SITE.name}. Hoa lụa làm tay, giao tận nơi.
          </p>
          <p className="type-small text-ivory-50/60">
            Người bán: {SITE.seller.name}
            {SITE.seller.taxCode ? ` · MST ${SITE.seller.taxCode}` : ""} · {SITE.contact.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
