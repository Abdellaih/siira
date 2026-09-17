import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { localeDir } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = localeDir[(locale as Locale) ?? "fr"] ?? "ltr";

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div lang={locale} dir={dir}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
