"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { LandingNav } from "@/features/landing-page/landing-page";
import styles from "./prompt-page.module.css";

const GITHUB_REPO = "https://github.com/sybil-solutions/local-studio";

const SETUP_PROMPT = `Set up Local Studio completely on the machine you are operating now.

Repository: https://github.com/sybil-solutions/local-studio

Work autonomously. Do not give me a tutorial or stop after listing commands. Inspect the machine, make the safest sensible choices, install and configure the software, launch it, and verify that it works. Ask only if you reach a genuine credential, destructive-action, or hardware blocker.

Operating rules

1. If the repository already exists, use it. Preserve uncommitted work and never reset, overwrite, or delete user changes.
2. Read AGENTS.md and README.md before changing or running anything. Follow repository instructions exactly.
3. Never print, commit, or expose secrets. Store machine-specific values in .env.local.
4. Do not bypass hooks or security checks. With vLLM or SGLang, never disable CUDA graphs and never use enforce eager.
5. Prefer supported, reproducible installation paths. Do not silently substitute a different product or inference stack.

Phase 1 — inspect

Determine and report the operating system, CPU architecture, available RAM, free disk space, GPU model and memory or Apple unified memory, existing model directories, and whether ports 3000 and 8080 are available. Check Git, Node.js 20+, npm, Bun 1.x, Python 3.10+, uv, Docker, NVIDIA driver/CUDA, and relevant existing inference runtimes. Do not install anything until this inventory is complete.

Phase 2 — acquire and preflight

Clone the repository into a normal user-owned project directory if it is absent. If it exists, inspect its current branch and worktree before updating it. Install only missing prerequisites using the platform's normal package manager. From the repository root, run npm run doctor and resolve every actionable failure.

Phase 3 — choose the correct runtime

- Apple Silicon macOS: prefer MLX for model serving.
- Linux with a supported NVIDIA GPU: choose vLLM or SGLang based on the installed stack and model requirements.
- CPU-only or broad GGUF compatibility: choose llama.cpp.
- Windows: use WSL2 for the controller and web frontend unless the repository explicitly documents a supported native path.
- A remote GPU host is allowed. Keep the UI local if that is the cleaner architecture and connect it to the remote controller.

Explain the choice in one short paragraph, including the hardware constraint that drove it.

Phase 4 — install Local Studio

Install controller dependencies with:

cd controller && bun install

Install frontend dependencies with:

cd frontend && npm ci

Choose a model directory with enough free space. Configure LOCAL_STUDIO_MODELS_DIR when the default /models path is unsuitable. Let Local Studio manage runtime environments under its data directory unless an existing verified runtime should be reused.

For local-only use, keep the controller bound to 127.0.0.1. For LAN or remote access, bind intentionally and require LOCAL_STUDIO_API_KEY. Use LOCAL_STUDIO_ALLOW_UNAUTHENTICATED=true only when the user explicitly accepts unauthenticated access on a trusted LAN.

Point the frontend at the controller with BACKEND_URL or NEXT_PUBLIC_API_URL when it is not using http://localhost:8080.

Phase 5 — launch

Start the controller with bun src/main.ts from controller/. Start the frontend in a second process. For initial interactive setup, use npm run dev from frontend/ and open http://localhost:3000/setup. For a durable production run, use npm run build followed by npm run start; never use plain next start.

On macOS, build the Electron desktop app only after the web and controller paths are healthy. Use the repository's documented desktop build and installation commands rather than inventing a bundle path.

Phase 6 — prove it works

Do not claim success until all applicable checks pass:

- The controller health endpoint returns HTTP 200.
- The frontend returns HTTP 200 and the setup page loads.
- The UI can read controller status, system information, and runtime targets.
- At least one appropriate inference engine is detected or installed.
- A hardware-appropriate small model is downloaded or an existing local model is registered.
- The model launches without disabling CUDA graphs or forcing eager execution.
- GET /v1/models shows the served model.
- A real OpenAI-compatible chat completion succeeds.
- Usage accounting records the request.
- The agent surface opens and can see the configured provider when supported.

If a check fails, diagnose and fix it, then rerun the check. Do not hide degraded behavior.

Phase 7 — handoff

Leave the required processes running. If appropriate, create a reversible launchd or systemd service only after the manual path is proven. Finish with a compact handoff containing:

- Local Studio path and git revision
- UI URL
- Controller URL
- Selected runtime and why
- Model directory and active model
- Exact start, stop, and status commands
- Authentication status without revealing the key
- Verification results with HTTP status and inference outcome
- Any remaining limitation or human-only step

The final state must be a working Local Studio installation, not a plan.`;

type CopyState = "idle" | "copied" | "failed";

export function PromptPage() {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(SETUP_PROMPT);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <main className={styles.shell}>
      <LandingNav />
      <header className={styles.intro}>
        <p>Universal setup prompt</p>
        <h1>Give this to any coding model.</h1>
        <span>
          It will inspect the machine, choose the right runtime, install Local Studio, and prove a
          real inference request works.
        </span>
      </header>

      <section className={styles.promptSection} aria-labelledby="prompt-title">
        <div className={styles.promptRail}>
          <div>
            <span>local-studio / setup</span>
            <small id="prompt-title">Portable agent prompt</small>
          </div>
          <button type="button" onClick={copyPrompt}>
            {copyState === "copied" ? <Check size={15} /> : <Copy size={15} />}
            {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy prompt"}
          </button>
        </div>
        <pre>
          <code>{SETUP_PROMPT}</code>
        </pre>
      </section>

      <section className={styles.handoff} aria-label="How to use the prompt">
        <div>
          <span>01</span>
          <strong>Copy</strong>
          <p>Use the entire prompt without trimming the verification phases.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Paste</strong>
          <p>Give it to a coding model that can operate a terminal on the target machine.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Verify</strong>
          <p>Do not accept completion until health, model launch, and inference all pass.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/">← Back to Local Studio</Link>
        <Link href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
          Repository ↗
        </Link>
      </footer>
    </main>
  );
}
