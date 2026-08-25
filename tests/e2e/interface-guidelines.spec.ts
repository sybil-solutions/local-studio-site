import { expect, test } from "@playwright/test";
import { routePaths } from "../../src/domain/route";

test("routes use the shared interface tokens", async ({ page }) => {
	for (const path of routePaths.filter((item) => item !== "/machine")) {
		await page.goto(path);
		const audit = await page.evaluate(() => {
			const root = getComputedStyle(document.documentElement);
			return {
				colorScheme: root.colorScheme,
				fontSmoothing: root.getPropertyValue("-webkit-font-smoothing"),
				textSizeAdjust: root.getPropertyValue("-webkit-text-size-adjust"),
				themeColor: document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content,
			};
		});
		expect(audit, path).toEqual({
			colorScheme: "dark",
			fontSmoothing: "antialiased",
			textSizeAdjust: "100%",
			themeColor: "#000000",
		});
	}
});

test("website surfaces use layered light and concentric edges", async ({ page }) => {
	await page.goto("/");
	const primary = page.getByRole("link", { name: /Download for/ }).first();
	const primaryStyle = await primary.evaluate((element) => {
		const style = getComputedStyle(element);
		return { borderColor: style.borderColor, boxShadow: style.boxShadow };
	});
	expect(primaryStyle.boxShadow.match(/rgba?\(/g)?.length).toBeGreaterThanOrEqual(2);
	const borderChannels = primaryStyle.borderColor.match(/[\d.]+/g)?.map(Number) ?? [];
	expect(borderChannels[2]).toBeGreaterThanOrEqual(borderChannels[0] ?? 0);

	await page.goto("/product");
	const frame = page.locator("figure").filter({ has: page.locator("img") }).first();
	const radii = await frame.evaluate((element) => {
		const image = element.querySelector("img");
		return {
			inner: image ? Number.parseFloat(getComputedStyle(image).borderTopLeftRadius) : 0,
			outer: Number.parseFloat(getComputedStyle(element).borderTopLeftRadius),
			padding: Number.parseFloat(getComputedStyle(element).paddingTop),
		};
	});
	expect(radii.inner).toBeLessThanOrEqual(radii.outer);
	expect(Math.abs(radii.outer - radii.inner - radii.padding)).toBeLessThanOrEqual(1);

	await page.goto("/setup");
	const prompt = page.getByRole("region", { name: "Portable setup prompt" });
	const fade = await prompt.evaluate((element) => ({
		backgroundImage: getComputedStyle(element, "::after").backgroundImage,
		maskImage: getComputedStyle(element.querySelector("pre")!).maskImage,
	}));
	expect(fade.backgroundImage).not.toBe("none");
	expect(fade.maskImage).toBe("none");
});
