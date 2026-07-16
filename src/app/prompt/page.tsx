import type { Metadata } from "next";
import { PromptPage } from "@/features/prompt-page/prompt-page";

export const metadata: Metadata = {
  title: "Setup Prompt",
  description: "A portable prompt for a coding model to install and verify Local Studio on any supported machine.",
};

export default function PromptRoute() {
  return <PromptPage />;
}
