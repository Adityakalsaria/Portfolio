#!/usr/bin/env node
/**
 * Pulls previews for a list of X posts into the site.
 *
 *   node scripts/x-import.mjs
 *
 * Reads POSTS below, fetches each via X's public syndication endpoint (no
 * auth, no API key), saves its lead image locally as WebP, and writes
 * src/lib/posts.generated.ts.
 *
 * Media is downloaded rather than hotlinked: pbs.twimg.com URLs are not
 * guaranteed stable, are blocked in some networks, and would make every card
 * a third-party request on page load. Video posts get their poster frame and
 * a mid-size MP4, so a clip plays here instead of sending the reader to X.
 */
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "posts");
const DATA_FILE = path.join(ROOT, "src", "lib", "posts.generated.ts");

const POSTS = [
  "https://x.com/AdityaKalsaria/status/2064710819875856883",
  "https://x.com/AdityaKalsaria/status/2062563625894822023",
  "https://x.com/AdityaKalsaria/status/2060031160743542979",
  "https://x.com/AdityaKalsaria/status/2059608565225320917",
  "https://x.com/AdityaKalsaria/status/2057827133469446368",
  "https://x.com/dalpattapaniya/status/2056378181104656862",
  "https://x.com/dalpattapaniya/status/2051705622949986675",
  "https://x.com/AdityaKalsaria/status/2046210586699350332",
  "https://x.com/AdityaKalsaria/status/2042592802463453634",
  "https://x.com/AdityaKalsaria/status/2042229850845721023",
  "https://x.com/AdityaKalsaria/status/2041485488046104743",
  "https://x.com/AdityaKalsaria/status/2041163121734365253",
  "https://x.com/AdityaKalsaria/status/2040431050867052634",
  "https://x.com/AdityaKalsaria/status/2035003872117457289",
  "https://x.com/koshmoney/status/2000879533965369653",
  "https://x.com/AdityaKalsaria/status/1999776907605463065",
  "https://x.com/AdityaKalsaria/status/1999367239297044480",
  "https://x.com/AdityaKalsaria/status/1971215897621823850",
];

const idOf = (url) => url.match(/status\/(\d+)/)?.[1];

async function fetchPost(id) {
  const api = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=a`;
  const res = await fetch(api, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} for ${id}`);
  return res.json();
}

/**
 * The largest MP4 on offer. It is only the encoding source — what ships is
 * re-encoded below, so starting from the best available costs nothing.
 */
function pickVideo(d) {
  const mp4 = (d.video?.variants ?? []).filter((v) => v.type === "video/mp4");
  if (!mp4.length) return null;
  const by = (w) => mp4.find((v) => v.src.includes(`/${w}x`));
  return (by(1600) ?? by(1280) ?? by(640) ?? mp4[mp4.length - 1]).src;
}

/** First photo, or a video's poster frame. */
function leadMedia(d) {
  const photo = (d.photos ?? [])[0];
  if (photo?.url) {
    return { url: photo.url, width: photo.width, height: photo.height, video: false };
  }
  if (d.video?.poster) {
    const [aw, ah] = d.video.aspectRatio ?? [16, 9];
    return { url: d.video.poster, width: aw * 100, height: ah * 100, video: true };
  }
  const m = (d.mediaDetails ?? [])[0];
  if (m?.media_url_https) {
    const o = m.original_info ?? {};
    return {
      url: m.media_url_https,
      width: o.width ?? 1600,
      height: o.height ?? 900,
      video: m.type === "video",
    };
  }
  return null;
}

/**
 * Re-encode rather than shipping X's own file.
 *
 * Their variants are wildly uneven — the same tier ranged from 160KB to 26MB
 * across these posts, because bitrate follows whatever the uploader had. One
 * CRF pass gives consistent quality at a predictable size.
 *
 * The filter fits the frame inside a 1280 box instead of using a min()
 * expression: commas inside those need escaping through the filtergraph
 * parser, which silently mis-parsed and left one clip at 2160x3840.
 * force_original_aspect_ratio does the same job with no expression at all,
 * and handles portrait clips, which a fixed height gets wrong.
 *
 * Audio is dropped: these play muted on a plane, and the link to the post
 * covers anyone who wants it with sound.
 */
async function saveVideo(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status}`);
  const raw = `${dest}.src`;
  await writeFile(raw, Buffer.from(await res.arrayBuffer()));
  try {
    await run("ffmpeg", [
      "-y", "-loglevel", "error", "-i", raw,
      "-vf", "scale=1280:1280:force_original_aspect_ratio=decrease:force_divisible_by=2",
      "-c:v", "libx264", "-crf", "26", "-preset", "medium",
      "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart",
      dest,
    ]);
  } finally {
    await rm(raw, { force: true });
  }
}

/** The post's still, at the size a focused plane needs on a 2x screen. */
async function saveImage(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`media ${res.status}`);
  const tmp = `${dest}.tmp`;
  await writeFile(tmp, Buffer.from(await res.arrayBuffer()));
  await run("cwebp", ["-quiet", "-q", "88", "-resize", "1600", "0", tmp, "-o", dest]);
  await rm(tmp, { force: true });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const out = [];
  const keep = new Set();

  for (const [i, url] of POSTS.entries()) {
    const id = idOf(url);
    if (!id) {
      console.warn(`  ! not a status URL: ${url}`);
      continue;
    }
    let d;
    try {
      d = await fetchPost(id);
    } catch (e) {
      console.warn(`  ! ${id}: ${e.message}`);
      continue;
    }

    const media = leadMedia(d);
    let file = null;
    if (media) {
      file = `${id}.webp`;
      keep.add(file);
      try {
        await saveImage(media.url, path.join(OUT_DIR, file));
      } catch (e) {
        console.warn(`  ! ${id} media: ${e.message}`);
        file = null;
      }
    }

    // Video posts also get a clip, so the card can play rather than link away.
    let clip = null;
    const src = pickVideo(d);
    if (src) {
      const name = `${id}.mp4`;
      keep.add(name);
      try {
        await saveVideo(src, path.join(OUT_DIR, name));
        clip = `/posts/${name}`;
      } catch (e) {
        // Loud, and no clip recorded. Shipping the raw download instead is
        // how 18 clips became 98MB without anything saying so.
        console.warn(`  ! ${id} video FAILED to encode: ${e.message}`);
        keep.delete(name);
      }
    }

    out.push({
      id,
      url,
      clip,
      author: d.user?.screen_name ?? "",
      authorName: d.user?.name ?? "",
      date: d.created_at ?? "",
      // t.co shortlinks are the post's own media and quote links. They carry
      // nothing a reader can act on in a preview that already shows the media
      // and links to the post, so they come out.
      text: (d.text ?? "").replace(/https?:\/\/t\.co\/\S+/g, "").replace(/\s+/g, " ").trim(),
      likes: d.favorite_count ?? 0,
      video: media?.video ?? false,
      media: file
        ? { src: `/posts/${file}`, width: media.width, height: media.height }
        : null,
    });
    console.log(`  · ${i + 1}/${POSTS.length}  ${id}  ${file ? "media" : "no media"}`);
  }

  // Drop files for posts no longer in the list.
  if (existsSync(OUT_DIR)) {
    for (const f of await readdir(OUT_DIR)) {
      if (!keep.has(f)) await rm(path.join(OUT_DIR, f));
    }
  }

  const body = `// Generated by scripts/x-import.mjs — do not edit by hand.
import type { Post } from "./posts";

export const POSTS: Post[] = ${JSON.stringify(out, null, 2)};
`;
  await writeFile(DATA_FILE, body);
  console.log(`\n✓ ${out.length} posts → ${DATA_FILE}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
