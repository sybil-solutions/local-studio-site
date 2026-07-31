import type { Metadata } from "next";
import { MobilePage } from "@/features/landing-page/mobile-page";

export const metadata: Metadata = {
  title: "Mobile",
  description:
    "Pair KittyLitter with Local Studio, continue the same agent sessions from your phone, and understand exactly what the connection can access.",
  alternates: { canonical: "/mobile" },
  openGraph: {
    title: "Local Studio on your phone",
    description: "Pair once, then continue the same local agent sessions with KittyLitter.",
    url: "/mobile",
  },
};

export default function MobileRoute() {
  return <MobilePage />;
}
