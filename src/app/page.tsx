import type { Metadata } from "next";
import { LandingPage } from "@/features/landing-page/landing-page";

export const metadata: Metadata = {
  title: "Local Studio",
  description:
    "One operating surface for controllers, GPUs, models, providers, and local coding agents.",
};

export default function HomePage() {
  return <LandingPage />;
}
