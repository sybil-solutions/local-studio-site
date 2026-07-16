import { Composition } from "remotion";
import { ProductTour } from "./product-tour";

export function VideoRoot() {
  return (
    <Composition
      id="LocalStudioTour"
      component={ProductTour}
      durationInFrames={306}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}
