import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type SceneData = {
  image: string;
  eyebrow: string;
  title: string;
  detail: string;
};

const scenes: SceneData[] = [
  {
    image: "marketing/screenshots/status-dashboard.png",
    eyebrow: "01 / Control",
    title: "See the whole machine.",
    detail: "Controllers, GPUs, power, VRAM, throughput, and logs in one live surface.",
  },
  {
    image: "marketing/screenshots/discover-models.png",
    eyebrow: "02 / Discover",
    title: "Find what actually fits.",
    detail: "Search models against the hardware you own, then download without leaving the app.",
  },
  {
    image: "marketing/screenshots/model-library.png",
    eyebrow: "03 / Measure",
    title: "Keep the evidence attached.",
    detail: "Model quality, task time, hardware targets, and measured runs stay in frame.",
  },
  {
    image: "marketing/screenshots/system-settings.png",
    eyebrow: "04 / Operate",
    title: "One stack. Your stack.",
    detail: "vLLM, SGLang, MLX, llama.cpp, remote controllers, providers, and local agents.",
  },
];

function Scene({ image, eyebrow, title, detail }: SceneData) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = interpolate(frame, [0, 0.7 * fps], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 3 * fps], [1.035, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111", color: "#fff", fontFamily: "Helvetica Neue, sans-serif" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 72% 18%, rgba(255,255,255,0.09), transparent 34%), #141414",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 76,
          width: 720,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 34}px)`,
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.58)",
            fontFamily: "SFMono-Regular, Menlo, monospace",
            fontSize: 24,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 76, fontWeight: 650, letterSpacing: "-0.045em", lineHeight: 0.98, marginTop: 22 }}>
          {title}
        </div>
        <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 30, lineHeight: 1.4, marginTop: 24 }}>
          {detail}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          bottom: 72,
          height: 600,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 20,
          backgroundColor: "#0a0a0a",
          boxShadow: "0 32px 90px rgba(0,0,0,0.48)",
          transform: `scale(${scale})`,
          transformOrigin: "center bottom",
        }}
      >
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            fontSize: 18,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span>Local Studio</span>
          <span style={{ fontFamily: "SFMono-Regular, Menlo, monospace", fontSize: 15 }}>live app capture</span>
        </div>
        <Img
          src={staticFile(image)}
          style={{ width: "100%", height: "calc(100% - 54px)", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 84,
          top: 82,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 26,
          fontWeight: 650,
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 48,
            height: 48,
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 10,
            fontFamily: "SFMono-Regular, Menlo, monospace",
            fontSize: 17,
          }}
        >
          LS
        </span>
        Local Studio
      </div>
    </AbsoluteFill>
  );
}

export function ProductTour() {
  const { fps } = useVideoConfig();
  const transition = linearTiming({ durationInFrames: 0.6 * fps });

  return (
    <TransitionSeries>
      {scenes.flatMap((scene, index) => {
        const sequence = (
          <TransitionSeries.Sequence key={`${scene.image}-scene`} durationInFrames={3 * fps} premountFor={fps}>
            <Scene {...scene} />
          </TransitionSeries.Sequence>
        );
        if (index === scenes.length - 1) return [sequence];
        return [
          sequence,
          <TransitionSeries.Transition
            key={`${scene.image}-transition`}
            presentation={fade()}
            timing={transition}
          />,
        ];
      })}
    </TransitionSeries>
  );
}
