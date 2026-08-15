import SplashElementBuilderSection from "@/components/splash/SplashElementBuilderSection";
import { Metadata } from "next";
import NotificationsBanner from "@/components/core-features/notifications/NotificationsBanner";
export const metadata: Metadata = {
  title: "Notifications | Discover premium cosmetics and skincare products at Beauty Station.",
  description: "Discover premium cosmetics and skincare products at Beauty Station.",
};
export default function NotificationsPage() {
  return (
    <>
      <NotificationsBanner />
      <SplashElementBuilderSection
        sectionTitle="Back to Stock Notification"
        cards={[
          {
            number: "01",
            title: (
              <>
                Back to Stock <br />
                Notification: Stay <br />
                Updated on Restocks!
              </>
            ),
            description: (
              <>
                Compare your selected products in a table with Beauty Station Compare
                Table Builder. Choose from a variety of pre-built templates.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
