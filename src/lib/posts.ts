export type Post = {
  id: string;
  /** Canonical link back to the post. */
  url: string;
  author: string;
  authorName: string;
  /** ISO string from the API. */
  date: string;
  text: string;
  likes: number;
  /** True when the still is a video's poster frame. */
  video: boolean;
  /** Local MP4, so a clip plays here rather than on X. */
  clip: string | null;
  media: { src: string; width: number; height: number } | null;
};
