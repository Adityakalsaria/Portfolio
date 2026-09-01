import type { Category } from "./work";
import { POSTS } from "./posts.generated";

/**
 * Hand-added work that does not come from the Figma import. These are merged
 * ahead of the generated projects for the same category, so re-running the
 * importer never drops them.
 */
const STACKR_SECTIONS = [
  {
    title: "Flux branding",
    shots: [
      { src: "/work/marketing-assets/stackr/stackr-01.47db2c7d.webp", width: 1979, height: 1078 },
      { src: "/work/marketing-assets/stackr/stackr-02.e96eb793.webp", width: 1979, height: 1078 },
      { src: "/work/marketing-assets/stackr/stackr-03.32fcbef6.webp", width: 1979, height: 518 },
      { src: "/work/marketing-assets/stackr/stackr-04.8e56753b.webp", width: 1979, height: 1078 },
      { src: "/work/marketing-assets/stackr/stackr-05.6c984e5f.webp", width: 1979, height: 1152 },
      { src: "/work/marketing-assets/stackr/stackr-06.d0f4d936.webp", width: 1225, height: 1175 },
      { src: "/work/marketing-assets/stackr/stackr-07.17671227.webp", width: 1225, height: 1600 },
      { src: "/work/marketing-assets/stackr/stackr-08.1f135e40.webp", width: 469, height: 469 },
      { src: "/work/marketing-assets/stackr/stackr-09.201eff53.webp", width: 1920, height: 1118 },
      { src: "/work/marketing-assets/stackr/stackr-10.aef86e2c.webp", width: 1225, height: 1175 },
      { src: "/work/marketing-assets/stackr/stackr-11.3b9887cf.webp", width: 1225, height: 1600 },
      { src: "/work/marketing-assets/stackr/stackr-12.90fcad10.webp", width: 1920, height: 872 },
      { src: "/work/marketing-assets/stackr/stackr-13.33a1e11f.webp", width: 1979, height: 1078 },
      { src: "/work/marketing-assets/stackr/stackr-14.6c984e5f.webp", width: 1979, height: 1152 },
      { src: "/work/marketing-assets/stackr/stackr-15.511e4254.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-16.561ffd79.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-17.7df82e07.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-18.e9843232.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-19.d1cddb85.webp", width: 1401, height: 467 },
    ],
  },
  {
    title: "Ferrofluid branding",
    shots: [
      { src: "/work/marketing-assets/stackr/stackr-20.8ec89054.webp", width: 2089, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-21.49a3a723.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-22.f9441f7f.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-23.ac2d5012.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-24.43375065.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-25.06ff5be6.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-26.b76ecb0f.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-27.0f7b590f.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-28.b66f128e.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-29.6493bb14.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-30.9f89bebd.webp", width: 2354, height: 3099 },
      { src: "/work/marketing-assets/stackr/stackr-31.a706d996.webp", width: 2354, height: 3099 },
      { src: "/work/marketing-assets/stackr/stackr-32.56fc1c1f.webp", width: 2354, height: 3099 },
      { src: "/work/marketing-assets/stackr/stackr-33.ea256ac1.webp", width: 2354, height: 3099 },
      { src: "/work/marketing-assets/stackr/stackr-34.38a0619e.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-35.91fb3ae2.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-36.8ee11749.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-37.d45b7b31.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-38.f8647eb5.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-39.2c5dc6fc.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-40.5830f84b.webp", width: 2131, height: 728 },
      { src: "/work/marketing-assets/stackr/stackr-41.1eff4217.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/stackr/stackr-42.32144a19.webp", width: 1920, height: 1080 },
    ],
  },
  {
    title: "Stackr campaign",
    shots: [
      { src: "/work/marketing-assets/stackr/stackr-43.ea76c374.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-44.f5cc0b8b.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-45.7c6e06f7.webp", width: 2385, height: 2486 },
      { src: "/work/marketing-assets/stackr/stackr-46.f0b18612.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-47.87e773c4.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-48.d9d0060d.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-49.48155f7a.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-50.f37cd6e9.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-51.6fbd873b.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-52.aa5ba21b.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-53.c6894189.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-54.34872dbe.webp", width: 2385, height: 1342 },
      { src: "/work/marketing-assets/stackr/stackr-55.4cf9b3e4.webp", width: 2385, height: 2486 },
    ],
  },
];

/** Flat run of every Stackr image, for the views that do not group. */
const STACKR_SHOTS = STACKR_SECTIONS.flatMap((s) => s.shots);

const SOCKET_SECTIONS = [
  {
    title: "Socket protocol campaign",
    shots: [
      { src: "/work/marketing-assets/socket/socket-01.be0fa42a.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-02.bf7e1222.webp", width: 2855, height: 1606 },
      { src: "/work/marketing-assets/socket/socket-03.92ca80c7.webp", width: 2855, height: 1606 },
      { src: "/work/marketing-assets/socket/socket-04.55fc7649.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-05.cd485558.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-06.32a3b711.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-07.998bfaaa.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-08.138671fe.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-09.93239cdf.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-10.29e2afe8.webp", width: 2860, height: 1668 },
      { src: "/work/marketing-assets/socket/socket-11.9cde31ba.webp", width: 3200, height: 1601 },
      { src: "/work/marketing-assets/socket/socket-12.aa4513cf.webp", width: 2860, height: 1668 },
    ],
  },
  {
    title: "Chain abstraction campaign",
    shots: [
      { src: "/work/marketing-assets/socket/socket-13.a912f7d9.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-14.5dc4dd27.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-15.e129740f.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-16.af2bd227.webp", width: 3200, height: 3200 },
      { src: "/work/marketing-assets/socket/socket-17.94464c66.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-18.669e3acd.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-19.9afff8fb.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-20.3c4e229b.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-21.7d510156.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-22.b25a19aa.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-23.17dbb7e7.webp", width: 3200, height: 1800 },
    ],
  },
];

/** Flat run of every Socket image, for the views that do not group. */
const SOCKET_SHOTS = SOCKET_SECTIONS.flatMap((s) => s.shots);

const POLYGON_SECTIONS = [
  {
    title: "Polygon Ignite Dubai 2021 branding",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-01.6e4a4c57.webp", width: 1870, height: 2804 },
      { src: "/work/marketing-assets/polygon/polygon-02.902b99f0.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-03.0d16aa18.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-04.11030ac7.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-05.c24d99ca.webp", width: 1003, height: 1337 },
      { src: "/work/marketing-assets/polygon/polygon-06.e236f027.webp", width: 1805, height: 1128 },
      { src: "/work/marketing-assets/polygon/polygon-07.97b8865e.webp", width: 3200, height: 1600 },
      { src: "/work/marketing-assets/polygon/polygon-08.a9bbec4b.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-09.a3458478.webp", width: 1600, height: 900 },
    ],
  },
  {
    title: "Buidl IT Hackathon 2021 branding",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-10.c07f04ae.webp", width: 1024, height: 560 },
      { src: "/work/marketing-assets/polygon/polygon-11.5b34b59b.webp", width: 1200, height: 600 },
      { src: "/work/marketing-assets/polygon/polygon-12.f72f4808.webp", width: 1024, height: 512 },
      { src: "/work/marketing-assets/polygon/polygon-13.bbd1874c.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/polygon/polygon-14.e3d2471f.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/polygon/polygon-15.c0ee5bdb.webp", width: 1024, height: 560 },
      { src: "/work/marketing-assets/polygon/polygon-16.8e3d9507.webp", width: 2048, height: 1024 },
      { src: "/work/marketing-assets/polygon/polygon-17.4b4abd29.webp", width: 1024, height: 512 },
      { src: "/work/marketing-assets/polygon/polygon-18.f9ffd137.webp", width: 1600, height: 914 },
      { src: "/work/marketing-assets/polygon/polygon-19.b5fdbd3c.webp", width: 1600, height: 914 },
    ],
  },
  {
    title: "Building Web3 by polygon",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-20.5e63e98a.webp", width: 1995, height: 1123 },
      { src: "/work/marketing-assets/polygon/polygon-21.3e4aae7f.webp", width: 2394, height: 2394 },
      { src: "/work/marketing-assets/polygon/polygon-22.41566263.webp", width: 2394, height: 2394 },
      { src: "/work/marketing-assets/polygon/polygon-23.e2751467.webp", width: 2394, height: 2394 },
      { src: "/work/marketing-assets/polygon/polygon-24.e70755c7.webp", width: 2394, height: 2394 },
      { src: "/work/marketing-assets/polygon/polygon-25.418cec1e.webp", width: 1995, height: 1123 },
      { src: "/work/marketing-assets/polygon/polygon-26.b3d56e6f.webp", width: 1995, height: 1123 },
    ],
  },
  {
    title: "polygon Village branding",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-27.3ac8717a.webp", width: 1111, height: 1976 },
      { src: "/work/marketing-assets/polygon/polygon-28.8c2d2f29.webp", width: 1800, height: 1000 },
      { src: "/work/marketing-assets/polygon/polygon-29.0c0c0e4a.webp", width: 2698, height: 1417 },
    ],
  },
  {
    title: "polygon Jampad branding",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-30.936ef16f.webp", width: 2367, height: 1997 },
      { src: "/work/marketing-assets/polygon/polygon-31.62e531b7.webp", width: 2367, height: 1997 },
      { src: "/work/marketing-assets/polygon/polygon-32.1db8e1e5.webp", width: 2367, height: 1184 },
      { src: "/work/marketing-assets/polygon/polygon-33.9bd674c0.webp", width: 2367, height: 1997 },
    ],
  },
  {
    title: "Twitter AMAs and announcements",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-34.5fc348bf.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-35.cb72cbee.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-36.cd8c1bd7.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-37.fd56c643.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-38.370b8698.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-39.be25f89d.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-40.ebc83df9.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-41.0220cf16.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-42.09939756.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-43.97fa240b.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-44.d4cafe2f.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-45.f9f6d710.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-46.a3be7157.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-47.16f9ecdc.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-48.5ea06f27.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-49.a9a75c0c.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-50.c68083c3.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-51.4b70e046.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-52.c4830657.webp", width: 1600, height: 900 },
    ],
  },
  {
    title: "Product visuals",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-53.eec8532c.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-54.35c45aed.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-55.a3348689.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-56.22803abd.webp", width: 2160, height: 1080 },
      { src: "/work/marketing-assets/polygon/polygon-57.2195a75a.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-58.f7aa6253.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/polygon/polygon-59.44380e46.webp", width: 856, height: 1001 },
    ],
  },
  {
    title: "Internal team post",
    shots: [
      { src: "/work/marketing-assets/polygon/polygon-60.0214cf8b.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/polygon/polygon-61.52df54f2.webp", width: 1080, height: 1080 },
    ],
  },
];

/** Flat run of every Polygon image, for the views that do not group. */
const POLYGON_SHOTS = POLYGON_SECTIONS.flatMap((s) => s.shots);

const KOSH_SHOTS = [
  { src: "/work/marketing-assets/kosh/kosh-01.3256969b.webp", width: 1920, height: 2366 },
  { src: "/work/marketing-assets/kosh/kosh-02.ee30746e.webp", width: 1920, height: 2366 },
  { src: "/work/marketing-assets/kosh/kosh-03.19e830e7.webp", width: 1920, height: 2366 },
  { src: "/work/marketing-assets/kosh/kosh-04.87a9bd0d.webp", width: 1920, height: 2366 },
  { src: "/work/marketing-assets/kosh/kosh-05.1d72a903.webp", width: 1920, height: 1080 },
  { src: "/work/marketing-assets/kosh/kosh-06.b23cb180.webp", width: 2400, height: 1800 },
  { src: "/work/marketing-assets/kosh/kosh-07.908adab3.webp", width: 2160, height: 2160 },
  { src: "/work/marketing-assets/kosh/kosh-08.27fb0839.webp", width: 2160, height: 2160 },
  { src: "/work/marketing-assets/kosh/kosh-09.5eb45000.webp", width: 2160, height: 2160 },
  { src: "/work/marketing-assets/kosh/kosh-10.6dabd1f6.webp", width: 2160, height: 2160 },
  { src: "/work/marketing-assets/kosh/kosh-11.469c5a6d.webp", width: 2160, height: 2160 },
  { src: "/work/marketing-assets/kosh/kosh-12.f1d96ee4.webp", width: 2160, height: 1215 },
  { src: "/work/marketing-assets/kosh/kosh-13.b0869fd0.webp", width: 2160, height: 1293 },
  { src: "/work/marketing-assets/kosh/kosh-14.dc02d262.webp", width: 2160, height: 1215 },
  { src: "/work/marketing-assets/kosh/kosh-15.a1a11379.webp", width: 2160, height: 1293 },
  { src: "/work/marketing-assets/kosh/kosh-16.80b1313f.webp", width: 2160, height: 1134 },
  { src: "/work/marketing-assets/kosh/kosh-17.b6ff2aff.webp", width: 2160, height: 1215 },
  { src: "/work/marketing-assets/kosh/kosh-18.3da1235d.webp", width: 2160, height: 2662 },
  { src: "/work/marketing-assets/kosh/kosh-19.223bdbe1.webp", width: 2160, height: 1345 },
  { src: "/work/marketing-assets/kosh/kosh-20.12d982a0.webp", width: 2160, height: 2160 },
  { src: "/work/marketing-assets/kosh/kosh-21.3e1c356c.webp", width: 2160, height: 1215 },
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
        slug: "stackr",
        title: "Stackr",
        intro:
          "Brand and campaign design across three identities — Flux, then " +
          "Ferrofluid, then Stackr — and the ETH Global campaign that ran on it.",
        sections: STACKR_SECTIONS,
        shots: STACKR_SHOTS,
        cover: STACKR_SHOTS[0].src,
        width: STACKR_SHOTS[0].width,
        height: STACKR_SHOTS[0].height,
      },
      {
        slug: "socket",
        title: "Socket",
        intro:
          "Brand and campaign design for Socket — protocol announcements, " +
          "partnerships and the chain abstraction launch.",
        sections: SOCKET_SECTIONS,
        shots: SOCKET_SHOTS,
        cover: SOCKET_SHOTS[0].src,
        width: SOCKET_SHOTS[0].width,
        height: SOCKET_SHOTS[0].height,
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
