import Script from "next/script";
import type { ReactElement } from "react";

/** Google Analytics: chỉ được nhúng khi đã đặt NEXT_PUBLIC_GA_ID. Không có ID thì không tải gì. */
export function GoogleAnalytics({ gaId }: { gaId: string | undefined }): ReactElement | null {
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
