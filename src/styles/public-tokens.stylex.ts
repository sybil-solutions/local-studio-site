import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
	background: stylex.types.color({ default: "#000000" }),
	foreground: stylex.types.color({ default: "#f7f8f8" }),
	fine: stylex.types.color({ default: "#e8e8e8" }),
	dim: stylex.types.color({ default: "#d1d1d1" }),
	subtlest: stylex.types.color({ default: "#c3c3c3" }),
	quiet: stylex.types.color({ default: "#bababa" }),
	chrome: stylex.types.color({ default: "#a1a1a1" }),
	border: stylex.types.color({ default: "rgba(255,255,255,0.08)" }),
	borderSoft: stylex.types.color({ default: "rgba(255,255,255,0.06)" }),
	borderStrong: stylex.types.color({ default: "rgba(255,255,255,0.10)" }),
	borderStrongHover: stylex.types.color({ default: "rgba(255,255,255,0.28)" }),
	hover: stylex.types.color({ default: "rgba(255,255,255,0.06)" }),
	surfaceFaint: stylex.types.color({ default: "rgba(255,255,255,0.03)" }),
	foregroundHover: stylex.types.color({ default: "#ffffff" }),
	buttonInk: stylex.types.color({ default: "#000000" }),
	mediaRingInner: stylex.types.color({ default: "rgba(255,255,255,0.04)" }),
	mediaRingOuter: stylex.types.color({ default: "rgba(255,255,255,0.10)" }),
	shadowAmbient: stylex.types.color({ default: "rgba(0,0,0,0.72)" }),
	shadowDirect: stylex.types.color({ default: "rgba(0,0,0,0.42)" }),
	shadowControl: stylex.types.color({ default: "rgba(0,0,0,0.48)" }),
	shadowControlDirect: stylex.types.color({ default: "rgba(0,0,0,0.32)" }),
	veilCore: stylex.types.color({ default: "rgba(0,0,0,0.08)" }),
	veilEdge: stylex.types.color({ default: "rgba(0,0,0,0.025)" }),
	textShadowSoft: stylex.types.color({ default: "rgba(0,0,0,0.16)" }),
	textShadowStrong: stylex.types.color({ default: "rgba(0,0,0,0.18)" }),
	depthShadowDemo: stylex.types.color({ default: "rgba(0,0,0,0.44)" }),
	focusRing: stylex.types.color({ default: "#f7f8f8" }),
	focusHalo: stylex.types.color({ default: "rgba(255,255,255,0.18)" }),
	selectionSkyBright: stylex.types.color({ default: "#ffffff" }),
	selectionSkyDay: stylex.types.color({ default: "#f7f8f8" }),
	selectionSkyBlue: stylex.types.color({ default: "#eff0f0" }),
	selectionSkyDusk: stylex.types.color({ default: "#e7e8e8" }),
	selectionSkyNight: stylex.types.color({ default: "#ededed" }),
	selection: stylex.types.color({ default: "#eff0f0" }),
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
	heroTracking: "-0.03em",
});
