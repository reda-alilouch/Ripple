import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";

const supportedLngs = ["fr", "en"];
const defaultLng = "fr";
const cookieName = "i18next";

acceptLanguage.languages(supportedLngs);

export function middleware(req) {
  let lng;

  // 1. Détecter depuis le cookie
  if (req.cookies.has(cookieName)) {
    lng = req.cookies.get(cookieName).value;
  }

  // 2. Détecter depuis l'en-tête Accept-Language
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  }

  // 3. Langue par défaut
  if (!lng) {
    lng = defaultLng;
  }

  // Rediriger si la locale n'est pas dans l'URL
  if (
    !supportedLngs.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  // Attacher la langue au header pour les réponses
  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"));
    const lngInReferer = supportedLngs.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) {
      response.headers.set("X-i18next", lngInReferer);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
