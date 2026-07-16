import type { Metadata } from "next";
import { AgentsPage } from "@/features/landing-page/agents-page";

export const metadata: Metadata = {
  title: "Agents",
  description: "Configure Local Studio controllers, providers, runtimes, and Pi sessions.",
};

export default function AgentsRoute() {
  return <AgentsPage />;
}
