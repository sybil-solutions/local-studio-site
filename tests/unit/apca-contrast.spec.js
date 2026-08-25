import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const tokenSource = readFileSync("src/styles/public-tokens.stylex.ts", "utf8");

function tokenHex(name) {
	const match = tokenSource.match(
		new RegExp(`${name}: stylex\\.types\\.color\\(\\{ default: "(#[0-9a-f]{6})"`),
	);
	if (!match?.[1]) throw new Error(`Missing hex color token: ${name}`);
	return match[1];
}

function luminance(hex) {
	const channels = [1, 3, 5].map(
		(offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
	);
	const value =
		channels[0] ** 2.4 * 0.2126729 +
		channels[1] ** 2.4 * 0.7151522 +
		channels[2] ** 2.4 * 0.072175;
	return value < 0.022 ? value + (0.022 - value) ** 1.414 : value;
}

function apcaContrast(text, background) {
	const textY = luminance(text);
	const backgroundY = luminance(background);
	if (Math.abs(backgroundY - textY) < 0.0005) return 0;
	if (backgroundY > textY) {
		const contrast = (backgroundY ** 0.56 - textY ** 0.57) * 1.14;
		return contrast < 0.1 ? 0 : (contrast - 0.027) * 100;
	}
	const contrast = (backgroundY ** 0.65 - textY ** 0.62) * 1.14;
	return contrast > -0.1 ? 0 : (contrast + 0.027) * 100;
}

test("public text tokens preserve their APCA contrast roles", () => {
	const background = tokenHex("background");
	const minimumContrast = {
		foreground: 100,
		fine: 90,
		dim: 75,
		subtlest: 70,
		quiet: 65,
		focusRing: 55,
	};

	for (const [name, minimum] of Object.entries(minimumContrast)) {
		expect(
			Math.abs(apcaContrast(tokenHex(name), background)),
			`${name} against ${background}`,
		).toBeGreaterThanOrEqual(minimum);
	}
});

test("sky selection remains readable throughout its StyleX gradient", () => {
	const ink = tokenHex("selectionInk");
	for (const name of [
		"selectionSkyBright",
		"selectionSkyDay",
		"selectionSkyBlue",
		"selectionSkyDusk",
		"selectionSkyNight",
	]) {
		expect(
			Math.abs(apcaContrast(ink, tokenHex(name))),
			`${ink} on ${name}`,
		).toBeGreaterThanOrEqual(90);
	}
});
