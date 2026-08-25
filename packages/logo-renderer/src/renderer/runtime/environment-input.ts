const ENV_EFFECTIVE_HALF_WIDTH_RATIO = 0.22;
const ENV_EFFECTIVE_HALF_HEIGHT_RATIO = 0.22;
const ENV_VERTICAL_PHASE_SHIFT = Math.PI * 0.5;
const ENV_ORBIT_TILT = 0.65;
const ENV_DIRECT_PITCH = 0.2;

function clampSigned(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export function mapPointerToLocalEnvironment({
  clientX,
  clientY,
  rect,
}: {
  clientX: number;
  clientY: number;
  rect: Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">;
}) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const normalizedX = clampSigned(
    (clientX - centerX) / Math.max(1, rect.width * ENV_EFFECTIVE_HALF_WIDTH_RATIO),
  );
  const normalizedY = clampSigned(
    (clientY - centerY) / Math.max(1, rect.height * ENV_EFFECTIVE_HALF_HEIGHT_RATIO),
  );
  const phase = normalizedX * Math.PI + normalizedY * ENV_VERTICAL_PHASE_SHIFT;
  return {
    envYaw: phase,
    envPitch: Math.sin(phase) * ENV_ORBIT_TILT + normalizedY * ENV_DIRECT_PITCH,
    normalizedX,
    normalizedY,
  };
}
