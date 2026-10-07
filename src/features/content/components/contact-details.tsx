import { SITE } from "@/config/site";

type Row = { label: string; value: string; href?: string };

function rows(): Row[] {
  const { phone, email, hours, address, zaloUrl, messengerUrl } = SITE.contact;
  const list: Row[] = [
    { label: "Điện thoại", value: phone, href: `tel:${phone.replaceAll(" ", "")}` },
    { label: "Email", value: email, href: `mailto:${email}` },
  ];
  if (zaloUrl) list.push({ label: "Zalo", value: "Nhắn Zalo cho Lamora", href: zaloUrl });
  if (messengerUrl) list.push({ label: "Messenger", value: "Nhắn Messenger", href: messengerUrl });
  list.push({ label: "Giờ làm việc", value: hours }, { label: "Khu vực", value: address });
  return list;
}

/** Thông tin liên hệ lấy từ config/site.ts. P0 không có form liên hệ (docs/05 mục 10). */
export function ContactDetails() {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows().map((row) => (
        <div key={row.label} className="border border-sand-200 p-5">
          <dt className="type-eyebrow mb-2 text-stone-500">{row.label}</dt>
          <dd className="type-body">
            {row.href ? (
              <a href={row.href} className="link-underline py-1">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
