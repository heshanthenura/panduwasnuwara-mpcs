import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { MembershipProvider } from "@/app/context/MembershipContext";
import MembershipModals from "@/app/components/MembershipModals";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <NextIntlClientProvider messages={messages}>
        <MembershipProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <MembershipModals />
        </MembershipProvider>
      </NextIntlClientProvider>
    </div>
  );
}
