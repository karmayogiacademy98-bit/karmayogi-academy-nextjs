import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import WhatsAppButton from "@/components/website/WhatsAppButton";
import ReCaptchaProvider from "@/components/providers/ReCaptchaProvider";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function WebsiteLayout({ children }) {
  const settings = await getSiteSettings();
  return (
    <ReCaptchaProvider>
      <AnalyticsProvider />
      <Header logoUrl={settings?.logo_url || null} phone={settings?.phone} />
      <main>{children}</main>
      <Footer logoUrl={settings?.logo_url || null} />
      <WhatsAppButton phoneNumber={settings?.whatsapp} />
    </ReCaptchaProvider>
  );
}
