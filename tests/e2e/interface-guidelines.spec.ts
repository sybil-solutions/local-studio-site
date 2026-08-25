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

test("site chrome stays quieter until interaction", async ({ page }) => {
	await page.goto("/");
	const brightness = (color: string) =>
		(color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? []).reduce(
			(total, channel) => total + channel,
			0,
		);
	const heading = page.getByRole("heading", { level: 1 });
	const products = page.getByRole("button", { name: "Products" });
	const headingColor = await heading.evaluate((element) => getComputedStyle(element).color);
	const productRest = await products.evaluate((element) => getComputedStyle(element).color);
	await products.hover();
	const productHover = await products.evaluate((element) => getComputedStyle(element).color);
	expect(brightness(productRest)).toBeLessThan(brightness(headingColor));
	expect(brightness(productHover)).toBeGreaterThan(brightness(productRest));

	const footerLink = page.locator("footer a").first();
	await footerLink.scrollIntoViewIfNeeded();
	const footerRest = await footerLink.evaluate((element) => getComputedStyle(element).color);
	await footerLink.hover();
	const footerHover = await footerLink.evaluate((element) => getComputedStyle(element).color);
	expect(brightness(footerRest)).toBeLessThan(brightness(headingColor));
	expect(brightness(footerHover)).toBeGreaterThan(brightness(footerRest));
});

test("mobile product cards preserve source color without section shadows", async ({ page }) => {
	await page.goto("/#mobile");
	const card = page.locator("[data-kitty-feature]").first();
	const media = card.getByRole("region");
	const image = card.locator("img");
	const treatment = await media.evaluate((element) => ({
		boxShadow: getComputedStyle(element).boxShadow,
		filter: getComputedStyle(element.querySelector("img")!).filter,
	}));
	expect(treatment.boxShadow).toBe("none");
	expect(treatment.filter).not.toContain("grayscale");
	await expect(image).toBeVisible();
});
