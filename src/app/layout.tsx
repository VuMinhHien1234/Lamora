import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/be-vietnam-pro/300.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { SITE } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
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
      </body>
    </html>
  );
}
