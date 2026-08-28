// Regenerates public/localai/localai-logo.gltf from the brand SVG path.
// Produces a dense outline (adaptive bezier flattening) swept through a true
// quarter-circle fillet so bevel shading is analytically smooth — no faceted
// chamfer bands. Caps are triangulated with earcut.
//
// Usage: pnpm --filter @local-ai/logo-renderer generate

import ClipperLib from "clipper-lib";
import earcut from "earcut";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const SOURCE_SVG = path.join(ROOT, "public/images/localai_dark.svg");
const OUT_GLTF = path.join(ROOT, "public/localai/localai-logo.gltf");
const OUT_BIN = path.join(ROOT, "public/localai/localai-logo.bin");
const CHECK = process.argv.includes("--check");

// The cloud mark subpath in localai_dark.svg, extracted verbatim (relative to
// the end of the badge subpath it follows in the file).
const CLOUD_PATH_DATA =
  "m147.531,214.629c-1.812,5.375 -4.179,10.651 -7.123,15.75c-19.136,33.148 -56.879,48.918 -92.453,41.742c11.571,-34.396 44.099,-59.198 82.374,-59.198c5.888,0 11.641,0.587 17.202,1.706c12.941,-38.4 -2.499,-81.906 -38.93,-102.937c-36.443,-21.039 -81.858,-12.642 -108.637,17.793c3.74,4.247 7.117,8.924 10.056,14.01c19.148,33.136 13.952,73.703 -10.032,100.931c-23.995,-27.218 -29.209,-67.783 -10.075,-100.927c2.937,-5.087 6.312,-9.765 10.05,-14.014c-26.792,-30.423 -72.211,-38.801 -108.645,-17.747c-36.405,21.037 -51.83,64.52 -38.904,102.902c5.578,-1.126 11.348,-1.716 17.255,-1.716c38.281,0 70.813,24.811 82.38,59.215c-35.576,7.199 -73.334,-8.555 -92.488,-41.7c-2.956,-5.115 -5.331,-10.406 -7.147,-15.799c-39.7,8.012 -69.631,43.123 -69.631,85.17c0,47.954 38.932,86.886 86.886,86.886c0.378,0 0.755,-0.002 1.132,-0.007l258.401,0c0.375,0.005 0.75,0.007 1.126,0.007c47.954,0 86.886,-38.932 86.886,-86.886c0,-42.065 -29.958,-77.189 -69.684,-85.181Z";

// Model-space targets matching the previous Blender export so camera framing is unchanged.
const TARGET_HEIGHT = 0.147861;
const HALF_THICKNESS = 0.0115;
// The cloud has six narrow concave joins. Insets above 0.0013 self-intersect
// there, so keep the analytic fillet below that measured clearance.
const FILLET_RADIUS = 0.0012;
const FILLET_STEPS = 10;
const FLATTEN_TOLERANCE = 0.06; // svg units; silhouette smoothness budget
const MAX_BEZIER_DEPTH = 24;
const CLIPPER_SCALE = 100_000_000;
const CONTACT_CLOSE_RADIUS = 0.001;
const CONTACT_ARC_TOLERANCE = 0.00002;

function parseSubpath(data) {
  // Supports the subset used by the brand path: relative m, c, l and Z.
  const tokens = data.match(/[mclz]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  let i = 0;
  let cursor = [0, 0];
  let start = [0, 0];
  const contours = [];
  let contour = [];
  const readPoint = () => {
    const x = Number(tokens[i++]);
    const y = Number(tokens[i++]);
    return [x, y];
  };
  while (i < tokens.length) {
    const cmd = tokens[i++].toLowerCase();
    if (cmd === "m") {
      if (contour.length > 1) contours.push(contour);
      const p = readPoint();
      cursor = [cursor[0] + p[0], cursor[1] + p[1]];
      start = [...cursor];
      contour = [cursor];
    } else if (cmd === "c") {
      const c1 = [cursor[0] + Number(tokens[i++]), cursor[1] + Number(tokens[i++])];
      const c2 = [cursor[0] + Number(tokens[i++]), cursor[1] + Number(tokens[i++])];
      const end = [cursor[0] + Number(tokens[i++]), cursor[1] + Number(tokens[i++])];
      contour.push(...flattenCubic(cursor, c1, c2, end, 0));
      cursor = end;
    } else if (cmd === "l") {
      const p = readPoint();
      cursor = [cursor[0] + p[0], cursor[1] + p[1]];
      contour.push(cursor);
    } else if (cmd === "z") {
      contour.push(start);
      cursor = [...start];
    } else {
      throw new Error(`Unsupported path command: ${cmd}`);
    }
  }
  if (contour.length > 1) contours.push(contour);
  return contours;
}

function flattenCubic(p0, p1, p2, p3, depth) {
  // Flatness: control points close to the chord p0->p3.
  const dx = p3[0] - p0[0];
  const dy = p3[1] - p0[1];
  const d1 = Math.abs((p1[0] - p3[0]) * dy - (p1[1] - p3[1]) * dx);
  const d2 = Math.abs((p2[0] - p3[0]) * dy - (p2[1] - p3[1]) * dx);
  if (depth >= MAX_BEZIER_DEPTH || (d1 + d2) ** 2 <= FLATTEN_TOLERANCE ** 2 * (dx * dx + dy * dy)) {
    return depth === 0 ? [p3] : [p3];
  }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const p01 = mid(p0, p1);
  const p12 = mid(p1, p2);
  const p23 = mid(p2, p3);
  const p012 = mid(p01, p12);
  const p123 = mid(p12, p23);
  const p0123 = mid(p012, p123);
  return [
    ...flattenCubic(p0, p01, p012, p0123, depth + 1),
    ...flattenCubic(p0123, p123, p23, p3, depth + 1),
  ];
}

function dedupeContour(points) {
  const out = [];
  for (const p of points) {
    const prev = out[out.length - 1];
    if (!prev || Math.hypot(p[0] - prev[0], p[1] - prev[1]) > 1e-6) out.push(p);
  }
  while (
    out.length > 1 &&
    Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) <= 1e-6
  ) {
    out.pop();
  }
  return out;
}

function signedArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area += a[0] * b[1] - b[0] * a[1];
  }
  return area / 2;
}

function contourNormals(points) {
  // Outward 2D normals from neighbor tangents. The dense adaptive sampling
  // keeps these smooth along G1 logo curves.
  const n = points.length;
  const normals = Array.from({ length: n });
  for (let i = 0; i < n; i += 1) {
    const prev = points[(i - 1 + n) % n];
    const next = points[(i + 1) % n];
    let tx = next[0] - prev[0];
    let ty = next[1] - prev[1];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    // For CCW winding, (ty, -tx) points outward.
    normals[i] = [ty, -tx];
  }
  return normals;
}

function assertSimpleContour(points, label) {
  const cross = (a, b, c) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    for (let j = i + 2; j < points.length; j += 1) {
      if (i === 0 && j === points.length - 1) continue;
      const c = points[j];
      const d = points[(j + 1) % points.length];
      const abC = cross(a, b, c);
      const abD = cross(a, b, d);
      const cdA = cross(c, d, a);
      const cdB = cross(c, d, b);
      if (abC * abD < -1e-14 && cdA * cdB < -1e-14)
        throw new Error(`${label} self-intersects at segments ${i} and ${j}`);
    }
  }
}

function assertDisjointContours(contours, label) {
  const cross = (a, b, c) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  for (let first = 0; first < contours.length; first += 1) {
    for (let second = first + 1; second < contours.length; second += 1) {
      const a = contours[first];
      const b = contours[second];
      for (let i = 0; i < a.length; i += 1) {
        for (let j = 0; j < b.length; j += 1) {
          const abC = cross(a[i], a[(i + 1) % a.length], b[j]);
          const abD = cross(a[i], a[(i + 1) % a.length], b[(j + 1) % b.length]);
          const cdA = cross(b[j], b[(j + 1) % b.length], a[i]);
          const cdB = cross(b[j], b[(j + 1) % b.length], a[(i + 1) % a.length]);
          if (abC * abD < -1e-14 && cdA * cdB < -1e-14)
            throw new Error(`${label} contours ${first} and ${second} intersect`);
        }
      }
    }
  }
}

function closePointContacts(outline) {
  const path = outline.map(([x, y]) => ({
    X: Math.round(x * CLIPPER_SCALE),
    Y: Math.round(y * CLIPPER_SCALE),
  }));
  const offset = new ClipperLib.ClipperOffset(
    2,
    Math.round(CONTACT_ARC_TOLERANCE * CLIPPER_SCALE),
  );
  offset.AddPath(
    path,
    ClipperLib.JoinType.jtRound,
    ClipperLib.EndType.etClosedPolygon,
  );
  const solution = [];
  offset.Execute(solution, Math.round(CONTACT_CLOSE_RADIUS * CLIPPER_SCALE));
  if (solution.length < 2)
    throw new Error("Logo contact closing did not preserve its negative spaces");

  const contours = solution
    .map((result) => result.map(({ X, Y }) => [X / CLIPPER_SCALE, Y / CLIPPER_SCALE]))
    .sort((a, b) => Math.abs(signedArea(b)) - Math.abs(signedArea(a)));
  for (let i = 0; i < contours.length; i += 1) {
    const shouldBePositive = i === 0;
    if ((signedArea(contours[i]) > 0) !== shouldBePositive) contours[i].reverse();
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const contour of contours) {
    for (const [x, y] of contour) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  const scale = TARGET_HEIGHT / (maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return contours.map((contour) =>
    contour.map(([x, y]) => [(x - cx) * scale, (y - cy) * scale]),
  );
}

function buildMesh() {
  const parsed = parseSubpath(CLOUD_PATH_DATA).map(dedupeContour);
  const source = parsed.reduce((longest, current) =>
    current.length > longest.length ? current : longest,
  );
  if (!source.length) throw new Error("No usable contour found in path data");

  for (let i = 0; i < source.length; i += 1)
    source[i] = [source[i][0], -source[i][1]];
  if (signedArea(source) < 0) source.reverse();

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of source) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const sourceScale = TARGET_HEIGHT / (maxY - minY);
  const sourceCenterX = (minX + maxX) / 2;
  const sourceCenterY = (minY + maxY) / 2;
  const sourceOutline = dedupeContour(
    source.map(([x, y]) => [
      (x - sourceCenterX) * sourceScale,
      (y - sourceCenterY) * sourceScale,
    ]),
  );
  // The SVG uses three point contacts to bridge its holes into one fill path.
  // Give those joins finite width before extrusion so every 3D edge is smooth.
  const contours = closePointContacts(sourceOutline);
  const contourNormals2d = contours.map(contourNormals);
  const bevelContours = contours.map((contour, contourIndex) =>
    contour.map((point, i) => [
      point[0] - contourNormals2d[contourIndex][i][0] * FILLET_RADIUS,
      point[1] - contourNormals2d[contourIndex][i][1] * FILLET_RADIUS,
    ]),
  );
  contours.forEach((contour, i) => assertSimpleContour(contour, `logo contour ${i}`));
  bevelContours.forEach((contour, i) =>
    assertSimpleContour(contour, `logo bevel inset ${i}`),
  );
  assertDisjointContours(bevelContours, "logo bevel inset");

  const positions = [];
  const normals = [];
  const indices = [];
  const capCoordinates = [];
  const holeStarts = [];
  const frontCapVertices = [];
  const backCapVertices = [];
  const T = HALF_THICKNESS;
  const r = FILLET_RADIUS;
  const K = FILLET_STEPS;
  const fillet = (k) => {
    const alpha = (k / K) * (Math.PI / 2);
    return { inset: r * Math.sin(alpha), z: T - r + r * Math.cos(alpha) };
  };

  for (let contourIndex = 0; contourIndex < contours.length; contourIndex += 1) {
    const outline = contours[contourIndex];
    const n = outline.length;
    const normals2d = contourNormals2d[contourIndex];
    if (contourIndex > 0) holeStarts.push(capCoordinates.length / 2);
    for (const point of outline) capCoordinates.push(...point);

    const pushRing = (inset, z, normalFor) => {
      const start = positions.length / 3;
      for (let i = 0; i < n; i += 1) {
        const point = outline[i];
        const normal2d = normals2d[i];
        positions.push(
          point[0] - normal2d[0] * inset,
          point[1] - normal2d[1] * inset,
          z,
        );
        normals.push(...normalFor(i));
      }
      return start;
    };
    const linkRings = (a, b) => {
      for (let i = 0; i < n; i += 1) {
        const j = (i + 1) % n;
        indices.push(a + i, b + i, b + j, a + i, b + j, a + j);
      }
    };

    const frontCap = pushRing(0, T, () => [0, 0, 1]);
    for (let i = 0; i < n; i += 1) frontCapVertices.push(frontCap + i);
    const frontRings = [];
    for (let k = 1; k <= K; k += 1) {
      const { inset, z } = fillet(k);
      const alpha = (k / K) * (Math.PI / 2);
      frontRings.push(
        pushRing(inset, z, (i) => [
          normals2d[i][0] * Math.sin(alpha),
          normals2d[i][1] * Math.sin(alpha),
          Math.cos(alpha),
        ]),
      );
    }
    const wallTop = frontRings[frontRings.length - 1];
    const wallBottom = pushRing(r, -(T - r), (i) => [
      normals2d[i][0],
      normals2d[i][1],
      0,
    ]);
    const backRings = [];
    for (let k = K - 1; k >= 1; k -= 1) {
      const { inset, z } = fillet(k);
      const alpha = (k / K) * (Math.PI / 2);
      backRings.push(
        pushRing(inset, -z, (i) => [
          normals2d[i][0] * Math.sin(alpha),
          normals2d[i][1] * Math.sin(alpha),
          -Math.cos(alpha),
        ]),
      );
    }
    const backCap = pushRing(0, -T, () => [0, 0, -1]);
    for (let i = 0; i < n; i += 1) backCapVertices.push(backCap + i);

    let upper = frontCap;
    for (const ring of frontRings) {
      linkRings(upper, ring);
      upper = ring;
    }
    linkRings(wallTop, wallBottom);
    upper = wallBottom;
    for (const ring of backRings) {
      linkRings(upper, ring);
      upper = ring;
    }
    linkRings(upper, backCap);
  }

  const capTriangulation = earcut(capCoordinates, holeStarts, 2);
  for (let i = 0; i < capTriangulation.length; i += 3) {
    indices.push(
      frontCapVertices[capTriangulation[i]],
      frontCapVertices[capTriangulation[i + 1]],
      frontCapVertices[capTriangulation[i + 2]],
      backCapVertices[capTriangulation[i + 2]],
      backCapVertices[capTriangulation[i + 1]],
      backCapVertices[capTriangulation[i]],
    );
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint32Array(indices),
    outlineCount: contours.reduce((sum, contour) => sum + contour.length, 0),
  };
}

function writeGltf(mesh) {
  const vertexCount = mesh.positions.length / 3;
  const positionBytes = mesh.positions.byteLength;
  const normalBytes = mesh.normals.byteLength;
  const indexBytes = mesh.indices.byteLength;
  const bufferLength = positionBytes + normalBytes + indexBytes;
  const buffer = new Uint8Array(bufferLength);
  buffer.set(new Uint8Array(mesh.positions.buffer, 0, positionBytes), 0);
  buffer.set(new Uint8Array(mesh.normals.buffer, 0, normalBytes), positionBytes);
  buffer.set(new Uint8Array(mesh.indices.buffer, 0, indexBytes), positionBytes + normalBytes);

  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < mesh.positions.length; i += 3) {
    minX = Math.min(minX, mesh.positions[i]);
    maxX = Math.max(maxX, mesh.positions[i]);
    minY = Math.min(minY, mesh.positions[i + 1]);
    maxY = Math.max(maxY, mesh.positions[i + 1]);
    minZ = Math.min(minZ, mesh.positions[i + 2]);
    maxZ = Math.max(maxZ, mesh.positions[i + 2]);
  }

  const gltf = {
    asset: { generator: "ls-web scripts/generate-logo-mesh.mjs", version: "2.0" },
    scene: 0,
    scenes: [{ name: "Scene", nodes: [0] }],
    nodes: [{ mesh: 0, name: "LocalAI" }],
    meshes: [
      {
        name: "LocalAI",
        primitives: [
          {
            attributes: { POSITION: 0, NORMAL: 1 },
            indices: 2,
          },
        ],
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: vertexCount,
        type: "VEC3",
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
      },
      { bufferView: 1, componentType: 5126, count: vertexCount, type: "VEC3" },
      { bufferView: 2, componentType: 5125, count: mesh.indices.length, type: "SCALAR" },
    ],
    bufferViews: [
      { buffer: 0, byteLength: positionBytes, byteOffset: 0, target: 34962 },
      { buffer: 0, byteLength: normalBytes, byteOffset: positionBytes, target: 34962 },
      {
        buffer: 0,
        byteLength: indexBytes,
        byteOffset: positionBytes + normalBytes,
        target: 34963,
      },
    ],
    buffers: [{ byteLength: bufferLength, uri: "localai-logo.bin" }],
  };

  const gltfBody = `${JSON.stringify(gltf, null, "\t")}\n`;
  if (CHECK) {
    const mismatches = [];
    if (!fs.existsSync(OUT_BIN) || !Buffer.from(fs.readFileSync(OUT_BIN)).equals(Buffer.from(buffer))) {
      mismatches.push(OUT_BIN);
    }
    if (!fs.existsSync(OUT_GLTF) || fs.readFileSync(OUT_GLTF, "utf8") !== gltfBody) {
      mismatches.push(OUT_GLTF);
    }
    if (mismatches.length) {
      console.error(`logo mesh outputs are stale:\n${mismatches.join("\n")}`);
      process.exitCode = 1;
      return;
    }
    console.log(`logo mesh outputs ok (${bufferLength} bytes, ${vertexCount} vertices)`);
    return;
  }
  fs.writeFileSync(OUT_BIN, buffer);
  fs.writeFileSync(OUT_GLTF, gltfBody);
  console.log(
    `wrote ${OUT_GLTF} (${bufferLength} bytes): ${vertexCount} vertices, ${mesh.indices.length / 3} triangles, outline ${mesh.outlineCount} points`,
  );
}

const source = fs.readFileSync(SOURCE_SVG, "utf8");
if (!source.includes(CLOUD_PATH_DATA)) {
  throw new Error(`logo source does not contain the expected cloud path: ${SOURCE_SVG}`);
}
writeGltf(buildMesh());
