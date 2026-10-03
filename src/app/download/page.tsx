import type { Metadata } from "next";
import { headers } from "next/headers";
import { DownloadsPage, type Platform } from "@/features/landing-page/downloads-page";
import { latestPublishedRelease } from "./release-download";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download Local Studio for macOS (Apple silicon and Intel), Windows, and Linux (AppImage and .deb), plus standalone controller binaries for GPU machines.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Download Local Studio",
    description: "Installers for macOS, Windows, and Linux, and controller binaries for every machine.",
    url: "/download",
  },
};

const detectPlatform = (userAgent: string): Platform | undefined =>
  /Windows/i.test(userAgent)
    ? "windows"
    : /Macintosh|Mac OS X/i.test(userAgent) && !/iPhone|iPad/i.test(userAgent)
      ? "macos"
      : /Linux|X11/i.test(userAgent) && !/Android/i.test(userAgent)
        ? "linux"
        : undefined;

export default async function DownloadRoute() {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const release = await latestPublishedRelease().catch(() => undefined);
  return <DownloadsPage release={release} platform={detectPlatform(userAgent)} />;
}
