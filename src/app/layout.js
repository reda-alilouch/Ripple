import { Inter } from "next/font/google";
import "./global.css";
import AuthProvider from "@/components/AuthProvider";
import TranslationsProvider from "@/components/TranslationsProvider";
import initI18next from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ripple",
  description: "Ripple - Your Music Companion",
};

const i18nNamespaces = ["common", "auth", "messages", "footer"];

export default async function RootLayout({ children, params: { locale } }) {
  const i18n = await initI18next(locale, i18nNamespaces);

  return (
    <html lang={i18n.language}>
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-slate-900`}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={i18n.language}
        >
          <AuthProvider>{children}</AuthProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
