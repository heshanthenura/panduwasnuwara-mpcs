import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "si"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: [
    "/",
    "/(en|si)/:path*",
  ],
};
