import { defineUserConfig } from "vuepress";
import { defaultTheme } from 'vuepress'

export default defineUserConfig({
  lang: "en-US",
  title: "AuthCompanion 2",
  description:
    "Documenation Site for AuthCompanion - An effortless, open source, token-based user management server - well suited for modern web projects.",
  // head: [['script', { defer: true, src: 'https://t.jitsu.com/s/lib.js', 'data-key': 'js.70qf40hrc3y266v4uud9dh.fub39cgaa9a45y8iqpteqq', 'data-tracking-host': 'https://young-thunder-2379.fly.dev/' }]],
  theme: defaultTheme({
    logo: "",
    darkMode: true,
    repo: "authcompanion/authcompanion2",
    editLink: false,
    lastUpdated: true,
    navbar: [
      {
        text: "Guide",
        link: "/",
      },
      {
        text: "Contributing",
        link: "/contributing/",
      },
      {
        text: "License",
        link: "/guide/licenseoverview.md",
      },
    ],
    // sidebar object
    // pages under different sub paths will use different sidebar
    sidebar: {
      "/": [
        {
          text: "📚 The Guide",
          children: [
            "/guide/gettingstarted.md",
            "/guide/explore.md",
            "/guide/configuration.md",
            "/guide/webforms.md",
            "/guide/authapi.md",
          ],
        },
      ],
      "/contributing/": [
        {
          text: "How to Contribute",
          children: ["gettinghelp.md", "codeofconduct.md"],
        },
      ],
    },
  }),
});
