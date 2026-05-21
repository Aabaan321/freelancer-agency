import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "es", "fr", "de", "zh", "ja", "ko", "hi", "ur", "pt", "ru", "it", "tr", "nl"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const RTL_LOCALES = ["ar", "ur"];

export function isRTL(locale: string) {
  return RTL_LOCALES.includes(locale);
}
