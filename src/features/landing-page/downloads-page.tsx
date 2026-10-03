import Link from "next/link";
import { Apple, Cpu, DownloadCloud, Monitor, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PublishedAsset, PublishedRelease } from "@/app/download/release-download";
import { LandingNav } from "./landing-page";
import styles from "./downloads.module.css";

export type Platform = "macos" | "windows" | "linux";

type Row = {
  label: string;
  detail: string;
  match: RegExp;
  href?: string;
};

type Group = {
  id: Platform | "controller";
  title: string;
  icon: LucideIcon;
  rows: Row[];
  notes: string[];
};

const GROUPS: Group[] = [
  {
    id: "macos",
    title: "macOS",
    icon: Apple,
    rows: [
      { label: "Apple silicon", detail: "DMG installer · M1 and newer", match: /^Local-Studio-mac-arm64\.dmg$/, href: "/download/macos-arm64" },
      { label: "Intel", detail: "DMG installer", match: /^Local-Studio-mac-x64\.dmg$/, href: "/download/macos-x64" },
      { label: "Apple silicon", detail: "ZIP archive", match: /arm64.*\.zip$/ },
      { label: "Intel", detail: "ZIP archive", match: /x64.*\.zip$/ },
    ],
    notes: [
      "Signed and notarized by Apple.",
      "Open the DMG and drag Local Studio into Applications.",
      "The app updates itself after that.",
    ],
  },
  {
    id: "windows",
    title: "Windows",
    icon: Monitor,
    rows: [
      { label: "x64", detail: "Installer · Windows 10 and 11", match: /^Local-Studio-win-x64\.exe$/, href: "/download/windows" },
    ],
    notes: [
      "The installer is not code-signed yet.",
      "If SmartScreen appears, choose More info, then Run anyway.",
    ],
  },
  {
    id: "linux",
    title: "Linux",
    icon: Terminal,
    rows: [
      { label: "x64", detail: "AppImage", match: /^Local-Studio-linux-x64\.AppImage$/, href: "/download/linux" },
      { label: "arm64", detail: "AppImage", match: /^Local-Studio-linux-arm64\.AppImage$/, href: "/download/linux-arm64" },
      { label: "x64", detail: "Debian / Ubuntu package", match: /(amd64|x86_64|x64)\.deb$/ },
      { label: "arm64", detail: "Debian / Ubuntu package", match: /(arm64|aarch64)\.deb$/ },
    ],
    notes: [
      "AppImage: make the file executable with chmod +x, then run it.",
      "Debian or Ubuntu: sudo apt install ./Local-Studio-*.deb",
    ],
  },
  {
    id: "controller",
    title: "Controller only",
    icon: Cpu,
    rows: [
      { label: "Linux x64", detail: "Headless controller binary", match: /^local-studio-controller-linux-x64$/ },
      { label: "Linux arm64", detail: "Headless controller binary · DGX Spark, Jetson", match: /^local-studio-controller-linux-arm64$/ },
      { label: "macOS Apple silicon", detail: "Headless controller binary", match: /^local-studio-controller-darwin-arm64$/ },
      { label: "macOS Intel", detail: "Headless controller binary", match: /^local-studio-controller-darwin-x64$/ },
      { label: "Windows x64", detail: "Headless controller binary", match: /^local-studio-controller-windows-x64\.exe$/ },
    ],
    notes: [
      "For GPU machines without the desktop app.",
      "Local Studio can install the controller for you from Settings → Local → Install, on any Linux or macOS machine on your tailnet.",
      "To run it by hand: chmod +x the binary and start it. It listens on port 18091.",
    ],
  },
];

const formatSize = (bytes: number) =>
  bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(1)} GB` : `${Math.max(1, Math.round(bytes / 1024 ** 2))} MB`;

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

function AssetRow({ row, asset }: { row: Row; asset: PublishedAsset }) {
  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        <span className={styles.rowLabel}>{row.label}</span>
        <span className={styles.rowDetail}>{row.detail}</span>
      </div>
      <code className={styles.rowFile} title={asset.name}>{asset.name}</code>
      <span className={styles.rowSize}>{formatSize(asset.size)}</span>
      <code className={styles.rowHash} title={`SHA-256 ${asset.sha256}`}>{asset.sha256.slice(0, 12)}</code>
      <Link className={styles.rowLink} href={row.href ?? asset.url} prefetch={false}>
        <DownloadCloud size={15} aria-hidden="true" />
        Download
      </Link>
    </li>
  );
}

export function DownloadsPage({
  release,
  platform,
}: {
  release: PublishedRelease | undefined;
  platform: Platform | undefined;
}) {
  const assetFor = (row: Row) => release?.assets.find((asset) => row.match.test(asset.name));
  const groups = [...GROUPS].sort((a, b) => Number(b.id === platform) - Number(a.id === platform));

  return (
    <main className={styles.shell}>
      <LandingNav />
      <section className={styles.header} aria-labelledby="downloads-title">
        <p className={styles.kicker}>Downloads</p>
        <h1 id="downloads-title" className={styles.title}>
          Local Studio for every machine.
        </h1>
        {release ? (
          <p className={styles.meta}>
            Version {release.version}
            {release.publishedAt ? ` · ${formatDate(release.publishedAt)}` : ""} ·{" "}
            <Link href={release.pageUrl} prefetch={false} target="_blank" rel="noopener noreferrer">
              Release notes ↗
            </Link>
            {release.sumsUrl ? (
              <>
                {" · "}
                <Link href={release.sumsUrl} prefetch={false}>
                  SHA256SUMS
                </Link>
              </>
            ) : null}
          </p>
        ) : (
          <p className={styles.meta}>
            The first multi-platform release is being published.{" "}
            <Link href="https://github.com/sybil-solutions/local-studio/releases" prefetch={false}>
              See all releases on GitHub ↗
            </Link>
          </p>
        )}
      </section>

      {groups.map((group) => {
        const Icon = group.icon;
        const rows = group.rows.flatMap((row) => {
          const asset = assetFor(row);
          return asset ? [{ row, asset }] : [];
        });
        return (
          <section
            key={group.id}
            id={group.id}
            className={styles.group}
            data-recommended={group.id === platform || undefined}
            aria-labelledby={`${group.id}-title`}
          >
            <div className={styles.groupHead}>
              <Icon size={20} aria-hidden="true" />
              <h2 id={`${group.id}-title`}>{group.title}</h2>
              {group.id === platform ? <span className={styles.badge}>Your system</span> : null}
            </div>
            {rows.length ? (
              <ul className={styles.rows}>
                {rows.map(({ row, asset }) => (
                  <AssetRow key={asset.name} row={row} asset={asset} />
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>Not in the current release yet.</p>
            )}
            <ul className={styles.notes}>
              {group.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        );
      })}

      <footer className={styles.footnote}>
        Local Studio is built on{" "}
        <Link href="https://github.com/pingdotgg/t3code" prefetch={false} target="_blank" rel="noopener noreferrer">
          T3 Code
        </Link>{" "}
        and released under the MIT License. Every download link checks the release checksum before redirecting
        to GitHub.
      </footer>
    </main>
  );
}
