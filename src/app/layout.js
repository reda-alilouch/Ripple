import { Inter } from "next/font/google";
import "./global.css";
import AuthProvider from "@/components/AuthProvider";
import ClientI18nProvider from "@/components/ClientI18nProvider";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ripple",
  description: "Ripple - Your Music Companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
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
        <ThemeProvider>
          <ClientI18nProvider>
            <AuthProvider>{children}</AuthProvider>
          </ClientI18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
