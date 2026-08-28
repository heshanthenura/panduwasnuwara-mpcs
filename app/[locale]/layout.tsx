import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import Navbar from "@/app/components/Navbar";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <div className="min-h-screen flex flex-col">
      <NextIntlClientProvider messages={messages}>
        <Navbar />
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
