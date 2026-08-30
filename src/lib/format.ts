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
