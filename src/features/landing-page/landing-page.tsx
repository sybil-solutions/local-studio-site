import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  DownloadCloud,
} from "lucide-react";
import styles from "./landing.module.css";

type Screenshot = {
  src: string;
  title: string;
  meta: string;
  alt: string;
  width: number;
  height: number;
};

export const screenshots: Screenshot[] = [
  {
    src: "/marketing/screenshots/usage-proxy.png",
    title: "Usage",
    meta: "live app capture",
    alt: "Local Studio usage screen showing proxied tokens, requests, sessions, active days, and token activity.",
    width: 5118,
    height: 2800,
  },
  {
    src: "/marketing/screenshots/configure-models.png",
    title: "Configure",
    meta: "live app capture",
    alt: "Local Studio model configuration screen showing searchable Hugging Face models, hardware fit, and downloads.",
    width: 5118,
    height: 2800,
  },
  {
    src: "/marketing/screenshots/workbench-browser.png",
    title: "Workbench",
    meta: "live app capture",
    alt: "Local Studio workbench with a coding agent session and a local document open in the integrated browser.",
    width: 5118,
    height: 2800,
  },
  {
    src: "/marketing/screenshots/workbench-terminal.png",
    title: "Tools",
    meta: "live app capture",
    alt: "Local Studio workbench with agent reasoning, terminal output, repository changes, and tool activity.",
    width: 5118,
    height: 2800,
  },
];

const GITHUB_REPO = "https://github.com/sybil-solutions/local-studio";
const DOWNLOAD_DMG = "/download/macos";

export function LandingNav() {
  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.brand} aria-label="Local Studio">
        <span className={styles.mark} aria-hidden="true">
          <span className={styles.markOrbit}>
            <span />
            <span />
          </span>
          <span className={styles.markCore} />
        </span>
        <span>Local Studio</span>
      </Link>
      <nav className={styles.navLinks} aria-label="Landing navigation">
        <Link className={styles.navOptionalSmall} href="/#product">Product</Link>
        <Link className={styles.navMobilePrimary} href="/mobile">Mobile</Link>
        <Link className={styles.navDocs} href="/docs">Docs</Link>
        <Link className={styles.navSetup} href="/prompt">Setup</Link>
        <Link className={styles.navOptional} href="/#media">Media</Link>
        <Link
          className={styles.navOptional}
          href={GITHUB_REPO}
          prefetch={false}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </nav>
    </header>
  );
}

export function ScreenshotFrame({
  screenshot,
  priority = false,
}: {
  screenshot: Screenshot;
  priority?: boolean;
}) {
  return (
    <figure className={styles.frame}>
      <figcaption className={styles.frameHeader}>
        <span>{screenshot.title}</span>
        <span>{screenshot.meta}</span>
      </figcaption>
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        priority={priority}
        sizes="(max-width: 900px) 100vw, 70vw"
      />
    </figure>
  );
}

export function LandingPage() {
  return (
    <main className={styles.minimalShell}>
      <LandingNav />

      <section className={styles.launchHero} aria-labelledby="landing-title">
        <div className={styles.launchTexture} aria-hidden="true" />
        <div className={styles.launchGrid}>
          <div className={styles.launchCopy}>
            <h1 id="landing-title" className={styles.launchTitle}>
              Run your intelligence
              <br />
              at home.
            </h1>
            <p className={styles.launchLead}>AI workspace built to help you go local.</p>
            <div className={styles.launchActions}>
              <Link
                className={styles.button}
                href={DOWNLOAD_DMG}
                prefetch={false}
                rel="noopener noreferrer"
              >
                <DownloadCloud size={17} aria-hidden="true" />
                Download for macOS
              </Link>
              <Link className={styles.minimalLink} href="/prompt">
                Setup
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className={styles.signalField} aria-hidden="true">
            <div className={styles.signalGlow} />
            <div className={styles.signalRipple} />
            <div className={[styles.signalOrbit, styles.signalOrbitOuter].join(" ")}>
              <span />
              <span />
              <span />
            </div>
            <div className={[styles.signalOrbit, styles.signalOrbitInner].join(" ")}>
              <span />
              <span />
            </div>
            <div className={styles.signalAxis} />
            <div className={styles.signalCore}>
              <span />
            </div>
          </div>
        </div>

        <figure id="product" className={styles.foldScreenshot}>
          <div className={styles.screenshotBezel}>
            <div className={styles.screenshotViewport}>
              <Image
                src="/marketing/screenshots/workbench-browser.png"
                alt="Local Studio workbench showing a coding agent and a local document in the integrated browser."
                width={5118}
                height={2800}
                priority
                sizes="(max-width: 900px) 92vw, 1080px"
              />
            </div>
          </div>
        </figure>
      </section>

      <section id="media" className={styles.storySection} aria-labelledby="system-title">
        <div className={styles.storyIntro}>
          <p className={styles.sectionKicker}>All in one</p>
          <h2 id="system-title">Local AI is hard, this will make it easier.</h2>
          <p>
            Local Studio keeps the model, the runtime, and the hardware together. Nothing important
            disappears behind a provider abstraction.
          </p>
        </div>
        <div className={styles.featureList}>
          {[
            {
              number: "01",
              title: "Control",
              body: "Local and remote controllers, live status, launch state, logs, and metrics.",
              screenshot: screenshots[0],
            },
            {
              number: "02",
              title: "Serve",
              body: "vLLM, SGLang, MLX, and llama.cpp behind one OpenAI-compatible surface.",
              screenshot: screenshots[1],
            },
            {
              number: "03",
              title: "Work",
              body: "Models, providers, browser, files, terminal, and agents in the same session.",
              screenshot: screenshots[3],
            },
          ].map((feature) => (
            <article className={styles.featureRow} key={feature.number}>
              <div className={styles.featureCopy}>
                <span>{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
              <figure className={styles.featureVisual}>
                <Image
                  src={feature.screenshot.src}
                  alt={feature.screenshot.alt}
                  width={feature.screenshot.width}
                  height={feature.screenshot.height}
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.kittySection} aria-labelledby="kittylitter-title">
        <div className={styles.kittyIntro}>
          <div>
            <p className={styles.sectionKicker}>KittyLitter</p>
            <h2 id="kittylitter-title">Your agents, in your pocket.</h2>
          </div>
          <div className={styles.kittyCopy}>
            <p>
              Pair your phone from Local Studio, then keep working with Codex, Claude, OpenCode,
              Pi, and Droid from anywhere.
            </p>
            <Link className={styles.minimalLink} href="/mobile">
              See how mobile works
              <span aria-hidden="true">→</span>
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
        </div>
        <div className={styles.kittyGallery}>
          <figure className={styles.kittyCapture}>
            <figcaption>Light</figcaption>
            <Image
              src="/marketing/screenshots/kittylitter-connect-light.png"
              alt="Local Studio phone connection screen in light mode with a KittyLitter iPhone capture covering the private pairing code."
              width={948}
              height={768}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <span className={styles.phoneCover} aria-hidden="true">
              <Image
                src="/marketing/screenshots/kittylitter-iphone.jpeg"
                alt=""
                width={1447}
                height={768}
              />
            </span>
          </figure>
          <figure className={styles.kittyCapture}>
            <figcaption>Dark</figcaption>
            <Image
              src="/marketing/screenshots/kittylitter-connect-dark.png"
              alt="Local Studio phone connection screen in dark mode with a KittyLitter iPhone capture covering the private pairing code."
              width={948}
              height={768}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <span className={styles.phoneCover} aria-hidden="true">
              <Image
                src="/marketing/screenshots/kittylitter-iphone.jpeg"
                alt=""
                width={1447}
                height={768}
              />
            </span>
          </figure>
        </div>
      </section>

      <section id="downloads" className={styles.finalCallout} aria-labelledby="download-title">
        <p className={styles.sectionKicker}>Local Studio</p>
        <h2 id="download-title">Your models. Your hardware. One surface.</h2>
        <div>
          <Link className={styles.button} href={DOWNLOAD_DMG} prefetch={false} rel="noopener noreferrer">
            <DownloadCloud size={18} aria-hidden="true" />
            Download for macOS
          </Link>
          <Link
            className={styles.minimalLink}
            href={GITHUB_REPO}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
            <span aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.minimalLink} href="/prompt">
            Setup
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <footer className={styles.minimalFooter}>
        <span>Local Studio</span>
        <span>Desktop / web / controller / agents</span>
      </footer>
    </main>
  );
}
const tocSections = [
  { id: "prerequisites", label: "Prerequisites" },
  { id: "quick-start", label: "Quick start" },
  { id: "setup-wizard", label: "Setup wizard" },
  { id: "runtime-backends", label: "Runtime backends" },
  { id: "agent-runtime", label: "Agent runtime" },
  { id: "remote-lan", label: "Remote / LAN" },
  { id: "validation", label: "Validation" },
];

const backends = [
  {
    name: "vLLM",
    desc: "CUDA throughput serving through configured, discovered, system, Docker, or bundled targets.",
  },
  {
    name: "SGLang",
    desc: "Structured and multi-turn serving through discovered or configured Python targets.",
  },
  {
    name: "llama.cpp",
    desc: "GGUF models through the llama-server binary. Great for CPU and modest hardware.",
  },
  { name: "MLX", desc: "Apple Silicon serving through mlx_lm.server. The default path on Mac." },
];

const validationSteps = [
  "Settings switches controllers and the runtime state updates.",
  "System shows installed engines and the active service topology.",
  "A model launches through a recipe and /status reflects it.",
  "/v1/chat/completions works locally and through a provider route.",
  "/agent completes a turn using the selected model and local tools.",
];

export function DocsPage() {
  return (
    <main className={styles.shell}>
      <LandingNav />
      <div className={styles.docsLayout}>
        <aside className={styles.toc}>
          <p className={styles.tocLabel}>On this page</p>
          <ul className={styles.tocList}>
            {tocSections.map((s) => (
              <li key={s.id}>
                <Link href={`/docs#${s.id}`}>{s.label}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <article className={styles.docsContent}>
          <p className={styles.eyebrow}>Setup guide</p>
          <h1 className={styles.sectionTitle} style={{ marginTop: "0.6rem" }}>
            Get Local Studio running
          </h1>
          <p className={styles.sectionLead} style={{ marginBottom: "2.5rem" }}>
            Local Studio is a local-first workstation for running, managing, and using self-hosted
            LLM backends. Two modules share one controller API: a Bun/Hono backend and a Next.js +
            React frontend with an Electron desktop shell.
          </p>

          <section className={styles.docsSection} id="prerequisites">
            <h2>Prerequisites</h2>
            <ul>
              <li>
                <strong>Bun 1.x</strong> — for the controller.
              </li>
              <li>
                <strong>Node.js 20+ and npm</strong> — for the frontend.
              </li>
              <li>
                <strong>Python 3.10+ on PATH</strong> — engine installs use <code>uv</code> when
                present, pip otherwise.
              </li>
              <li>
                <strong>Git</strong>.
              </li>
              <li>
                <strong>NVIDIA driver + CUDA</strong> for vLLM/SGLang on Linux. Apple Silicon uses
                the MLX backend.
              </li>
            </ul>
          </section>

          <section className={styles.docsSection} id="quick-start">
            <h2>Quick start</h2>
            <p>
              Run the preflight check first — it verifies toolchain, ports, directories, and
              network:
            </p>
            <pre className={styles.codeBlock}>npm run doctor</pre>
            <p>
              Start the controller (listens on <code>127.0.0.1:8080</code>; data dir and SQLite are
              created automatically, model weights live in <code>LOCAL_STUDIO_MODELS_DIR</code>,
              default <code>/models</code>):
            </p>
            <pre className={styles.codeBlock}>
              cd controller &amp;&amp; bun install &amp;&amp; bun src/main.ts
            </pre>
            <p>
              Start the frontend in a second terminal, then open{" "}
              <code>http://localhost:3000/setup</code>:
            </p>
            <pre className={styles.codeBlock}>
              cd frontend &amp;&amp; npm ci &amp;&amp; npm run dev
            </pre>
            <div className={styles.callout}>
              <CheckCircle2 size={16} aria-hidden="true" />
              <p>
                <code>npm ci</code> runs a postinstall patch against{" "}
                <code>@earendil-works/pi-ai</code>. If that step prints a warning, agent streaming
                may misrender — re-run <code>npm ci</code> to fix it.
              </p>
            </div>
          </section>

          <section className={styles.docsSection} id="setup-wizard">
            <h2>Setup wizard</h2>
            <p>
              The first-run <code>/setup</code> wizard walks through choosing a models directory,
              installing an engine, downloading a model, launching it, and benchmarking. Engine
              installs (vLLM/SGLang/MLX) land in{" "}
              <code>&lt;data dir&gt;/runtime/venvs/&lt;backend&gt;-latest</code>.
            </p>
          </section>

          <section className={styles.docsSection} id="runtime-backends">
            <h2>Runtime backends</h2>
            <p>Recipes launch through the controller runtime layer. Wired backend families:</p>
            <ul>
              {backends.map((b) => (
                <li key={b.name}>
                  <strong>{b.name}</strong> — {b.desc}
                </li>
              ))}
            </ul>
            <p>
              Runtime target discovery is surfaced in Settings; selections persist in the controller
              data directory.
            </p>
          </section>

          <section className={styles.docsSection} id="agent-runtime">
            <h2>Agent runtime</h2>
            <p>
              The agent surface lives at <code>/agent</code> in the frontend. It uses
              <code>@earendil-works/pi-coding-agent</code> through the frontend runtime rather than
              shelling out to a separate agent process. Agent skills and extensions are loaded by
              the frontend runtime and surfaced in the session UI.
            </p>
            <p>
              Agent file operations are local-only, stored under <code>data/agentfs</code>.
            </p>
          </section>

          <section className={styles.docsSection} id="remote-lan">
            <h2>Remote / LAN deployment</h2>
            <p>
              The controller binds <code>127.0.0.1</code> by default. Binding a non-loopback host
              (e.g. <code>LOCAL_STUDIO_HOST=0.0.0.0</code>) requires{" "}
              <code>LOCAL_STUDIO_API_KEY</code> — startup throws without it. On a trusted LAN you
              may instead set
              <code>LOCAL_STUDIO_ALLOW_UNAUTHENTICATED=true</code> to opt out of authentication.
            </p>
            <p>
              Point the frontend at a remote controller with <code>BACKEND_URL</code> or{" "}
              <code>NEXT_PUBLIC_API_URL</code> (default <code>http://localhost:8080</code>).
              Configure <code>.env.local</code> first (see <code>.env.example</code>):
            </p>
            <pre className={styles.codeBlock}>
              REMOTE_HOST=192.168.x.x REMOTE_USER=username REMOTE_PATH=/home/user/project #
              Optional: REMOTE_SSH_KEY (defaults to ~/.ssh/id_ed25519)
            </pre>
            <pre className={styles.codeBlock}>
              ./scripts/deploy-remote.sh controller # sync + build + restart controller
              ./scripts/deploy-remote.sh frontend # sync + build + restart frontend
              ./scripts/deploy-remote.sh status # inspect remote processes
            </pre>
            <p>
              Local daemon helper: <code>./scripts/daemon.sh {`{start|stop|status}`}</code>.
            </p>
          </section>

          <section className={styles.docsSection} id="validation">
            <h2>Validation</h2>
            <p>After setup, confirm the stack is healthy:</p>
            <ul>
              {validationSteps.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <pre className={styles.codeBlock}>
              npm run check # contracts + structure + frontend quality + controller typecheck npm
              run test:integration # controller integration + frontend regression
            </pre>
            <p>
              For the full agent runbook — controllers, providers, runtimes, and Pi sessions — see
              <Link href="/agents" style={{ color: "inherit", textDecoration: "underline" }}>
                {" "}
                the agents page
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
      <footer className={styles.footer}>
        <span>Local Studio docs</span>
        <span>Desktop / web / controller / Pi</span>
      </footer>
    </main>
  );
}
