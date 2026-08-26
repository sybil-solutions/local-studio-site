declare module "@local-ai/logo-renderer/react" {
	import type { ComponentType } from "react";
	const LocalAiLogoShader: ComponentType<{
		modelUrl: string;
		fallbackUrl: string;
		dayUrl: string;
		nightUrl: string;
	}>;
	export default LocalAiLogoShader;
	export { LocalAiLogoShader };
}
