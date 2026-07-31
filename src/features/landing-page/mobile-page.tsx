import Link from "next/link";
import {
  ArrowRight,
  DownloadCloud,
  KeyRound,
  Laptop,
  LockKeyhole,
  MessageSquareMore,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wrench,
} from "lucide-react";
import { LandingNav } from "./landing-page";
import styles from "./landing.module.css";

const requirements = [
  "Local Studio 2.9.0 or newer on macOS",
  "KittyLitter 1.6.0 or newer on iPhone, iPad, or Android",
  "Local Studio running and your Mac reachable",
];

const steps = [
  {
    title: "Open the connection",
    body: "In Local Studio, open Settings, choose Profile & phone, and find Connect your phone.",
    icon: Laptop,
  },
  {
    title: "Scan it in KittyLitter",
    body: "Open KittyLitter's server scanner, choose Local Studio, and scan the QR code. Copy connection JSON is the fallback when scanning is unavailable.",
    icon: QrCode,
  },
  {
    title: "Continue the same work",
    body: "Open the Local Studio server in KittyLitter. Existing sessions appear there; new phone turns return to the same session on your Mac.",
    icon: MessageSquareMore,
  },
];

const capabilities = [
  {
    title: "One session list",
    body: "Start on desktop, continue on mobile, then return to Local Studio without creating a disconnected copy.",
    icon: MessageSquareMore,
  },
  {
    title: "The complete timeline",
    body: "Stream assistant content, reasoning, tool calls, and tool results in their original order.",
    icon: Wrench,
  },
  {
    title: "Work stays on the Mac",
    body: "The agent runtime and filesystem operations run through Local Studio on your Mac. This website never receives your sessions or files.",
    icon: LockKeyhole,
  },
];

export function MobilePage() {
  return (
    <main className={styles.minimalShell}>
      <LandingNav />

      <section className={styles.mobileHero} aria-labelledby="mobile-title">
        <div className={styles.mobileHeroTexture} aria-hidden="true" />
        <div className={styles.mobileHeroCopy}>
          <p className={styles.sectionKicker}>Local Studio · KittyLitter</p>
          <h1 id="mobile-title" className={styles.mobileTitle}>
            Your local agents,
            <br />
            away from your desk.
          </h1>
          <p className={styles.mobileLead}>
            Pair KittyLitter once, then read and continue the same Local Studio sessions from your
            phone. The work still runs on your Mac.
          </p>
          <div className={styles.mobileActions}>
            <Link className={styles.button} href="/download/macos" prefetch={false}>
              <DownloadCloud size={17} aria-hidden="true" />
              Download Local Studio
            </Link>
            <Link
              className={styles.minimalLink}
              href="https://kittylitter.app"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get KittyLitter
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <ul className={styles.requirementList} aria-label="Mobile connection requirements">
            {requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>

        <div className={styles.connectionMap} aria-label="KittyLitter connects securely to Local Studio on your Mac">
          <div className={styles.connectionNode}>
            <span className={styles.connectionIcon}><Smartphone size={22} aria-hidden="true" /></span>
            <span><strong>KittyLitter</strong><small>Your trusted phone</small></span>
          </div>
          <div className={styles.connectionChannel}>
            <span>authenticated connection</span>
            <ArrowRight size={18} aria-hidden="true" />
          </div>
          <div className={styles.connectionNode}>
            <span className={styles.connectionIcon}><Laptop size={22} aria-hidden="true" /></span>
            <span><strong>Local Studio</strong><small>Your Mac and agents</small></span>
          </div>
          <p className={styles.connectionNote}>
            Same sessions. Same runtime. No pairing data sent to localstudio.ai.
          </p>
        </div>
      </section>

      <section className={styles.mobileSection} aria-labelledby="pair-title">
        <div className={styles.mobileSectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Pair once</p>
            <h2 id="pair-title">Three steps, no server setup.</h2>
          </div>
          <p>
            Local Studio creates the connection. KittyLitter saves it securely so you do not need
            to scan again every time.
          </p>
        </div>
        <ol className={styles.stepGrid}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className={styles.stepCard}>
                <div className={styles.stepNumber}>0{index + 1}</div>
                <Icon size={22} aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.mobileSection} aria-labelledby="sync-title">
        <div className={styles.mobileSectionHeader}>
          <div>
            <p className={styles.sectionKicker}>What carries across</p>
            <h2 id="sync-title">A window into the same runtime.</h2>
          </div>
          <p>
            KittyLitter is not a separate cloud copy of Local Studio. It connects to the controller
            and agent runtime you already use.
          </p>
        </div>
        <div className={styles.capabilityRail}>
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <article key={capability.title} className={styles.capabilityCard}>
                <Icon size={21} aria-hidden="true" />
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.securitySection} aria-labelledby="security-title">
        <div className={styles.securityMark} aria-hidden="true">
          <ShieldCheck size={34} />
        </div>
        <div className={styles.securityCopy}>
          <p className={styles.sectionKicker}>Security boundary</p>
          <h2 id="security-title">Treat the pairing code like a password.</h2>
          <p>
            The QR code and copied connection JSON contain a private controller credential. They
            grant access to every agent enabled on that controller—not only Local Studio. Scan only
            with a device you trust. Never post, email, record, or paste the code into support chat.
          </p>
          <ul>
            <li><KeyRound size={17} aria-hidden="true" /> The public screenshots use permanently redacted QR images.</li>
            <li><LockKeyhole size={17} aria-hidden="true" /> Local bridge requests are signed and replay-protected.</li>
            <li><ShieldCheck size={17} aria-hidden="true" /> This page has no form, tracker, or pairing upload endpoint.</li>
          </ul>
        </div>
      </section>

      <section className={styles.mobileCta} aria-labelledby="mobile-cta-title">
        <p className={styles.sectionKicker}>Ready when both apps are current</p>
        <h2 id="mobile-cta-title">Take the session with you.</h2>
        <div>
          <Link className={styles.button} href="/download/macos" prefetch={false}>
            Download Local Studio
          </Link>
          <Link
            className={styles.minimalLink}
            href="https://kittylitter.app"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open kittylitter.app
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <footer className={styles.minimalFooter}>
        <span>Local Studio × KittyLitter</span>
        <span>Private controller access from a trusted device.</span>
      </footer>
    </main>
  );
}
