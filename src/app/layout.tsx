import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/be-vietnam-pro/300.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import { ToastProvider } from "@/components/ui/toast";
import { SITE } from "@/config/site";
import { getEnv } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getEnv().NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${SITE.name} — Hoa lụa cao cấp, bền đẹp như thật`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: { siteName: SITE.name, locale: "vi_VN", type: "website" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="vi"
      style={
        {
          "--font-cormorant": "'Cormorant Garamond'",
          "--font-be-vietnam": "'Be Vietnam Pro'",
        } as React.CSSProperties
      }
    >
      <body>
        <ToastProvider>{children}</ToastProvider>
        <GoogleAnalytics gaId={getEnv().NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
