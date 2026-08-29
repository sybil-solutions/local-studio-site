import { baseStyles, type PublicStyle } from "../styles/base-styles";
import * as stylex from "@stylexjs/stylex";
import { constants, lengths } from "../styles/public-tokens.stylex";
import type { ReactNode } from "react";
import { setupPath } from "../domain/route";
import { assets } from "../domain/asset";
import { LocalAiLogoShader as LogoMark } from "@local-ai/logo-renderer/react";
import { CtaPair } from "./Links";

const pageWidth =
	`min(${lengths.pageWidth}, calc(100% - ${lengths.pageGutter}))`;

const styles = stylex.create({
	root: {
		position: "relative",
		display: "flex",
		width: pageWidth,
		minWidth: 0,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		marginInline: "auto",
		padding: {
			default: "150px 0",
			"@media (max-width: 620px)": "100px 0",
		},
		textAlign: "center",
	},
	home: {
		minHeight: "650px",
		paddingBlock: 0,
	},
	child: {
		width: "100%",
		maxWidth: "100%",
		minWidth: 0,
	},
	title: {
		marginBlock: '0',
		marginInline: 'auto',
		fontFamily: constants.fontSans,
		fontSize: {
			default: "42px",
			"@media (max-width: 620px)": "32px",
		},
		fontWeight: 425,
		lineHeight: {
			default: "48px",
			"@media (max-width: 620px)": "40px",
		},
		letterSpacing: constants.headerTracking,
		overflowWrap: "anywhere",
	},
	homeTitle: {
		maxWidth: "900px",
		fontSize: {
			default: "70px",
			"@media (max-width: 620px)": "32px",
		},
		fontWeight: 400,
		lineHeight: {
			default: "78px",
			"@media (max-width: 620px)": "40px",
		},
	},
	actions: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "12px",
		marginTop: "36px",
	},
	mark: {
		top: "50%",
		left: "50%",
		width: "clamp(340px, 68vw, 880px)",
		aspectRatio: "2.2",
		transform: "translate(-50%,-50%)",
	},
	aboveMark: { position: "relative", zIndex: 2 },
});

export function PageCta({
	id,
	title = "AI that stays yours",
	actions,
	variant = "page",
	sx,
}: {
	id: string;
	title?: string;
	actions?: ReactNode;
	variant?: "page" | "home";
	sx?: PublicStyle;
}) {
	const home = variant === "home";
	return (
		<section
			id={home ? "downloads" : undefined}
			{...stylex.props(baseStyles.element, home && baseStyles.sectionAnchor, styles.root, home && styles.home, sx)}
			aria-labelledby={id}
		>
			<LogoMark modelUrl={assets.ctaMark} fallbackUrl={assets.localaiDark} dayUrl={assets.dayEnv} nightUrl={assets.nightEnv} viewportAspect={2.2} staticPose sx={styles.mark} />
			<h2
				id={id}
				{...stylex.props(baseStyles.element, baseStyles.heading, baseStyles.headingTwo, styles.child, styles.title, home && styles.homeTitle, styles.aboveMark)}
			>
				{title}
			</h2>
			<div {...stylex.props(baseStyles.element, styles.child, styles.actions, styles.aboveMark)}>
				{actions ?? (
					<CtaPair secondary={{ href: setupPath, label: "Setup Prompt" }} />
				)}
			</div>
		</section>
	);
}
