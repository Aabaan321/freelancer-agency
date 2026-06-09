import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { ChatWidget } from "@/components/marketing/chat-widget";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
