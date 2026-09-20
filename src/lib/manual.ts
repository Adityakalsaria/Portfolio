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
      { src: "/work/marketing-assets/socket/socket-24.f26d02c7.webp", width: 3200, height: 1799 },
      { src: "/work/marketing-assets/socket/socket-25.0981f1bd.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-26.3672dd8a.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-27.4d6f39d4.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-28.c7c6e731.webp", width: 3200, height: 1799 },
      { src: "/work/marketing-assets/socket/socket-29.984411df.webp", width: 3200, height: 1799 },
      { src: "/work/marketing-assets/socket/socket-30.b8d9cb71.webp", width: 3200, height: 1799 },
      { src: "/work/marketing-assets/socket/socket-31.7d3e7112.webp", width: 3200, height: 1799 },
    ],
  },
  {
    title: "Eco-Series campaign",
    shots: [
      { src: "/work/marketing-assets/socket/socket-32.16723d9d.webp", width: 2022, height: 2022 },
      { src: "/work/marketing-assets/socket/socket-33.2d132f65.webp", width: 3200, height: 1799 },
      { src: "/work/marketing-assets/socket/socket-34.126bf900.webp", width: 3200, height: 1895 },
      { src: "/work/marketing-assets/socket/socket-35.4df51b8f.webp", width: 2022, height: 2022 },
      { src: "/work/marketing-assets/socket/socket-36.4df51b8f.webp", width: 2022, height: 2022 },
      { src: "/work/marketing-assets/socket/socket-37.0655e09e.webp", width: 2022, height: 2022 },
      { src: "/work/marketing-assets/socket/socket-38.05e7668e.webp", width: 2022, height: 2022 },
    ],
  },
  {
    title: "Bungee branding",
    shots: [
      { src: "/work/marketing-assets/socket/socket-39.de31afe9.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-40.5c096f67.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-41.17ef40cd.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-42.2f72c64a.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-43.adc1ccbf.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-44.0712d6b7.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-45.798b4ca2.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-46.d0c1e3f9.webp", width: 2991, height: 1683 },
      { src: "/work/marketing-assets/socket/socket-47.411db08b.webp", width: 2991, height: 1682 },
      { src: "/work/marketing-assets/socket/socket-48.ff8e3445.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/socket/socket-49.4468fdf7.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/socket/socket-50.18cde503.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/socket/socket-51.39a60966.webp", width: 2160, height: 2160 },
    ],
  },
  {
    title: "Bungee campaigns",
    shots: [
      { src: "/work/marketing-assets/socket/socket-52.a5745127.webp", width: 2443, height: 3200 },
      { src: "/work/marketing-assets/socket/socket-53.7140d53d.webp", width: 3200, height: 3200 },
      { src: "/work/marketing-assets/socket/socket-54.8237e629.webp", width: 847, height: 901 },
      { src: "/work/marketing-assets/socket/socket-55.e646f65b.webp", width: 2142, height: 901 },
      { src: "/work/marketing-assets/socket/socket-56.9a568aef.webp", width: 848, height: 1100 },
      { src: "/work/marketing-assets/socket/socket-57.88bde284.webp", width: 848, height: 1100 },
      { src: "/work/marketing-assets/socket/socket-58.62ee7fad.webp", width: 1244, height: 1100 },
      { src: "/work/marketing-assets/socket/socket-59.364cec82.webp", width: 1493, height: 1100 },
      { src: "/work/marketing-assets/socket/socket-60.958c0102.webp", width: 1493, height: 1100 },
      { src: "/work/marketing-assets/socket/socket-61.2a956a14.webp", width: 3200, height: 1671 },
      { src: "/work/marketing-assets/socket/socket-62.87f91906.webp", width: 2172, height: 2172 },
      { src: "/work/marketing-assets/socket/socket-63.93460a47.webp", width: 2172, height: 2172 },
      { src: "/work/marketing-assets/socket/socket-64.2add54b4.webp", width: 3200, height: 1802 },
      { src: "/work/marketing-assets/socket/socket-65.990b001c.webp", width: 2189, height: 2189 },
      { src: "/work/marketing-assets/socket/socket-66.544da491.webp", width: 3200, height: 1802 },
      { src: "/work/marketing-assets/socket/socket-67.ccca43f0.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-68.65bcb458.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/socket/socket-69.9c97cccd.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/socket/socket-70.e8f08adf.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/socket/socket-71.10add118.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/socket/socket-72.40493492.webp", width: 2022, height: 2022 },
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

const KOSH_SECTIONS = [
  {
    title: "KOSH",
    shots: [
      { src: "/work/marketing-assets/kosh/kosh-01.62f37b5f.webp", width: 1920, height: 2366 },
      { src: "/work/marketing-assets/kosh/kosh-02.f51ce5dc.webp", width: 1920, height: 2366 },
      { src: "/work/marketing-assets/kosh/kosh-03.9adeb1c3.webp", width: 1920, height: 2366 },
      { src: "/work/marketing-assets/kosh/kosh-04.dadb09ab.webp", width: 1920, height: 2366 },
      { src: "/work/marketing-assets/kosh/kosh-05.9c495050.webp", width: 1920, height: 1080 },
      { src: "/work/marketing-assets/kosh/kosh-06.b67d26dd.webp", width: 2400, height: 1800 },
      { src: "/work/marketing-assets/kosh/kosh-07.57c064ad.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/kosh/kosh-08.d3352c42.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/kosh/kosh-09.e1691163.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/kosh/kosh-10.3600a084.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/kosh/kosh-11.cd64f09f.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/kosh/kosh-12.701f3a4b.webp", width: 2160, height: 1215 },
      { src: "/work/marketing-assets/kosh/kosh-13.08ce80ac.webp", width: 2160, height: 1293 },
      { src: "/work/marketing-assets/kosh/kosh-14.c575a9e9.webp", width: 2160, height: 1215 },
      { src: "/work/marketing-assets/kosh/kosh-15.dece58cd.webp", width: 2160, height: 1293 },
      { src: "/work/marketing-assets/kosh/kosh-16.bdab50ab.webp", width: 2160, height: 1134 },
      { src: "/work/marketing-assets/kosh/kosh-17.d52a2ebb.webp", width: 2160, height: 1215 },
      { src: "/work/marketing-assets/kosh/kosh-18.15340a69.webp", width: 2160, height: 2662 },
      { src: "/work/marketing-assets/kosh/kosh-19.c515e42e.webp", width: 2160, height: 1345 },
      { src: "/work/marketing-assets/kosh/kosh-20.e71b5174.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/kosh/kosh-21.73e35e80.webp", width: 2160, height: 1215 },
    ],
  },
  {
    title: "Copperx",
    shots: [
      { src: "/work/marketing-assets/kosh/kosh-22.3af8640f.webp", width: 2114, height: 1189 },
      { src: "/work/marketing-assets/kosh/kosh-23.2224cfbd.webp", width: 2114, height: 1189 },
      { src: "/work/marketing-assets/kosh/kosh-24.5199b0ab.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-25.ef89882a.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-26.ab912bd2.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-27.2d889c0f.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-28.202875dd.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-29.b289c925.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-30.6711e624.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-31.88b7ee34.webp", width: 2114, height: 1190 },
      { src: "/work/marketing-assets/kosh/kosh-32.ab1ff2f9.webp", width: 2114, height: 1189 },
      { src: "/work/marketing-assets/kosh/kosh-33.0d8e49b7.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-34.37f824ef.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-35.d03ce730.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-36.50ed0949.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-37.553af989.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-38.898b1707.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-39.e7e7ba5f.webp", width: 1691, height: 951 },
      { src: "/work/marketing-assets/kosh/kosh-40.597c731d.webp", width: 2114, height: 1189 },
      { src: "/work/marketing-assets/kosh/kosh-41.f7761b1f.webp", width: 2114, height: 1189 },
      { src: "/work/marketing-assets/kosh/kosh-42.2da640ae.webp", width: 2114, height: 1189 },
      { src: "/work/marketing-assets/kosh/kosh-43.a1816aa6.webp", width: 2114, height: 1189 },
      { src: "/work/marketing-assets/kosh/kosh-44.79ba5213.webp", width: 2114, height: 1190 },
      { src: "/work/marketing-assets/kosh/kosh-45.12e3671b.webp", width: 2708, height: 2708 },
      { src: "/work/marketing-assets/kosh/kosh-46.3f42eaa2.webp", width: 1200, height: 630 },
      { src: "/work/marketing-assets/kosh/kosh-47.1533d5f9.webp", width: 1200, height: 630 },
      { src: "/work/marketing-assets/kosh/kosh-48.3a55bca0.webp", width: 1200, height: 630 },
      { src: "/work/marketing-assets/kosh/kosh-49.2e36c336.webp", width: 1600, height: 900 },
      { src: "/work/marketing-assets/kosh/kosh-50.bd110d20.webp", width: 2708, height: 2713 },
      { src: "/work/marketing-assets/kosh/kosh-51.0c212a31.webp", width: 2134, height: 1200 },
      { src: "/work/marketing-assets/kosh/kosh-52.0458c011.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/kosh/kosh-53.8d620872.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/kosh/kosh-54.3f865eba.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/kosh/kosh-55.a5b858d9.webp", width: 2400, height: 1350 },
      { src: "/work/marketing-assets/kosh/kosh-56.4fde1f4a.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/kosh/kosh-57.a5644c37.webp", width: 1200, height: 675 },
    ],
  },
];

/** Flat run of every KOSH image, for the views that do not group. */
const KOSH_SHOTS = KOSH_SECTIONS.flatMap((s) => s.shots);

const RUDY_SECTIONS = [
  {
    title: "App Store screens",
    row: true,
    shots: [
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-01.6c574e89.webp", width: 414, height: 896 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-02.d1066d08.webp", width: 414, height: 896 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-03.5116322a.webp", width: 414, height: 896 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-04.a434a43c.webp", width: 414, height: 896 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-05.793cafc4.webp", width: 414, height: 896 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-06.110484ad.webp", width: 414, height: 896 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-07.2bc1a642.webp", width: 414, height: 896 },
    ],
  },
  {
    title: "Launch",
    shots: [
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-08.cc88c458.webp", width: 1204, height: 686 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-09.448b6aaf.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-10.f2533bd8.webp", width: 1204, height: 713 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-11.d1f711a3.webp", width: 1204, height: 686 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-12.d2202043.webp", width: 2623, height: 875 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-13.a3d2aef4.webp", width: 3200, height: 1801 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-14.1e43edc1.webp", width: 3200, height: 1801 },
    ],
  },
  {
    title: "Feature posts",
    shots: [
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-15.e8299a5f.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-16.a3c7a651.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-17.f860952d.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-18.688ae77a.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-19.f3dc24c6.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-20.c6297196.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-21.c466bb65.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-22.5d8275fe.webp", width: 1080, height: 1080 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-23.75d52433.webp", width: 1080, height: 1080 },
    ],
  },
  {
    title: "Instagram",
    shots: [
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-24.c1fb52c9.webp", width: 1080, height: 1350 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-25.e8f2908d.webp", width: 1080, height: 1350 },
    ],
  },
  {
    title: "Twitter",
    shots: [
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-26.87937818.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-27.28a4e79a.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-28.fd9e1e34.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-29.e62f3a33.webp", width: 1200, height: 1050 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-30.269ded05.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-31.cdaa9a2a.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-32.9844b0e1.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-33.9d247f1c.webp", width: 1200, height: 1200 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-34.c6727252.webp", width: 825, height: 1047 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-35.82ce18c0.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-36.c1846fff.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-37.9597334a.webp", width: 1200, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-38.62209332.webp", width: 1136, height: 675 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-39.c83f999f.webp", width: 1199, height: 675 },
    ],
  },
  {
    title: "Motion",
    shots: [
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-40.4ae0d937.webp", width: 3200, height: 1818 },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-41.30c75a0e.webp", width: 2396, height: 1348, video: true, clip: "/work/marketing-assets/uncle-rudy/uncle-rudy-41.30c75a0e.mp4" },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-42.26848a73.webp", width: 1796, height: 1348, video: true, clip: "/work/marketing-assets/uncle-rudy/uncle-rudy-42.26848a73.mp4" },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-43.f509dcca.webp", width: 1080, height: 1080, video: true, clip: "/work/marketing-assets/uncle-rudy/uncle-rudy-43.f509dcca.mp4" },
      { src: "/work/marketing-assets/uncle-rudy/uncle-rudy-44.91e3c104.webp", width: 1080, height: 1080, video: true, clip: "/work/marketing-assets/uncle-rudy/uncle-rudy-44.91e3c104.mp4" },
    ],
  },
];

/** Flat run of every Uncle Rudy image, for the views that do not group. */
const RUDY_SHOTS = RUDY_SECTIONS.flatMap((s) => s.shots);

const KOSH_APP_SECTIONS = [
  {
    title: "Card",
    shots: [
      { src: "/work/ui/kosh-money-app/kosh-app-01.2235fcab.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-02.47aa935f.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-03.7fee3d22.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-04.9f569475.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-05.0fa415a1.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-06.831c76d8.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-07.0b2da5c4.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-08.9df4f2a3.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-09.4ab1954d.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-10.dd8e8327.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-11.35662c25.webp", width: 660, height: 1434 },
    ],
  },
  {
    title: "Giftcard",
    shots: [
      { src: "/work/ui/kosh-money-app/kosh-app-12.36650ac3.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-13.1ae44d5b.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-14.69af5742.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-15.7f7ec2d7.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-16.53012493.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-17.4e072329.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-18.a5a2eb61.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-19.79e99384.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-20.5e612223.webp", width: 402, height: 875 },
      { src: "/work/ui/kosh-money-app/kosh-app-21.264e7c38.webp", width: 402, height: 875 },
    ],
  },
  {
    title: "Rewards",
    shots: [
      { src: "/work/ui/kosh-money-app/kosh-app-22.3fe76e6f.webp", width: 402, height: 931 },
      { src: "/work/ui/kosh-money-app/kosh-app-23.244741fd.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-24.f607c1f7.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-25.8e472dcb.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-26.17581190.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-27.8f0288f5.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-28.fac70841.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-29.f4a40a1d.webp", width: 402, height: 568 },
      { src: "/work/ui/kosh-money-app/kosh-app-30.a95b39a7.webp", width: 402, height: 841 },
      { src: "/work/ui/kosh-money-app/kosh-app-31.17a654f3.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-32.8511d39e.webp", width: 402, height: 922 },
      { src: "/work/ui/kosh-money-app/kosh-app-33.2e6b40ff.webp", width: 402, height: 584 },
      { src: "/work/ui/kosh-money-app/kosh-app-34.155a0dbb.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-35.5788e19c.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-36.9f6a5c93.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-37.7fb13a3e.webp", width: 660, height: 1434 },
    ],
  },
  {
    title: "User profile",
    shots: [
      { src: "/work/ui/kosh-money-app/kosh-app-38.f2975454.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-39.dbcf5e8f.webp", width: 660, height: 1434 },
    ],
  },
  {
    title: "Wallet",
    shots: [
      { src: "/work/ui/kosh-money-app/kosh-app-40.30bb4d50.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-41.ff2f60f3.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-42.accdd8f8.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-43.5f11ceb4.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-44.5f11ceb4.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-45.b5b28e67.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-46.38bd3e88.webp", width: 660, height: 1434 },
      { src: "/work/ui/kosh-money-app/kosh-app-47.bb4079d1.webp", width: 660, height: 1434 },
    ],
  },
];

/** Flat run of every KOSH app screen, for the views that do not group. */
const KOSH_APP_SHOTS = KOSH_APP_SECTIONS.flatMap((s) => s.shots);

const BULLX_SHOTS = [
  { src: "/work/ui/bullx/bullx-01.084c2304.webp", width: 1700, height: 1030 },
  { src: "/work/ui/bullx/bullx-02.d9a18a3a.webp", width: 1700, height: 1112 },
  { src: "/work/ui/bullx/bullx-03.55ff034b.webp", width: 1700, height: 1030 },
  { src: "/work/ui/bullx/bullx-04.a6aa1d9a.webp", width: 2000, height: 1056 },
  { src: "/work/ui/bullx/bullx-05.3062f6e0.webp", width: 1360, height: 2576 },
  { src: "/work/ui/bullx/bullx-06.a2c2634a.webp", width: 1716, height: 1344 },
  { src: "/work/ui/bullx/bullx-07.4af46970.webp", width: 1716, height: 1664 },
  { src: "/work/ui/bullx/bullx-08.50401c88.webp", width: 812, height: 684 },
  { src: "/work/ui/bullx/bullx-09.e34da790.webp", width: 812, height: 1264 },
];

const STACKR_UI_SHOTS = [
  { src: "/work/ui/stackr-ui/stackr-ui-01.1ce5dc57.webp", width: 1440, height: 1024 },
];

const GPUNET_SHOTS = [
  { src: "/work/ui/gpu-net/gpu-net-01.e3bbca3f.webp", width: 1440, height: 1585 },
  { src: "/work/ui/gpu-net/gpu-net-02.811c2525.webp", width: 1440, height: 1657 },
  { src: "/work/ui/gpu-net/gpu-net-03.57302d95.webp", width: 1440, height: 1431 },
];

const POLYGON_UI_SHOTS = [
  { src: "/work/ui/polygon-ui/polygon-ui-01.29fc2501.webp", width: 1440, height: 1067 },
  { src: "/work/ui/polygon-ui/polygon-ui-02.466d405e.webp", width: 1440, height: 1081 },
  { src: "/work/ui/polygon-ui/polygon-ui-03.2f7709a2.webp", width: 1440, height: 768 },
  { src: "/work/ui/polygon-ui/polygon-ui-04.2f83e0de.webp", width: 1440, height: 768 },
  { src: "/work/ui/polygon-ui/polygon-ui-05.8ea2d972.webp", width: 1440, height: 810 },
];

const BRIDGY_SHOTS = [
  { src: "/work/ui/bridgy/bridgy-01.45aab261.webp", width: 1440, height: 1297 },
  { src: "/work/ui/bridgy/bridgy-02.cb96bd6d.webp", width: 1440, height: 1297 },
  { src: "/work/ui/bridgy/bridgy-03.f04fddf0.webp", width: 1440, height: 1297 },
  { src: "/work/ui/bridgy/bridgy-04.d2bd63b7.webp", width: 1440, height: 1297 },
  { src: "/work/ui/bridgy/bridgy-05.feb58cef.webp", width: 1440, height: 1270 },
];

const ICONSCOUT_SECTIONS = [
  {
    title: "Reward Program",
    shots: [
      { src: "/work/marketing-assets/iconscout/iconscout-01.453789f5.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/iconscout/iconscout-02.85b10bce.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/iconscout/iconscout-03.bd9cb4ce.webp", width: 2400, height: 1350 },
      { src: "/work/marketing-assets/iconscout/iconscout-04.3a6b45c4.webp", width: 1800, height: 3200 },
      { src: "/work/marketing-assets/iconscout/iconscout-05.d7dd8c56.webp", width: 3200, height: 1600 },
    ],
  },
  {
    title: "Premium plan offer",
    shots: [
      { src: "/work/marketing-assets/iconscout/iconscout-06.260c80b7.webp", width: 3200, height: 3200 },
      { src: "/work/marketing-assets/iconscout/iconscout-07.e8557a4e.webp", width: 1800, height: 3200 },
      { src: "/work/marketing-assets/iconscout/iconscout-08.90c2b52e.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/iconscout/iconscout-09.a69af97f.webp", width: 1200, height: 1000 },
      { src: "/work/marketing-assets/iconscout/iconscout-10.dd720f29.webp", width: 1200, height: 2800 },
      { src: "/work/marketing-assets/iconscout/iconscout-11.637aa138.webp", width: 3200, height: 297 },
      { src: "/work/marketing-assets/iconscout/iconscout-12.5d7bb128.webp", width: 640, height: 2400 },
    ],
  },
  {
    title: "3 Million+ assets",
    shots: [
      { src: "/work/marketing-assets/iconscout/iconscout-13.13825a67.webp", width: 3200, height: 3200 },
      { src: "/work/marketing-assets/iconscout/iconscout-14.b093c620.webp", width: 1800, height: 3200 },
      { src: "/work/marketing-assets/iconscout/iconscout-15.1c70de6d.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/iconscout/iconscout-16.41aea102.webp", width: 1200, height: 1000 },
      { src: "/work/marketing-assets/iconscout/iconscout-17.9a812c0c.webp", width: 1200, height: 2800 },
      { src: "/work/marketing-assets/iconscout/iconscout-18.a64c454b.webp", width: 640, height: 2400 },
      { src: "/work/marketing-assets/iconscout/iconscout-19.91d9f08a.webp", width: 3200, height: 297 },
    ],
  },
  {
    title: "Tokyo Olympics 2020",
    shots: [
      { src: "/work/marketing-assets/iconscout/iconscout-20.3d56fc4b.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/iconscout/iconscout-21.635269c3.webp", width: 1800, height: 3200 },
      { src: "/work/marketing-assets/iconscout/iconscout-22.a5be393b.webp", width: 2400, height: 1350 },
      { src: "/work/marketing-assets/iconscout/iconscout-23.1547f788.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/iconscout/iconscout-24.fb841d4d.webp", width: 1800, height: 3200 },
      { src: "/work/marketing-assets/iconscout/iconscout-25.bbed523d.webp", width: 2160, height: 2160 },
      { src: "/work/marketing-assets/iconscout/iconscout-26.7ab687f6.webp", width: 2400, height: 1350 },
    ],
  },
  {
    title: "Announcements",
    shots: [
      { src: "/work/marketing-assets/iconscout/iconscout-27.a2edace7.webp", width: 2896, height: 1334 },
      { src: "/work/marketing-assets/iconscout/iconscout-28.ff6b80f9.webp", width: 2896, height: 1334 },
      { src: "/work/marketing-assets/iconscout/iconscout-29.4d79cbc9.webp", width: 3200, height: 1800 },
      { src: "/work/marketing-assets/iconscout/iconscout-30.f0403579.webp", width: 2896, height: 1334 },
      { src: "/work/marketing-assets/iconscout/iconscout-31.991cc156.webp", width: 2514, height: 1143 },
    ],
  },
  {
    title: "Blog covers",
    shots: [
      { src: "/work/marketing-assets/iconscout/iconscout-32.3460b00c.webp", width: 3060, height: 1391 },
      { src: "/work/marketing-assets/iconscout/iconscout-33.e4136119.webp", width: 3060, height: 1410 },
      { src: "/work/marketing-assets/iconscout/iconscout-34.095a18ab.webp", width: 3060, height: 1410 },
      { src: "/work/marketing-assets/iconscout/iconscout-35.899d7a21.webp", width: 3060, height: 1410 },
      { src: "/work/marketing-assets/iconscout/iconscout-36.74037d0b.webp", width: 3060, height: 1410 },
      { src: "/work/marketing-assets/iconscout/iconscout-37.9c56de86.webp", width: 3060, height: 1410 },
    ],
  },
];

/** Flat run of every IconScout image, for the views that do not group. */
const ICONSCOUT_SHOTS = ICONSCOUT_SECTIONS.flatMap((s) => s.shots);

export const MANUAL: Category[] = [
  {
    id: "marketing-assets",
    name: "Marketing Assets",
    projects: [
      {
        slug: "uncle-rudy",
        title: "Conscious Engines (Uncle Rudy App)",
        intro:
          "Launch and social design for Uncle Rudy — the task app that roasts " +
          "you. App Store screens, the launch and the posts around it.",
        sections: RUDY_SECTIONS,
        shots: RUDY_SHOTS,
        cover: RUDY_SHOTS[0].src,
        width: RUDY_SHOTS[0].width,
        height: RUDY_SHOTS[0].height,
      },
      {
        slug: "kosh-work",
        title: "KOSH (prev-Copperx)",
        intro:
          "Marketing and social assets for KOSH — launch announcements, card reveals and campaign graphics.",
        sections: KOSH_SECTIONS,
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
        title: "Socket/Bungee",
        intro:
          "Brand and campaign design for Socket and Bungee — protocol " +
          "announcements, the chain abstraction launch, and Bungee's identity " +
          "and campaigns.",
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
        slug: "iconscout",
        title: "IconScout",
        intro:
          "Campaign, social and blog design for IconScout — the Reward " +
          "Program, plan offers, the Tokyo Olympics series and the blog covers.",
        sections: ICONSCOUT_SECTIONS,
        shots: ICONSCOUT_SHOTS,
        cover: ICONSCOUT_SHOTS[0].src,
        width: ICONSCOUT_SHOTS[0].width,
        height: ICONSCOUT_SHOTS[0].height,
      },
    ],
  },
  {
    id: "ui",
    name: "UI",
    projects: [
      {
        slug: "kosh-money-app",
        title: "KOSH money app",
        intro:
          "Mobile app screens for KOSH money — the card, gift cards, rewards, " +
          "profile and wallet.",
        sections: KOSH_APP_SECTIONS,
        shots: KOSH_APP_SHOTS,
        cover: KOSH_APP_SHOTS[0].src,
        width: KOSH_APP_SHOTS[0].width,
        height: KOSH_APP_SHOTS[0].height,
      },
      {
        slug: "bullx",
        title: "BullX",
        intro:
          "Desktop UI for BullX — the market view, leaderboard, alerts and the popups around them.",
        shots: BULLX_SHOTS,
        cover: BULLX_SHOTS[0].src,
        width: BULLX_SHOTS[0].width,
        height: BULLX_SHOTS[0].height,
      },
      {
        slug: "stackr-ui",
        title: "Stackr",
        intro:
          "Explorer UI for Stackr — the latest events table.",
        shots: STACKR_UI_SHOTS,
        cover: STACKR_UI_SHOTS[0].src,
        width: STACKR_UI_SHOTS[0].width,
        height: STACKR_UI_SHOTS[0].height,
      },
      {
        slug: "gpu-net",
        title: "GPU.NET",
        intro:
          "Staking and subnet voting UI for GPU.NET.",
        shots: GPUNET_SHOTS,
        cover: GPUNET_SHOTS[0].src,
        width: GPUNET_SHOTS[0].width,
        height: GPUNET_SHOTS[0].height,
      },
      {
        slug: "polygon-ui",
        title: "Polygon",
        intro:
          "Web UI for Polygon — the wallet home and the rewards quests.",
        shots: POLYGON_UI_SHOTS,
        cover: POLYGON_UI_SHOTS[0].src,
        width: POLYGON_UI_SHOTS[0].width,
        height: POLYGON_UI_SHOTS[0].height,
      },
      {
        slug: "bridgy",
        title: "Bridgy",
        intro:
          "The Bridgy bridge flow for Polygon — route breakdown and transaction history.",
        shots: BRIDGY_SHOTS,
        cover: BRIDGY_SHOTS[0].src,
        width: BRIDGY_SHOTS[0].width,
        height: BRIDGY_SHOTS[0].height,
      },
    ],
  },
];
