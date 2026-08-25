import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Minimal PNG writer (no dependencies): RGBA rows -> PNG via zlib.
 * Generates PWA icons (192/512) and the OG image (1200x630).
 */

const root = join(fileURLToPath(new URL("../", import.meta.url)));

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const RED = [183, 53, 45, 255];
const RED_DARK = [143, 37, 31, 255];
const GOLD = [217, 154, 36, 255];
const PAPER = [255, 250, 242, 255];

function iconRGBA(size) {
  const data = Buffer.alloc(size * size * 4);
  const border = Math.max(4, Math.round(size / 24));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let color;
      if (x < border || x >= size - border || y < border || y >= size - border) color = RED_DARK;
      else if (
        x < border * 2 || x >= size - border * 2 ||
        y < border * 2 || y >= size - border * 2
      ) color = GOLD;
      else color = RED;
      data.set(color, (y * size + x) * 4);
    }
  }
  return data;
}

function ogRGBA(width, height) {
  const data = Buffer.alloc(width * height * 4);
  const bandHeight = Math.round(height / 12);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let color = RED;
      if (y < bandHeight || y >= height - bandHeight) color = RED_DARK;
      else if (y < bandHeight * 2 || y >= height - bandHeight * 2) color = GOLD;
      // simple centered diamond motif
      const dx = Math.abs(x - width / 2);
      const dy = Math.abs(y - height / 2);
      if (dx + dy < Math.min(width, height) / 5 && dx > dy) color = PAPER;
      data.set(color, (y * width + x) * 4);
    }
  }
  return data;
}

const outputs = [
  ["assets/icons/icon-192.png", iconRGBA(192)],
  ["assets/icons/icon-512.png", iconRGBA(512)],
  ["assets/icons/og-image.png", ogRGBA(1200, 630)],
];

for (const [rel, rgba] of outputs) {
  const sizeMeta =
    rel.includes("icon-192") ? 192 : rel.includes("icon-512") ? 512 : null;
  const width = sizeMeta ?? 1200;
  const height = sizeMeta ?? 630;
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, encodePNG(width, height, rgba));
  console.log(`wrote ${rel} (${width}x${height})`);
}
