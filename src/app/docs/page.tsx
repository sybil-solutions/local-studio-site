import type { Metadata } from "next";
import { DocsPage } from "@/features/landing-page/landing-page";

export const metadata: Metadata = {
  title: "Docs",
  description: "Set up Local Studio, its inference runtimes, remote controllers, and agent surface.",
};

export default function DocsRoute() {
  return <DocsPage />;
}
