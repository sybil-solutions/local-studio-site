import { ImageResponse } from "next/og";

export const alt = "Local Studio — Run your intelligence at home.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function OrbitalMark() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="22" fill="none" stroke="#3d3d3d" strokeWidth="2" />
      <ellipse
        cx="36"
        cy="36"
        rx="28"
        ry="12"
        fill="none"
        stroke="#858585"
        strokeWidth="2"
        transform="rotate(-28 36 36)"
      />
      <circle cx="36" cy="36" r="5" fill="#ffffff" />
      <circle cx="13" cy="28" r="3.5" fill="#ffffff" />
      <circle cx="57" cy="48" r="3.5" fill="#ffffff" />
    </svg>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#f5f5f5",
        backgroundColor: "#050505",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
        backgroundSize: "96px 96px",
        padding: "54px 68px 52px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <OrbitalMark />
        <div style={{ display: "flex", fontSize: 32, fontWeight: 650, letterSpacing: "-1px" }}>
          Local Studio
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1020 }}>
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 500,
            lineHeight: 0.96,
            letterSpacing: "-5px",
          }}
        >
          Run your intelligence at home.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            color: "#9b9b9b",
            fontSize: 28,
            letterSpacing: "-0.5px",
          }}
        >
          AI workspace built to help you go local.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#777777",
          fontSize: 16,
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", gap: "34px" }}>
          <span>Control</span>
          <span>Serve</span>
          <span>Work</span>
        </div>
        <span>localstudio.ai</span>
      </div>
    </div>,
    size,
  );
}
