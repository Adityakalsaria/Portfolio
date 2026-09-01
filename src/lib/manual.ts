import type { Category } from "./work";
import { POSTS } from "./posts.generated";

/**
 * Hand-added work that does not come from the Figma import. These are merged
 * ahead of the generated projects for the same category, so re-running the
 * importer never drops them.
 */
const POLYGON_SECTIONS = [
  {
    title: "Ignite Dubai",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-01.22bbadee.webp", width: 2048, height: 2048 },
      { src: "/work/marketing-assets/polygon/polygon-02.39783ded.webp", width: 2048, height: 2048 },
      { src: "/work/marketing-assets/polygon/polygon-03.12942374.webp", width: 1568, height: 392 },
      { src: "/work/marketing-assets/polygon/polygon-04.902b99f0.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-05.0d16aa18.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-06.11030ac7.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-07.c24d99ca.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-08.e236f027.webp", width: 1805, height: 1128 },
      { src: "/work/marketing-assets/polygon/polygon-09.2e57dc5c.webp", width: 2048, height: 1024 },
      { src: "/work/marketing-assets/polygon/polygon-10.a9bbec4b.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-11.418cec1e.webp", width: 1995, height: 1123 },
      { src: "/work/marketing-assets/polygon/polygon-12.b3d56e6f.webp", width: 1995, height: 1123 },
      { src: "/work/marketing-assets/polygon/polygon-13.a3458478.webp", width: 1600, height: 900 },
    ],
  },
  {
    title: "BUIDL IT",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-14.c07f04ae.webp", width: 1024, height: 560 },
      { src: "/work/marketing-assets/polygon/polygon-15.5b34b59b.webp", width: 1200, height: 600 },
      { src: "/work/marketing-assets/polygon/polygon-16.f72f4808.webp", width: 1024, height: 512 },
      { src: "/work/marketing-assets/polygon/polygon-17.e3d2471f.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/polygon/polygon-18.c0ee5bdb.webp", width: 1024, height: 560 },
      { src: "/work/marketing-assets/polygon/polygon-19.0214cf8b.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/polygon/polygon-20.f29b3794.webp", width: 1568, height: 392 },
      { src: "/work/marketing-assets/polygon/polygon-21.e209ecc1.webp", width: 2048, height: 1076 },
      { src: "/work/marketing-assets/polygon/polygon-22.f9ffd137.webp", width: 1600, height: 914 },
      { src: "/work/marketing-assets/polygon/polygon-23.b5fdbd3c.webp", width: 1600, height: 914 },
    ],
  },
  {
    title: "AMA and fireside",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-24.eec8532c.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-25.5e63e98a.webp", width: 1995, height: 1123 },
      { src: "/work/marketing-assets/polygon/polygon-26.fd56c643.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-27.d0bb9449.webp", width: 2048, height: 1024 },
      { src: "/work/marketing-assets/polygon/polygon-28.be25f89d.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-29.ebc83df9.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-30.0220cf16.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-31.09939756.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-32.97fa240b.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-33.d4cafe2f.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-34.f9f6d710.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-35.a3be7157.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-36.0342a754.webp", width: 1568, height: 392 },
      { src: "/work/marketing-assets/polygon/polygon-37.5ea06f27.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-38.a9a75c0c.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-39.c68083c3.webp", width: 1600, height: 900 },
    ],
  },
  {
    title: "Building Web3",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-40.63cd8756.webp", width: 2048, height: 2048 },
      { src: "/work/marketing-assets/polygon/polygon-41.e8eea22b.webp", width: 1568, height: 196 },
      { src: "/work/marketing-assets/polygon/polygon-42.1dc6a252.webp", width: 2048, height: 337 },
      { src: "/work/marketing-assets/polygon/polygon-43.3ac8717a.webp", width: 1111, height: 1976 },
    ],
  },
  {
    title: "Explainers",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-44.5fc348bf.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-45.cb72cbee.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-46.cd8c1bd7.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-47.44380e46.webp", width: 856, height: 1001 },
      { src: "/work/marketing-assets/polygon/polygon-48.931da40a.webp", width: 1568, height: 196 },
    ],
  },
  {
    title: "Polygon Village",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-49.bbd1874c.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/polygon/polygon-50.8c2d2f29.webp", width: 1800, height: 1000 },
      { src: "/work/marketing-assets/polygon/polygon-51.e4a3d5a0.webp", width: 1568, height: 196 },
      { src: "/work/marketing-assets/polygon/polygon-52.874ca251.webp", width: 1505, height: 125 },
    ],
  },
  {
    title: "Wallet Suite",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-53.ade6e2d6.webp", width: 1568, height: 196 },
      { src: "/work/marketing-assets/polygon/polygon-54.f7aa6253.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-55.29a84b04.webp", width: 2048, height: 517 },
    ],
  },
  {
    title: "JAMPAD",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-56.8e3d9507.webp", width: 2048, height: 1024 },
      { src: "/work/marketing-assets/polygon/polygon-57.4b4abd29.webp", width: 1024, height: 512 },
      { src: "/work/marketing-assets/polygon/polygon-58.dbb98b68.webp", width: 2048, height: 1728 },
      { src: "/work/marketing-assets/polygon/polygon-59.d0648aa4.webp", width: 2048, height: 1728 },
      { src: "/work/marketing-assets/polygon/polygon-60.28dad08a.webp", width: 2048, height: 1024 },
      { src: "/work/marketing-assets/polygon/polygon-61.e501cdaa.webp", width: 1568, height: 196 },
    ],
  },
  {
    title: "Milestones",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-62.a3348689.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-63.64ea4469.webp", width: 2048, height: 2048 },
      { src: "/work/marketing-assets/polygon/polygon-64.370b8698.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-65.a76cf2af.webp", width: 1568, height: 196 },
      { src: "/work/marketing-assets/polygon/polygon-66.52df54f2.webp", width: 1080, height: 1080 },
    ],
  },
];

/** Flat run of every Polygon image, for the views that do not group. */
const POLYGON_SHOTS = POLYGON_SECTIONS.flatMap((s) => s.shots);

const KOSH_SHOTS = [
  { src: "/work/marketing-assets/kosh/kosh-01.e15bcdb7.webp", width: 1662, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-02.c76a0609.webp", width: 1662, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-03.53c7c129.webp", width: 1662, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-04.08d7e28a.webp", width: 1662, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-05.9c495050.webp", width: 1920, height: 1080 },
  { src: "/work/marketing-assets/kosh/kosh-06.2a393bf1.webp", width: 2048, height: 1536 },
  { src: "/work/marketing-assets/kosh/kosh-07.fdc608ef.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-08.d4467a6b.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-09.f96bf4fe.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-10.1895b4e3.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-11.0d93bf28.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-12.da1333ca.webp", width: 2048, height: 1152 },
  { src: "/work/marketing-assets/kosh/kosh-13.091b6a77.webp", width: 2048, height: 1226 },
  { src: "/work/marketing-assets/kosh/kosh-14.4d36f871.webp", width: 2048, height: 1152 },
  { src: "/work/marketing-assets/kosh/kosh-15.0092539c.webp", width: 2048, height: 1226 },
  { src: "/work/marketing-assets/kosh/kosh-16.9c352571.webp", width: 2048, height: 1075 },
  { src: "/work/marketing-assets/kosh/kosh-17.88a7a054.webp", width: 2048, height: 1152 },
  { src: "/work/marketing-assets/kosh/kosh-18.41f3c685.webp", width: 1662, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-19.f8cdd79b.webp", width: 2048, height: 1275 },
  { src: "/work/marketing-assets/kosh/kosh-20.62b4df52.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-21.e4f0fe37.webp", width: 2048, height: 1152 },
];

/** Stand-in work, so a category with siblings can be seen behaving. Delete
 *  this and its images under public/work/marketing-assets/sample when there
 *  is real work to put in its place. */
const SAMPLE_SHOTS = [
    { src: "/work/marketing-assets/sample/sample-01.webp", width: 1602, height: 1002 },
    { src: "/work/marketing-assets/sample/sample-02.webp", width: 1602, height: 1602 },
    { src: "/work/marketing-assets/sample/sample-03.webp", width: 1202, height: 1602 },
    { src: "/work/marketing-assets/sample/sample-04.webp", width: 1602, height: 902 },
];

export const MANUAL: Category[] = [
  {
    id: "marketing-assets",
    name: "Marketing Assets",
    projects: [
      {
        slug: "kosh-work",
        title: "KOSH work",
        intro:
          "Marketing and social assets for KOSH — launch announcements, card reveals and campaign graphics.",
        cover: KOSH_SHOTS[0].src,
        width: KOSH_SHOTS[0].width,
        height: KOSH_SHOTS[0].height,
        shots: KOSH_SHOTS,
        posts: POSTS,
      },
      {
        slug: "polygon",
        title: "Polygon",
        intro:
          "Campaign and social design for Polygon — Ignite, BUIDL IT, the " +
          "speaker series and the explainers around them.",
        sections: POLYGON_SECTIONS,
        shots: POLYGON_SHOTS,
        cover: POLYGON_SHOTS[0].src,
        width: POLYGON_SHOTS[0].width,
        height: POLYGON_SHOTS[0].height,
      },
      {
        slug: "sample-project",
        title: "Placeholder project",
        intro:
          "Stand-in work, here so the category's project list has something to show. Replace when there is real work for it.",
        cover: SAMPLE_SHOTS[0].src,
        width: SAMPLE_SHOTS[0].width,
        height: SAMPLE_SHOTS[0].height,
        shots: SAMPLE_SHOTS,
      },
    ],
  },
];
