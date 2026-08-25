import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
	background: stylex.types.color({ default: "#000000" }),
	foreground: stylex.types.color({ default: "#f7fbff" }),
	fine: stylex.types.color({ default: "#dce6f2" }),
	dim: stylex.types.color({ default: "#c7d4e5" }),
	subtlest: stylex.types.color({ default: "#b7c9de" }),
	quiet: stylex.types.color({ default: "#a8c1dc" }),
	border: stylex.types.color({ default: "rgba(168,220,255,0.38)" }),
	borderSoft: stylex.types.color({ default: "rgba(168,220,255,0.28)" }),
	borderStrong: stylex.types.color({ default: "rgba(168,220,255,0.58)" }),
	borderStrongHover: stylex.types.color({ default: "rgba(138,212,255,0.92)" }),
	hover: stylex.types.color({ default: "rgba(93,183,255,0.18)" }),
	surfaceFaint: stylex.types.color({ default: "rgba(93,183,255,0.06)" }),
	navSurface: stylex.types.color({ default: "rgba(0,0,0,0.84)" }),
	foregroundHover: stylex.types.color({ default: "#ffffff" }),
	buttonInk: stylex.types.color({ default: "#000000" }),
	mediaTone: stylex.types.color({ default: "#e5e5e5" }),
	mediaRingInner: stylex.types.color({ default: "rgba(93,183,255,0.05)" }),
	mediaRingOuter: stylex.types.color({ default: "rgba(93,183,255,0.12)" }),
	shadowAmbient: stylex.types.color({ default: "rgba(0,0,0,0.72)" }),
	shadowDirect: stylex.types.color({ default: "rgba(40,120,190,0.22)" }),
	shadowControl: stylex.types.color({ default: "rgba(0,0,0,0.48)" }),
	shadowControlDirect: stylex.types.color({ default: "rgba(93,183,255,0.2)" }),
	veilCore: stylex.types.color({ default: "rgba(0,0,0,0.08)" }),
	veilEdge: stylex.types.color({ default: "rgba(0,0,0,0.025)" }),
	textShadowSoft: stylex.types.color({ default: "rgba(0,0,0,0.16)" }),
	textShadowStrong: stylex.types.color({ default: "rgba(0,0,0,0.18)" }),
	depthShadowDemo: stylex.types.color({ default: "rgba(0,0,0,0.44)" }),
	focusRing: stylex.types.color({ default: "#5db7ff" }),
	focusHalo: stylex.types.color({ default: "rgba(93,183,255,0.28)" }),
	selectionSkyBright: stylex.types.color({ default: "#e0f5ff" }),
	selectionSkyDay: stylex.types.color({ default: "#daf2ff" }),
	selectionSkyBlue: stylex.types.color({ default: "#d4efff" }),
	selectionSkyDusk: stylex.types.color({ default: "#cfedff" }),
	selectionSkyNight: stylex.types.color({ default: "#c9ebff" }),
	selection: stylex.types.color({ default: "#d4efff" }),
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
