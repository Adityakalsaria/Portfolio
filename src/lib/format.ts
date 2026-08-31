import type { Project } from "./work";

/**
 * The frame's proportions say what kind of artefact it is — worth surfacing,
 * since it's real information the Figma file already carries.
 */
export function formatOf(p: Project): string {
  if (!p.width || !p.height) return "";
  const ratio = p.width / p.height;
  if (ratio > 1.25) return "Desktop";
  if (ratio < 0.8) return "Mobile";
  return "Square";
}

export function aspectOf(p: Project): string {
  if (!p.width || !p.height) return "4 / 3";
  return `${p.width} / ${p.height}`;
}

/** What the row's right-hand column says about a project.
 *
 *  No counts — a tally of files is inventory, not information about the work.
 *  And no format either once there is a set: "Square" describes one frame,
 *  not thirty-nine of assorted shapes. */
export function metaOf(p: Project): string {
  if (p.shots?.length || p.posts?.length) return "";
  return formatOf(p);
}
