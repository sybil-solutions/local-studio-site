import { expect, test } from "@playwright/test";
import { mapPointerToLocalEnvironment } from "../../packages/logo-renderer/src/renderer/runtime/environment-input";

const rect = { left: 100, top: 200, width: 800, height: 400 };

function mapAt(normalizedX: number, normalizedY: number) {
	return mapPointerToLocalEnvironment({
		clientX: rect.left + rect.width * normalizedX,
		clientY: rect.top + rect.height * normalizedY,
		rect,
	});
}

test("renderer environment interaction follows its own bounds", () => {
	const localPoint = mapAt(0.61, 0.42);
	const translated = mapPointerToLocalEnvironment({
		clientX: rect.left + 500 + rect.width * 0.61,
		clientY: rect.top + 300 + rect.height * 0.42,
		rect: { ...rect, left: rect.left + 500, top: rect.top + 300 },
	});
	expect(translated).toEqual(localPoint);
	expect(mapAt(0.5, 0.5)).toEqual({
		envYaw: 0,
		envPitch: 0,
		normalizedX: 0,
		normalizedY: 0,
	});
});

test("a small horizontal area scrubs a full lighting day", () => {
	const left = mapAt(0.28, 0.5);
	const right = mapAt(0.72, 0.5);
	const farLeft = mapAt(-1, 0.5);
	const farRight = mapAt(2, 0.5);
	expect(left.envYaw).toBeCloseTo(-Math.PI);
	expect(right.envYaw).toBeCloseTo(Math.PI);
	expect(farLeft.envYaw).toBeCloseTo(left.envYaw);
	expect(farLeft.envPitch).toBeCloseTo(left.envPitch);
	expect(farRight.envYaw).toBeCloseTo(right.envYaw);
	expect(farRight.envPitch).toBeCloseTo(right.envPitch);
});

test("vertical position shifts the day phase and light elevation", () => {
	const above = mapAt(0.5, 0.28);
	const below = mapAt(0.5, 0.72);
	const quarterCycle = mapAt(0.61, 0.5);
	expect(above.envYaw).toBeCloseTo(-Math.PI / 2);
	expect(above.envPitch).toBeCloseTo(-0.85);
	expect(below.envYaw).toBeCloseTo(Math.PI / 2);
	expect(below.envPitch).toBeCloseTo(0.85);
	expect(quarterCycle.envYaw).toBeCloseTo(Math.PI / 2);
	expect(quarterCycle.envPitch).toBeCloseTo(0.65);
});

test("degenerate renderer bounds keep finite interaction values", () => {
	const mapped = mapPointerToLocalEnvironment({
		clientX: 2,
		clientY: -2,
		rect: { left: 0, top: 0, width: 0, height: 0 },
	});
	for (const value of Object.values(mapped)) expect(Number.isFinite(value)).toBe(true);
});
