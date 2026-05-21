import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { ChatWidget } from "@/components/marketing/chat-widget";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <AnnouncementBar />
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}
