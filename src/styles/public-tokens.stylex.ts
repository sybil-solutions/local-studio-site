import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
	background: stylex.types.color({ default: "#000000" }),
	foreground: stylex.types.color({ default: "#f7fbff" }),
	fine: stylex.types.color({ default: "#dce6f2" }),
	dim: stylex.types.color({ default: "#c7d4e5" }),
	subtlest: stylex.types.color({ default: "#b7c9de" }),
	quiet: stylex.types.color({ default: "#a8c1dc" }),
	border: stylex.types.color({ default: "rgba(255,255,255,0.36)" }),
	borderSoft: stylex.types.color({ default: "rgba(255,255,255,0.3)" }),
	borderStrong: stylex.types.color({ default: "rgba(255,255,255,0.48)" }),
	borderStrongHover: stylex.types.color({ default: "rgba(138,212,255,0.82)" }),
	hover: stylex.types.color({ default: "rgba(100,194,255,0.16)" }),
	surfaceFaint: stylex.types.color({ default: "rgba(100,194,255,0.05)" }),
	navSurface: stylex.types.color({ default: "rgba(0,0,0,0.84)" }),
	foregroundHover: stylex.types.color({ default: "#e8f5ff" }),
	buttonInk: stylex.types.color({ default: "#000000" }),
	mediaTone: stylex.types.color({ default: "#e5e5e5" }),
	mediaRingInner: stylex.types.color({ default: "rgba(255,255,255,0.012)" }),
	mediaRingOuter: stylex.types.color({ default: "rgba(255,255,255,0.035)" }),
	depthShadow: stylex.types.color({ default: "rgba(0,0,0,0.52)" }),
	depthShadowDemo: stylex.types.color({ default: "rgba(0,0,0,0.44)" }),
	focusRing: stylex.types.color({ default: "#5db7ff" }),
	selectionSkyBright: stylex.types.color({ default: "#c2e8ff" }),
	selectionSkyDay: stylex.types.color({ default: "#8ad4ff" }),
	selectionSkyBlue: stylex.types.color({ default: "#4aa8ff" }),
	selectionSkyDusk: stylex.types.color({ default: "#285ca8" }),
	selectionSkyNight: stylex.types.color({ default: "#132b52" }),
	selection: stylex.types.color({ default: "#a8dcff" }),
	selectionInk: stylex.types.color({ default: "#000000" }),
});

export const lengths = stylex.defineVars({
	pageWidth: stylex.types.length({ default: "1399px" }),
	pageGutter: stylex.types.length({ default: "48px" }),
	navHeight: stylex.types.length({ default: "72px" }),
	radiusControl: stylex.types.length({ default: "6px" }),
	radiusCompact: stylex.types.length({ default: "8px" }),
	radiusFrame: stylex.types.length({ default: "10px" }),
	radiusMediaFrame: stylex.types.length({ default: "14px" }),
	radiusPanel: stylex.types.length({ default: "16px" }),
	storyGap: stylex.types.length({
		default: "120px",
		"@media (max-width: 620px)": "96px",
	}),
});

export const times = stylex.defineVars({
	fast: stylex.types.time({
		default: "130ms",
		"@media (prefers-reduced-motion: reduce)": "0.01ms",
	}),
	glyph: stylex.types.time({
		default: "180ms",
		"@media (prefers-reduced-motion: reduce)": "0.01ms",
	}),
	normal: stylex.types.time({
		default: "240ms",
		"@media (prefers-reduced-motion: reduce)": "0.01ms",
	}),
	feature: stylex.types.time({
		default: "450ms",
		"@media (prefers-reduced-motion: reduce)": "0.01ms",
	}),
});

export const constants = stylex.defineConsts({
	fontSansName: "Geist Sans",
	fontMonoName: "Geist Mono",
	fontSans: '"Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	fontMono: '"Geist Mono", ui-monospace, monospace',
	headerTracking: "-0.02em",
});
